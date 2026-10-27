import { freeShippingProgress } from '@ashan/core';
import { formatMoney } from '@ashan/i18n';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AppText, Screen } from '@/components/screen';
import { useTheme } from '@/theme';

// Placeholder subtotal until the cart milestone wires real data.
const DEMO_SUBTOTAL_CENTS = 0;

export default function CartScreen() {
  const { t } = useTranslation();
  const { colors, radii } = useTheme();
  const progress = freeShippingProgress(DEMO_SUBTOTAL_CENTS);
  return (
    <Screen>
      <AppText variant="title">{t('nav.cart')}</AppText>
      <AppText>
        {progress.qualified
          ? t('cart.freeShippingUnlocked')
          : t('cart.freeShippingProgress', { amount: formatMoney(progress.remainingCents) })}
      </AppText>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: Math.round(progress.ratio * 100) }}
        style={{
          height: 8,
          backgroundColor: colors.surfaceMuted,
          borderRadius: radii.full,
          overflow: 'hidden',
        }}
      >
        <View
          style={{ height: 8, width: `${progress.ratio * 100}%`, backgroundColor: colors.primary }}
        />
      </View>
    </Screen>
  );
}
