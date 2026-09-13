/**
 * Vérifications statiques sans dépendance, lancées par la CI :
 *  - les 3 pages existent et déclarent le bon lang/dir ;
 *  - chaque page référence les 3 hreflang + x-default + canonical ;
 *  - aucune ancre interne cassée (href="#x" sans id="x") ;
 *  - aucun chemin local cassé (src/href vers /assets/…) ;
 *  - chaque champ de formulaire reste labellisé (for/id appariés).
 *
 *   npm run check
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = [
  { file: "index.html", lang: "fr", dir: "ltr", path: "/" },
  { file: "en/index.html", lang: "en", dir: "ltr", path: "/en/" },
  { file: "ar/index.html", lang: "ar", dir: "rtl", path: "/ar/" },
];

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.error(`✗ ${msg}`);
};
const ok = (msg) => console.log(`✓ ${msg}`);

for (const page of PAGES) {
  const html = await readFile(path.join(root, page.file), "utf8");

  if (!html.includes(`<html lang="${page.lang}" dir="${page.dir}">`))
    fail(`${page.file}: <html lang/dir> incorrect`);

  for (const l of ["fr", "en", "ar"])
    if (!html.includes(`hreflang="${l}"`)) fail(`${page.file}: hreflang ${l} manquant`);
  if (!html.includes('hreflang="x-default"')) fail(`${page.file}: hreflang x-default manquant`);
  if (!html.includes(`rel="canonical" href="https://www.cabinet-majdoub.tn${page.path}"`))
    fail(`${page.file}: canonical incorrect`);

  // ancres internes
  const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
  for (const a of new Set(anchors))
    if (!html.includes(`id="${a}"`)) fail(`${page.file}: ancre #${a} sans cible`);

  // chemins locaux
  // query string de versionnage (?v=…) ignorée : le fichier vérifié est le chemin nu
  const locals = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) =>
    m[1].split(/[?#]/)[0]
  );
  for (const l of new Set(locals)) {
    try {
      await readFile(path.join(root, l), null);
    } catch {
      fail(`${page.file}: fichier manquant ${l}`);
    }
  }

  // labels appariés
  const fors = [...html.matchAll(/<label[^>]*for="([^"]+)"/g)].map((m) => m[1]);
  for (const f of fors)
    if (!html.includes(`id="${f}"`)) fail(`${page.file}: label for="${f}" sans contrôle`);

  ok(`${page.file} (lang=${page.lang}, dir=${page.dir}, ${locals.length} assets, ${anchors.length} ancres)`);
}

if (failures) {
  console.error(`\n${failures} échec(s)`);
  process.exit(1);
}
console.log("\nToutes les vérifications statiques passent.");
