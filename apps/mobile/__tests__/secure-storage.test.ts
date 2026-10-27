import * as SecureStore from 'expo-secure-store';
import { chunkedSecureStorage } from '@/lib/secure-storage';

const store = (SecureStore as unknown as { __store: Map<string, string> }).__store;

beforeEach(() => store.clear());

describe('chunkedSecureStorage', () => {
  it('round-trips a large session across several Keychain items', async () => {
    const session = JSON.stringify({ access_token: 'x'.repeat(5000), user: { id: 'u1' } });
    await chunkedSecureStorage.setItem('sb-127-auth-token', session);
    expect(store.get('sb-127-auth-token.n')).toBe('3');
    for (const v of store.values()) expect(v.length).toBeLessThanOrEqual(1800);
    expect(await chunkedSecureStorage.getItem('sb-127-auth-token')).toBe(session);
  });

  it('returns null for a missing key', async () => {
    expect(await chunkedSecureStorage.getItem('nope')).toBeNull();
  });

  it('removes every chunk', async () => {
    await chunkedSecureStorage.setItem('k', 'y'.repeat(4000));
    await chunkedSecureStorage.removeItem('k');
    expect(store.size).toBe(0);
  });

  it('shrinking a value drops stale chunks', async () => {
    await chunkedSecureStorage.setItem('k', 'a'.repeat(4000));
    await chunkedSecureStorage.setItem('k', 'short');
    expect(await chunkedSecureStorage.getItem('k')).toBe('short');
    expect(store.size).toBe(2);
  });

  it('sanitizes keys SecureStore would reject', async () => {
    await chunkedSecureStorage.setItem('sb:auth/token', 'v');
    expect([...store.keys()].every((k) => /^[\w.-]+$/.test(k))).toBe(true);
    expect(await chunkedSecureStorage.getItem('sb:auth/token')).toBe('v');
  });
});
