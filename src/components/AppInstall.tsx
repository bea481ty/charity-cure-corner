import { useEffect, useState } from 'react';
import { Download, Check, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { initializeAppWorker } from '@/lib/pwa';
import icon from '@/assets/cure-corner-icon.jpg';

type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> };

export function AppInstall() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [help, setHelp] = useState(false);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)');
    const updateInstalled = () => setInstalled(standalone.matches || (navigator as Navigator & { standalone?: boolean }).standalone === true);
    const updateNetwork = () => setOffline(!navigator.onLine);
    const capture = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPrompt); };
    const complete = () => { setInstalled(true); setPrompt(null); setHelp(false); };
    const failed = () => setUnavailable(true);
    updateInstalled(); updateNetwork();
    standalone.addEventListener('change', updateInstalled);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', complete);
    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('app-offline-unavailable', failed);
    void initializeAppWorker().catch(failed);
    return () => {
      standalone.removeEventListener('change', updateInstalled);
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', complete);
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('app-offline-unavailable', failed);
    };
  }, []);

  const install = async () => {
    if (!prompt) { setHelp(true); return; }
    setBusy(true);
    try {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(null);
    } catch { setHelp(true); }
    finally { setBusy(false); }
  };

  return <>
    <div className="mx-auto flex max-w-md items-center justify-between gap-3 border-b border-border px-5 py-2">
      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-primary"><img src={icon} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />Your Neighbour Chemist</span>
      {installed ? <Check aria-label="App installed" className="h-4 w-4 shrink-0 text-primary" /> : <Button size="sm" onClick={install} disabled={busy} className="shrink-0"><Download />{busy ? 'Installing…' : 'Install app'}</Button>}
    </div>
    {offline && <p role="status" className="mx-auto flex max-w-md items-center gap-2 bg-muted px-5 py-2 text-xs text-primary"><WifiOff className="h-4 w-4 shrink-0" />Offline · Orders and WhatsApp need internet.</p>}
    {unavailable && !offline && <p role="status" className="mx-auto max-w-md px-5 py-2 text-xs text-muted-foreground">Offline access is unavailable. You can still use the app online.</p>}
    <Dialog open={help} onOpenChange={setHelp}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Install Charity’s Cure Corner</DialogTitle><DialogDescription>Open charity-cure-corner.lovable.app in your device’s browser.</DialogDescription></DialogHeader>
        <div className="space-y-3 text-sm">
          <p><strong>Android:</strong> In Chrome, open the ⋮ menu and choose “Install app” or “Add to Home screen”.</p>
          <p><strong>Windows and desktop:</strong> In Chrome or Edge, use the install icon in the address bar or “Install this site as an app” in the browser menu.</p>
          <p><strong>iPhone or iPad:</strong> In Safari, tap Share, then “Add to Home Screen”.</p>
          <p className="text-muted-foreground">Installation depends on your browser. Open the app online once to save its pages for offline use.</p>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}