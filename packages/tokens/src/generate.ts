// Writes generated/tokens.css. Run with `pnpm tokens`; a test fails if the committed file is stale.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderCss } from './css.ts';

const out = fileURLToPath(new URL('../generated/tokens.css', import.meta.url));
writeFileSync(out, renderCss());
console.log(`wrote ${out}`);
