// Checkout Management
function initCheckoutEvents() {
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

  // Place order button
  $('#placeOrder').addEventListener('click', handlePlaceOrder);
}

function handlePlaceOrder(e) {
  e.preventDefault();
  
  // Get form elements
  const form = e.target.closest('form');
  const inputs = form.querySelectorAll('input[required]');
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
  
  if (!isValid) {
    toast('Please fill in all required fields correctly', 'error');
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
  }, 1500);
}
