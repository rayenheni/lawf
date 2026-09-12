/**
 * Post-processes the client build into one fully-rendered, crawlable HTML
 * document per locale:
 *
 *   dist/index.html      (fr, the default)
 *   dist/en/index.html
 *   dist/ar/index.html
 *   dist/robots.txt
 *   dist/sitemap.xml
 *
 * Run after `vite build` and `vite build --ssr src/entry-server.tsx`:
 *
 *   npm run build
 *
 * Each document gets its real rendered markup inside #root (hydrated on the
 * client), a localised <html lang>/<dir>, localised title/description,
 * hreflang alternates, a canonical link and LegalService JSON-LD.
 */
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(root, "dist");

const { render, meta, CABINET, LANGS } = await import(pathToFileURL(path.join(DIST, "server", "entry-server.js")).href);

const SITE = CABINET.siteUrl.replace(/\/$/, "");
const LOCALES = LANGS.map((l) => ({
  code: l.code,
  path: l.code === "fr" ? "" : `${l.code}/`,
}));

const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

function headFor(code, m) {
  const hreflang = LOCALES.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${SITE}/${l.path}" />`).join(
    "\n    "
  );
  const self = LOCALES.find((l) => l.code === code);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: `Cabinet ${CABINET.lawyer}`,
    description: m.description,
    inLanguage: code,
    telephone: CABINET.phone,
    email: CABINET.email,
    url: `${SITE}/${self.path}`,
    areaServed: "TN",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Avenue Habib Bourguiba",
      addressLocality: "Tunis",
      addressCountry: "TN",
    },
    knowsLanguage: ["fr", "ar", "en"],
  };

  return `
    ${hreflang}
    <link rel="alternate" hreflang="x-default" href="${SITE}/" />
    <link rel="canonical" href="${SITE}/${self.path}" />
    <meta property="og:url" content="${SITE}/${self.path}" />
    <meta property="og:locale" content="${code === "fr" ? "fr_TN" : code === "ar" ? "ar_TN" : "en_TN"}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
}

function renderDocument(template, code, appHtml) {
  const m = meta(code);
  let html = template;

  html = html.replace(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${code}" dir="${m.dir}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${esc(m.description)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:title" content="${esc(m.title)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${esc(m.description)}" />`
  );

  html = html.replace("</head>", `${headFor(code, m)}\n  </head>`);
  html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${appHtml}</div>`);

  return html;
}

async function main() {
  const template = await readFile(path.join(DIST, "index.html"), "utf8");

  for (const locale of LOCALES) {
    const appHtml = render(locale.code);
    const doc = renderDocument(template, locale.code, appHtml);
    const outDir = locale.path ? path.join(DIST, locale.path) : DIST;
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, "index.html"), doc);
    console.log(
      `prerendered ${locale.path || "(root)"} -> ${(doc.length / 1024).toFixed(0)} KB ` +
        `(${(appHtml.length / 1024).toFixed(0)} KB of real, crawlable markup)`
    );
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LOCALES.map(
  (l) => `  <url>
    <loc>${SITE}/${l.path}</loc>
${LOCALES.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.code}" href="${SITE}/${a.path}" />`).join("\n")}
  </url>`
).join("\n")}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

  await writeFile(path.join(DIST, "sitemap.xml"), sitemap);
  await writeFile(path.join(DIST, "robots.txt"), robots);
  console.log("wrote sitemap.xml and robots.txt");

  // The SSR bundle was only an input to this step; keep the deployable
  // directory free of build-only artifacts.
  await rm(path.join(DIST, "server"), { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
