import { describe, expect, it } from 'vitest';
import { canRegisterAppWorker, isAppWorker } from '@/lib/pwa-policy';

const production = { production: true, secure: true, framed: false, search: '', hostname: 'charity-cure-corner.lovable.app' };
describe('Offline worker safety', () => {
  it('allows the published HTTPS app and custom domains', () => {
    expect(canRegisterAppWorker(production)).toBe(true);
    expect(canRegisterAppWorker({ ...production, hostname: 'preview-v2--shop.example.com' })).toBe(true);
  });
  it.each(['id-preview--abc.lovable.app', 'preview-2--abc.lovable.app', 'PREVIEW--ABC.GPT-ENG.COM', 'project--abc-dev.gptengineer.run', 'lovableproject.com', 'x.lovableproject-dev.com', 'beta.lovable.dev'])('refuses preview host %s', hostname => {
    expect(canRegisterAppWorker({ ...production, hostname })).toBe(false);
  });
  it('refuses dev, iframe, HTTP and the user kill switch', () => {
    expect(canRegisterAppWorker({ ...production, production: false })).toBe(false);
    expect(canRegisterAppWorker({ ...production, framed: true })).toBe(false);
    expect(canRegisterAppWorker({ ...production, secure: false })).toBe(false);
    expect(canRegisterAppWorker({ ...production, search: '?sw=off' })).toBe(false);
  });
  it('cleans up only the app shell, never messaging workers or other origins', () => {
    expect(isAppWorker('https://example.com/sw.js', 'https://example.com')).toBe(true);
    expect(isAppWorker('https://example.com/firebase-messaging-sw.js', 'https://example.com')).toBe(false);
    expect(isAppWorker('https://other.com/sw.js', 'https://example.com')).toBe(false);
  });
});