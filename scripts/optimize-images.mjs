/**
 * Régénère les images servies (`assets/img/`) depuis les originaux
 * intouchés (`assets/original/`). Idempotent : relire toujours la source,
 * jamais un fichier déjà compressé.
 *
 *   npm run images
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "assets/original");
const OUT = path.join(root, "assets/img");

/** `width` = plus grande largeur CSS affichée, doublée pour retina. */
const TARGETS = [
  { name: "hero", width: 1280, webp: 42, jpeg: 52 },
  { name: "portrait", width: 800, webp: 74, jpeg: 78 },
  { name: "office", width: 960, webp: 74, jpeg: 78 },
];

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
const sizeOf = async (f) => {
  try {
    return (await stat(f)).size;
  } catch {
    return 0;
  }
};

await mkdir(OUT, { recursive: true });
let before = 0;
let after = 0;

for (const t of TARGETS) {
  const input = path.join(SRC, `${t.name}.jpg`);
  const original = await sizeOf(input);
  if (!original) {
    console.warn(`! source manquante : ${path.relative(root, input)}`);
    continue;
  }

  const pipeline = sharp(input, { failOn: "none" })
    .resize({ width: t.width, withoutEnlargement: true })
    .rotate();

  const webpPath = path.join(OUT, `${t.name}.webp`);
  const jpegPath = path.join(OUT, `${t.name}.jpg`);

  await pipeline.clone().webp({ quality: t.webp, effort: 6 }).toFile(webpPath);
  const meta = await pipeline
    .clone()
    .jpeg({ quality: t.jpeg, mozjpeg: true, progressive: true })
    .toFile(jpegPath);

  const webpSize = await sizeOf(webpPath);
  before += original;
  after += webpSize;
  console.log(
    `${t.name.padEnd(9)} ${meta.width}x${meta.height}  orig ${kb(original).padStart(9)}` +
      `  ->  webp ${kb(webpSize).padStart(8)}  jpg ${kb(await sizeOf(jpegPath)).padStart(8)}`
  );
}

if (before) {
  console.log(
    `\npayload ${kb(before)} -> ${kb(after)} (-${((1 - after / before) * 100).toFixed(0)}% ` +
      `pour les clients WebP ; le JPEG sert de repli)`
  );
}
