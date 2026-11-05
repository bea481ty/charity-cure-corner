/** Only the published top-level app may own an app-shell worker. */
export function canRegisterAppWorker({ production, hostname, framed, search, secure }: {
  production: boolean; hostname: string; framed: boolean; search: string; secure: boolean;
}) {
  const host = hostname.toLowerCase();
  const lovableDomain = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(host);
  const label = host.split('.')[0] ?? '';
  const preview = lovableDomain && (/^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(label) || /^project--.+-dev$/.test(label));
  const editor = ['lovableproject.com', 'lovableproject-dev.com', 'beta.lovable.dev'].some(domain => host === domain || host.endsWith(`.${domain}`));
  return production && secure && !framed && !preview && !editor && new URLSearchParams(search).get('sw') !== 'off';
}

export function isAppWorker(scriptURL: string, origin: string) {
  const url = new URL(scriptURL, origin);
  return url.origin === origin && url.pathname === '/sw.js';
}