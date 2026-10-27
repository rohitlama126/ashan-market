// Rasterizes the Ashan Market mark into the PNGs Expo needs. Run: node scripts/make-icons.mjs
// sharp is a devDependency of this app.
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const mark = (rounded) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="${rounded ? 14 : 0}" fill="#B3261E"/>
  <circle cx="45" cy="19" r="6" fill="#E8A33D"/>
  <path d="M8 48 L22 28 L30 38 L40 22 L56 48 Z" fill="#FBF7F2"/>
  <path d="M22 28 L26 34 L22 33 L18 34 Z M40 22 L45 30 L40 29 L35 30 Z" fill="#E6DCCF"/>
</svg>`;

const out = (name) => fileURLToPath(new URL(`../assets/images/${name}`, import.meta.url));

// iOS applies its own corner mask, so the app icon is full-bleed and opaque.
await sharp(Buffer.from(mark(false)), { density: 1200 })
  .resize(1024, 1024)
  .flatten({ background: '#B3261E' })
  .png()
  .toFile(out('icon.png'));
await sharp(Buffer.from(mark(true)), { density: 600 })
  .resize(400, 400)
  .png()
  .toFile(out('splash-icon.png'));
console.log('icons written');
