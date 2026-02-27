import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Store the deferred prompt globally so the install page can use it
let globalDeferredPrompt: BeforeInstallPromptEvent | null = null;

export function getGlobalDeferredPrompt() {
  return globalDeferredPrompt;
}

export function clearGlobalDeferredPrompt() {
  globalDeferredPrompt = null;
}

export function InstallPrompt() {
  const [dismissed, setDismissed] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);
    setReady(true);

    if (standalone) return;

    const wasDismissed = sessionStorage.getItem('pwa-install-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }

    // Capture the beforeinstallprompt globally
    const handler = (e: Event) => {
      e.preventDefault();
      globalDeferredPrompt = e as BeforeInstallPromptEvent;
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setDismissed(true);
      globalDeferredPrompt = null;
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!ready || isStandalone || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-3 animate-slide-up">
      <div className="rounded-2xl p-4 shadow-2xl border border-border max-w-lg mx-auto bg-card text-card-foreground">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-primary text-primary-foreground">
            <Download size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm">Instalar Neuro Flux</h3>
            <p className="text-xs text-muted-foreground">Acesse mais rápido pela tela inicial</p>
          </div>
          <a
            href="/install"
            className="shrink-0 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary text-primary-foreground active:scale-95 transition-transform"
          >
            Instalar
          </a>
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-full opacity-50 hover:opacity-100 transition-opacity"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
