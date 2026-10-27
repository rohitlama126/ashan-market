import { describe, expect, it } from 'vitest';
import { AddressSchema, CentsSchema, UsPhoneSchema, UsZipSchema } from './index.ts';

describe('UsZipSchema', () => {
  it.each(['11372', '75038-1234', ' 94103 '])('accepts %s', (zip) => {
    expect(UsZipSchema.safeParse(zip).success).toBe(true);
  });
  it.each(['1137', 'ABCDE', '113721'])('rejects %s', (zip) => {
    expect(UsZipSchema.safeParse(zip).success).toBe(false);
  });
});

describe('UsPhoneSchema', () => {
  it('normalizes to E.164', () => {
    expect(UsPhoneSchema.parse('(718) 555-0134')).toBe('+17185550134');
    expect(UsPhoneSchema.parse('+1 718 555 0134')).toBe('+17185550134');
  });
  it('rejects short numbers', () => {
    expect(UsPhoneSchema.safeParse('555-0134').success).toBe(false);
  });
});

describe('CentsSchema', () => {
  it('requires non-negative integers', () => {
    expect(CentsSchema.safeParse(499).success).toBe(true);
    expect(CentsSchema.safeParse(4.99).success).toBe(false);
    expect(CentsSchema.safeParse(-1).success).toBe(false);
  });
});

describe('AddressSchema', () => {
  it('defaults country to US and trims fields', () => {
    const a = AddressSchema.parse({
      name: ' Sita Gurung ',
      line1: '37-10 74th St',
      city: 'Jackson Heights',
      state: 'NY',
      zip: '11372',
    });
    expect(a.country).toBe('US');
    expect(a.name).toBe('Sita Gurung');
  });
  it('rejects unknown states', () => {
    expect(
      AddressSchema.safeParse({ name: 'A', line1: 'B', city: 'C', state: 'XX', zip: '11372' })
        .success,
    ).toBe(false);
  });
});
