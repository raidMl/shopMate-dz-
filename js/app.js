// Main Application Entry Point

// Initialize app after products are loaded
function initializeApp() {
  // Initialize all components
  initFilters();
  initFavorites();
  
  // Render initial state
  renderProducts();
  updateCartUI();
  
  // Initialize event listeners
  initFilterEvents();
  initCartEvents();
  initCheckoutEvents();
  initKeyboardShortcuts();
}

// Fallback initialization if products load synchronously
document.addEventListener('DOMContentLoaded', function() {
  // Check if products are already loaded
  if (products.length > 0) {
    initializeApp();
  }
  // Otherwise, initializeApp will be called from loadProducts()
});

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

// Global render function (backward compatibility)
function render() {
  renderProducts();
}
