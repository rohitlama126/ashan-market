import { fireEvent, render, screen } from '@testing-library/react-native';
import { I18nProvider } from '@/i18n';
import AccountScreen from '@/app/account';
import HomeScreen from '@/app/index';

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

describe('AccountScreen', () => {
  it('switches language', async () => {
    await render(
      <I18nProvider locale="en">
        <AccountScreen />
      </I18nProvider>,
    );
    expect(screen.getByText('Account')).toBeOnTheScreen();
    fireEvent.press(screen.getByText('नेपाली'));
    expect(await screen.findByText('खाता')).toBeOnTheScreen();
  });
});
