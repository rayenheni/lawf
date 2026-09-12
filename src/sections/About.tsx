import office from "../assets/office.jpg";
import officeWebp from "../assets/office.webp";
import { useLang } from "../context";
import { CheckIcon } from "../components/icons";
import { DataTable, Label, Picture, Reveal, SectionIntro } from "../components/ui";

export function About() {
  const { t } = useLang();
  return (
    <>
      <section id="cabinet" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <SectionIntro
                eyebrow={t.about.eyebrow}
                title={t.about.title}
                titleEm={t.about.titleEm}
                lead={t.about.lead}
              />

              <Reveal delay={140}>
                <p className="mt-7 text-body-sm leading-relaxed text-navy-700">{t.about.p1}</p>
              </Reveal>
              <Reveal delay={190}>
                <p className="mt-4 text-body-sm leading-relaxed text-navy-700">{t.about.p2}</p>
              </Reveal>

              <ul className="mt-9 space-y-3.5">
                {t.about.bullets.map((b, i) => (
                  <Reveal as="li" key={b} delay={i * 70} className="flex gap-3.5">
                    <CheckIcon className="mt-1 h-3.5 w-3.5 shrink-0 text-brass-600" />
                    <span className="text-body-sm leading-relaxed text-navy-800">{b}</span>
                  </Reveal>
                ))}
              </ul>

              <Reveal delay={200}>
                <div className="mt-12">
                  <Label>{t.about.factTitle}</Label>
                  <DataTable className="mt-5" rows={t.about.facts} />
                </div>
              </Reveal>
            </div>

            <div className="lg:pt-20">
              <Reveal delay={100} className="relative">
                <div className="overflow-hidden border border-navy-900/10">
                  <Picture
                    webp={officeWebp}
                    jpeg={office}
                    alt={t.about.caption}
                    width={960}
                    height={640}
                    className="block"
                    imgClassName="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <p className="mt-3.5 text-label uppercase tracking-[0.2em] text-navy-500">{t.about.caption}</p>
              </Reveal>

              <Reveal delay={180} className="mt-10 border border-navy-900/10 p-6">
                <Label>{t.about.langTitle}</Label>
                <ul className="mt-6 space-y-5">
                  {t.about.languages.map((l) => (
                    <li key={l.name}>
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-body-sm font-medium text-navy-900">{l.name}</span>
                        <span className="text-label uppercase tracking-[0.16em] text-navy-500">{l.level}</span>
                      </div>
                      <span className="mt-2.5 block h-[2px] w-full bg-navy-900/10">
                        <span className="block h-full bg-brass-500/80" style={{ width: `${l.pct}%` }} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* engagements */}
      <section className="border-y border-navy-900/10 bg-ivory-100 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="max-w-xl text-[1.6rem] leading-snug text-navy-900 sm:text-[2rem]">
              {t.engagements.title} <em className="italic text-brass-600">{t.engagements.titleEm}</em>
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-14">
            {t.engagements.items.map((e, i) => (
              <Reveal key={e.num} delay={i * 90} className="border-t border-navy-900/15 pt-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm text-brass-600">{e.num}</span>
                  <h3 className="text-[1.05rem] font-medium text-navy-900">{e.title}</h3>
                </div>
                <p className="mt-4 text-body-sm leading-relaxed text-navy-600">{e.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
