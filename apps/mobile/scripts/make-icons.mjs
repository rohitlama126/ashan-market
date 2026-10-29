// Builds every app/browser icon from the stupa brand artwork (apps/web/public/brand/stupa.png).
// Run after replacing that file: node apps/mobile/scripts/make-icons.mjs
// sharp is a devDependency of this app.
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

const path = (rel) => fileURLToPath(new URL(rel, import.meta.url));
const source = path('../../web/public/brand/stupa.png');
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

/** Square PNG on white with breathing room; iOS icons must be opaque. */
const render = (size, padding = 0.08) => {
  const inner = Math.round(size * (1 - padding * 2));
  return sharp(source)
    .resize(inner, inner, { fit: 'contain', background: WHITE })
    .extend({
      top: Math.floor((size - inner) / 2),
      bottom: Math.ceil((size - inner) / 2),
      left: Math.floor((size - inner) / 2),
      right: Math.ceil((size - inner) / 2),
      background: WHITE,
    })
    .flatten({ background: WHITE })
    .png({ compressionLevel: 9 });
};

// iOS (Expo): app icon (iOS applies its own corner mask) and splash image.
await render(1024).toFile(path('../assets/images/icon.png'));
await render(400, 0.04).toFile(path('../assets/images/splash-icon.png'));

// Web (Next.js file conventions): tab icon, Apple touch icon, legacy favicon.ico.
await render(512, 0.04).toFile(path('../../web/app/icon.png'));
await render(180).toFile(path('../../web/app/apple-icon.png'));

// favicon.ico: one 48px PNG inside an ICO container (supported by all current browsers).
// ICO decoders require the embedded PNG to be RGBA.
const png = await render(48, 0.02).ensureAlpha().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt16LE(1, 10); // color planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
writeFileSync(path('../../web/app/favicon.ico'), Buffer.concat([header, png]));

console.log('icons written');
