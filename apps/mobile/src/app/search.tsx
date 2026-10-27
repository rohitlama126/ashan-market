import { useTranslation } from 'react-i18next';
import { TextInput } from 'react-native';
import { AppText, Screen } from '@/components/screen';
import { useTheme } from '@/theme';

export default function SearchScreen() {
  const { t } = useTranslation();
  const { colors, radii, spacing, fontSizes } = useTheme();
  return (
    <Screen>
      <AppText variant="title">{t('nav.search')}</AppText>
      <TextInput
        accessibilityLabel={t('nav.search')}
        placeholder={t('search.placeholder')}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        style={{
          minHeight: 44,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          color: colors.text,
          borderRadius: radii.md,
          paddingHorizontal: spacing[3],
          fontSize: fontSizes.base[0],
        }}
      />
    </Screen>
  );
}
