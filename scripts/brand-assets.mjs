/**
 * Regenerates the dark-mode brand assets, favicons and the Open Graph card.
 *
 * The source logos come from premiumwebagency.com and are drawn in near-black
 * ink for light backgrounds, so they disappear on this site. Run this after
 * replacing any file in `public/brand` or `public/clients`:
 *
 *   npm run assets
 */
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const at = (...parts) => path.join(root, ...parts);

const BONE = [242, 240, 236];
const VOID = { r: 5, g: 5, b: 7, alpha: 1 };

/**
 * Flips dark ink to warm white and leaves saturated brand colour alone, so each
 * mark keeps its identity while becoming legible on black.
 *
 * Brightness is the discriminator, not saturation: dark navy scores high on the
 * usual saturation formula, so a saturation test would leave it invisible.
 */
async function recolour(from, to, threshold = 0.5) {
  const { data, info } = await sharp(from).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += info.channels) {
    if (data[i + 3] === 0) continue;
    const value = Math.max(data[i], data[i + 1], data[i + 2]) / 255;
    if (value >= threshold) continue;
    [data[i], data[i + 1], data[i + 2]] = BONE;
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .webp({ quality: 95, alphaQuality: 100 })
    .toFile(to);

  return `${info.width}x${info.height}`;
}

async function brandAssets() {
  const jobs = [[at("public/brand/logo.webp"), at("public/brand/logo-dark.webp")]];
  for (let i = 1; i <= 7; i += 1) {
    jobs.push([at(`public/clients/stack-${i}.webp`), at(`public/clients/stack-${i}-dark.webp`)]);
  }
  for (const [from, to] of jobs) {
    console.log(`  ${path.relative(root, to)}  ${await recolour(from, to)}`);
  }
}

async function icons() {
  // The hex mark occupies roughly the left 150px of the 501x171 logo.
  const mark = await sharp(at("public/brand/logo-dark.webp"))
    .extract({ left: 4, top: 4, width: 146, height: 163 })
    .resize(360, 360, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({ create: { width: 512, height: 512, channels: 4, background: VOID } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(at("app/icon.png"));

  const small = await sharp(mark)
    .resize(126, 126, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({ create: { width: 180, height: 180, channels: 4, background: VOID } })
    .composite([{ input: small, gravity: "center" }])
    .png()
    .toFile(at("app/apple-icon.png"));

  return mark;
}

/** The social card is composed here so the preview matches the site's design. */
async function openGraph(mark) {
  const grid = (count, fn) => Array.from({ length: count }, (_, i) => fn(i)).join("");

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <radialGradient id="glow" cx="78%" cy="18%" r="62%">
      <stop offset="0%" stop-color="#4f7fff" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#4f7fff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#9a9aa4"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="#050507"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <g stroke="#16161d" stroke-width="1">
    ${grid(13, (i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="630"/>`)}
    ${grid(7, (i) => `<line x1="0" y1="${i * 100}" x2="1200" y2="${i * 100}"/>`)}
  </g>

  <text x="72" y="132" fill="#a9c6ff" font-family="monospace" font-size="20" letter-spacing="4">
    SYSTEM / 01 — PREMIUM WEB AGENCY
  </text>

  <text x="66" y="330" fill="url(#fade)" font-family="Helvetica, Arial, sans-serif"
        font-size="176" font-weight="600" letter-spacing="-8">WE ARE AI.</text>

  <text x="72" y="404" fill="#c9c7c2" font-family="Helvetica, Arial, sans-serif" font-size="30">
    AI-native digital products, design and growth.
  </text>

  <line x1="72" y1="486" x2="1128" y2="486" stroke="#22222c" stroke-width="1"/>

  <text x="72" y="536" fill="#85858f" font-family="monospace" font-size="20" letter-spacing="3">
    987+ WEBSITES  /  3487+ BRANDS  /  878+ STORES  /  1200+ CLIENTS
  </text>
</svg>`;

  await sharp(Buffer.from(svg))
    .composite([{ input: await sharp(mark).resize(96, 96).toBuffer(), top: 66, left: 1032 }])
    .png()
    .toFile(at("app/opengraph-image.png"));

  await sharp(at("app/opengraph-image.png")).toFile(at("app/twitter-image.png"));
}

console.log("Recolouring brand assets for dark UI…");
await brandAssets();
console.log("Generating icons and social card…");
await openGraph(await icons());
console.log("Done.");
