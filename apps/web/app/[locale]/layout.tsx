import type { Metadata } from 'next';
import { Inter, Mukta } from 'next/font/google';
import { notFound } from 'next/navigation';
import { createI18n, isLocale, locales } from '@ashan/i18n';
import { Backdrop } from '../../components/backdrop.tsx';
import { SiteHeader } from '../../components/site-header.tsx';
import '../globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const mukta = Mukta({
  variable: '--font-mukta',
  subsets: ['devanagari', 'latin'],
  weight: ['400', '500', '600', '700'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { t } = createI18n(locale);
  return {
    title: { default: t('app.name'), template: `%s · ${t('app.name')}` },
    description: t('app.tagline'),
    alternates: { languages: { en: '/en', ne: '/ne' } },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${inter.variable} ${mukta.variable} h-full antialiased`}>
      <body className="isolate flex min-h-full flex-col font-sans">
        <Backdrop />
        <SiteHeader locale={locale} />
        {children}
        <footer className="glass text-text-muted mt-auto rounded-none border-x-0 border-b-0 py-6 text-center text-sm">
          © 2026{' '}
          <span className={`font-semibold ${locale === 'en' ? 'tracking-[0.14em] uppercase' : ''}`}>
            {createI18n(locale).t('app.name')}
          </span>
        </footer>
      </body>
    </html>
  );
}
