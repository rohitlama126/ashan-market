import { resources } from '@ashan/i18n';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { AppText, Screen } from '@/components/screen';
import { useTheme } from '@/theme';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { colors, radii, spacing } = useTheme();
  return (
    <Screen>
      <AppText
        variant="muted"
        // Letter spacing breaks Devanagari, so capitals + tracking apply to English only.
        style={[
          { fontWeight: '800' },
          i18n.language === 'en' && { textTransform: 'uppercase', letterSpacing: 2 },
        ]}
      >
        {t('app.name')}
      </AppText>
      <View
        style={[
          styles.hero,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderRadius: radii.xl,
            padding: spacing[6],
          },
        ]}
      >
        <AppText variant="title">{t('app.tagline')}</AppText>
        <View style={[styles.badge, { backgroundColor: colors.accent, borderRadius: radii.full }]}>
          <AppText style={{ color: colors.accentText, fontWeight: '600' }}>
            {t('app.comingSoon')}
          </AppText>
        </View>
      </View>
      <AppText variant="heading">{t('nav.categories')}</AppText>
      <View style={styles.grid}>
        {categorySlugs.map((slug) => (
          <View
            key={slug}
            style={[
              styles.tile,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderRadius: radii.lg,
              },
            ]}
          >
            <AppText style={styles.center}>{t(`categories.${slug}`)}</AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { borderWidth: StyleSheet.hairlineWidth, gap: 16 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: {
    width: '47%',
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  center: { textAlign: 'center' },
});
