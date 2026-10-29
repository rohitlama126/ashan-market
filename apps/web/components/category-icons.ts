import type { resources } from '@ashan/i18n';
import {
  Candy,
  Coffee,
  Cookie,
  Flame,
  Flower2,
  House,
  Snowflake,
  Soup,
  Wheat,
  Citrus,
  type LucideIcon,
} from 'lucide-react';

type CategorySlug = keyof typeof resources.en.categories;

export const categoryIcons: Record<CategorySlug, LucideIcon> = {
  'snacks-namkeen': Cookie,
  noodles: Soup,
  'achar-pickles': Citrus,
  'spices-masala': Flame,
  'rice-daal-chiura': Wheat,
  tea: Coffee,
  sweets: Candy,
  frozen: Snowflake,
  'puja-samagri': Flower2,
  household: House,
};
