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
  
  // Show loading state
  const btn = e.target;
  const originalText = btn.textContent;
  btn.textContent = t('contact.sending');
  btn.disabled = true;
  btn.classList.add('loading');
  
  // Simulate processing delay
  setTimeout(() => {
    $('#checkoutModal').close();
    toast(t('message.orderPlaced'), 'success');
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
  }, 1500);
}
