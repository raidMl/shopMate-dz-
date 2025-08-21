// Language switcher component
class LanguageSwitcher {
  constructor() {
    this.currentLanguage = getCurrentLanguage();
    this.init();
  }

  init() {
    this.createLanguageSwitcher();
    this.bindEvents();
  }

  createLanguageSwitcher() {
    // Create language switcher dropdown
    const languageContainer = document.createElement('div');
    languageContainer.className = 'language-switcher';
    languageContainer.innerHTML = `
      <button class="language-toggle" aria-label="Change language">
        <span class="language-flag">${languages[this.currentLanguage].flag}</span>
        <span class="language-name">${languages[this.currentLanguage].name}</span>
        <span class="language-arrow">▼</span>
      </button>
      <div class="language-dropdown">
        ${Object.keys(languages).map(langCode => `
          <button class="language-option ${langCode === this.currentLanguage ? 'active' : ''}" 
                  data-lang="${langCode}">
            <span class="language-flag">${languages[langCode].flag}</span>
            <span class="language-name">${languages[langCode].name}</span>
          </button>
        `).join('')}
      </div>
    `;

    // Insert language switcher in the navbar
    const navbar = document.querySelector('.navbar');
    const navActions = navbar.querySelector('.nav-actions');
    navActions.insertBefore(languageContainer, navActions.firstChild);
  }

  bindEvents() {
    const languageToggle = document.querySelector('.language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');

    // Toggle dropdown
    languageToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      languageDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      languageDropdown.classList.remove('show');
    });

    // Handle language selection
    languageOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const langCode = option.getAttribute('data-lang');
        this.changeLanguage(langCode);
        languageDropdown.classList.remove('show');
      });
    });

    // Keyboard navigation
    languageToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        languageDropdown.classList.toggle('show');
      }
    });

    languageOptions.forEach(option => {
      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const langCode = option.getAttribute('data-lang');
          this.changeLanguage(langCode);
          languageDropdown.classList.remove('show');
        }
      });
    });
  }

  changeLanguage(langCode) {
    if (langCode === this.currentLanguage) return;

    this.currentLanguage = langCode;
    setLanguage(langCode);

    // Update the toggle button
    const languageToggle = document.querySelector('.language-toggle');
    const flag = languageToggle.querySelector('.language-flag');
    const name = languageToggle.querySelector('.language-name');
    
    flag.textContent = languages[langCode].flag;
    name.textContent = languages[langCode].name;

    // Update active state in dropdown
    document.querySelectorAll('.language-option').forEach(option => {
      option.classList.toggle('active', option.getAttribute('data-lang') === langCode);
    });

    // Update page content
    this.updatePageContent();
  }

  updatePageContent() {
    // Force re-render of dynamic content
    setTimeout(() => {
      // Update products grid
      if (typeof renderProducts === 'function') {
        renderProducts();
      }
      
      // Update cart
      if (typeof updateCartUI === 'function') {
        updateCartUI();
      }
      
      // Update wilaya dropdown language
      if (typeof updateWilayaDropdownLanguage === 'function') {
        updateWilayaDropdownLanguage();
      }
      
      // Update any open modals
      this.updateModals();
    }, 50);
  }

  updateModals() {
    // Update variant selection modal if open
    const variantModal = document.querySelector('#variantModal');
    if (variantModal && variantModal.open) {
      const productId = variantModal.getAttribute('data-product-id');
      if (productId && typeof openVariantSelection === 'function') {
        // Re-open with updated translations
        variantModal.close();
        setTimeout(() => openVariantSelection(productId), 100);
      }
    }

    // Update checkout modal if open
    const checkoutModal = document.querySelector('#checkoutModal');
    if (checkoutModal && checkoutModal.open) {
      if (typeof openCheckout === 'function') {
        // Re-open with updated translations
        checkoutModal.close();
        setTimeout(() => openCheckout(), 100);
      }
    }
  }
}

// Utility function to format currency based on language
function formatCurrency(amount, currency = 'USD') {
  const languageMap = {
    'en': 'en-US',
    'ar': 'ar-SA',
    'fr': 'fr-FR'
  };
  
  const locale = languageMap[getCurrentLanguage()] || 'en-US';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

// Utility function to format numbers based on language
function formatNumber(number) {
  const languageMap = {
    'en': 'en-US',
    'ar': 'ar-SA', 
    'fr': 'fr-FR'
  };
  
  const locale = languageMap[getCurrentLanguage()] || 'en-US';
  
  return new Intl.NumberFormat(locale).format(number);
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LanguageSwitcher();
});
