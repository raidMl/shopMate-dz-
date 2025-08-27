// Main Application Entry Point

// Theme initialization function
function initTheme() {
  // Theme is handled by ThemeManager class in theme-contact.js
  console.log('Theme initialization handled by ThemeManager class');
}

// Populate wilaya dropdown
function populateWilayaDropdown() {
  const wilayaSelect = document.getElementById('wilayaSelect');
  if (!wilayaSelect || typeof wilayas === 'undefined') return;
  
  wilayas.forEach(wilaya => {
    const option = document.createElement('option');
    option.value = wilaya.code;
    option.textContent = `${wilaya.code} - ${wilaya.name}`;
    wilayaSelect.appendChild(option);
  });
}

// Initialize filters
function initFilters() {
  console.log('Filters initialization');
}

// Initialize favorites
function initFavorites() {
  console.log('Favorites initialization');
}

// Update favorites count
function updateFavoritesCount() {
  const favCount = document.getElementById('favoritesCount');
  if (favCount && typeof state !== 'undefined' && state.favorites) {
    favCount.textContent = state.favorites.length;
  }
}

// Initialize event listeners
function initEventListeners() {
  if (typeof initFilterEvents === 'function') initFilterEvents();
  if (typeof initCartEvents === 'function') initCartEvents();
  if (typeof initCheckoutEvents === 'function') initCheckoutEvents();
  initKeyboardShortcuts();
}

// Show loading state
function showLoadingState() {
  const grid = document.getElementById('grid');
  if (grid) {
    grid.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    `;
  }
}

// Hide loading state
function hideLoadingState() {
  const loadingState = document.querySelector('.loading-state');
  if (loadingState) {
    loadingState.remove();
  }
}

// Enhanced toast function with error type
function showToast(message, type = 'success') {
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  
  toastEl.textContent = message;
  toastEl.className = `toast ${type}`;
  toastEl.style.display = 'block';
  
  setTimeout(() => {
    toastEl.style.display = 'none';
  }, 3000);
}

// Application initialization
async function initApp() {
  try {
    // Show loading state
    showLoadingState();
    
    // Initialize products from API
    await initializeProducts();
    
    // Initialize other components
    initTheme();
    
    // Setup language switcher (ensure it's defined before calling)
    if (typeof setupLanguageSwitcher === 'function') {
      setupLanguageSwitcher();
    } else {
      console.warn('setupLanguageSwitcher function not found');
    }
    
    if (typeof populateWilayaDropdown === 'function') {
      populateWilayaDropdown();
    }
    
    initFilters();
    initFavorites();
    
    // Initialize event listeners
    initEventListeners();
    
    // Render initial state
    renderProducts();
    if (typeof updateCartUI === 'function') updateCartUI();
    updateFavoritesCount();
    
    // Hide loading state
    hideLoadingState();
    
    console.log('App initialized successfully');
  } catch (error) {
    console.error('Error initializing app:', error);
    hideLoadingState();
    showToast('Failed to initialize app. Please refresh the page.', 'error');
  }
}

// Keyboard shortcuts
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Escape key to close modals and drawer
    if (e.key === 'Escape') {
      const checkoutModal = $('#checkoutModal');
      if (checkoutModal.open) {
        checkoutModal.close();
      }
      
      // Close product preview modals
      const previewModals = document.querySelectorAll('.product-preview-modal');
      previewModals.forEach(modal => {
        modal.close();
        modal.remove();
      });
      
      openDrawer(false);
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      $('#search').focus();
    }
    
    // Ctrl/Cmd + Enter in checkout form to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      const checkoutModal = $('#checkoutModal');
      if (checkoutModal.open) {
        e.preventDefault();
        $('#placeOrder').click();
      }
    }
  });
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
