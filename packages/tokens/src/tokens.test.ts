import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast.ts';
import { renderCss } from './css.ts';
import { colors, contrastPairs } from './tokens.ts';

describe('contrastRatio', () => {
  it('matches known WCAG values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });
});

describe.each(['light', 'dark'] as const)('%s scheme', (scheme) => {
  it.each(contrastPairs)('%s on %s meets WCAG AA (4.5:1)', (fg, bg) => {
    const ratio = contrastRatio(colors[scheme][fg], colors[scheme][bg]);
    expect(
      ratio,
      `${fg} ${colors[scheme][fg]} on ${bg} ${colors[scheme][bg]}`,
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('focus ring is distinguishable from background (3:1)', () => {
    expect(contrastRatio(colors[scheme].focus, colors[scheme].background)).toBeGreaterThanOrEqual(
      3,
    );
  });
});

describe('generated CSS', () => {
  it('is up to date (run `pnpm tokens` if this fails)', () => {
    const committed = readFileSync(new URL('../generated/tokens.css', import.meta.url), 'utf8');
    expect(committed).toBe(renderCss());
  });

  it('defines every color role for light and dark', () => {
    const css = renderCss();
    for (const role of Object.keys(colors.light)) {
      const name = role.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      expect(css).toContain(`--color-${name}: var(--am-${name});`);
    }
    expect(css.match(/--am-primary:/g)).toHaveLength(3);
  });
});
