import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X, Monitor, Smartphone, ExternalLink, CheckCircle } from 'lucide-react';
import { InflationMirrorLogo } from './InflationMirrorLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallModal(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return;
        }
      } catch (e) {
        console.log('Install prompt error:', e);
      }
    }
    // Show the modal guide with cover logo
    setShowInstallModal(true);
  };

  // If already running standalone, display a subtle installed badge or omit
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-teal-300/80 bg-slate-900/60 rounded-lg border border-slate-800 select-none">
        <CheckCircle className="w-3 h-3 text-teal-400" />
        <span>PWA Installed</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-300 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 rounded-xl transition shadow-sm"
        title="Download or Install Inflation Mirror App"
      >
        <Download className="w-3.5 h-3.5 text-teal-400" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* Branded Cover Logo & Install Guide Modal */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header with Close Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2">
                <InflationMirrorLogo size="sm" interactive={false} />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Install Inflation Mirror</span>
              </div>
              <button
                onClick={() => setShowInstallModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 space-y-4">
              {/* Branded App Cover Logo Artwork */}
              <div className="relative rounded-xl overflow-hidden border border-slate-700/60 shadow-lg group">
                <img
                  src="/cover-logo.svg"
                  alt="Inflation Mirror App Cover Logo"
                  className="w-full h-auto object-cover block"
                  onError={(e) => {
                    // Fallback to png if svg rendering differs
                    (e.target as HTMLImageElement).src = '/cover-logo.png';
                  }}
                />
              </div>

              <div className="text-center px-2">
                <h4 className="text-base font-bold text-white">Get the Full Offline Experience</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Add Inflation Mirror to your home screen or desktop for fast offline calculations, instant sync, and a fullscreen experience.
                </p>
              </div>

              {/* Install Instructions by Platform */}
              <div className="space-y-2.5 text-xs text-slate-300">
                {isIOS ? (
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-white text-xs">
                      <Smartphone className="w-4 h-4 text-teal-400" />
                      <span>iOS (Safari) Installation</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                      <li>Tap the <strong className="text-white">Share</strong> button (<Share className="w-3 h-3 inline mx-0.5 text-teal-400" />) in Safari</li>
                      <li>Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong></li>
                      <li>Tap <strong className="text-white">"Add"</strong> in the top-right corner</li>
                    </ol>
                  </div>
                ) : (
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-white text-xs">
                      <Monitor className="w-4 h-4 text-sky-400" />
                      <span>Android / Chrome / Edge Installation</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                      <li>Tap the browser menu <strong className="text-white">(⋮)</strong> or install icon in address bar</li>
                      <li>Select <strong className="text-white">"Install Inflation Mirror"</strong> or <strong className="text-white">"Add to Home screen"</strong></li>
                      <li>Confirm to pin the app with high-resolution logo and offline capabilities</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                {deferredPrompt ? (
                  <button
                    onClick={async () => {
                      if (deferredPrompt) {
                        await deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === 'accepted') {
                          setIsInstalled(true);
                          setDeferredPrompt(null);
                          setShowInstallModal(false);
                        }
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                  >
                    <Download className="w-4 h-4" />
                    Install Now (Native Prompt)
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Open standalone window or reload in new tab outside iframe
                      window.open(window.location.href, '_blank');
                    }}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open in New Window / Browser Tab
                  </button>
                )}

                <button
                  onClick={() => setShowInstallModal(false)}
                  className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
