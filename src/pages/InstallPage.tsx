import { useState, useEffect } from 'react';
import { Download, Share, Smartphone, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGlobalDeferredPrompt, clearGlobalDeferredPrompt } from '@/components/pwa/InstallPrompt';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    setIsStandalone(standalone);

    if (standalone) {
      navigate('/', { replace: true });
      return;
    }

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if we already have a deferred prompt from the global handler
    const existing = getGlobalDeferredPrompt();
    if (existing) {
      setDeferredPrompt(existing as BeforeInstallPromptEvent);
    }

    // Also listen for new ones
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, [navigate]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        clearGlobalDeferredPrompt();
        navigate('/', { replace: true });
      }
    } catch {
      // prompt failed
    }
    setInstalling(false);
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-card border border-border active:scale-95 transition-transform"
        >
          <ArrowLeft size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-12">
        <div className="max-w-sm w-full text-center space-y-8">
          {/* App Icon */}
          <div className="w-24 h-24 mx-auto rounded-3xl bg-primary flex items-center justify-center shadow-2xl">
            <Smartphone size={44} className="text-primary-foreground" />
          </div>

          {/* App Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight">NeuroFlux</h1>
            <p className="text-sm text-muted-foreground">
              Sistema de gestão completo
            </p>
          </div>

          {/* Install Section */}
          {isIOS ? (
            <div className="space-y-4">
              {!showIOSSteps ? (
                <>
                  <button
                    onClick={() => setShowIOSSteps(true)}
                    className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-primary text-primary-foreground shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={22} />
                    Instalar Agora
                  </button>
                  <p className="text-xs text-muted-foreground">
                    Toque no botão acima para iniciar a instalação
                  </p>
                </>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4 text-left animate-slide-up">
                  <p className="text-sm font-bold">Siga estes passos para instalar:</p>
                  <div className="space-y-3">
                    <Step n={1}>
                      Toque em <Share size={15} className="inline -mt-0.5 text-primary" /> <strong>Compartilhar</strong> na barra inferior do Safari
                    </Step>
                    <Step n={2}>
                      Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>
                    </Step>
                    <Step n={3}>
                      Toque em <strong>"Adicionar"</strong> no canto superior direito
                    </Step>
                  </div>
                  <p className="text-xs text-muted-foreground pt-2">
                    ⚠️ Funciona apenas no <strong>Safari</strong>. Se estiver usando outro navegador, copie o link e abra no Safari.
                  </p>
                </div>
              )}
            </div>
          ) : deferredPrompt ? (
            <div className="space-y-4">
              <button
                onClick={handleInstall}
                disabled={installing}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider bg-primary text-primary-foreground shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                <Download size={22} />
                {installing ? 'Instalando...' : 'Instalar Agora'}
              </button>
              <p className="text-xs text-muted-foreground">
                Toque no botão acima para instalar direto no seu celular
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4 text-left">
                <p className="text-sm font-bold">Como instalar no Android:</p>
                <div className="space-y-3">
                  <Step n={1}>
                    Toque no menu <strong>⋮</strong> (três pontos) do Chrome
                  </Step>
                  <Step n={2}>
                    Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>
                  </Step>
                  <Step n={3}>
                    Confirme tocando em <strong>"Instalar"</strong>
                  </Step>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ⚠️ Funciona melhor no <strong>Google Chrome</strong>
              </p>
            </div>
          )}

          {/* Features */}
          <div className="space-y-2 pt-4">
            <Feature text="Acesso rápido pela tela inicial" />
            <Feature text="Funciona como app nativo" />
            <Feature text="Carregamento ultra rápido" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 text-sm text-muted-foreground">
      <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
        {n}
      </span>
      <span className="pt-0.5">{children}</span>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
      <ChevronRight size={14} className="text-primary" />
      <span>{text}</span>
    </div>
  );
}
