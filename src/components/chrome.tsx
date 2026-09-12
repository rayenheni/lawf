import { useEffect, useRef, useState } from "react";
import { CABINET } from "../content";
import { useLang, useScrollProgress, useScrollSpy } from "../context";
import { cn } from "../utils/cn";
import {
  ArrowUp,
  ClockIcon,
  CloseIcon,
  FacebookIcon,
  MailIcon,
  MenuIcon,
  PhoneIcon,
  PinIcon,
  WhatsAppIcon,
} from "./icons";
import { Btn, Reveal } from "./ui";

const SECTION_IDS = ["accueil", "cabinet", "domaines", "methode", "parcours", "avis", "faq", "contact"];

function Wordmark({ dark = true }: { dark?: boolean }) {
  const { t } = useLang();
  return (
    <a href="#accueil" className="group flex items-center gap-3">
      <span
        className={cn(
          "grid h-10 w-10 place-items-center border",
          dark ? "border-navy-900/20 bg-navy-900 text-white" : "border-white/25 bg-white/10 text-white"
        )}
      >
        <span className="font-display text-label tracking-wide">{t.brand.initials}</span>
      </span>
      <span className="leading-none">
        <span
          className={cn("block font-display text-[1.02rem] tracking-[0.02em]", dark ? "text-navy-900" : "text-white")}
        >
          {t.brand.name}
        </span>
        <span
          className={cn("mt-1 block text-micro uppercase tracking-[0.26em]", dark ? "text-navy-500" : "text-white/55")}
        >
          {t.hero.portraitRole}
        </span>
      </span>
    </a>
  );
}

function LangSwitch({ dark = true }: { dark?: boolean }) {
  const { lang, setLang, t } = useLang();
  return (
    <div role="group" aria-label={t.a11y.lang} className="flex items-center gap-3">
      {(["fr", "en", "ar"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={cn(
            "text-label font-medium uppercase tracking-[0.16em] transition-colors duration-200",
            lang === code
              ? dark
                ? "text-brass-700 underline decoration-brass-500 decoration-1 underline-offset-4"
                : "text-brass-300 underline decoration-brass-400 decoration-1 underline-offset-4"
              : dark
                ? "text-navy-500 hover:text-navy-900"
                : "text-white/45 hover:text-white"
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

/** Focusable elements inside a container, in DOM order. */
function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(SECTION_IDS, 0.28);
  const progress = useScrollProgress();

  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const openBtnRef = useRef<HTMLButtonElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Move focus into the dialog when it opens, and back to the trigger on close.
  useEffect(() => {
    if (open) {
      closeBtnRef.current?.focus();
    } else if (wasOpen.current) {
      openBtnRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Escape closes; Tab is trapped inside the dialog while it is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !drawerRef.current) return;
      const items = focusables(drawerRef.current);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { id: "cabinet", label: t.nav.about },
    { id: "domaines", label: t.nav.expertise },
    { id: "methode", label: t.nav.method },
    { id: "parcours", label: t.nav.career },
    { id: "avis", label: t.nav.testimonies },
    { id: "faq", label: t.nav.faq },
  ];

  return (
    <>
      {/* utility bar */}
      <div className="hidden bg-navy-950 text-white/70 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2.5">
          <p className="label text-white/55">{t.utility}</p>
          <div className="flex items-center gap-7">
            <a href={`tel:${CABINET.phone}`} className="flex items-center gap-2 text-caption hover:text-white">
              <PhoneIcon className="h-3.5 w-3.5" /> {CABINET.phoneDisplay}
            </a>
            <a href={`mailto:${CABINET.email}`} className="flex items-center gap-2 text-caption hover:text-white">
              <MailIcon className="h-3.5 w-3.5" /> {CABINET.email}
            </a>
            <a
              href={CABINET.facebook}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-caption hover:text-white"
            >
              <FacebookIcon className="h-3.5 w-3.5" /> Facebook
            </a>
            <LangSwitch dark={false} />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-navy-900/10 bg-white/95 backdrop-blur-sm">
        <div
          className="absolute inset-x-0 top-0 h-[2px] bg-brass-500/90 transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-8 px-5 transition-all duration-300 sm:px-8",
            scrolled ? "py-3" : "py-4 lg:py-5"
          )}
        >
          <Wordmark />

          <nav aria-label={t.a11y.nav} className="hidden items-center gap-8 xl:flex">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={cn(
                  "label border-b pb-1 transition-colors duration-200",
                  active === l.id
                    ? "border-brass-500 text-navy-900"
                    : "border-transparent text-navy-500 hover:border-navy-900/25 hover:text-navy-900"
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={`tel:${CABINET.phone}`}
              className="flex items-center gap-2 text-caption font-medium text-navy-800 hover:text-brass-600 xl:hidden"
            >
              <PhoneIcon className="h-4 w-4" /> {t.nav.call}
            </a>
            <Btn href="#contact">{t.nav.book}</Btn>
          </div>

          <button
            ref={openBtnRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.a11y.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-10 w-10 place-items-center border border-navy-900/20 text-navy-900 lg:hidden"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* mobile drawer — a real modal dialog: labelled, focus-trapped, and
          `inert` while closed so its links leave the tab order. */}
      <div
        id="mobile-menu"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.a11y.menu}
        inert={!open}
        className={cn(
          "fixed inset-0 z-70 bg-white transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Wordmark />
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t.a11y.close}
              className="grid h-10 w-10 place-items-center border border-navy-900/20 text-navy-900"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          <nav aria-label={t.a11y.nav} className="mt-10 flex flex-col border-t border-navy-900/10">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="border-b border-navy-900/10 py-4 font-display text-xl text-navy-900"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="border-b border-navy-900/10 py-4 font-display text-xl text-brass-600"
            >
              {t.nav.contact}
            </a>
          </nav>

          <div className="mt-8 space-y-4 text-body-sm text-navy-700">
            <a href={`tel:${CABINET.phone}`} className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 text-brass-600" /> {CABINET.phoneDisplay}
            </a>
            <a href={`mailto:${CABINET.email}`} className="flex items-center gap-3">
              <MailIcon className="h-4 w-4 text-brass-600" /> {CABINET.email}
            </a>
            <p className="flex items-start gap-3">
              <PinIcon className="mt-3 h-4 w-4 shrink-0 text-brass-600" /> {t.contact.address}
            </p>
          </div>

          <div className="mt-auto space-y-6 pt-10">
            <LangSwitch />
            <Btn href="#contact" className="w-full" onClick={() => setOpen(false)}>
              {t.nav.book}
            </Btn>
          </div>
        </div>
      </div>
    </>
  );
}

export function FloatingActions() {
  const { t } = useLang();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base =
    "grid h-11 w-11 place-items-center border border-navy-900/15 bg-white/95 text-navy-800 shadow-sm backdrop-blur transition-colors duration-300 hover:border-navy-900 hover:bg-navy-900 hover:text-white";

  return (
    <div className="fixed bottom-5 z-40 flex flex-col gap-2 ltr:right-4 rtl:left-4 sm:bottom-6 ltr:sm:right-6 rtl:sm:left-6">
      <a
        href={`https://wa.me/${CABINET.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        className={base}
        aria-label={t.a11y.whatsapp}
        title={t.a11y.whatsapp}
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
      <a href={`tel:${CABINET.phone}`} className={base} aria-label={t.a11y.phone} title={t.a11y.phone}>
        <PhoneIcon className="h-4 w-4" />
      </a>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        inert={!showTop}
        className={cn(base, showTop ? "opacity-100" : "pointer-events-none opacity-0")}
        aria-label={t.a11y.top}
        title={t.a11y.top}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const nav = [
    { id: "cabinet", label: t.nav.about },
    { id: "domaines", label: t.nav.expertise },
    { id: "methode", label: t.nav.method },
    { id: "parcours", label: t.nav.career },
    { id: "avis", label: t.nav.testimonies },
    { id: "faq", label: t.nav.faq },
    { id: "contact", label: t.nav.contact },
  ];

  return (
    <footer className="bg-navy-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          <div>
            <Wordmark dark={false} />
            <p className="mt-6 max-w-xs text-body-sm leading-relaxed text-white/60">{t.footer.tagline}</p>
            <div className="mt-7 flex gap-3">
              <a
                href={CABINET.facebook}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center border border-white/20 text-white/80 transition-colors hover:border-brass-400 hover:text-brass-300"
                aria-label={t.a11y.facebook}
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${CABINET.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center border border-white/20 text-white/80 transition-colors hover:border-brass-400 hover:text-brass-300"
                aria-label={t.a11y.whatsapp}
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${CABINET.email}`}
                className="grid h-9 w-9 place-items-center border border-white/20 text-white/80 transition-colors hover:border-brass-400 hover:text-brass-300"
                aria-label={t.a11y.email}
              >
                <MailIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="label text-brass-300">{t.footer.navTitle}</h4>
            <ul className="mt-6 space-y-3 text-body-sm text-white/65">
              {nav.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="link-underline hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label text-brass-300">{t.footer.expertiseTitle}</h4>
            <ul className="mt-6 space-y-3 text-body-sm text-white/65">
              {t.expertise.items.map((e) => (
                <li key={e.title}>
                  <a href="#domaines" className="link-underline hover:text-white">
                    {e.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label text-brass-300">{t.contact.cabinet}</h4>
            <ul className="mt-6 space-y-4 text-body-sm text-white/65">
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
                <span>{t.contact.address}</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
                <span>
                  {CABINET.phoneDisplay}
                  <span className="block text-white/45">{CABINET.landlineDisplay}</span>
                </span>
              </li>
              <li className="flex gap-3">
                <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-brass-400" />
                <span>
                  {t.contact.hours.map((h) => (
                    <span key={h.d} className="block">
                      {h.d} — {h.h}
                    </span>
                  ))}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <Reveal className="flex flex-col gap-4 text-caption leading-relaxed text-white/45 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl space-y-2">
              <p>
                {t.footer.legal1} {t.footer.legal2}
              </p>
              <p>{t.footer.legal3}</p>
            </div>
            <p className="whitespace-nowrap">
              © {year} Cabinet {CABINET.lawyer} — {t.footer.rights}
            </p>
          </Reveal>

          {/* Legal notice & privacy: native <details> so it works without JS and
              is fully crawlable. */}
          <details className="group mt-6 border-t border-white/10 pt-5">
            <summary className="label cursor-pointer list-none text-white/60 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brass-400">
              <span aria-hidden="true" className="me-2 inline-block transition-transform group-open:rotate-90">
                ›
              </span>
              {t.legal.title}
            </summary>
            <dl className="mt-5 grid gap-x-10 gap-y-5 text-caption leading-relaxed text-white/60 sm:grid-cols-2">
              <div>
                <dt className="text-white/85">{t.legal.editor}</dt>
                <dd className="mt-1">{t.legal.editorValue}</dd>
              </div>
              <div>
                <dt className="text-white/85">{t.legal.hosting}</dt>
                <dd className="mt-1">{t.legal.hostingValue}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/85">{t.legal.dataTitle}</dt>
                <dd className="mt-1">{t.legal.dataBody}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-white/85">{t.legal.cookiesTitle}</dt>
                <dd className="mt-1">{t.legal.cookies}</dd>
              </div>
            </dl>
          </details>
        </div>
      </div>
    </footer>
  );
}
