// Checkout Management
function initCheckoutEvents() {
  // Initialize wilaya dropdown
  initWilayaDropdown();
  
  // Checkout buttons
  $('#checkout').addEventListener('click', () => { 
    if (Object.keys(state.cart).length === 0) {
      toast(t('cart.empty'), 'error');
      return;
    }
    openDrawer(false); 
    $('#checkoutModal').showModal(); 
  });
  
  $('#checkoutQuick').addEventListener('click', () => { 
    if (Object.keys(state.cart).length === 0) {
      toast(t('cart.empty'), 'error');
      return;
    }
    $('#checkoutModal').showModal(); 
  });

  // Close/Cancel buttons - handle dialog close
  const checkoutModal = $('#checkoutModal');
  if (checkoutModal) {
    // Handle form submission (dialog method="dialog")
    checkoutModal.addEventListener('close', handleDialogClose);
    
    // Handle close/cancel buttons explicitly
    const closeButtons = checkoutModal.querySelectorAll('button[value="cancel"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        checkoutModal.close('cancel');
      });
    });
  }

  // Place order button
  $('#placeOrder').addEventListener('click', handlePlaceOrder);
}

/**
 * Handle dialog close event
 */
function handleDialogClose(e) {
  const dialog = e.target;
  const form = dialog.querySelector('form');
  
  // Clear any error states when dialog closes
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => input.classList.remove('error'));
  }
}

/**
 * Initialize wilaya dropdown with all Algerian wilayas
 */
function initWilayaDropdown() {
  const wilayaSelect = $('#wilayaSelect');
  if (wilayaSelect && typeof populateWilayaSelect === 'function') {
    populateWilayaSelect(wilayaSelect, currentLanguage);
  }
}

/**
 * Update wilaya dropdown when language changes
 */
function updateWilayaDropdownLanguage() {
  const wilayaSelect = $('#wilayaSelect');
  if (wilayaSelect && typeof populateWilayaSelect === 'function') {
    const selectedValue = wilayaSelect.value;
    populateWilayaSelect(wilayaSelect, currentLanguage);
    // Restore selected value if it exists
    if (selectedValue) {
      wilayaSelect.value = selectedValue;
    }
  }
}

function handlePlaceOrder(e) {
  e.preventDefault();
  
  // Get form elements
  const form = e.target.closest('form');
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  // Validate required fields
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('error');
      isValid = false;
    } else {
      input.classList.remove('error');
    }
  });
  
  // Validate email format
  const emailInput = form.querySelector('input[type="email"]');
  if (emailInput && emailInput.value && !emailInput.checkValidity()) {
    emailInput.classList.add('error');
    isValid = false;
  }
  
  // Validate wilaya selection
  const wilayaSelect = form.querySelector('#wilayaSelect');
  if (wilayaSelect && !wilayaSelect.value) {
    wilayaSelect.classList.add('error');
    isValid = false;
  } else if (wilayaSelect) {
    wilayaSelect.classList.remove('error');
  }
  
  if (!isValid) {
    toast(t('checkout.fillRequired'), 'error');
    return;
  }

  // Check if cart is not empty
  if (Object.keys(state.cart).length === 0) {
    toast(t('cart.empty'), 'error');
    return;
  }
  
  // Show loading state
  const btn = e.target;
  const originalText = btn.textContent;
  btn.textContent = t('order.processing');
  btn.disabled = true;
  btn.classList.add('loading');
  
  // Collect form data
  const formData = new FormData(form);
  const checkoutData = {
    fullName: form.querySelector('input[data-i18n="checkout.nameExample"]').value.trim(),
    email: form.querySelector('input[type="email"]').value.trim(),
    phone: form.querySelector('input[type="tel"]').value.trim(),
    wilaya: wilayaSelect.value,
    address: form.querySelector('textarea').value.trim()
  };
  
  // Calculate subtotal
  const subtotal = Object.keys(state.cart).reduce((sum, productId) => {
    const product = products.find(p => p.id === parseInt(productId));
    return sum + (product ? product.price * state.cart[productId] : 0);
  }, 0);
  
  // Simulate processing delay
  setTimeout(() => {
    try {
      // Create order using order manager
      const order = orderManager.createOrder(checkoutData, state.cart, subtotal);
      
      // Close modal and show success
      $('#checkoutModal').close();
      
      // Show order confirmation
      const orderSummary = orderManager.generateOrderSummary(order);
      console.log('Order created:', order);
      console.log('Order summary:', orderSummary);
      
      toast(t('order.created'), 'success');
      
      // Empty cart after successful order
      emptyCart();
      
      // Reset button
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('loading');
      
      // Reset form
      form.reset();
      inputs.forEach(input => input.classList.remove('error'));
      
      // Re-populate wilaya dropdown after reset
      setTimeout(initWilayaDropdown, 100);
      
      // Optional: Show order details modal
      showOrderConfirmation(order);
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast('Error creating order. Please try again.', 'error');
      
      // Reset button
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('loading');
    }
  }, 1500);
}

/**
 * Show order confirmation modal/details
 * @param {Object} order - Created order object
 */
function showOrderConfirmation(order) {
  // You can implement a detailed order confirmation modal here
  // For now, we'll just log the order and show a toast
  console.log('Order confirmation for:', order.orderId);
  
  // Optional: Create and show order confirmation dialog
  // This could include order details, estimated delivery, etc.
}
