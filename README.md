# lawf — Cabinet d'avocat, site trilingue pré-rendu

Single-page marketing site for a Tunis law firm, in **French, English and Arabic**
(with full RTL layout), pre-rendered at build time into one crawlable HTML
document per locale and hydrated on the client.

Stack: React 19 · TypeScript (strict) · Vite 7 · Tailwind CSS 4 · Vitest.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Script                 | What it does                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Dev server (proxied hosts allowed — see `vite.config.ts`)                |
| `npm run build`        | Client build → SSR build → **pre-render** `/`, `/en/`, `/ar/` + sitemap  |
| `npm run build:single` | Legacy one-file artifact (inlines everything into a single `index.html`) |
| `npm run preview`      | Serve `dist/`                                                            |
| `npm test`             | Vitest (pure logic + component behaviour)                                |
| `npm run typecheck`    | `tsc --noEmit` under `strict`                                            |
| `npm run lint`         | ESLint (TS + react-hooks + jsx-a11y)                                     |
| `npm run format`       | Prettier                                                                 |
| `npm run images`       | Re-derive optimised WebP/JPEG from `src/assets/original/`                |

---

## Architecture

```
src/
  content.ts        All copy for the 3 locales + cabinet coordinates.
                    `const en: typeof fr` / `const ar: typeof fr` make a
                    missing or drifted translation key a COMPILE error.
  context.tsx       LangProvider (locale + document lang/dir), scroll hooks.
  entry-server.tsx  SSR entry used only by scripts/prerender.mjs.
  main.tsx          hydrateRoot() when markup is present, createRoot() otherwise.
  lib/contact.ts    Pure, tested form logic (validation, message, hrefs, POST).
  components/       chrome (header/drawer/footer), ui primitives, icons.
  sections/         One file per page section.
scripts/
  optimize-images.mjs  sharp pipeline: original/ -> webp + progressive jpeg.
  prerender.mjs        Builds per-locale HTML, hreflang, canonical, JSON-LD,
                       sitemap.xml and robots.txt into dist/.
```

### The content boundary

**No user-facing string lives in a component.** Every label, including
`aria-label`s, the WhatsApp salutation and the SEO title, comes from
`content.ts`. Adding a locale means adding one object; the type system then
lists every key you must provide.

### Pre-rendering & hydration

`npm run build` renders the app to a string per locale and injects it into the
built shell, so crawlers and no-JS visitors receive the full text. The client
then hydrates. Two invariants keep hydration byte-identical:

1. `LangProvider` seeds its state from `<html lang>` (`detectLang()`), never
   from a hard-coded default.
2. The scroll-reveal styles are scoped under `html.js`, which an inline script
   adds before first paint — so server markup, no-JS visitors and the first
   client paint all agree that content is visible.

### Images

`src/assets/original/` holds the untouched sources. `npm run images` derives
the delivered files (WebP + progressive JPEG fallback, sized to the largest
rendered box at 2×, EXIF-rotated, metadata stripped). Components use the
`<Picture>` primitive so intrinsic dimensions prevent layout shift.

---

## Contact form

The form is honest by construction:

- **With `VITE_CONTACT_ENDPOINT` set** — the draft is POSTed as JSON; the
  confirmation screen is only shown on a 2xx response, and a failure shows a
  retry state plus the direct channels.
- **Without it** — the form never claims to have sent anything. It shows a
  _"your request is ready"_ state with the message already drafted for
  WhatsApp and e-mail, so a static deployment still converts leads.

See `.env.example`. The logic lives in `src/lib/contact.ts` and is unit-tested.

---

## Demo data — read before going live

`CABINET.demo` is `true`. Phone numbers, e-mail, address, statistics and
testimonials are **placeholders**; the footer discloses this in all three
locales. Before publishing for a real practitioner:

1. Replace `CABINET` and set `demo: false`.
2. Replace the testimonial set with reviews backed by written client consent
   (bar advertising rules apply), or remove the section.
3. Fill `legal.hostingValue` and publish the INPDP data-protection declaration
   required for any personal-data processing in Tunisia.

---

## Accessibility

WCAG 2.1 AA is the target and is enforced where automatable (`eslint-plugin-jsx-a11y`,
plus contrast measured for every text/background pair in the palette). Notable
points: skip link, real modal dialog for the mobile menu (focus trap, Escape,
`inert` when closed), labelled form controls, `aria-expanded`/`aria-controls`
on every disclosure, `prefers-reduced-motion` support, and an 11px type floor
(see the `@theme` scale in `src/index.css`).

## Deployment

`dist/` is a plain static site: serve it from any CDN or object storage.
Point the host at `CABINET.siteUrl` (used for canonical/hreflang/sitemap) and
keep the directory structure — `/`, `/en/`, `/ar/`.
