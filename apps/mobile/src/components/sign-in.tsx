import { EmailSchema, OtpCodeSchema, UsPhoneSchema } from '@ashan/schemas';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { AppText } from '@/components/screen';
import { Button, ErrorText, TextField } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import { useTheme } from '@/theme';

type Channel = 'email' | 'phone';

export function SignIn() {
  const { t, i18n } = useTranslation();
  const { dark, radii, spacing } = useTheme();
  const [channel, setChannel] = useState<Channel>('email');
  const [value, setValue] = useState('');
  const [target, setTarget] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [appleAvailable, setAppleAvailable] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'ios') void AppleAuthentication.isAvailableAsync().then(setAppleAvailable);
  }, []);

  async function sendCode() {
    setError(null);
    const parsed =
      channel === 'email' ? EmailSchema.safeParse(value) : UsPhoneSchema.safeParse(value);
    if (!parsed.success) {
      setError(t(channel === 'email' ? 'auth.errorInvalidEmail' : 'auth.errorInvalidPhone'));
      return;
    }
    setBusy(true);
    const options = { shouldCreateUser: true, data: { locale: i18n.language } };
    const { error } =
      channel === 'email'
        ? await supabase.auth.signInWithOtp({ email: parsed.data, options })
        : await supabase.auth.signInWithOtp({ phone: parsed.data, options });
    setBusy(false);
    if (error) setError(t('auth.errorGeneric'));
    else setTarget(parsed.data);
  }

  async function verify() {
    if (!target) return;
    setError(null);
    const token = OtpCodeSchema.safeParse(code);
    if (!token.success) {
      setError(t('auth.errorInvalidCode'));
      return;
    }
    setBusy(true);
    const { error } =
      channel === 'email'
        ? await supabase.auth.verifyOtp({ email: target, token: token.data, type: 'email' })
        : await supabase.auth.verifyOtp({ phone: target, token: token.data, type: 'sms' });
    setBusy(false);
    if (error) setError(t('auth.errorInvalidCode'));
  }

  // Native Sign in with Apple: Supabase verifies Apple's ID token against the hashed nonce.
  async function signInWithApple() {
    setError(null);
    try {
      const rawNonce = Crypto.randomUUID();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce,
      );
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!credential.identityToken) throw new Error('No identity token');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
        nonce: rawNonce,
      });
      if (error) throw error;
      // Apple shares the name only on the first sign-in; save it.
      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ');
      if (name && data.user)
        await supabase.from('profiles').update({ full_name: name }).eq('id', data.user.id);
    } catch (e) {
      if ((e as { code?: string }).code !== 'ERR_REQUEST_CANCELED')
        setError(t('auth.errorGeneric'));
    }
  }

  // Google via the system browser sheet (PKCE), returning to ashanmarket://auth/callback.
  async function signInWithGoogle() {
    setError(null);
    const redirectTo = Linking.createURL('auth/callback');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      setError(t('auth.errorGeneric'));
      return;
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') return;
    const authCode = Linking.parse(result.url).queryParams?.code;
    if (typeof authCode !== 'string') {
      setError(t('auth.errorGeneric'));
      return;
    }
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
    if (exchangeError) setError(t('auth.errorGeneric'));
  }

  if (target) {
    return (
      <View style={{ gap: spacing[4] }}>
        <AppText>{t('auth.codeSentTo', { target })}</AppText>
        <TextField
          label={t('auth.codeLabel')}
          value={code}
          onChangeText={(s) => setCode(s.replace(/\D/g, ''))}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={6}
          autoFocus
        />
        <ErrorText>{error}</ErrorText>
        <Button label={t('auth.verify')} onPress={() => void verify()} disabled={busy} />
        <Button
          label={t('auth.resend')}
          variant="secondary"
          onPress={() => void sendCode()}
          disabled={busy}
        />
        <Button
          label={t('auth.changeTarget')}
          variant="link"
          onPress={() => {
            setTarget(null);
            setCode('');
            setError(null);
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ gap: spacing[4] }}>
      <AppText variant="heading">{t('auth.signInTitle')}</AppText>
      {appleAvailable && (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
          buttonStyle={
            dark
              ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
              : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
          }
          cornerRadius={radii.md}
          style={{ height: 44, width: '100%' }}
          onPress={() => void signInWithApple()}
        />
      )}
      <Button
        label={t('auth.continueWithGoogle')}
        variant="secondary"
        onPress={() => void signInWithGoogle()}
      />
      <AppText variant="muted" style={{ textAlign: 'center' }}>
        {t('auth.or')}
      </AppText>
      <TextField
        label={t(channel === 'email' ? 'auth.emailLabel' : 'auth.phoneLabel')}
        value={value}
        onChangeText={setValue}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={channel === 'email' ? 'email-address' : 'phone-pad'}
        textContentType={channel === 'email' ? 'emailAddress' : 'telephoneNumber'}
        autoComplete={channel === 'email' ? 'email' : 'tel'}
      />
      <ErrorText>{error}</ErrorText>
      <Button label={t('auth.sendCode')} onPress={() => void sendCode()} disabled={busy} />
      <Button
        label={t(channel === 'email' ? 'auth.usePhone' : 'auth.useEmail')}
        variant="link"
        onPress={() => {
          setChannel(channel === 'email' ? 'phone' : 'email');
          setValue('');
          setError(null);
        }}
      />
      <AppText variant="muted">{t('auth.legal')}</AppText>
    </View>
  );
}
