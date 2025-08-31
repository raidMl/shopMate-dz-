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
  const checkoutData = {
    fullName: form.querySelector('input[data-i18n="checkout.nameExample"]').value.trim(),
    email: form.querySelector('input[type="email"]').value.trim(),
    phone: form.querySelector('input[type="tel"]').value.trim(),
    wilaya: wilayaSelect.value,
    address: form.querySelector('textarea').value.trim()
  };
  
  // Prepare order data for API
  const orderProducts = Object.keys(state.cart).map(cartKey => {
    // Extract actual product ID from cart key (handle variants)
    const productId = cartKey.split('-')[0]; // Get the base product ID
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      console.error(`Product not found for ID: ${productId}`);
      return null;
    }
    
    // Get variant info if it exists
    let selectedColor = null;
    let selectedSize = null;
    
    if (state.cartVariants && state.cartVariants[cartKey]) {
      selectedColor = state.cartVariants[cartKey].color;
      selectedSize = state.cartVariants[cartKey].size;
    }
    
    return {
      product: productId, // Use actual product ID, not the variant key
      quantity: state.cart[cartKey],
      selectedColor: selectedColor,
      selectedSize: selectedSize
    };
  }).filter(Boolean); // Remove any null entries
  
  // Calculate subtotal using actual product IDs
  const subtotal = Object.keys(state.cart).reduce((sum, cartKey) => {
    const productId = cartKey.split('-')[0];
    const product = products.find(p => p.id === productId);
    return sum + (product ? product.price * state.cart[cartKey] : 0);
  }, 0);
  
  const orderData = {
    customerInfo: checkoutData,
    products: orderProducts,
    totalPrice: subtotal
  };
  
  // Make API call to create order
  createOrder(orderData)
    .then(order => {
      // Close modal and show success
      $('#checkoutModal').close();
      
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
      
      // Show order confirmation
      showOrderConfirmation(order);
      
    })
    .catch(error => {
      console.error('Error creating order:', error);
      toast('Error creating order. Please try again.', 'error');
      
      // Reset button
      btn.textContent = originalText;
      btn.disabled = false;
      btn.classList.remove('loading');
    });
}

/**
 * Create order via API
 * @param {Object} orderData - Order data including customer info and products
 * @returns {Promise} - Promise resolving to created order
 */
async function createOrder(orderData) {
  const API_BASE_URL = 'http://localhost:5000/api';
  
  try {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add auth token if available (for registered users)
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    const order = await response.json();
    console.log('Order created successfully:', order);
    return order;
    
  } catch (error) {
    console.error('API Error creating order:', error);
    throw error;
  }
}

/**
 * Show order confirmation modal/details
 * @param {Object} order - Created order object
 */
function showOrderConfirmation(order) {
  // Create order confirmation modal
  const modal = document.createElement('dialog');
  modal.className = 'order-confirmation-modal';
  
  // Calculate order details
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString(getCurrentLanguage() === 'ar' ? 'ar-DZ' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const itemCount = order.products ? order.products.reduce((total, item) => total + item.quantity, 0) : 0;
  
  modal.innerHTML = `
    <div class="order-confirmation-content">
      <div class="order-confirmation-header">
        <div class="success-animation">
          <div class="checkmark-circle">
            <div class="checkmark">✓</div>
          </div>
        </div>
        <h2>${t('order.confirmationTitle') || 'Order Confirmed!'}</h2>
        <p class="order-confirmation-subtitle">${t('order.confirmationSubtitle') || 'Thank you for your purchase. Your order has been successfully placed.'}</p>
        <button class="btn ghost close-confirmation" aria-label="Close">×</button>
      </div>
      
      <div class="order-confirmation-body">
        <div class="order-summary-card">
          <div class="order-summary-header">
            <h3>${t('order.summary') || 'Order Summary'}</h3>
            <div class="order-id-badge">
              <span class="order-id-label">${t('order.id') || 'Order ID'}:</span>
              <span class="order-id-value">#${order._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
          
          <div class="order-details-grid">
            <div class="order-detail-item">
              <div class="detail-icon">📅</div>
              <div class="detail-content">
                <span class="detail-label">${t('order.date') || 'Order Date'}</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
            </div>
            
            <div class="order-detail-item">
              <div class="detail-icon">📦</div>
              <div class="detail-content">
                <span class="detail-label">${t('order.items') || 'Items'}</span>
                <span class="detail-value">${itemCount} ${itemCount === 1 ? t('order.item') || 'item' : t('order.items') || 'items'}</span>
              </div>
            </div>
            
            <div class="order-detail-item">
              <div class="detail-icon">💰</div>
              <div class="detail-content">
                <span class="detail-label">${t('order.total') || 'Total Amount'}</span>
                <span class="detail-value total-amount">${money(order.totalPrice)}</span>
              </div>
            </div>
            
            <div class="order-detail-item">
              <div class="detail-icon">📍</div>
              <div class="detail-content">
                <span class="detail-label">${t('order.deliveryTo') || 'Delivery To'}</span>
                <span class="detail-value">${order.customerInfo.wilaya}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="customer-info-card">
          <h4>${t('order.customerInfo') || 'Customer Information'}</h4>
          <div class="customer-details">
            <div class="customer-detail">
              <span class="customer-label">${t('customer.name') || 'Name'}:</span>
              <span class="customer-value">${order.customerInfo.fullName}</span>
            </div>
            <div class="customer-detail">
              <span class="customer-label">${t('customer.email') || 'Email'}:</span>
              <span class="customer-value">${order.customerInfo.email}</span>
            </div>
            <div class="customer-detail">
              <span class="customer-label">${t('customer.phone') || 'Phone'}:</span>
              <span class="customer-value">${order.customerInfo.phone}</span>
            </div>
            <div class="customer-detail">
              <span class="customer-label">${t('customer.address') || 'Address'}:</span>
              <span class="customer-value">${order.customerInfo.address}, ${order.customerInfo.wilaya}</span>
            </div>
          </div>
        </div>
        
        ${order.qrCode ? `
          <div class="qr-code-card">
            <h4>${t('order.qrCode') || 'Order QR Code'}</h4>
            <div class="qr-code-container">
              <img src="${order.qrCode}" alt="Order QR Code" class="qr-code-image">
              <p class="qr-code-description">${t('order.qrCodeDescription') || 'Show this QR code for order verification'}</p>
            </div>
          </div>
        ` : ''}
        
        ${order.isGuestOrder ? `
          <div class="guest-order-notice">
            <div class="notice-icon">ℹ️</div>
            <div class="notice-content">
              <strong>${t('order.guestOrderNotice') || 'Guest Order'}</strong>
              <p>${t('order.guestOrderDescription') || 'Please save this information for order tracking. You can contact us with your order ID for updates.'}</p>
            </div>
          </div>
        ` : ''}
      </div>
      
      <div class="order-confirmation-footer">
        <div class="action-buttons">
          <button class="btn secondary" onclick="window.print()">
            <span class="btn-icon">🖨️</span>
            ${t('order.print') || 'Print Order'}
          </button>
          <button class="btn" onclick="copyOrderDetails('${order._id}')">
            <span class="btn-icon">📋</span>
            ${t('order.copyDetails') || 'Copy Details'}
          </button>
        </div>
        <button class="btn primary close-confirmation">
          ${t('order.close') || 'Continue Shopping'}
        </button>
      </div>
    </div>
  `;
  
  // Add event listeners
  modal.querySelectorAll('.close-confirmation').forEach(btn => {
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
  
  // Add to DOM and show
  document.body.appendChild(modal);
  modal.showModal();
  
  // Add animation class after modal is shown
  setTimeout(() => {
    modal.querySelector('.success-animation').classList.add('animate');
  }, 100);
}

// Copy order details to clipboard
function copyOrderDetails(orderId) {
  const orderDetails = `
Order ID: #${orderId.slice(-8).toUpperCase()}
Date: ${new Date().toLocaleDateString()}
Thank you for your order!
  `.trim();
  
  navigator.clipboard.writeText(orderDetails).then(() => {
    toast(t('order.copiedToClipboard') || 'Order details copied to clipboard!', 'success');
  }).catch(() => {
    toast(t('order.copyFailed') || 'Failed to copy order details', 'error');
  });
}
