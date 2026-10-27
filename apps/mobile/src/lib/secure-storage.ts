import * as SecureStore from 'expo-secure-store';

// Supabase sessions can exceed SecureStore's ~2 KB per-item guidance, so values are split
// across numbered keys. Everything stays in the iOS Keychain (never plain AsyncStorage).
const CHUNK = 1800;
const countKey = (key: string) => `${key}.n`;
const partKey = (key: string, i: number) => `${key}.${i}`;
const safe = (key: string) => key.replace(/[^\w.-]/g, '_');

export const chunkedSecureStorage = {
  async getItem(rawKey: string): Promise<string | null> {
    const key = safe(rawKey);
    const n = Number(await SecureStore.getItemAsync(countKey(key)));
    if (!n) return null;
    const parts = await Promise.all(
      Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(partKey(key, i))),
    );
    return parts.some((p) => p === null) ? null : parts.join('');
  },

  async setItem(rawKey: string, value: string): Promise<void> {
    const key = safe(rawKey);
    await chunkedSecureStorage.removeItem(rawKey);
    const parts = value.match(new RegExp(`[\\s\\S]{1,${CHUNK}}`, 'g')) ?? [''];
    await Promise.all(parts.map((p, i) => SecureStore.setItemAsync(partKey(key, i), p)));
    await SecureStore.setItemAsync(countKey(key), String(parts.length));
  },

  async removeItem(rawKey: string): Promise<void> {
    const key = safe(rawKey);
    const n = Number(await SecureStore.getItemAsync(countKey(key)));
    await Promise.all(
      Array.from({ length: n || 0 }, (_, i) => SecureStore.deleteItemAsync(partKey(key, i))),
    );
    await SecureStore.deleteItemAsync(countKey(key));
  },
};
