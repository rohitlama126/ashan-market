import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { NativeTabs } from 'expo-router/native-tabs';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { I18nProvider } from '@/i18n';
import { useTheme } from '@/theme';

function Tabs() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.primary}
      labelStyle={{ selected: { color: colors.primary } }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t('nav.home')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="categories">
        <NativeTabs.Trigger.Label>{t('nav.categories')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.grid.2x2.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <NativeTabs.Trigger.Label>{t('nav.search')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Label>{t('nav.cart')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="cart.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Label>{t('nav.account')}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person.crop.circle.fill" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function RootLayout() {
  const { dark, colors } = useTheme();
  const base = dark ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
        },
      }}
    >
      <I18nProvider>
        <StatusBar style="auto" />
        <Tabs />
      </I18nProvider>
    </ThemeProvider>
  );
}
