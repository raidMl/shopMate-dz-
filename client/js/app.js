/**
 * ShopMate E-Commerce Application
 * Main application entry point and initialization
 */

class ShopMateApp {
  constructor() {
    this.initialized = false;
    this.components = {};
    this.config = {
      apiEndpoint: '/api',
      defaultLanguage: 'en',
      defaultTheme: 'dark',
      enableDebug: true
    };
  }

  async init() {
    if (this.initialized) {
      console.warn('App already initialized');
      return;
    }

    try {
      this.log('🚀 Initializing ShopMate App...');
      
      // Show loading state
      this.showLoadingState();
      
      // Initialize core components in order
      await this.initializeCore();
      await this.initializeData();
      await this.initializeComponents();
      await this.initializeUI();
      
      // Hide loading state
      this.hideLoadingState();
      
      this.initialized = true;
      this.log('✅ ShopMate App initialized successfully');
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.handleInitializationError(error);
    }
  }

  async initializeCore() {
    this.log('🔧 Initializing core systems...');
    
    // Initialize theme system
    if (typeof ThemeManager !== 'undefined') {
      this.components.themeManager = new ThemeManager();
      window.themeManager = this.components.themeManager;
    }
    
    // Initialize state management
    if (typeof initializeState === 'function') {
      await initializeState();
    }
    
    // Initialize keyboard shortcuts
    this.initializeKeyboardShortcuts();
  }

  async initializeData() {
    this.log('📦 Loading application data...');
    
    // Initialize products from API or local data
    if (typeof initializeProducts === 'function') {
      await initializeProducts();
    }
    
    // Load user preferences
    this.loadUserPreferences();
  }

  async initializeComponents() {
    this.log('🔧 Initializing components...');
    
    // Initialize language switcher
    if (typeof setupLanguageSwitcher === 'function') {
      setupLanguageSwitcher();
    }
    
    // Initialize mobile navbar
    if (window.MobileNavbar && !window.mobileNavbar) {
      this.components.mobileNavbar = new MobileNavbar();
      window.mobileNavbar = this.components.mobileNavbar;
    }
    
    // Initialize other components
    this.initializeFilters();
    this.initializeFavorites();
    this.initializeCart();
    this.initializeCheckout();
    
    // Initialize contact form
    if (typeof ContactForm !== 'undefined') {
      this.components.contactForm = new ContactForm();
    }
    
    // Initialize footer navigation
    if (typeof FooterNavigation !== 'undefined') {
      this.components.footerNavigation = new FooterNavigation();
    }
  }

  async initializeUI() {
    this.log('🎨 Setting up user interface...');
    
    // Populate wilaya dropdown
    if (typeof populateWilayaDropdown === 'function') {
      populateWilayaDropdown();
    }
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Render initial UI state
    this.renderInitialState();
    
    // Setup PWA features
    this.setupPWA();
  }

  initializeFilters() {
    if (typeof initFilterEvents === 'function') {
      initFilterEvents();
    }
  }

  initializeFavorites() {
    if (typeof initFavorites === 'function') {
      initFavorites();
    }
    this.updateFavoritesCount();
  }

  initializeCart() {
    if (typeof initCartEvents === 'function') {
      initCartEvents();
    }
    if (typeof updateCartUI === 'function') {
      updateCartUI();
    }
  }

  initializeCheckout() {
    if (typeof initCheckoutEvents === 'function') {
      initCheckoutEvents();
    }
  }

  setupEventListeners() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.handleGlobalError(event.error);
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError(event.reason);
    });
    
    // Online/offline status
    window.addEventListener('online', () => {
      this.showToast('Connection restored', 'success');
    });
    
    window.addEventListener('offline', () => {
      this.showToast('No internet connection', 'warning');
    });
  }

  initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Escape key - close modals and drawers
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
      
      // Ctrl/Cmd + K - focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      // Ctrl/Cmd + Enter - submit forms
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        this.handleQuickSubmit();
      }
    });
  }

  closeAllModals() {
    // Close checkout modal
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal && checkoutModal.open) {
      checkoutModal.close();
    }
    
    // Close product preview modals
    document.querySelectorAll('.product-preview-modal').forEach(modal => {
      modal.close();
      modal.remove();
    });
    
    // Close cart drawer
    if (typeof openDrawer === 'function') {
      openDrawer(false);
    }
    
    // Close mobile navbar
    if (window.mobileNavbar) {
      window.mobileNavbar.closeDrawer();
    }
  }

  handleQuickSubmit() {
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal && checkoutModal.open) {
      const submitButton = document.getElementById('placeOrder');
      if (submitButton && !submitButton.disabled) {
        submitButton.click();
      }
    }
  }

  renderInitialState() {
    // Render products
    if (typeof renderProducts === 'function') {
      renderProducts();
    }
    
    // Update UI components
    if (typeof updateCartUI === 'function') {
      updateCartUI();
    }
    
    this.updateFavoritesCount();
  }

  updateFavoritesCount() {
    const favCount = document.getElementById('favoritesCount');
    if (favCount && typeof state !== 'undefined' && state.favorites) {
      favCount.textContent = state.favorites.length;
    }
  }

  loadUserPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('theme') || this.config.defaultTheme;
    if (this.components.themeManager) {
      this.components.themeManager.applyTheme(savedTheme);
    }
    
    // Load language preference
    const savedLanguage = localStorage.getItem('language') || this.config.defaultLanguage;
    if (typeof setLanguage === 'function') {
      setLanguage(savedLanguage);
    }
  }

  setupPWA() {
    // Check for service worker support
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
    
    // Handle install prompt
    this.setupInstallPrompt();
  }

  async registerServiceWorker() {
    try {
      // Only register if service worker file exists
      const response = await fetch('/sw.js', { method: 'HEAD' });
      if (response.ok) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.log('🔧 Service Worker registered:', registration);
      }
    } catch (error) {
      this.log('Service Worker registration skipped:', error.message);
    }
  }

  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // You could show a custom install button here
    });
    
    window.addEventListener('appinstalled', () => {
      this.showToast('App installed successfully!', 'success');
    });
  }

  showLoadingState() {
    const grid = document.getElementById('grid');
    if (grid) {
      grid.innerHTML = `
        <div class="loading-state" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        ">
          <div class="loading-spinner" style="
            width: 48px;
            height: 48px;
            border: 4px solid var(--border);
            border-top: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
          "></div>
          <p style="color: var(--muted); margin: 0;">Loading ShopMate...</p>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
    }
  }

  hideLoadingState() {
    const loadingState = document.querySelector('.loading-state');
    if (loadingState) {
      loadingState.remove();
    }
  }

  showToast(message, type = 'info') {
    if (typeof toast === 'function') {
      toast(message, type);
    } else if (typeof showToast === 'function') {
      showToast(message, type);
    } else {
      console.log(`Toast: ${message} (${type})`);
    }
  }

  handleInitializationError(error) {
    this.hideLoadingState();
    
    const grid = document.getElementById('grid');
    if (grid) {
      grid.innerHTML = `
        <div class="error-state" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
        ">
          <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
          <h3 style="color: var(--text); margin-bottom: 1rem;">Failed to Initialize App</h3>
          <p style="color: var(--muted); margin-bottom: 2rem;">
            Something went wrong while loading ShopMate. Please refresh the page to try again.
          </p>
          <button class="btn" onclick="window.location.reload()">
            Refresh Page
          </button>
        </div>
      `;
    }
    
    this.showToast('Failed to initialize app. Please refresh the page.', 'error');
  }

  handleGlobalError(error) {
    if (this.config.enableDebug) {
      console.error('Global error:', error);
    }
    
    // Don't show toast for every error, just critical ones
    if (error && error.message && !error.message.includes('Script error')) {
      this.showToast('An unexpected error occurred', 'error');
    }
  }

  log(message, ...args) {
    if (this.config.enableDebug) {
      console.log(message, ...args);
    }
  }

  // Public API methods
  refresh() {
    if (typeof renderProducts === 'function') {
      renderProducts();
    }
    if (typeof updateCartUI === 'function') {
      updateCartUI();
    }
    this.updateFavoritesCount();
    
    // Refresh components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.refresh === 'function') {
        component.refresh();
      }
    });
  }

  getVersion() {
    return '1.0.0';
  }

  getStats() {
    return {
      initialized: this.initialized,
      components: Object.keys(this.components),
      productsLoaded: typeof products !== 'undefined' ? products.length : 0,
      cartItems: typeof state !== 'undefined' && state.cart ? Object.keys(state.cart).length : 0
    };
  }
}

// Create global app instance
window.shopMateApp = new ShopMateApp();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.shopMateApp.init();
});

// Global helper functions for backward compatibility
function initApp() {
  return window.shopMateApp.init();
}

function showToast(message, type = 'success') {
  return window.shopMateApp.showToast(message, type);
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ShopMateApp;
}
