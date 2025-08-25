// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggle();
  }

  applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      this.updateToggleIcon('☀️');
    } else {
      document.documentElement.removeAttribute('data-theme');
      this.updateToggleIcon('🌙');
    }
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
  }

  updateToggleIcon(icon) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
      themeIcon.textContent = icon;
    }
  }

  toggle() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    
    // Use translation if available, fallback to English
    const message = typeof t === 'function' ? 
      t('message.themeChanged', {theme: t(`theme.${newTheme}`)}) : 
      `Switched to ${newTheme} mode`;
    toast(message, 'success');
  }

  setupToggle() {
    const toggleButton = document.getElementById('themeToggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', () => this.toggle());
    }
  }
}

// Contact Form Management
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Add loading state
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      toast('Thank you! Your message has been sent successfully.', 'success');
      this.form.reset();
      
    } catch (error) {
      toast('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
    }
  }
}

// Footer Navigation
class FooterNavigation {
  constructor() {
    this.init();
  }

  init() {
    // Handle category clicks in footer
    const categoryLinks = document.querySelectorAll('footer [data-category]');
    categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.getAttribute('data-category');
        this.filterByCategory(category);
        this.scrollToProducts();
      });
    });

    // Handle contact link
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    contactLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToContact();
      });
    });
  }

  filterByCategory(category) {
    // Update state and trigger filter
    state.category = category.toLowerCase();
    updateFilters();
    renderProducts();
    
    // Update UI
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
      categorySelect.value = category.toLowerCase();
    }
    
    toast(`Showing ${category} products`, 'success');
  }

  scrollToProducts() {
    const productsSection = document.getElementById('grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

// Smooth scroll for internal links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Initialize theme and contact functionality
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new ContactForm();
  new FooterNavigation();
  initSmoothScroll();
});
