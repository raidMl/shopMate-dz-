// PWA functionality and service worker management
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.isOnline = navigator.onLine;
        
        this.init();
    }

    async init() {
        // Check if running as PWA
        this.checkInstallStatus();
        
        // Register service worker
        await this.registerServiceWorker();
        
        // Setup install prompt
        this.setupInstallPrompt();
        
        // Setup network monitoring
        this.setupNetworkMonitoring();
        
        // Setup update checking
        this.setupUpdateChecking();
        
        // Setup iOS install guidance
        this.setupIOSInstallGuidance();
        
        console.log('🎉 PWA Manager initialized');
    }

    checkInstallStatus() {
        // Check if app is running in standalone mode
        this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone ||
                          document.referrer.includes('android-app://');
        
        if (this.isInstalled) {
            console.log('📱 App is running as installed PWA');
            this.hideInstallPrompt();
        }
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('✅ Service Worker registered:', registration.scope);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    this.handleServiceWorkerUpdate(registration);
                });
                
                // Check for existing service worker updates
                if (registration.waiting) {
                    this.showUpdatePrompt();
                }
                
                return registration;
            } catch (error) {
                console.error('❌ Service Worker registration failed:', error);
            }
        } else {
            console.log('⚠️ Service Worker not supported');
        }
    }

    handleServiceWorkerUpdate(registration) {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdatePrompt();
            }
        });
    }

    setupInstallPrompt() {
        const installBanner = document.getElementById('pwa-install-banner');
        const installBtn = document.getElementById('pwa-install-btn');
        const dismissBtn = document.getElementById('pwa-dismiss-btn');

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            
            // Show banner after delay if not dismissed
            setTimeout(() => {
                if (!localStorage.getItem('pwa-dismissed') && !this.isInstalled) {
                    this.showInstallPrompt();
                }
            }, 3000);
        });

        // Handle install button click
        installBtn?.addEventListener('click', () => {
            this.triggerInstall();
        });

        // Handle dismiss button click
        dismissBtn?.addEventListener('click', () => {
            this.dismissInstallPrompt();
        });

        // Listen for successful installation
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA installed successfully');
            this.hideInstallPrompt();
            this.showToast('App installed successfully! 🎉', 'success');
            this.trackEvent('pwa_installed');
        });
    }

    showInstallPrompt() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.remove('hidden');
        }
    }

    hideInstallPrompt() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.add('hidden');
        }
    }

    async triggerInstall() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`PWA install outcome: ${outcome}`);
            this.trackEvent('pwa_install_prompt', { outcome });
            
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }

    dismissInstallPrompt() {
        this.hideInstallPrompt();
        localStorage.setItem('pwa-dismissed', Date.now().toString());
        this.trackEvent('pwa_install_dismissed');
    }

    setupNetworkMonitoring() {
        const offlineIndicator = document.getElementById('offline-indicator');
        
        const updateNetworkStatus = () => {
            const wasOnline = this.isOnline;
            this.isOnline = navigator.onLine;
            
            if (offlineIndicator) {
                if (this.isOnline) {
                    offlineIndicator.classList.add('hidden');
                    if (!wasOnline) {
                        this.showToast('Back online! 📡', 'success');
                        this.syncPendingData();
                    }
                } else {
                    offlineIndicator.classList.remove('hidden');
                    this.showToast('You\'re offline 📴', 'warning');
                }
            }
            
            // Update UI based on network status
            document.body.classList.toggle('offline', !this.isOnline);
        };

        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);
        updateNetworkStatus(); // Initial check
    }

    async syncPendingData() {
        if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
            try {
                const registration = await navigator.serviceWorker.ready;
                await registration.sync.register('sync-orders');
                console.log('🔄 Background sync triggered');
            } catch (error) {
                console.log('❌ Background sync failed:', error);
            }
        }
    }

    setupUpdateChecking() {
        // Check for updates periodically
        setInterval(() => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.update();
                });
            }
        }, 60000); // Check every minute
    }

    showUpdatePrompt() {
        const shouldUpdate = confirm(
            'A new version of ShopMate is available! Would you like to update now?'
        );
        
        if (shouldUpdate) {
            window.location.reload();
        }
    }

    setupIOSInstallGuidance() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isStandalone = window.navigator.standalone;
        
        if (isIOS && !isStandalone && !localStorage.getItem('ios-prompt-dismissed')) {
            setTimeout(() => {
                this.showIOSInstallGuidance();
            }, 5000);
        }
    }

    showIOSInstallGuidance() {
        const modal = this.createIOSInstallModal();
        document.body.appendChild(modal);
        
        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            modal.remove();
            localStorage.setItem('ios-prompt-dismissed', Date.now().toString());
        }, 10000);
    }

    createIOSInstallModal() {
        const modal = document.createElement('div');
        modal.className = 'ios-install-modal';
        modal.innerHTML = `
            <div class="ios-install-content">
                <div class="ios-install-header">
                    <h3>📱 Install ShopMate</h3>
                    <button class="ios-install-close">&times;</button>
                </div>
                <div class="ios-install-body">
                    <p>To install this app on your iOS device:</p>
                    <ol>
                        <li>Tap the <strong>Share</strong> button <span class="share-icon">⎋</span></li>
                        <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                        <li>Tap <strong>"Add"</strong> to confirm</li>
                    </ol>
                </div>
            </div>
        `;
        
        // Handle close button
        modal.querySelector('.ios-install-close').addEventListener('click', () => {
            modal.remove();
            localStorage.setItem('ios-prompt-dismissed', Date.now().toString());
        });
        
        return modal;
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Remove after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    showLoading(show = true) {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.classList.toggle('hidden', !show);
        }
    }

    trackEvent(eventName, data = {}) {
        // Track PWA events for analytics
        console.log(`📊 PWA Event: ${eventName}`, data);
        
        // You can send to analytics service here
        if (window.gtag) {
            window.gtag('event', eventName, {
                event_category: 'PWA',
                ...data
            });
        }
    }

    // Public methods for app to use
    static getInstance() {
        if (!window.pwaManager) {
            window.pwaManager = new PWAManager();
        }
        return window.pwaManager;
    }
}

// CSS for iOS install modal
const iosInstallCSS = `
.ios-install-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1003;
    padding: 1rem;
}

.ios-install-content {
    background: white;
    border-radius: 12px;
    max-width: 400px;
    width: 100%;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.ios-install-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--primary-color);
    color: white;
}

.ios-install-header h3 {
    margin: 0;
    font-size: 1.2rem;
}

.ios-install-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ios-install-close:hover {
    background: rgba(255, 255, 255, 0.1);
}

.ios-install-body {
    padding: 1.5rem;
}

.ios-install-body p {
    margin: 0 0 1rem 0;
    color: var(--text-color);
}

.ios-install-body ol {
    margin: 0;
    padding-left: 1.2rem;
    color: var(--text-color);
}

.ios-install-body li {
    margin-bottom: 0.5rem;
    line-height: 1.4;
}

.share-icon {
    display: inline-block;
    font-size: 1.2rem;
    background: var(--primary-color);
    color: white;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    margin: 0 0.2rem;
}
`;

// Inject iOS install modal CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = iosInstallCSS;
document.head.appendChild(styleSheet);

// Initialize PWA Manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PWAManager.getInstance();
    });
} else {
    PWAManager.getInstance();
}

// Export for use in other modules
window.PWAManager = PWAManager;