import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstall, setShowInstall] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        // Check if user has already seen the prompt
        const alreadySeen = localStorage.getItem('pwa-prompt-shown');
        if (alreadySeen) {
            return;
        }

        // Check if iOS
        const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(ios);

        // Listen for install prompt
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Show iOS prompt if on iOS and not installed
        if (ios && !localStorage.getItem('pwa-dismissed')) {
            setShowInstall(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt && !isIOS) return;

        if (isIOS) {
            // Show iOS instructions
            alert('To install Pumafy:\n\n1. Tap the Share button (⬆️)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add" in the top right');
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setShowInstall(false);
            localStorage.setItem('pwa-prompt-shown', 'true');
        } else {
            // User dismissed, mark as shown so we don't show again
            localStorage.setItem('pwa-prompt-shown', 'true');
        }
    };

    const handleDismiss = () => {
        setShowInstall(false);
        localStorage.setItem('pwa-prompt-shown', 'true');
        localStorage.setItem('pwa-dismissed', 'true');
    };

    if (isInstalled || !showInstall) return null;

    return (
        <div className="fixed bottom-20 sm:bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-gradient-to-r from-[#1ed760] to-[#1db954] rounded-lg p-4 shadow-2xl z-50 animate-slideUp">
            <button 
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-black/60 hover:text-black transition"
            >
                <X size={20} />
            </button>
            
            <div className="flex items-start gap-3">
                <div className="bg-black/10 rounded-full p-2 flex-shrink-0">
                    <Download size={24} className="text-black" />
                </div>
                <div className="flex-1">
                    <h3 className="text-black font-bold text-lg mb-1">Install Pumafy</h3>
                    <p className="text-black/80 text-sm mb-3">
                        {isIOS 
                            ? 'Add to your home screen for quick access!'
                            : 'Install the app for a better experience!'}
                    </p>
                    <button
                        onClick={handleInstall}
                        className="bg-black text-[#1ed760] font-bold py-2 px-4 rounded-full text-sm hover:scale-105 transition-transform"
                    >
                        {isIOS ? 'Show Instructions' : 'Install Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;
