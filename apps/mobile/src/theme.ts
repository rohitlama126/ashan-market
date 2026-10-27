import { colors, fontSizes, radii, spacing, type ColorScheme } from '@ashan/tokens';
import { useColorScheme } from 'react-native';

export interface Theme {
  dark: boolean;
  colors: ColorScheme;
  spacing: typeof spacing;
  radii: typeof radii;
  fontSizes: typeof fontSizes;
}

export function useTheme(): Theme {
  const dark = useColorScheme() === 'dark';
  return { dark, colors: dark ? colors.dark : colors.light, spacing, radii, fontSizes };
}
