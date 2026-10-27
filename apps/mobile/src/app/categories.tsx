import { resources } from '@ashan/i18n';
import { useTranslation } from 'react-i18next';
import { AppText, Screen } from '@/components/screen';

const categorySlugs = Object.keys(
  resources.en.categories,
) as (keyof typeof resources.en.categories)[];

export default function CategoriesScreen() {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="title">{t('nav.categories')}</AppText>
      {categorySlugs.map((slug) => (
        <AppText key={slug}>{t(`categories.${slug}`)}</AppText>
      ))}
    </Screen>
  );
}
