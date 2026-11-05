// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

// Query-qualified precache documents never intercept normal navigations.
// NetworkFirst serves fresh HTML online and uses the matching saved page offline.
const offlinePaths = ["/", "/shop", "/cart", "/checkout", "/chat", "/tips", "/contact",
  ...["paracetamol-500", "malaria-test-kit", "ibuprofen-400", "artemether-lumefantrine", "vitamin-c-1000", "multivitamin", "baby-diapers", "ors-sachets", "plaster-strips", "antiseptic-liquid"].map(id => `/product/${id}`)];
const pwaPlugins = VitePWA({
  strategies: "generateSW", filename: "sw.js", registerType: "autoUpdate",
  injectRegister: null, manifest: false, devOptions: { enabled: false },
  integration: { configureOptions(config, options) {
    options.outDir = config.environments?.['client']?.build.outDir ?? "dist/client";
  } },
  workbox: {
    globPatterns: ["**/*.{js,css,png,jpg,jpeg,svg,webp,woff,woff2,webmanifest}"],
    globIgnores: ["**/sw.js", "**/workbox-*.js"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    navigateFallback: null, cleanupOutdatedCaches: true, clientsClaim: true, skipWaiting: true,
    additionalManifestEntries: offlinePaths.map(path => ({ url: `${path}?offline-shell=1`, revision: new Date().toISOString() })),
    runtimeCaching: [
      ...offlinePaths.map(path => ({
        urlPattern: new RegExp(`^https?:\\/\\/[^/]+${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\?|$)`),
        handler: "NetworkFirst" as const,
        options: { cacheName: "ccc-pages", networkTimeoutSeconds: 4,
          cacheableResponse: { statuses: [200] }, expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 60 * 60 },
          precacheFallback: { fallbackURL: `${path}?offline-shell=1` } },
      })),
      { urlPattern: ({ request, url, sameOrigin }) => sameOrigin && request.mode === "navigate" && !/^\/(?:~oauth|api|_server)(?:\/|$)/.test(url.pathname),
        handler: "NetworkFirst", options: { cacheName: "ccc-pages", precacheFallback: { fallbackURL: "/?offline-shell=1" }, cacheableResponse: { statuses: [200] } } },
      { urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/assets\/.*-[\w-]+\.(js|css|png|jpe?g|svg|webp|woff2?)$/.test(url.pathname),
        handler: "CacheFirst", options: { cacheName: "ccc-assets", expiration: { maxEntries: 150, maxAgeSeconds: 30 * 24 * 60 * 60 } } },
    ],
  },
});

// TanStack builds several environments and prerenders after client closeBundle.
// Generate once, after the entire application output is ready.
const pwaBuild = pwaPlugins.find(plugin => plugin.name === "vite-plugin-pwa:build");
if (pwaBuild) delete pwaBuild.closeBundle;

export default defineConfig({
  vite: { plugins: [...pwaPlugins, {
    name: "ccc-pwa-finalize", apply: "build", enforce: "post",
    buildApp: { order: "post", async handler() {
      const api = pwaPlugins.find(plugin => plugin.name === "vite-plugin-pwa")?.api;
      await api?.generateSW();
    } },
  }] },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
