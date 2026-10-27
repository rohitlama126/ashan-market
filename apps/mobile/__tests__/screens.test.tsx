import { fireEvent, render, screen } from '@testing-library/react-native';
import AccountScreen from '@/app/account';
import HomeScreen from '@/app/index';
import { I18nProvider } from '@/i18n';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    auth: {
      signInWithOtp: jest.fn(async () => ({ error: null })),
      verifyOtp: jest.fn(async () => ({ error: null })),
      signOut: jest.fn(async () => ({ error: null })),
    },
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

jest.mock('@/auth', () => ({ useAuth: () => ({ session: null, loading: false }) }));

describe('HomeScreen', () => {
  it('renders the tagline and all launch categories', async () => {
    await render(
      <I18nProvider locale="en">
        <HomeScreen />
      </I18nProvider>,
    );
    expect(screen.getByText('Nepali groceries, delivered across the USA')).toBeOnTheScreen();
    expect(screen.getByText('Achar & Pickles')).toBeOnTheScreen();
    expect(screen.getByText('Puja Samagri')).toBeOnTheScreen();
  });

  it('renders in Nepali', async () => {
    await render(
      <I18nProvider locale="ne">
        <HomeScreen />
      </I18nProvider>,
    );
    expect(screen.getByText('चाउचाउ')).toBeOnTheScreen();
  });
});

describe('AccountScreen (signed out)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('switches language', async () => {
    await render(
      <I18nProvider locale="en">
        <AccountScreen />
      </I18nProvider>,
    );
    expect(screen.getByText('Sign in or create an account')).toBeOnTheScreen();
    await fireEvent.press(screen.getByText('नेपाली'));
    expect(await screen.findByText('साइन इन गर्नुहोस् वा खाता बनाउनुहोस्')).toBeOnTheScreen();
  });

  it('rejects an invalid email without calling Supabase', async () => {
    await render(
      <I18nProvider locale="en">
        <AccountScreen />
      </I18nProvider>,
    );
    await fireEvent.changeText(screen.getByLabelText('Email'), 'not-an-email');
    await fireEvent.press(screen.getByText('Send code'));
    expect(await screen.findByText('Enter a valid email address.')).toBeOnTheScreen();
    expect(supabase.auth.signInWithOtp).not.toHaveBeenCalled();
  });

  it('sends an email code, then verifies it', async () => {
    await render(
      <I18nProvider locale="en">
        <AccountScreen />
      </I18nProvider>,
    );
    await fireEvent.changeText(screen.getByLabelText('Email'), ' Sita@Example.com ');
    await fireEvent.press(screen.getByText('Send code'));
    expect(await screen.findByText('We sent a 6-digit code to sita@example.com')).toBeOnTheScreen();
    expect(supabase.auth.signInWithOtp).toHaveBeenCalledWith({
      email: 'sita@example.com',
      options: { shouldCreateUser: true, data: { locale: 'en' } },
    });

    await fireEvent.changeText(screen.getByLabelText('6-digit code'), '123456');
    await fireEvent.press(screen.getByText('Verify and continue'));
    await screen.findByText('Verify and continue');
    expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
      email: 'sita@example.com',
      token: '123456',
      type: 'email',
    });
  });

  it('normalizes a US phone number to E.164', async () => {
    await render(
      <I18nProvider locale="en">
        <AccountScreen />
      </I18nProvider>,
    );
    await fireEvent.press(screen.getByText('Use a phone number instead'));
    await fireEvent.changeText(screen.getByLabelText('Mobile number (US)'), '(718) 555-0134');
    await fireEvent.press(screen.getByText('Send code'));
    expect(await screen.findByText('We sent a 6-digit code to +17185550134')).toBeOnTheScreen();
  });
});
