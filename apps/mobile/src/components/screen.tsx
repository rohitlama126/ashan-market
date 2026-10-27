import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, type TextProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

export function Screen({ children }: { children: ReactNode }) {
  const { colors, spacing } = useTheme();
  return (
    <SafeAreaView edges={['top']} style={[styles.fill, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ padding: spacing[4], gap: spacing[4] }}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

type Variant = 'title' | 'heading' | 'body' | 'muted';

export function AppText({ variant = 'body', style, ...props }: TextProps & { variant?: Variant }) {
  const { colors, fontSizes } = useTheme();
  const [size, lineHeight] = {
    title: fontSizes['3xl'],
    heading: fontSizes.xl,
    body: fontSizes.base,
    muted: fontSizes.sm,
  }[variant];
  return (
    <Text
      accessibilityRole={variant === 'title' || variant === 'heading' ? 'header' : undefined}
      style={[
        {
          color: variant === 'muted' ? colors.textMuted : colors.text,
          fontSize: size,
          // Extra leading so Devanagari matras are not clipped.
          lineHeight: Math.round(lineHeight * 1.15),
          fontWeight: variant === 'title' ? '700' : variant === 'heading' ? '600' : '400',
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
