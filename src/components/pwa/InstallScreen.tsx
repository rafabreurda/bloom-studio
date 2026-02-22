import { useState, useEffect } from 'react';
import { Download, Share, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallScreen() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    if (ios) return;

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
      window.location.reload();
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="max-w-sm w-full text-center space-y-8">
        <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center shadow-lg">
          <Smartphone size={48} className="text-primary-foreground" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tight">Sol e Mio</h1>
          <p className="text-sm text-muted-foreground">
            Instale o aplicativo para continuar
          </p>
        </div>

        {isIOS ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 text-left">
            <p className="text-sm font-semibold">Como instalar no iPhone/iPad:</p>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
                <span>Toque no ícone <Share size={16} className="inline -mt-0.5" /> na barra do navegador</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
                <span>Selecione <strong>"Adicionar à Tela de Início"</strong></span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</span>
                <span>Toque em <strong>"Adicionar"</strong></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {deferredPrompt ? (
              <button
                onClick={handleInstall}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Download size={20} />
                Instalar Agora
              </button>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3 text-left">
                <p className="text-sm font-semibold">Como instalar:</p>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    <span>Abra o menu do navegador <strong>(⋮)</strong></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    <span>Selecione <strong>"Instalar aplicativo"</strong></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground/60">
          Acesse pelo app instalado para usar o sistema
        </p>
      </div>
    </div>
  );
}
