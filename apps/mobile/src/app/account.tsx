import { formatIdentifier, isLocale, locales, type Locale } from '@ashan/i18n';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, View } from 'react-native';
import { useAuth } from '@/auth';
import { AppText, Screen } from '@/components/screen';
import { SignIn } from '@/components/sign-in';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

function LanguagePicker({ userId }: { userId: string | undefined }) {
  const { t, i18n } = useTranslation();
  const { colors, radii, spacing } = useTheme();

  async function choose(l: Locale) {
    await i18n.changeLanguage(l);
    if (userId) await supabase.from('profiles').update({ locale: l }).eq('id', userId);
  }

  return (
    <View style={{ gap: spacing[2] }}>
      <AppText variant="heading">{t('language.label')}</AppText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: spacing[2] }}>
        {locales.map((l) => {
          const selected = i18n.language === l;
          return (
            <Pressable
              key={l}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => void choose(l)}
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
    </View>
  );
}

export default function AccountScreen() {
  const { t, i18n } = useTranslation();
  const { session } = useAuth();
  const { spacing } = useTheme();
  const user = session?.user;

  function confirmDelete() {
    Alert.alert(t('account.deleteTitle'), t('account.deleteBody'), [
      { text: t('account.cancel'), style: 'cancel' },
      {
        text: t('account.deleteConfirm'),
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.rpc('delete_my_account');
          if (error) {
            Alert.alert(t('auth.errorGeneric'));
            return;
          }
          await supabase.auth.signOut({ scope: 'local' });
        },
      },
    ]);
  }

  // After sign-in, switch to the language saved on the profile.
  const userId = user?.id;
  useEffect(() => {
    if (!userId) return;
    void supabase
      .from('profiles')
      .select('locale')
      .eq('id', userId)
      .single()
      .then(({ data }) => {
        if (data && isLocale(data.locale) && data.locale !== i18n.language) {
          void i18n.changeLanguage(data.locale);
        }
      });
  }, [userId, i18n]);

  return (
    <Screen>
      <AppText variant="title">{user ? t('account.title') : t('nav.account')}</AppText>
      {user ? (
        <View style={{ gap: spacing[4] }}>
          <AppText variant="muted">
            {t('account.signedInAs', { identifier: formatIdentifier(user) })}
          </AppText>
          <Button
            label={t('auth.signOut')}
            variant="secondary"
            onPress={() => void supabase.auth.signOut()}
          />
        </View>
      ) : (
        <SignIn />
      )}
      <LanguagePicker userId={user?.id} />
      {user && <Button label={t('account.deleteTitle')} variant="danger" onPress={confirmDelete} />}
    </Screen>
  );
}
