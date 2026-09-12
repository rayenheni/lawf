/**
 * Pure, dependency-free logic for the contact form.
 *
 * Kept out of the component so it can be unit-tested without a DOM and reused
 * by both the browser form and the (optional) server endpoint.
 */

export type ContactDraft = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  date: string;
  slot: string;
  message: string;
};

export type ContactLabels = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  date: string;
  message: string;
};

/** A request is actionable with a name, a description and at least one way to reply. */
export function validateContact(d: ContactDraft): boolean {
  const name = d.name.trim();
  const message = d.message.trim();
  const reachable = d.phone.trim().length > 0 || d.email.trim().length > 0;
  return name.length > 1 && message.length > 4 && reachable;
}

/**
 * Renders the draft into the plain-text body shared by WhatsApp and e-mail.
 * The greeting is localised copy, not a hard-coded string, so an Arabic
 * visitor no longer receives a French salutation.
 */
export function buildMessage(d: ContactDraft, l: ContactLabels, greeting: string): string {
  return [
    greeting,
    "",
    `${l.name}: ${d.name.trim()}`,
    `${l.phone}: ${d.phone.trim() || "—"}`,
    `${l.email}: ${d.email.trim() || "—"}`,
    `${l.subject}: ${d.subject}`,
    `${l.date}: ${d.date || "—"} · ${d.slot}`,
    "",
    d.message.trim(),
  ].join("\n");
}

export function whatsappHref(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function mailtoHref(email: string, subject: string, message: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export type SubmitResult = { status: "ok" } | { status: "network"; detail?: string };

/**
 * POSTs the draft to the configured intake endpoint.
 *
 * `endpoint` comes from `VITE_CONTACT_ENDPOINT`; when it is absent the caller
 * never invokes this and instead shows the honest "draft ready" state, so the
 * site can never claim a message was delivered when nothing was sent.
 */
export async function submitContact(endpoint: string, draft: ContactDraft): Promise<SubmitResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    return res.ok ? { status: "ok" } : { status: "network", detail: `HTTP ${res.status}` };
  } catch (err) {
    return { status: "network", detail: err instanceof Error ? err.message : undefined };
  }
}
