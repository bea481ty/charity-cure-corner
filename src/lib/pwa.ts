import { canRegisterAppWorker, isAppWorker } from './pwa-policy';

/** Called only after hydration; this is the single app-shell registrar. */
export async function initializeAppWorker() {
  if (!('serviceWorker' in navigator)) return;
  if (!canRegisterAppWorker({ production: import.meta.env.PROD, hostname: window.location.hostname,
    framed: window.self !== window.top, search: window.location.search, secure: window.isSecureContext })) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(registration => {
      const worker = registration.active ?? registration.waiting ?? registration.installing;
      return worker && isAppWorker(worker.scriptURL, window.location.origin);
    }).map(registration => registration.unregister()));
    return;
  }
  const { registerSW } = await import('virtual:pwa-register');
  registerSW({ immediate: true, onRegisterError: () => {
    window.dispatchEvent(new Event('app-offline-unavailable'));
  } });
}