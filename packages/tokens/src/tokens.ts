// Ashan Market design tokens: the single source for web (CSS variables / Tailwind) and mobile (RN theme).
// Palette is original: sindoor crimson, Himalayan slate ink, marigold, rhododendron, prayer-flag blue/green
// on a warm paper background.

export const palette = {
  crimson: {
    50: '#FDF3F2',
    100: '#FBE3E1',
    200: '#F6C4C0',
    300: '#EE9A93',
    400: '#E2675E',
    500: '#CF3F35',
    600: '#B3261E',
    700: '#921F19',
    800: '#761C17',
    900: '#5F1915',
  },
  ink: {
    50: '#F5F7FA',
    100: '#E8ECF1',
    200: '#D0D7E0',
    300: '#A9B4C2',
    400: '#7A889B',
    500: '#566377',
    600: '#414C5E',
    700: '#323B4A',
    800: '#232B37',
    900: '#161C25',
  },
  marigold: {
    50: '#FEF8EC',
    100: '#FCEDCB',
    200: '#F8D893',
    300: '#F2BE5B',
    400: '#E8A33D',
    500: '#D18620',
    600: '#AD6716',
    700: '#8A4F15',
    800: '#703F16',
    900: '#5D3515',
  },
  rhododendron: {
    50: '#FDF1F5',
    300: '#F08FB0',
    500: '#D63A6E',
    600: '#B82658',
    700: '#961E48',
  },
  leaf: {
    50: '#EEF8F2',
    300: '#7CCB9F',
    500: '#2E8B57',
    600: '#23704A',
    700: '#1C5A3C',
  },
  sky: {
    50: '#EEF5FD',
    300: '#8DBCF2',
    500: '#3A7FD0',
    600: '#1F5FA8',
    700: '#194C86',
  },
  paper: {
    50: '#FFFFFF',
    100: '#FBF7F2',
    200: '#F3ECE3',
    300: '#E6DCCF',
  },
  night: {
    900: '#14110F',
    800: '#1E1A17',
    700: '#2A2420',
    600: '#3A322C',
    200: '#BFB4A8',
    100: '#F5EFE8',
  },
} as const;

export type ColorRole =
  | 'background'
  | 'surface'
  | 'surfaceMuted'
  | 'border'
  | 'text'
  | 'textMuted'
  | 'primary'
  | 'primaryText'
  | 'primaryHover'
  | 'accent'
  | 'accentText'
  | 'sale'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'focus';

export type ColorScheme = Record<ColorRole, string>;

export const colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    background: palette.paper[100],
    surface: palette.paper[50],
    surfaceMuted: palette.paper[200],
    border: palette.paper[300],
    text: palette.ink[900],
    textMuted: palette.ink[600],
    primary: palette.crimson[600],
    primaryText: palette.paper[50],
    primaryHover: palette.crimson[700],
    accent: palette.marigold[400],
    accentText: palette.ink[900],
    sale: palette.rhododendron[600],
    success: palette.leaf[700],
    warning: palette.marigold[700],
    danger: palette.crimson[700],
    info: palette.sky[600],
    focus: palette.sky[600],
  },
  dark: {
    background: palette.night[900],
    surface: palette.night[800],
    surfaceMuted: palette.night[700],
    border: palette.night[600],
    text: palette.night[100],
    textMuted: palette.night[200],
    primary: palette.crimson[400],
    primaryText: palette.ink[900],
    primaryHover: palette.crimson[300],
    accent: palette.marigold[300],
    accentText: palette.ink[900],
    sale: palette.rhododendron[300],
    success: palette.leaf[300],
    warning: palette.marigold[300],
    danger: palette.crimson[300],
    info: palette.sky[300],
    focus: palette.sky[300],
  },
};

/** Pairs that must meet WCAG AA (4.5:1) in both schemes; enforced by tests. */
export const contrastPairs: ReadonlyArray<readonly [fg: ColorRole, bg: ColorRole]> = [
  ['text', 'background'],
  ['text', 'surface'],
  ['text', 'surfaceMuted'],
  ['textMuted', 'background'],
  ['textMuted', 'surface'],
  ['primaryText', 'primary'],
  ['primaryText', 'primaryHover'],
  ['accentText', 'accent'],
  ['primary', 'surface'],
  ['sale', 'surface'],
  ['success', 'surface'],
  ['warning', 'surface'],
  ['danger', 'surface'],
  ['info', 'surface'],
];

/** 4-pt spacing scale, in px (web) / dp (mobile). */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontFamilies = {
  // Inter for Latin, Mukta for Devanagari; both SIL OFL.
  sans: ['Inter', 'Mukta', 'system-ui', 'sans-serif'],
  devanagari: ['Mukta', 'Inter', 'system-ui', 'sans-serif'],
} as const;

/** [fontSize, lineHeight] in px. Devanagari text gets extra leading via `devanagariLeadingScale`. */
export const fontSizes = {
  xs: [12, 16],
  sm: [14, 20],
  base: [16, 24],
  lg: [18, 28],
  xl: [20, 28],
  '2xl': [24, 32],
  '3xl': [30, 36],
  '4xl': [36, 44],
} as const satisfies Record<string, readonly [number, number]>;

export const devanagariLeadingScale = 1.15;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

/** Minimum touch/click target, per WCAG 2.2 / Apple HIG. */
export const minTarget = 44;
