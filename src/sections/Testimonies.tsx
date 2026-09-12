import { useState } from "react";
import { useLang } from "../context";
import { cn } from "../utils/cn";
import { ArrowRight, CheckIcon, PlusIcon, QuoteIcon } from "../components/icons";
import { Btn, Disclosure, Reveal, SectionIntro } from "../components/ui";

export function Testimonies() {
  const { t } = useLang();
  return (
    <>
      <section id="avis" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionIntro eyebrow={t.testimonies.eyebrow} title={t.testimonies.title} titleEm={t.testimonies.titleEm} />
          <div className="mt-12 grid gap-px bg-navy-900/12 sm:grid-cols-2">
            {t.testimonies.items.map((item, i) => (
              <Reveal key={item.name} delay={i * 70} className="bg-white">
                <figure className="flex h-full flex-col p-7 sm:p-9">
                  <QuoteIcon className="h-5 w-5 text-brass-500/70" />
                  <blockquote className="mt-5 flex-1 text-body-sm leading-relaxed text-navy-800">
                    “{item.quote}”
                  </blockquote>
                  <figcaption className="mt-7 border-t border-navy-900/10 pt-5">
                    <span className="block text-body-sm font-medium text-navy-900">{item.name}</span>
                    <span className="mt-1 block text-label uppercase tracking-[0.14em] text-navy-500">{item.role}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <p className="mt-6 max-w-3xl text-caption leading-relaxed text-navy-500">{t.testimonies.note}</p>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="border-y border-navy-900/10 bg-ivory-100 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionIntro eyebrow={t.faq.eyebrow} title={t.faq.title} titleEm={t.faq.titleEm} lead={t.faq.lead} />
            </div>
            <Faq />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-950 py-16 sm:py-20">
        <div className="subtle-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="max-w-2xl text-[1.8rem] leading-snug text-white sm:text-[2.3rem]">
              {t.ctaBand.title} <em className="italic text-brass-300">{t.ctaBand.titleEm}</em>
            </h2>
            <p className="mt-5 max-w-xl text-body-sm leading-relaxed text-white/65">{t.ctaBand.text}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-4">
            <Btn href="#contact" variant="outlineLight" className="border-brass-400/60 text-brass-200">
              {t.ctaBand.button}
              <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
            </Btn>
            <Btn href="#domaines" variant="outlineLight">
              {t.nav.expertise}
            </Btn>
          </div>
        </div>
      </section>
    </>
  );
}

function Faq() {
  const { t } = useLang();
  const [open, setOpen] = useState<number>(0);
  return (
    <div className="border-t border-navy-900/12">
      {t.faq.items.map((item, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={item.q} delay={i * 45}>
            <Disclosure
              id={`faq-${i}`}
              open={isOpen}
              onToggle={() => setOpen(isOpen ? -1 : i)}
              buttonClassName="py-5"
              button={
                <>
                  <span className="flex-1">
                    <span
                      className={cn(
                        "block text-body font-medium leading-snug transition-colors duration-300 sm:text-[1.05rem]",
                        isOpen ? "text-brass-700" : "text-navy-900"
                      )}
                    >
                      {item.q}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 grid h-7 w-7 shrink-0 place-items-center border transition-all duration-300",
                      isOpen ? "rotate-45 border-brass-600 text-brass-600" : "border-navy-900/20 text-navy-500"
                    )}
                  >
                    <PlusIcon className="h-3.5 w-3.5" />
                  </span>
                </>
              }
            >
              <p className="flex gap-3 pb-1 text-body-sm leading-relaxed text-navy-700">
                <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" />
                {item.a}
              </p>
            </Disclosure>
          </Reveal>
        );
      })}
      <Reveal delay={140}>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Btn href="#contact">{t.nav.book}</Btn>
          <span className="label text-navy-500">{t.contact.formTitle}</span>
        </div>
      </Reveal>
      <Reveal delay={180}>
        <p className="mt-6 text-caption leading-relaxed text-navy-500">{t.contact.form.note}</p>
      </Reveal>
    </div>
  );
}
