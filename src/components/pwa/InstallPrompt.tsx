import { useState, useEffect } from 'react';
import { Download, X, Share, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (standalone) return;

    // Check if previously dismissed (session only)
    const wasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    // Listen for the native install prompt (Android/Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    const installedHandler = () => {
      setDismissed(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
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
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 animate-slide-up">
      <div
        className="rounded-2xl p-4 shadow-2xl border border-border max-w-lg mx-auto"
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
              {isIOS ? (
                <>
                  Toque em{' '}
                  <Share size={14} className="inline -mt-0.5" />{' '}
                  <strong>(Compartilhar)</strong> e depois{' '}
                  <strong>"Adicionar à Tela de Início"</strong>
                </>
              ) : deferredPrompt ? (
                'Instale o app para acesso rápido direto da sua tela inicial.'
              ) : (
                <>
                  Toque em{' '}
                  <MoreVertical size={14} className="inline -mt-0.5" />{' '}
                  no navegador e selecione{' '}
                  <strong>"Instalar aplicativo"</strong> ou{' '}
                  <strong>"Adicionar à tela inicial"</strong>
                </>
              )}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Native install button - only on Android/Chrome when available */}
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstall}
            className="w-full mt-3 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all active:scale-95"
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
