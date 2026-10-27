import { locales } from '@ashan/i18n';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AppText, Screen } from '@/components/screen';
import { useTheme } from '@/theme';

export default function AccountScreen() {
  const { t, i18n } = useTranslation();
  const { colors, radii, spacing } = useTheme();
  return (
    <Screen>
      <AppText variant="title">{t('nav.account')}</AppText>
      <AppText variant="heading">{t('language.label')}</AppText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: spacing[2] }}>
        {locales.map((l) => {
          const selected = i18n.language === l;
          return (
            <Pressable
              key={l}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => void i18n.changeLanguage(l)}
              style={{
                minHeight: 44,
                minWidth: 44,
                justifyContent: 'center',
                paddingHorizontal: spacing[4],
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : colors.surface,
              }}
            >
              <AppText style={{ color: selected ? colors.primaryText : colors.text }}>
                {t(`language.${l}`)}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}
