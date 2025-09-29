/**
 * Mobile Navbar Component
 * Handles mobile drawer functionality, theme toggle, and language switching
 */
class MobileNavbar {
  constructor() {
    this.isOpen = false;
    this.languageOptionsOpen = false;
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

    // Language switcher - Enhanced debugging and event handling
    this.elements.languageToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('🌐 Language toggle clicked');
      console.log('Language options element:', this.elements.languageOptions);
      console.log('Current state:', this.languageOptionsOpen);
      this.toggleLanguageOptions();
    });

    // Language options - Enhanced event handling with debugging
    this.elements.languageOptions?.addEventListener('click', (e) => {
      console.log('🌐 Language options clicked, target:', e.target);
      const langOption = e.target.closest('.mobile-lang-option');
      console.log('🌐 Found lang option:', langOption);
      
      if (langOption) {
        e.preventDefault();
        e.stopPropagation();
        const lang = langOption.getAttribute('data-lang');
        console.log('🌐 Language selected:', lang);
        this.changeLanguage(lang);
      }
    });

    // Close language options when clicking outside
    document.addEventListener('click', (e) => {
      if (this.languageOptionsOpen && 
          !this.elements.languageToggle?.contains(e.target) && 
          !this.elements.languageOptions?.contains(e.target)) {
        this.closeLanguageOptions();
      }
    });

    // Escape key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.languageOptionsOpen) {
          this.closeLanguageOptions();
        } else if (this.isOpen) {
          this.closeDrawer();
        }
      }
    });

    // Global event listeners
    document.addEventListener('cartUpdated', () => this.updateCartCount());
    document.addEventListener('languageChanged', (e) => {
      if (e.detail && e.detail.language) {
        this.currentLanguage = e.detail.language;
      }
      this.updateCurrentLanguage();
    });
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
    
    // Also close language options when drawer closes
    this.closeLanguageOptions();
    
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
    console.log('Toggle language options, current state:', this.languageOptionsOpen);
    
    if (this.languageOptionsOpen) {
      this.closeLanguageOptions();
    } else {
      this.openLanguageOptions();
    }
  }

  openLanguageOptions() {
    if (!this.elements.languageOptions) {
      console.warn('❌ Language options element not found');
      console.log('Available elements:', Object.keys(this.elements));
      return;
    }
    
    console.log('🌐 Opening language options...');
    this.languageOptionsOpen = true;
    this.elements.languageOptions.classList.add('open');
    this.elements.languageToggle?.classList.add('active');
    
    // Force display styles
    this.elements.languageOptions.style.display = 'block';
    this.elements.languageOptions.style.maxHeight = '200px';
    this.elements.languageOptions.style.opacity = '1';
    
    // Animate options
    const options = this.elements.languageOptions.querySelectorAll('.mobile-lang-option');
    console.log('🌐 Found language options:', options.length);
    
    options.forEach((option, index) => {
      option.style.opacity = '0';
      option.style.transform = 'translateY(-10px)';
      setTimeout(() => {
        option.style.transition = 'all 0.2s ease';
        option.style.opacity = '1';
        option.style.transform = 'translateY(0)';
      }, index * 50);
    });
    
    console.log('✅ Language options opened');
  }

  closeLanguageOptions() {
    if (!this.elements.languageOptions) return;
    
    console.log('🌐 Closing language options...');
    this.languageOptionsOpen = false;
    this.elements.languageOptions.classList.remove('open');
    this.elements.languageToggle?.classList.remove('active');
    
    // Reset styles
    setTimeout(() => {
      this.elements.languageOptions.style.display = '';
      this.elements.languageOptions.style.maxHeight = '';
      this.elements.languageOptions.style.opacity = '';
    }, 300);
    
    // Reset animations
    const options = this.elements.languageOptions.querySelectorAll('.mobile-lang-option');
    options.forEach(option => {
      option.style.transition = '';
      option.style.opacity = '';
      option.style.transform = '';
    });
    
    console.log('✅ Language options closed');
  }

  changeLanguage(lang) {
    console.log('Changing language to:', lang);
    
    // Store the language preference
    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Try different language switching methods
    let languageChanged = false;
    
    // Method 1: Try global setLanguage function
    if (typeof setLanguage === 'function') {
      setLanguage(lang);
      languageChanged = true;
    }
    // Method 2: Try window.languageSwitcher
    else if (window.languageSwitcher && typeof window.languageSwitcher.setLanguage === 'function') {
      window.languageSwitcher.setLanguage(lang);
      languageChanged = true;
    }
    
    // Method 3: Dispatch custom event as fallback
    if (!languageChanged) {
      document.dispatchEvent(new CustomEvent('languageChangeRequest', { 
        detail: { language: lang } 
      }));
    }
    
    // Also trigger a general language change event
    document.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: lang } 
    }));
    
    // Close language options
    this.closeLanguageOptions();
    
    // Update UI immediately
    this.updateActiveLanguage(lang);
    this.updateCurrentLanguage();
    
    // Show feedback
    if (typeof toast === 'function') {
      const langNames = { en: 'English', ar: 'العربية', fr: 'Français' };
      toast(`Language changed to ${langNames[lang] || lang}`, 'success');
    }
    
    console.log('Language change completed');
  }

  updateActiveLanguage(lang) {
    const options = document.querySelectorAll('.mobile-lang-option');
    options.forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
  }

  updateCurrentLanguage() {
    if (!this.elements.currentLang) return;
    
    const currentLanguage = this.getCurrentLanguage();
    const langMap = {
      'en': 'EN',
      'ar': 'ع',
      'fr': 'FR'
    };
    
    this.elements.currentLang.textContent = langMap[currentLanguage] || 'EN';
    this.updateActiveLanguage(currentLanguage);
  }

  getCurrentLanguage() {
    // Priority order for getting current language
    if (this.currentLanguage) {
      return this.currentLanguage;
    }
    
    if (typeof getCurrentLanguage === 'function') {
      return getCurrentLanguage();
    }
    
    if (window.currentLanguage) {
      return window.currentLanguage;
    }
    
    const storedLang = localStorage.getItem('language');
    if (storedLang) {
      return storedLang;
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
    
    // Ensure mobile language styles are loaded
    this.ensureMobileLanguageStyles();
    
    // Debug language elements
    console.log('📱 Mobile navbar elements:', {
      languageToggle: !!this.elements.languageToggle,
      languageOptions: !!this.elements.languageOptions,
      currentLang: !!this.elements.currentLang
    });
    
    // Ensure language options are properly set up
    if (this.elements.languageOptions) {
      const options = this.elements.languageOptions.querySelectorAll('.mobile-lang-option');
      console.log('📱 Mobile language options found:', options.length);
      
      // Add individual click handlers as fallback
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const lang = option.getAttribute('data-lang');
          console.log('📱 Direct option click:', lang);
          this.changeLanguage(lang);
        });
      });
    }
  }

  ensureMobileLanguageStyles() {
    // Check if styles are already loaded
    if (document.getElementById('mobile-language-dynamic-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'mobile-language-dynamic-styles';
    style.textContent = `
      /* Mobile Language Switcher Dynamic Styles */
      .mobile-language-options {
        position: relative;
        z-index: 100;
        max-height: 0;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0;
        background: var(--bg-secondary);
        border-radius: 12px;
        margin: 8px 16px 0;
        box-shadow: 
          0 4px 6px -1px rgba(0, 0, 0, 0.1),
          0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border: 1px solid var(--border-color);
        backdrop-filter: blur(8px);
      }
      
      .mobile-language-options.open {
        max-height: 250px;
        opacity: 1;
        margin-bottom: 8px;
        display: block !important;
      }
      
      .mobile-language-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background: transparent;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 12px;
        position: relative;
      }
      
      .mobile-language-toggle:hover {
        background: var(--bg-secondary);
        transform: translateX(4px);
      }
      
      .mobile-language-toggle.active {
        background: var(--primary-alpha, rgba(110, 231, 183, 0.1)) !important;
        color: var(--primary);
      }
      
      .mobile-language-toggle .nav-current-lang {
        font-weight: 600;
        font-size: 14px;
        color: var(--text-secondary);
        background: var(--bg-secondary);
        padding: 4px 8px;
        border-radius: 6px;
        min-width: 32px;
        text-align: center;
        transition: all 0.2s ease;
      }
      
      .mobile-language-toggle.active .nav-current-lang {
        background: var(--primary);
        color: white;
      }
      
      .mobile-language-toggle::after {
        content: '▼';
        font-size: 10px;
        color: var(--text-secondary);
        transition: transform 0.3s ease, color 0.2s ease;
        position: absolute;
        right: 20px;
      }
      
      .mobile-language-toggle.active::after {
        transform: rotate(180deg);
        color: var(--primary);
      }
      
      .mobile-lang-option {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px 20px;
        background: none;
        border: none;
        width: 100%;
        text-align: left;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
        border-bottom: 1px solid var(--border-light);
        position: relative;
      }
      
      .mobile-lang-option:last-child {
        border-bottom: none;
      }
      
      .mobile-lang-option:hover {
        background: var(--primary-alpha);
        transform: translateX(4px);
      }
      
      .mobile-lang-option.active {
        background: var(--primary-alpha);
        font-weight: 600;
        color: var(--primary);
      }
      
      .mobile-lang-option.active::after {
        content: '✓';
        position: absolute;
        right: 20px;
        color: var(--primary);
        font-weight: bold;
      }
      
      .mobile-lang-option .lang-flag {
        font-size: 20px;
        width: 24px;
        text-align: center;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      }
      
      .mobile-lang-option .lang-name {
        flex: 1;
        color: var(--text-primary);
        font-weight: 500;
        transition: color 0.2s ease;
      }
      
      .mobile-lang-option:hover .lang-name {
        color: var(--primary);
      }
      
      .mobile-lang-option.active .lang-name {
        color: var(--primary);
      }
      
      /* Light Theme Specific Overrides */
      [data-theme="light"] .mobile-language-options {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
        border-color: rgba(0, 0, 0, 0.1);
      }

      [data-theme="light"] .mobile-lang-option {
        border-color: rgba(0, 0, 0, 0.05);
      }

      [data-theme="light"] .mobile-lang-option:hover {
        background: rgba(110, 231, 183, 0.1);
      }

      [data-theme="light"] .mobile-language-toggle:hover {
        background: rgba(0, 0, 0, 0.02);
      }

      [data-theme="light"] .mobile-language-toggle .nav-current-lang {
        background: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.7);
      }

      /* Dark Theme Specific Overrides */
      :root:not([data-theme="light"]) .mobile-language-options {
        background: rgba(26, 26, 26, 0.98) !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        border-color: rgba(255, 255, 255, 0.1);
      }

      :root:not([data-theme="light"]) .mobile-lang-option {
        border-color: rgba(255, 255, 255, 0.05);
      }

      :root:not([data-theme="light"]) .mobile-lang-option:hover {
        background: rgba(110, 231, 183, 0.15);
      }

      :root:not([data-theme="light"]) .mobile-language-toggle:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      :root:not([data-theme="light"]) .mobile-language-toggle .nav-current-lang {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);
      }
    `;
    
    document.head.appendChild(style);
  }

  // Public API methods
  refresh() {
    this.updateCartCount();
    this.updateCurrentLanguage();
  }

  // Force close all dropdowns
  closeAllDropdowns() {
    this.closeLanguageOptions();
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
