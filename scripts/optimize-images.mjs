/**
 * Derives the web-delivered images in `src/assets/` from the untouched
 * originals in `src/assets/original/`.
 *
 * Idempotent and non-destructive: re-running always reads from `original/`,
 * so repeated runs never re-compress an already-compressed file.
 *
 *   npm run images
 *
 * Each source produces a WebP (modern browsers) and a progressive MozJPEG
 * (fallback), both resized to the largest size the layout can actually
 * display at 2x device-pixel ratio.
 */
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "src/assets/original");
const OUT = path.join(root, "src/assets");

/**
 * `width` is the largest rendered CSS width in the layout, doubled for retina.
 * `hero` is a full-bleed background composited at 22% opacity under a heavy
 * gradient, so it is deliberately compressed far harder than the others.
 */
const TARGETS = [
  { name: "hero", width: 1280, webp: 42, jpeg: 52 },
  { name: "portrait", width: 800, webp: 74, jpeg: 78 },
  { name: "office", width: 960, webp: 74, jpeg: 78 },
];

const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

async function sizeOf(file) {
  try {
    return (await stat(file)).size;
  } catch {
    return 0;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  let before = 0;
  let after = 0;

  for (const t of TARGETS) {
    const input = path.join(SRC, `${t.name}.jpg`);
    const original = await sizeOf(input);
    if (!original) {
      console.warn(`! missing source: ${path.relative(root, input)}`);
      continue;
    }

    const pipeline = sharp(input, { failOn: "none" }).resize({ width: t.width, withoutEnlargement: true }).rotate(); // honour EXIF orientation before stripping metadata

    const webpPath = path.join(OUT, `${t.name}.webp`);
    const jpegPath = path.join(OUT, `${t.name}.jpg`);

    await pipeline.clone().webp({ quality: t.webp, effort: 6 }).toFile(webpPath);

    const meta = await pipeline.clone().jpeg({ quality: t.jpeg, mozjpeg: true, progressive: true }).toFile(jpegPath);

    const webpSize = await sizeOf(webpPath);
    before += original;
    after += webpSize;

    console.log(
      `${t.name.padEnd(9)} ${meta.width}x${meta.height}  ` +
        `orig ${kb(original).padStart(9)}  ->  webp ${kb(webpSize).padStart(8)}` +
        `  jpg ${kb(await sizeOf(jpegPath)).padStart(8)}`
    );
  }

  if (before) {
    // Only one of the two formats is ever downloaded, so the WebP column is
    // the number that reaches a real visitor.
    console.log(
      `\npayload ${kb(before)} -> ${kb(after)} ` +
        `(${((1 - after / before) * 100).toFixed(0)}% smaller for WebP clients; ` +
        `the JPEG is the fallback)`
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
