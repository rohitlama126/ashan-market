import { minTarget } from '@ashan/tokens';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from '@/components/screen';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'link';

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}) {
  const { colors, radii, spacing } = useTheme();
  const bg = {
    primary: colors.primary,
    danger: colors.danger,
    secondary: colors.surface,
    link: 'transparent',
  }[variant];
  const fg = {
    primary: colors.primaryText,
    danger: colors.primaryText,
    secondary: colors.text,
    link: colors.primary,
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: minTarget,
        justifyContent: 'center',
        alignItems: variant === 'link' ? 'flex-start' : 'center',
        paddingHorizontal: variant === 'link' ? 0 : spacing[4],
        borderRadius: radii.md,
        backgroundColor: bg,
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: colors.border,
        opacity: disabled ? 0.6 : pressed ? 0.85 : 1,
      })}
    >
      <AppText
        style={{
          color: fg,
          fontWeight: '600',
          textDecorationLine: variant === 'link' ? 'underline' : 'none',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

export function TextField({ label, ...props }: TextInputProps & { label: string }) {
  const { colors, radii, spacing, fontSizes } = useTheme();
  return (
    <View style={{ gap: spacing[1] }}>
      <AppText style={{ fontWeight: '600' }}>{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={{
          minHeight: minTarget,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: radii.md,
          paddingHorizontal: spacing[3],
          fontSize: fontSizes.base[0],
        }}
        {...props}
      />
    </View>
  );
}

export function ErrorText({ children }: { children: string | null }) {
  const { colors } = useTheme();
  if (!children) return null;
  return (
    <AppText
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={{ color: colors.danger }}
    >
      {children}
    </AppText>
  );
}
