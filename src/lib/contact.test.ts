import { describe, expect, it } from "vitest";
import { buildMessage, mailtoHref, submitContact, validateContact, whatsappHref, type ContactDraft } from "./contact";

const draft = (over: Partial<ContactDraft> = {}): ContactDraft => ({
  name: "Karim Ben Salah",
  phone: "+216 98 000 000",
  email: "",
  subject: "Autre",
  date: "2026-09-20",
  slot: "Matin (8h30 — 12h)",
  message: "Litige relatif à un bail commercial signé en 2024.",
  ...over,
});

const labels = {
  name: "Nom & prénom",
  phone: "Téléphone",
  email: "E-mail",
  subject: "Nature du dossier",
  date: "Date souhaitée",
  message: "Votre message",
};

describe("validateContact", () => {
  it("accepts a complete request with a phone number only", () => {
    expect(validateContact(draft())).toBe(true);
  });

  it("accepts a request with an e-mail but no phone", () => {
    expect(validateContact(draft({ phone: "", email: "k@example.tn" }))).toBe(true);
  });

  it("rejects a request with no way to reply", () => {
    expect(validateContact(draft({ phone: "", email: "" }))).toBe(false);
  });

  it("rejects a blank or whitespace-only name", () => {
    expect(validateContact(draft({ name: "" }))).toBe(false);
    expect(validateContact(draft({ name: "  " }))).toBe(false);
    expect(validateContact(draft({ name: "K" }))).toBe(false);
  });

  it("rejects a message too short to act on", () => {
    expect(validateContact(draft({ message: "abc" }))).toBe(false);
  });

  it("trims before judging, so surrounding spaces never validate", () => {
    expect(validateContact(draft({ message: "   abc   " }))).toBe(false);
    expect(validateContact(draft({ name: " Karim ", message: "  Un litige de bail.  " }))).toBe(true);
  });
});

describe("buildMessage", () => {
  it("includes every field the lawyer needs to triage", () => {
    const msg = buildMessage(draft(), labels, "Bonjour Maître Majdoub,");
    expect(msg).toContain("Bonjour Maître Majdoub,");
    expect(msg).toContain(`${labels.name}: Karim Ben Salah`);
    expect(msg).toContain(`${labels.subject}: Autre`);
    expect(msg).toContain("2026-09-20");
    expect(msg).toContain("bail commercial");
  });

  it("uses the localised greeting, not a hard-coded one", () => {
    const ar = buildMessage(draft(), labels, "تحية طيبة الأستاذ المحترم،");
    expect(ar.startsWith("تحية طيبة الأستاذ المحترم،")).toBe(true);
    expect(ar).not.toContain("Bonjour");
  });

  it("marks absent optional fields with a dash instead of an empty value", () => {
    const msg = buildMessage(draft({ phone: "", email: "", date: "" }), labels, "Hi,");
    expect(msg).toContain(`${labels.phone}: —`);
    expect(msg).toContain(`${labels.email}: —`);
  });
});

describe("hrefs", () => {
  it("URL-encodes the WhatsApp body exactly once", () => {
    const href = whatsappHref("21698412763", "a b & c\né");
    expect(href.startsWith("https://wa.me/21698412763?text=")).toBe(true);
    const decoded = decodeURIComponent(href.slice(href.indexOf("text=") + 5));
    expect(decoded).toBe("a b & c\né");
    // No double-encoding artifacts.
    expect(href).not.toContain("%25");
  });

  it("builds a mailto with encoded subject and body", () => {
    const href = mailtoHref("c@x.tn", "Immobilier — Karim", "line1\nline2");
    expect(href.startsWith("mailto:c@x.tn?subject=")).toBe(true);
    expect(href).toContain("body=line1%0Aline2");
  });
});

describe("submitContact", () => {
  it("reports ok on a 2xx response", async () => {
    globalThis.fetch = (async () => new Response(null, { status: 200 })) as typeof fetch;
    await expect(submitContact("https://example.tn/intake", draft())).resolves.toEqual({ status: "ok" });
  });

  it("reports a network failure on a non-2xx response", async () => {
    globalThis.fetch = (async () => new Response(null, { status: 500 })) as typeof fetch;
    const r = await submitContact("https://example.tn/intake", draft());
    expect(r.status).toBe("network");
  });

  it("reports a network failure when the request throws (offline)", async () => {
    globalThis.fetch = (async () => {
      throw new TypeError("Failed to fetch");
    }) as typeof fetch;
    const r = await submitContact("https://example.tn/intake", draft());
    expect(r).toEqual({ status: "network", detail: "Failed to fetch" });
  });
});
