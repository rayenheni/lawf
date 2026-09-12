import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { CABINET, content, LANGS, type Lang } from "./content";

export { CABINET, LANGS };

/**
 * Server entry used by `scripts/prerender.mjs` to produce one crawlable,
 * fully-rendered HTML document per locale.
 */
export function render(lang: Lang): string {
  return renderToString(
    <StrictMode>
      <App initialLang={lang} />
    </StrictMode>
  );
}

export function meta(lang: Lang) {
  const dir = LANGS.find((l) => l.code === lang)?.dir ?? "ltr";
  return {
    dir,
    title: content[lang].seo.title,
    description: content[lang].seo.description,
  };
}
