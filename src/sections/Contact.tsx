import { useMemo, useState } from "react";
import { CABINET } from "../content";
import { useLang } from "../context";
import { cn } from "../utils/cn";
import {
  buildMessage,
  mailtoHref,
  submitContact,
  validateContact,
  whatsappHref,
  type ContactDraft,
} from "../lib/contact";
import {
  ArrowRight,
  CheckIcon,
  ClockIcon,
  FacebookIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "../components/icons";
import { Btn, Label, Reveal, SectionIntro } from "../components/ui";

const field =
  "w-full border border-navy-900/15 bg-white px-4 py-3 text-body-sm text-navy-900 placeholder:text-navy-400 transition-colors duration-200 focus:border-brass-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500/40";
const fieldLabel = "mb-2 block text-label font-medium uppercase tracking-[0.18em] text-navy-500";
const chip = "border px-4 py-2 text-caption transition-colors duration-200";

/**
 * Optional intake endpoint. When `VITE_CONTACT_ENDPOINT` is absent the form
 * never pretends to send: it shows the "draft ready" state instead.
 */
const ENDPOINT: string | undefined = import.meta.env.VITE_CONTACT_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "prepared" | "network";

export function Contact() {
  const { t } = useLang();
  const f = t.contact.form;
  const empty = (): ContactDraft => ({
    name: "",
    phone: "",
    email: "",
    subject: f.subjects[0],
    date: "",
    slot: f.slots[0],
    message: "",
  });
  const [form, setForm] = useState<ContactDraft>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState(false);

  const update = (key: keyof ContactDraft, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const message = useMemo(
    () =>
      buildMessage(
        form,
        { name: f.name, phone: f.phone, email: f.email, subject: f.subject, date: f.date, message: f.message },
        f.greeting
      ),
    [form, f]
  );

  const waHref = whatsappHref(CABINET.whatsapp, message);
  const mailHref = mailtoHref(CABINET.email, `${form.subject} — ${form.name}`, message);

  const submit = async () => {
    if (!validateContact(form)) {
      setError(true);
      return;
    }
    setError(false);
    if (!ENDPOINT) {
      // Honest path: nothing is transmitted by this site, so we say so and
      // hand over a pre-drafted message on the visitor's own channels.
      setStatus("prepared");
      return;
    }
    setStatus("sending");
    const result = await submitContact(ENDPOINT, form);
    setStatus(result.status === "ok" ? "sent" : "network");
  };

  const showOutcome = status === "sent" || status === "prepared" || status === "network";

  return (
    <section id="contact" className="bg-ivory-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionIntro
          eyebrow={t.contact.eyebrow}
          title={t.contact.title}
          titleEm={t.contact.titleEm}
          lead={t.contact.lead}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* form */}
          <Reveal className="border border-navy-900/12 bg-white p-6 sm:p-8">
            {/* The outcome region is announced politely so screen-reader users
                hear the result of submitting, including failures. */}
            <div aria-live="polite">
              {showOutcome ? (
                <div className="flex min-h-[28rem] flex-col justify-center">
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center border",
                      status === "network" ? "border-red-500/60 text-red-600" : "border-brass-500/60 text-brass-600"
                    )}
                  >
                    {status === "network" ? <PhoneIcon className="h-5 w-5" /> : <CheckIcon className="h-5 w-5" />}
                  </span>
                  <h3 className="mt-6 font-display text-[1.5rem] text-navy-900">
                    {status === "sent" ? f.sentTitle : status === "network" ? f.networkError : f.preparedTitle}
                  </h3>
                  <p className="mt-2 text-body-sm text-navy-600">{status === "sent" ? f.sentSub : f.preparedSub}</p>

                  <h4 className="label mt-8 border-t border-navy-900/12 pt-6 text-navy-500">{f.summaryTitle}</h4>
                  <dl className="mt-2">
                    {[
                      [f.subject, `${form.subject}`],
                      [
                        f.name,
                        `${form.name}${form.phone ? ` — ${form.phone}` : ""}${form.email ? ` — ${form.email}` : ""}`,
                      ],
                      [f.date, `${form.date || "—"} · ${form.slot}`],
                      [f.message, form.message],
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="grid gap-1 border-b border-navy-900/12 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4"
                      >
                        <dt className="label text-navy-500">{k}</dt>
                        <dd className="text-body-sm leading-relaxed text-navy-800">{v}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="label mt-8 text-navy-500">{f.channelLabel}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <Btn href={waHref}>
                      <WhatsAppIcon className="h-4 w-4" />
                      {f.whatsapp}
                    </Btn>
                    <Btn href={mailHref} variant="outline">
                      <MailIcon className="h-4 w-4" />
                      {f.email}
                    </Btn>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setForm(empty());
                      }}
                      className="text-label uppercase tracking-[0.16em] text-navy-500 underline underline-offset-4 hover:text-brass-600"
                    >
                      {f.reopen}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submit();
                  }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-navy-900/12 pb-5">
                    <h3 className="text-[1.05rem] font-medium text-navy-900">{t.contact.formTitle}</h3>
                    <span className="label text-navy-400">{t.contact.eyebrow}</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={fieldLabel} htmlFor="contact-name">
                        {f.name}
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        className={field}
                        placeholder={f.namePh}
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel} htmlFor="contact-phone">
                        {f.phone}
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className={field}
                        placeholder={f.phonePh}
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel} htmlFor="contact-email">
                        {f.email}
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={field}
                        placeholder={f.emailPh}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={fieldLabel} htmlFor="contact-date">
                        {f.date}
                      </label>
                      <input
                        id="contact-date"
                        name="date"
                        type="date"
                        className={field}
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                      />
                    </div>
                  </div>

                  <fieldset className="border-0 p-0">
                    <legend className={fieldLabel}>{f.subject}</legend>
                    <div className="flex flex-wrap gap-2">
                      {f.subjects.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={form.subject === s}
                          onClick={() => update("subject", s)}
                          className={cn(
                            chip,
                            form.subject === s
                              ? "border-navy-900 bg-navy-900 text-white"
                              : "border-navy-900/15 text-navy-600 hover:border-navy-900/45 hover:text-navy-900"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="border-0 p-0">
                    <legend className={fieldLabel}>{f.slot}</legend>
                    <div className="flex flex-wrap gap-2">
                      {f.slots.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={form.slot === s}
                          onClick={() => update("slot", s)}
                          className={cn(
                            chip,
                            form.slot === s
                              ? "border-brass-600 bg-brass-500/12 text-brass-700"
                              : "border-navy-900/15 text-navy-600 hover:border-navy-900/45 hover:text-navy-900"
                          )}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label className={fieldLabel} htmlFor="contact-message">
                      {f.message}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      className={cn(field, "resize-none")}
                      placeholder={f.messagePh}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="border-l-2 border-red-500 bg-red-50/60 px-4 py-3 text-caption text-red-700"
                    >
                      {f.required}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-6">
                    <Btn type="submit">
                      {status === "sending" ? f.sending : f.submit}
                      {status !== "sending" && <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />}
                    </Btn>
                    <p className="max-w-sm text-caption leading-relaxed text-navy-500">{f.note}</p>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          {/* details */}
          <div className="space-y-8">
            <Reveal>
              <Label>{t.contact.cabinet}</Label>
              <dl className="mt-6 divide-y divide-navy-900/12 border-t border-navy-900/12">
                <div className="flex gap-4 py-5">
                  <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
                  <div>
                    <dt className="label text-navy-500">{t.contact.cabinet}</dt>
                    <dd className="mt-1.5 text-body-sm leading-relaxed text-navy-800">{t.contact.address}</dd>
                  </div>
                </div>
                <div className="flex gap-4 py-5">
                  <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
                  <div>
                    <dt className="label text-navy-500">{t.contact.phoneLabel}</dt>
                    <dd className="mt-1.5 space-y-1 text-body-sm text-navy-800">
                      <a href={`tel:${CABINET.phone}`} className="block hover:text-brass-600">
                        {CABINET.phoneDisplay}
                      </a>
                      <a href={`tel:${CABINET.landline}`} className="block hover:text-brass-600">
                        {CABINET.landlineDisplay}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4 py-5">
                  <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
                  <div>
                    <dt className="label text-navy-500">{t.contact.emailLabel}</dt>
                    <dd className="mt-1.5 text-body-sm text-navy-800">
                      <a href={`mailto:${CABINET.email}`} className="hover:text-brass-600">
                        {CABINET.email}
                      </a>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4 py-5">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-600" />
                  <div className="w-full">
                    <dt className="label text-navy-500">{t.contact.hoursLabel}</dt>
                    <dd className="mt-2 space-y-1.5">
                      {t.contact.hours.map((h) => (
                        <span key={h.d} className="flex justify-between gap-4 text-body-sm text-navy-700">
                          <span>{h.d}</span>
                          <span className="text-navy-900">{h.h}</span>
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-8">
                <Label>{t.contact.followLabel}</Label>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href={CABINET.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-navy-900/15 px-4 py-2 text-caption text-navy-800 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                  >
                    <FacebookIcon className="h-4 w-4" /> Facebook
                  </a>
                  <a
                    href={`https://wa.me/${CABINET.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-navy-900/15 px-4 py-2 text-caption text-navy-800 transition-colors hover:border-navy-900 hover:bg-navy-900 hover:text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="border border-navy-900/12 bg-white">
              <iframe
                title={t.a11y.map}
                src={CABINET.mapEmbed}
                className="h-64 w-full grayscale-[45%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={CABINET.mapLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 border-t border-navy-900/12 px-5 py-4 text-caption uppercase tracking-[0.16em] text-navy-700 transition-colors hover:text-brass-600"
              >
                <span>
                  {t.contact.cabinet} — {t.contact.address}
                </span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
