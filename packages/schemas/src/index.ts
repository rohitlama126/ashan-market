import { z } from 'zod';

export const LocaleSchema = z.enum(['en', 'ne']);

/** Money is always integer cents. */
export const CentsSchema = z.number().int().nonnegative();

export const UsZipSchema = z
  .string()
  .trim()
  .regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP code');

export const US_STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'DC',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY',
] as const;

export const UsStateSchema = z.enum(US_STATES);

export const UsPhoneSchema = z
  .string()
  .transform((s) => s.replace(/[^\d+]/g, ''))
  .pipe(z.string().regex(/^(\+1)?\d{10}$/, 'Enter a 10-digit US phone number'))
  .transform((s) => (s.startsWith('+1') ? s : `+1${s}`));

export const AddressSchema = z.object({
  name: z.string().trim().min(1).max(100),
  line1: z.string().trim().min(1).max(100),
  line2: z.string().trim().max(100).optional(),
  city: z.string().trim().min(1).max(60),
  state: UsStateSchema,
  zip: UsZipSchema,
  country: z.literal('US').default('US'),
  phone: UsPhoneSchema.optional(),
});
export type Address = z.infer<typeof AddressSchema>;

export const ShippingClassSchema = z.enum(['ambient', 'chilled', 'frozen']);
export type ShippingClass = z.infer<typeof ShippingClassSchema>;

export const FulfillmentMethodSchema = z.enum(['ship', 'local_delivery', 'pickup']);
export type FulfillmentMethod = z.infer<typeof FulfillmentMethodSchema>;

export const EmailSchema = z.string().trim().toLowerCase().pipe(z.email());

export const OtpCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'Enter the 6-digit code');

/** Fields a customer may edit on their own profile (mirrors the column grants in the DB). */
export const ProfileUpdateSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(100)
    .transform((s) => s || null),
  home_zip: z
    .string()
    .trim()
    .regex(/^(\d{5})?$/, 'Enter a 5-digit ZIP code')
    .transform((s) => s || null),
  locale: LocaleSchema,
  marketing_opt_in: z.boolean(),
});
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
