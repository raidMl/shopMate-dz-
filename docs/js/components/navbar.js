/**
 * Mobile Navbar Component
 * Handles mobile drawer functionality, theme toggle, and language switching
 */
class MobileNavbar {
  constructor() {
    this.isOpen = false;
    this.elements = this.getElements();
    this.currentLanguage = 'en';
    this.init();
  }

  getElements() {
    return {
      drawer: document.getElementById('mobileDrawer'),
      backdrop: document.getElementById('mobileDrawerBackdrop'),
      toggle: document.getElementById('mobileMenuToggle'),
      closeBtn: document.getElementById('mobileCloseBtn'),
      cartCount: document.getElementById('mobileCartCount'),
      themeIcon: document.getElementById('mobileThemeIcon'),
      currentLang: document.getElementById('mobileCurrentLang'),
      languageToggle: document.getElementById('mobileLanguageToggle'),
      languageOptions: document.getElementById('mobileLanguageOptions'),
      cartBtn: document.getElementById('mobileCartBtn'),
      checkoutBtn: document.getElementById('mobileCheckoutBtn'),
      themeToggle: document.getElementById('mobileThemeToggle')
    };
  }

  init() {
    if (!this.elements.drawer || !this.elements.toggle) {
      console.warn('Mobile navbar elements not found');
      return;
    }
    
    this.setupEventListeners();
    this.updateInitialState();
    console.log('Mobile navbar initialized');
  }

  setupEventListeners() {
    // Drawer toggle
    this.elements.toggle?.addEventListener('click', () => this.toggleDrawer());
    this.elements.closeBtn?.addEventListener('click', () => this.closeDrawer());
    this.elements.backdrop?.addEventListener('click', () => this.closeDrawer());

    // Navigation items
    this.elements.cartBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleCartClick();
    });

    this.elements.checkoutBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleCheckoutClick();
    });

    // Theme toggle
    this.elements.themeToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleThemeToggle();
    });

    // Language switcher
    this.elements.languageToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleLanguageOptions();
    });

    // Language options
    document.querySelectorAll('.mobile-lang-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        this.changeLanguage(lang);
      });
    });

    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });

    // Global event listeners
    document.addEventListener('cartUpdated', () => this.updateCartCount());
    document.addEventListener('languageChanged', () => this.updateCurrentLanguage());
  }

  toggleDrawer() {
    this.isOpen ? this.closeDrawer() : this.openDrawer();
  }

  openDrawer() {
    if (!this.elements.drawer) return;
    
    this.isOpen = true;
    this.elements.drawer.classList.add('open');
    this.elements.backdrop?.classList.add('open');
    this.elements.toggle?.classList.add('open');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Animate nav items
    this.animateNavItems();
  }

  closeDrawer() {
    if (!this.elements.drawer) return;
    
    this.isOpen = false;
    this.elements.drawer.classList.remove('open');
    this.elements.backdrop?.classList.remove('open');
    this.elements.toggle?.classList.remove('open');
    this.elements.languageOptions?.classList.remove('open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset animations
    this.resetNavItemAnimations();
  }

  animateNavItems() {
    const navItems = this.elements.drawer?.querySelectorAll('.mobile-nav-item');
    navItems?.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50));
    });
  }

  resetNavItemAnimations() {
    const navItems = this.elements.drawer?.querySelectorAll('.mobile-nav-item');
    navItems?.forEach(item => {
      item.style.transition = '';
      item.style.opacity = '';
      item.style.transform = '';
    });
  }

  handleCartClick() {
    this.closeDrawer();
    setTimeout(() => {
      if (typeof openDrawer === 'function') {
        openDrawer(true);
      }
    }, 300);
  }

  handleCheckoutClick() {
    this.closeDrawer();
    setTimeout(() => {
      if (typeof proceedToCheckout === 'function') {
        proceedToCheckout();
      }
    }, 300);
  }

  handleThemeToggle() {
    if (window.themeManager) {
      window.themeManager.toggle();
    } else {
      this.fallbackThemeToggle();
    }
  }

  fallbackThemeToggle() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      this.updateThemeIcon('☀️');
    } else {
      document.documentElement.removeAttribute('data-theme');
      this.updateThemeIcon('🌙');
    }
    
    localStorage.setItem('theme', newTheme);
    
    if (typeof toast === 'function') {
      toast(`Switched to ${newTheme} mode`, 'success');
    }
  }

  toggleLanguageOptions() {
    this.elements.languageOptions?.classList.toggle('open');
  }

  changeLanguage(lang) {
    // Try different language switching methods
    if (typeof setLanguage === 'function') {
      setLanguage(lang);
    } else if (window.languageSwitcher && typeof window.languageSwitcher.setLanguage === 'function') {
      window.languageSwitcher.setLanguage(lang);
    } else {
      // Fallback to main language switcher
      const languageSwitcher = document.getElementById('languageSelect');
      if (languageSwitcher) {
        languageSwitcher.value = lang;
        languageSwitcher.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    this.elements.languageOptions?.classList.remove('open');
    this.updateActiveLanguage(lang);
    
    // Close drawer after language change
    setTimeout(() => this.closeDrawer(), 500);
  }

  updateActiveLanguage(lang) {
    document.querySelectorAll('.mobile-lang-option').forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
  }

  updateCurrentLanguage() {
    if (!this.elements.currentLang) return;
    
    let currentLanguage = this.getCurrentLanguage();
    const langMap = {
      'en': 'EN',
      'ar': 'ع',
      'fr': 'FR'
    };
    
    this.elements.currentLang.textContent = langMap[currentLanguage] || 'EN';
    this.updateActiveLanguage(currentLanguage);
  }

  getCurrentLanguage() {
    // Try multiple methods to get current language
    if (typeof getCurrentLanguage === 'function') {
      return getCurrentLanguage();
    }
    if (window.currentLanguage) {
      return window.currentLanguage;
    }
    if (localStorage.getItem('language')) {
      return localStorage.getItem('language');
    }
    
    const languageSwitcher = document.getElementById('languageSelect');
    if (languageSwitcher) {
      return languageSwitcher.value || 'en';
    }
    
    return 'en';
  }

  updateCartCount() {
    if (!this.elements.cartCount) return;
    
    let count = 0;
    if (typeof state !== 'undefined' && state.cart) {
      count = Object.values(state.cart).reduce((sum, qty) => sum + qty, 0);
    }
    
    this.elements.cartCount.textContent = count;
    
    // Add pulse animation
    this.elements.cartCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
      this.elements.cartCount.style.transform = 'scale(1)';
    }, 200);
  }

  updateThemeIcon(icon) {
    if (this.elements.themeIcon) {
      this.elements.themeIcon.textContent = icon;
    }
  }

  updateInitialState() {
    this.updateCartCount();
    this.updateCurrentLanguage();
    
    // Set initial theme icon
    const currentTheme = localStorage.getItem('theme') || 'dark';
    this.updateThemeIcon(currentTheme === 'light' ? '☀️' : '🌙');
  }

  // Public API methods
  refresh() {
    this.updateCartCount();
    this.updateCurrentLanguage();
  }

  destroy() {
    // Cleanup event listeners if needed
    this.closeDrawer();
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.mobileNavbar = new MobileNavbar();
});

// Export for manual initialization
window.MobileNavbar = MobileNavbar;
