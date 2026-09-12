import portrait from "../assets/portrait.jpg";
import portraitWebp from "../assets/portrait.webp";
import heroBg from "../assets/hero.jpg";
import heroBgWebp from "../assets/hero.webp";
import { CABINET } from "../content";
import { useCountUp, useInView, useLang } from "../context";
import { ArrowRight, FacebookIcon, PhoneIcon } from "../components/icons";
import { Btn, Label, Picture, Reveal } from "../components/ui";

function Stat({
  value,
  suffix,
  label,
  active,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  active: boolean;
  delay: number;
}) {
  const shown = useCountUp(value, active);
  return (
    <Reveal delay={delay} className="border-t border-white/12 px-6 py-7 lg:px-8">
      <p className="font-display text-[2rem] leading-none text-white lg:text-[2.4rem]">
        {shown}
        <span className="text-brass-400">{suffix}</span>
      </p>
      <p className="mt-3 text-label uppercase tracking-[0.2em] text-white/50">{label}</p>
    </Reveal>
  );
}

export function Hero() {
  const { t } = useLang();
  const { ref, inView } = useInView<HTMLDivElement>(0.2);

  return (
    <section id="accueil" className="relative overflow-hidden bg-navy-950">
      <Picture
        webp={heroBgWebp}
        jpeg={heroBg}
        alt=""
        width={1280}
        height={853}
        priority
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover opacity-[0.22]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/96 to-navy-950/80" />
      <div className="subtle-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-0 sm:px-8 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="pb-16 lg:pb-24">
            <Reveal>
              <Label dark>{t.hero.eyebrow}</Label>
            </Reveal>

            <Reveal delay={70}>
              <h1 className="mt-7 text-[2.6rem] leading-[1.08] tracking-[-0.015em] text-white sm:text-[3.4rem] lg:text-[4.1rem]">
                {t.hero.titleTop} <em className="italic text-brass-300">{t.hero.titleEm}</em>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-7 max-w-xl text-body leading-relaxed text-white/70">{t.hero.lead}</p>
            </Reveal>

            <Reveal delay={190}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Btn href="#contact" variant="outlineLight" className="border-white/35 bg-white/5">
                  {t.hero.ctaPrimary}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Btn>
                <Btn href="#cabinet" variant="outlineLight">
                  {t.hero.ctaSecondary}
                </Btn>
              </div>
            </Reveal>

            <Reveal delay={250}>
              <dl className="mt-12 grid gap-y-6 border-t border-white/12 pt-8 sm:grid-cols-3 sm:gap-x-8">
                {t.hero.credentials.map((c) => (
                  <div key={c.k}>
                    <dt className="text-micro uppercase tracking-[0.22em] text-brass-300/85">{c.k}</dt>
                    <dd className="mt-2 text-body-sm leading-snug text-white/80">{c.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={310}>
              <div className="mt-8 flex flex-wrap items-center gap-6 text-caption text-white/60">
                <a href={`tel:${CABINET.phone}`} className="flex items-center gap-2 hover:text-white">
                  <PhoneIcon className="h-4 w-4 text-brass-400" /> {CABINET.phoneDisplay}
                </a>
                <a
                  href={CABINET.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-white"
                >
                  <FacebookIcon className="h-4 w-4 text-brass-400" /> {CABINET.facebookHandle}
                </a>
              </div>
            </Reveal>
          </div>

          {/* portrait */}
          <Reveal delay={160} className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div className="relative">
              <span className="absolute -top-4 ltr:-left-4 rtl:-right-4 hidden h-24 w-24 border-t border-brass-400/60 sm:block ltr:border-l rtl:border-r" />
              <div className="relative overflow-hidden border border-white/12">
                <Picture
                  webp={portraitWebp}
                  jpeg={portrait}
                  alt={t.hero.portraitCaption}
                  width={800}
                  height={1200}
                  priority
                  className="block"
                  imgClassName="aspect-[4/5] w-full object-cover object-top"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent px-6 pt-16 pb-6">
                  <p className="font-display text-lg text-white">{t.hero.portraitCaption}</p>
                  <p className="mt-1.5 text-micro uppercase tracking-[0.26em] text-brass-300/90">
                    {t.hero.portraitRole}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <span className="h-px flex-1 bg-white/15" />
                <span className="font-display text-sm text-brass-300">{t.about.badge.value}</span>
                <span className="max-w-[9rem] text-micro uppercase leading-tight tracking-[0.18em] text-white/45">
                  {t.about.badge.label}
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* stats band */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.items.map((s, i) => (
            <Stat key={s.label} {...s} active={inView} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
