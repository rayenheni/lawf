import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LangProvider } from "../context";
import { content } from "../content";
import { Contact } from "./Contact";

const fr = content.fr;

function renderContact() {
  return render(
    <LangProvider>
      <Contact />
    </LangProvider>
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(fr.contact.form.name), "Karim Ben Salah");
  await user.type(screen.getByLabelText(fr.contact.form.phone), "+216 98 000 000");
  await user.type(screen.getByLabelText(fr.contact.form.message), "Litige relatif à un bail commercial.");
}

describe("Contact form", () => {
  it("associates every visible label with its control", () => {
    renderContact();
    // getByLabelText throws when the label is not programmatically bound.
    expect(screen.getByLabelText(fr.contact.form.name)).toHaveAccessibleName(fr.contact.form.name);
    expect(screen.getByLabelText(fr.contact.form.phone)).toBeInTheDocument();
    expect(screen.getByLabelText(fr.contact.form.email)).toBeInTheDocument();
    expect(screen.getByLabelText(fr.contact.form.date)).toBeInTheDocument();
    expect(screen.getByLabelText(fr.contact.form.message)).toBeInTheDocument();
  });

  it("rejects an incomplete request with an alert, and nothing else", async () => {
    const user = userEvent.setup();
    renderContact();
    await user.click(screen.getByRole("button", { name: fr.contact.form.submit }));
    expect(await screen.findByRole("alert")).toHaveTextContent(fr.contact.form.required);
    expect(screen.queryByText(fr.contact.form.preparedTitle)).not.toBeInTheDocument();
  });

  it("never claims a message was sent when no endpoint is configured", async () => {
    const user = userEvent.setup();
    renderContact();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: fr.contact.form.submit }));

    // The honest "draft ready" state…
    expect(await screen.findByRole("heading", { name: fr.contact.form.preparedTitle })).toBeInTheDocument();
    // …and the old, false claim is gone for good.
    expect(screen.queryByText(/a été enregistrée/)).not.toBeInTheDocument();
  });

  it("hands over a pre-drafted WhatsApp message containing the visitor's own words", async () => {
    const user = userEvent.setup();
    renderContact();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: fr.contact.form.submit }));

    const wa = await screen.findByRole("link", { name: new RegExp(fr.contact.form.whatsapp) });
    const href = wa.getAttribute("href") ?? "";
    expect(href.startsWith("https://wa.me/")).toBe(true);
    const decoded = decodeURIComponent(href.slice(href.indexOf("text=") + 5));
    expect(decoded).toContain("bail commercial");
    // The salutation is localised copy, not a hard-coded French string.
    expect(decoded.startsWith(fr.contact.form.greeting)).toBe(true);
  });

  it("lets the visitor start over from the outcome screen", async () => {
    const user = userEvent.setup();
    renderContact();
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: fr.contact.form.submit }));
    await user.click(await screen.findByRole("button", { name: fr.contact.form.reopen }));
    expect(await screen.findByLabelText(fr.contact.form.message)).toHaveValue("");
  });
});
