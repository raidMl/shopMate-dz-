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
    this.apiUrl = 'http://localhost:5000/api/contact'; // Backend API endpoint
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
    const inputs = this.form.querySelectorAll('input, textarea');
    
    // Get form data
    const data = {
      name: formData.get('name') || inputs[0].value,
      mail: formData.get('email') || inputs[1].value,
      subject: formData.get('subject') || inputs[2].value,
      msgContent: formData.get('message') || inputs[3].value
    };
    
    // Validate required fields
    if (!data.name || !data.mail || !data.subject || !data.msgContent) {
      toast('Please fill in all required fields.', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.mail)) {
      toast('Please enter a valid email address.', 'error');
      return;
    }
    
    // Add loading state
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = t('contact.sending') || 'Sending...';
    submitButton.disabled = true;
    submitButton.classList.add('loading');
    
    // Disable form inputs
    inputs.forEach(input => input.disabled = true);
    
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Show success message
        toast(t('contact.success') || 'Thank you! Your message has been sent successfully.', 'success');
        this.form.reset();
        
        // Optional: Show confirmation modal
        this.showSuccessModal(data);
        
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Contact form error:', error);
      toast(t('contact.error') || 'Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button and form state
      submitButton.textContent = originalText;
      submitButton.disabled = false;
      submitButton.classList.remove('loading');
      
      // Re-enable form inputs
      inputs.forEach(input => input.disabled = false);
    }
  }
  
  showSuccessModal(data) {
    const modal = document.createElement('dialog');
    modal.className = 'contact-success-modal';
    
    modal.innerHTML = `
      <div class="success-modal-content">
        <div class="success-header">
          <div class="success-icon">✅</div>
          <h3>${t('contact.successTitle') || 'Message Sent!'}</h3>
          <button class="btn ghost close-success">×</button>
        </div>
        <div class="success-body">
          <p>${t('contact.successMessage') || 'Thank you for contacting us! We have received your message and will get back to you soon.'}</p>
          <div class="message-summary">
            <h4>${t('contact.messageSummary') || 'Message Summary:'}</h4>
            <div class="summary-item">
              <span class="summary-label">${t('contact.yourName') || 'Name'}:</span>
              <span class="summary-value">${data.name}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">${t('contact.yourEmail') || 'Email'}:</span>
              <span class="summary-value">${data.mail}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">${t('contact.subject') || 'Subject'}:</span>
              <span class="summary-value">${data.subject}</span>
            </div>
          </div>
          <p class="response-time">${t('contact.responseTime') || 'We typically respond within 24 hours during business days.'}</p>
        </div>
        <div class="success-footer">
          <button class="btn close-success">${t('contact.close') || 'Close'}</button>
        </div>
      </div>
    `;
    
    // Add event listeners
    modal.querySelectorAll('.close-success').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.close();
        modal.remove();
      });
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.close();
        modal.remove();
      }
    });
    
    document.body.appendChild(modal);
    modal.showModal();
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
