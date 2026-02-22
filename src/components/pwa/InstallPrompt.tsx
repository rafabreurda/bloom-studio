import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true); // default true to avoid flash

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    setIsStandalone(standalone);

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (standalone) return;

    const wasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDismissed(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed
  if (isStandalone || dismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] animate-slide-up">
      <div
        className="rounded-2xl p-4 shadow-2xl border border-border"
        style={{ backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--card-foreground))' }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            <Download size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm">Instalar NeuroFlux</h3>
            <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {isIOS
                ? <>Toque em <Share size={14} className="inline -mt-0.5" /> e depois <strong>"Adicionar à Tela de Início"</strong></>
                : deferredPrompt
                  ? 'Instale o app para acesso rápido direto da sua tela inicial.'
                  : <>Abra o menu do navegador <strong>(⋮)</strong> e selecione <strong>"Instalar aplicativo"</strong></>
              }
            </p>
          </div>
          <button onClick={handleDismiss} className="shrink-0 opacity-50 tap-target">
            <X size={20} />
          </button>
        </div>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
            }}
          >
            Instalar Agora
          </button>
        )}
      </div>
    </div>
  );
}
