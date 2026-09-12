import { useState } from "react";
import { useLang } from "../context";
import { cn } from "../utils/cn";
import { CheckIcon, PlusIcon } from "../components/icons";
import { Label, Reveal, SectionIntro, Disclosure } from "../components/ui";

export function Expertise() {
  const { t } = useLang();
  const [open, setOpen] = useState<number>(0);

  return (
    <section id="domaines" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              eyebrow={t.expertise.eyebrow}
              title={t.expertise.title}
              titleEm={t.expertise.titleEm}
              lead={t.expertise.lead}
            />
            <Reveal delay={160}>
              <p className="mt-8 border-l-2 border-brass-500/70 pl-4 text-caption leading-relaxed text-navy-500">
                {t.expertise.note}
              </p>
            </Reveal>
          </div>

          <div className="border-t border-navy-900/12">
            {t.expertise.items.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.title} delay={i * 50}>
                  <Disclosure
                    id={`expertise-${i}`}
                    open={isOpen}
                    onToggle={() => setOpen(isOpen ? -1 : i)}
                    buttonClassName="py-6"
                    button={
                      <>
                        <span className="w-8 shrink-0 pt-1 font-display text-caption text-brass-700">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1">
                          <span
                            className={cn(
                              "block font-display text-[1.15rem] leading-snug transition-colors duration-300 sm:text-[1.3rem]",
                              isOpen ? "text-brass-700" : "text-navy-900"
                            )}
                          >
                            {item.title}
                          </span>
                          <span
                            className={cn(
                              "mt-2 block max-w-xl text-body-sm leading-relaxed transition-colors duration-300",
                              isOpen ? "text-navy-700" : "text-navy-500"
                            )}
                          >
                            {item.text}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "mt-1 grid h-7 w-7 shrink-0 place-items-center border transition-all duration-300",
                            isOpen ? "rotate-45 border-brass-600 text-brass-600" : "border-navy-900/20 text-navy-500"
                          )}
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </span>
                      </>
                    }
                  >
                    <div className="ltr:pl-13 rtl:pr-13">
                      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-x-10">
                        {item.points.map((p) => (
                          <li key={p} className="flex gap-3">
                            <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-500" />
                            <span className="text-body-sm leading-relaxed text-navy-700">{p}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 border border-navy-900/10 bg-ivory-50 px-5 py-4">
                        <span className="label text-navy-500">{t.expertise.laws}</span>
                        <p className="mt-2 text-body-sm text-navy-800">{item.laws}</p>
                      </div>
                    </div>
                  </Disclosure>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Method() {
  const { t } = useLang();
  return (
    <section id="methode" className="relative overflow-hidden bg-navy-950 py-20 sm:py-24">
      <div className="subtle-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <SectionIntro dark eyebrow={t.method.eyebrow} title={t.method.title} titleEm={t.method.titleEm} />
          <p className="max-w-lg text-body-sm leading-relaxed text-white/60 lg:pb-3">{t.method.lead}</p>
        </div>

        <div className="mt-14 grid gap-x-10 gap-y-10 border-t border-white/12 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.method.steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <p className="font-display text-[1.6rem] leading-none text-brass-400">{s.num}</p>
              <h3 className="mt-5 text-[1.05rem] font-medium text-white">{s.title}</h3>
              <span className="mt-4 block h-px w-10 bg-brass-500/60" />
              <p className="mt-4 text-body-sm leading-relaxed text-white/60">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Career() {
  const { t } = useLang();
  return (
    <section id="parcours" className="bg-ivory-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Label>{t.career.eduEyebrow}</Label>
            <h2 className="mt-5 text-[1.7rem] leading-snug text-navy-900 sm:text-[2.1rem]">
              {t.career.eduTitle} <em className="italic text-brass-600">{t.career.eduEm}</em>
            </h2>

            <ul className="mt-10 border-t border-navy-900/12">
              {t.career.edu.map((e, i) => (
                <Reveal as="li" key={e.title} delay={i * 70} className="border-b border-navy-900/12 py-5">
                  <div className="grid gap-2 sm:grid-cols-[4.5rem_1fr] sm:gap-6">
                    <span className="font-display text-body-sm text-brass-600">{e.year}</span>
                    <div>
                      <h3 className="text-body font-medium leading-snug text-navy-900">{e.title}</h3>
                      <p className="mt-1.5 text-caption leading-relaxed text-navy-500">{e.place}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={120}>
              <div className="mt-12">
                <Label>{t.career.courtsTitle}</Label>
                <ul className="mt-5 space-y-3">
                  {t.career.courts.map((c) => (
                    <li key={c} className="flex gap-3 text-body-sm leading-relaxed text-navy-700">
                      <span className="mt-2.5 h-px w-4 shrink-0 bg-brass-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div>
            <Label>{t.career.expEyebrow}</Label>
            <h2 className="mt-5 text-[1.7rem] leading-snug text-navy-900 sm:text-[2.1rem]">
              {t.career.expTitle} <em className="italic text-brass-600">{t.career.expEm}</em>
            </h2>

            <ol className="mt-10 border-t border-navy-900/12">
              {t.career.exp.map((e, i) => (
                <Reveal as="li" key={e.title} delay={i * 80} className="border-b border-navy-900/12 py-6">
                  <p className="text-label font-medium uppercase tracking-[0.2em] text-brass-600">{e.period}</p>
                  <h3 className="mt-3 font-display text-[1.1rem] leading-snug text-navy-900">{e.title}</h3>
                  <p className="mt-1.5 text-caption text-navy-500">{e.place}</p>
                  <p className="mt-3.5 text-body-sm leading-relaxed text-navy-700">{e.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
