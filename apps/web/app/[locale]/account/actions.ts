'use server';
import { isLocale } from '@ashan/i18n';
import { ProfileUpdateSchema } from '@ashan/schemas';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '../../../lib/supabase/server.ts';

export type ProfileFormState = { status: 'idle' | 'saved' | 'error' };

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const parsed = ProfileUpdateSchema.safeParse({
    full_name: formData.get('full_name') ?? '',
    home_zip: formData.get('home_zip') ?? '',
    locale: formData.get('locale'),
    marketing_opt_in: formData.get('marketing_opt_in') === 'on',
  });
  if (!parsed.success) return { status: 'error' };

  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { status: 'error' };

  // RLS + column grants limit this to the caller's own row and editable fields.
  const { error } = await supabase.from('profiles').update(parsed.data).eq('id', auth.user.id);
  if (error) return { status: 'error' };
  revalidatePath(`/${parsed.data.locale}/account`);
  return { status: 'saved' };
}

export async function signOut(locale: string) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(`/${isLocale(locale) ? locale : 'en'}`);
}

export async function deleteAccount(locale: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc('delete_my_account');
  if (error) throw new Error('Account deletion failed');
  // The auth user no longer exists; clear the local session cookies.
  await supabase.auth.signOut({ scope: 'local' });
  redirect(`/${isLocale(locale) ? locale : 'en'}`);
}
