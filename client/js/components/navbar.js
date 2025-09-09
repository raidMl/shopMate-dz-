// Mobile Navbar Drawer Management
class MobileNavbar {
  constructor() {
    this.isOpen = false;
    this.drawer = document.getElementById('mobileDrawer');
    this.backdrop = document.getElementById('mobileDrawerBackdrop');
    this.toggle = document.getElementById('mobileMenuToggle');
    this.closeBtn = document.getElementById('mobileCloseBtn');
    this.cartCount = document.getElementById('mobileCartCount');
    this.themeIcon = document.getElementById('mobileThemeIcon');
    this.currentLang = document.getElementById('mobileCurrentLang');
    this.languageToggle = document.getElementById('mobileLanguageToggle');
    this.languageOptions = document.getElementById('mobileLanguageOptions');
    
    this.init();
  }

  init() {
    if (!this.drawer || !this.toggle) return;
    
    console.log('Initializing mobile navbar drawer');
    
    // Bind events
    this.toggle.addEventListener('click', () => this.toggleDrawer());
    this.closeBtn?.addEventListener('click', () => this.closeDrawer());
    this.backdrop?.addEventListener('click', () => this.closeDrawer());
    
    // Mobile navigation items
    document.getElementById('mobileCartBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeDrawer();
      setTimeout(() => {
        if (typeof openDrawer === 'function') {
          openDrawer(true);
        }
      }, 300);
    });
    
    document.getElementById('mobileCheckoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.closeDrawer();
      setTimeout(() => {
        if (typeof proceedToCheckout === 'function') {
          proceedToCheckout();
        }
      }, 300);
    });
    
    // Theme toggle - use the global theme manager
    document.getElementById('mobileThemeToggle')?.addEventListener('click', (e) => {
      e.preventDefault();
      // Access the global theme manager instance
      if (window.themeManager) {
        window.themeManager.toggle();
      } else {
        // Fallback if theme manager not available
        this.toggleTheme();
      }
    });
    
    // Language switcher events
    this.languageToggle?.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleLanguageOptions();
    });
    
    // Language option clicks
    document.querySelectorAll('.mobile-lang-option').forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        this.changeLanguage(lang);
      });
    });
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeDrawer();
      }
    });
    
    // Update cart count when it changes
    this.updateCartCount();
    this.updateCurrentLanguage();
    
    // Listen for cart updates
    document.addEventListener('cartUpdated', () => {
      this.updateCartCount();
    });
    
    // Listen for language changes from the main language switcher
    document.addEventListener('languageChanged', () => {
      this.updateCurrentLanguage();
    });
    
    // Listen for changes on the main language switcher
    const mainLanguageSwitcher = document.getElementById('languageSelect');
    if (mainLanguageSwitcher) {
      mainLanguageSwitcher.addEventListener('change', () => {
        this.updateCurrentLanguage();
      });
    }
    
    // Update on initialization
    setTimeout(() => {
      this.updateCurrentLanguage();
    }, 100);
  }

  toggleDrawer() {
    console.log('Toggle drawer clicked, isOpen:', this.isOpen);
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    console.log('Opening mobile drawer');
    this.isOpen = true;
    this.drawer.classList.add('open');
    this.backdrop.classList.add('open');
    this.toggle.classList.add('open');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Add stagger animation to nav items
    const navItems = this.drawer.querySelectorAll('.mobile-nav-item');
    navItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => {
        item.style.transition = 'all 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      }, 100 + (index * 50));
    });
  }

  closeDrawer() {
    console.log('Closing mobile drawer');
    this.isOpen = false;
    this.drawer.classList.remove('open');
    this.backdrop.classList.remove('open');
    this.toggle.classList.remove('open');
    
    // Close language options too
    this.languageOptions?.classList.remove('open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Reset nav item animations
    const navItems = this.drawer.querySelectorAll('.mobile-nav-item');
    navItems.forEach(item => {
      item.style.transition = '';
      item.style.opacity = '';
      item.style.transform = '';
    });
  }

  toggleLanguageOptions() {
    if (this.languageOptions) {
      this.languageOptions.classList.toggle('open');
    }
  }

  changeLanguage(lang) {
    // Use the existing language switcher functionality
    if (typeof setLanguage === 'function') {
      setLanguage(lang);
    } else if (typeof changeLanguage === 'function') {
      changeLanguage(lang);
    } else {
      // Fallback: trigger the existing language switcher
      const languageSwitcher = document.getElementById('languageSelect');
      if (languageSwitcher) {
        languageSwitcher.value = lang;
        languageSwitcher.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    
    this.languageOptions?.classList.remove('open');
    this.updateCurrentLanguage();
    
    // Update active state
    document.querySelectorAll('.mobile-lang-option').forEach(option => {
      option.classList.remove('active');
      if (option.getAttribute('data-lang') === lang) {
        option.classList.add('active');
      }
    });
    
    // Close the mobile drawer after language change
    setTimeout(() => {
      this.closeDrawer();
    }, 500);
  }

  updateCurrentLanguage() {
    if (this.currentLang) {
      // Get current language from the existing system
      let currentLanguage = 'en';
      
      // Try different ways to get current language
      if (typeof getCurrentLanguage === 'function') {
        currentLanguage = getCurrentLanguage();
      } else if (window.currentLanguage) {
        currentLanguage = window.currentLanguage;
      } else if (localStorage.getItem('language')) {
        currentLanguage = localStorage.getItem('language');
      } else {
        // Check the main language switcher value
        const languageSwitcher = document.getElementById('languageSelect');
        if (languageSwitcher) {
          currentLanguage = languageSwitcher.value || 'en';
        }
      }
      
      const langMap = {
        'en': 'EN',
        'ar': 'ع',
        'fr': 'FR'
      };
      this.currentLang.textContent = langMap[currentLanguage] || 'EN';
    }
    
    // Update active state for language options
    document.querySelectorAll('.mobile-lang-option').forEach(option => {
      option.classList.remove('active');
      const optionLang = option.getAttribute('data-lang');
      let currentLang = 'en';
      
      if (typeof getCurrentLanguage === 'function') {
        currentLang = getCurrentLanguage();
      } else if (window.currentLanguage) {
        currentLang = window.currentLanguage;
      } else if (localStorage.getItem('language')) {
        currentLang = localStorage.getItem('language');
      }
      
      if (optionLang === currentLang) {
        option.classList.add('active');
      }
    });
  }

  updateCartCount() {
    if (this.cartCount && typeof state !== 'undefined' && state.cart) {
      const count = Object.values(state.cart).reduce((s, n) => s + n, 0);
      this.cartCount.textContent = count;
      
      // Add pulse animation when count changes
      this.cartCount.style.transform = 'scale(1.2)';
      setTimeout(() => {
        this.cartCount.style.transform = 'scale(1)';
      }, 200);
    }
  }

  updateThemeIcon(icon) {
    if (this.themeIcon) {
      this.themeIcon.textContent = icon;
    }
  }

  // Fallback theme toggle if theme manager not available
  toggleTheme() {
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
}

// Initialize mobile navbar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing mobile navbar');
  window.mobileNavbar = new MobileNavbar();
});

// Export for use in other components
window.MobileNavbar = MobileNavbar;
