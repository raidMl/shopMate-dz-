// Cart Management Functions
function openDrawer(open = true) {
  $('#drawer').classList.toggle('open', open);
  $('#drawer').setAttribute('aria-hidden', !open);
  $('#backdrop').style.display = open ? 'block' : 'none';
}

function addToCart(id, qty = 1) {
  const prod = products.find(p => p.id === id);
  if (!prod || prod.stock === 0) return;
  
  const currentQty = state.cart[id] || 0;
  const newQty = currentQty + qty;
  
  // Check if we can add the requested quantity
  if (newQty > prod.stock) {
    toast(t('message.cantAdd') + ` ${qty} - ` + t('message.onlyAvailable', {count: prod.stock - currentQty}), 'error');
    return;
  }
  
  state.cart[id] = newQty;
  saveCart();
  updateCartUI();
  renderProducts(); // Re-render to update button states
  toast(t('message.addedToCart') + ` (${newQty}/${prod.stock})`, 'success');
}

function addToCartWithVariant(productId, variantKey, variantInfo) {
  const product = products.find(p => p.id === productId);
  if (!product || product.stock === 0) return;
  
  const currentQty = state.cart[variantKey] || 0;
  const newQty = currentQty + 1;
  
  // Check stock availability
  if (newQty > product.stock) {
    toast(`Can't add more - only ${product.stock - currentQty} more available`, 'error');
    return;
  }
  
  state.cart[variantKey] = newQty;
  
  // Store variant information separately
  if (!state.cartVariants) {
    state.cartVariants = {};
  }
  state.cartVariants[variantKey] = variantInfo;
  
  saveCart();
  updateCartUI();
  renderProducts();
  
  const variantText = [variantInfo.color, variantInfo.size].filter(Boolean).join(', ');
  toast(`Added ${product.name} ${variantText ? `(${variantText})` : ''} to cart!`, 'success');
}

function removeFromCart(key) { 
  delete state.cart[key];
  if (state.cartVariants?.[key]) {
    delete state.cartVariants[key];
  }
  saveCart(); 
  updateCartUI(); 
  renderProducts(); // Re-render to update button states
}

function changeQty(cartKey, delta) { 
  // Extract product ID from cart key (handle variants)
  const productId = cartKey.split('-')[0];
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  const newQty = Math.max(1, (state.cart[cartKey] || 1) + delta);
  
  if (newQty > prod.stock) {
    toast(t('message.maxQuantity', {max: prod.stock}), 'error');
    return;
  }
  
  state.cart[cartKey] = newQty; 
  saveCart(); 
  updateCartUI(); 
}

function changeQtyVariant(cartKey, delta) {
  const variantInfo = state.cartVariants?.[cartKey];
  const productId = cartKey.split('-')[0]; // Extract product ID from cart key
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  const newQty = Math.max(1, (state.cart[cartKey] || 1) + delta);
  
  // Check variant stock limits
  let maxStock = prod.stock;
  if (variantInfo?.color && prod.colors) {
    const colorOption = prod.colors.find(c => c.name === variantInfo.color);
    if (colorOption) maxStock = Math.min(maxStock, colorOption.stock);
  }
  if (variantInfo?.size && prod.sizes) {
    const sizeOption = prod.sizes.find(s => s.name === variantInfo.size);
    if (sizeOption) maxStock = Math.min(maxStock, sizeOption.stock);
  }
  
  if (newQty > maxStock) {
    toast(`Maximum quantity is ${maxStock} for this variant`, 'error');
    return;
  }
  
  state.cart[cartKey] = newQty;
  saveCart();
  updateCartUI();
}

function emptyCart() { 
  state.cart = {}; 
  saveCart(); 
  updateCartUI(); 
  renderProducts(); // Re-render to update button states
}

function saveCart() { 
  saveToLocalStorage('cart', state.cart);
  saveToLocalStorage('cartVariants', state.cartVariants || {});
}

function cartItems() {
  return Object.entries(state.cart).map(([cartKey, qty]) => {
    const productId = cartKey.split('-')[0]; // Extract base product ID
    const product = products.find(p => p.id === productId);
    
    // Get variant info if available
    let variantInfo = null;
    if (state.cartVariants && state.cartVariants[cartKey]) {
      variantInfo = state.cartVariants[cartKey];
    }
    
    return { 
      cartKey: cartKey,
      product: product, 
      qty: qty,
      variant: variantInfo
    };
  }).filter(item => item.product); // Remove items where product wasn't found
}

function cartSubtotal() {
  return cartItems().reduce((sum, item) => sum + item.product.price * item.qty, 0);
}

function updateCartUI() {
  const count = Object.values(state.cart).reduce((s, n) => s + n, 0);
  const subtotal = cartSubtotal();
  
  // Update cart count with animation
  const cartCountEl = $('#cartCount');
  cartCountEl.textContent = count;
  cartCountEl.classList.add('updated');
  setTimeout(() => cartCountEl.classList.remove('updated'), 400);

  const body = $('#cartBody');
  body.innerHTML = '';
  
  if (count === 0) {
    body.innerHTML = `
      <div class="cart-empty-state">
        <div class="empty-icon">🛒</div>
        <h3>${t('cart.empty')}</h3>
        <p class="muted">${t('cart.emptySubtext') || 'Add some amazing products to get started!'}</p>
        <button class="btn secondary" onclick="openDrawer(false)">${t('cart.continueShopping') || 'Continue Shopping'}</button>
      </div>`;
    return;
  }

  // Create cart header with item count
  const cartHeader = document.createElement('div');
  cartHeader.className = 'cart-header-info';
  cartHeader.innerHTML = `
    <div class="cart-summary">
      <span class="cart-item-count">${count} ${count === 1 ? 'item' : 'items'}</span>
      <span class="cart-total-price">${money(subtotal)}</span>
    </div>
  `;
  body.appendChild(cartHeader);

  // Create cart items container
  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'cart-items-container';

  cartItems().forEach(({ cartKey, product: p, qty, variant }) => {
    const row = document.createElement('div');
    row.className = 'cart-item enhanced';
    
    // Create variant display text
    const variantText = variant ? 
      [variant.color, variant.size].filter(Boolean).join(' • ') : '';
    
    // Calculate item total and savings
    const itemTotal = p.price * qty;
    const hasDiscount = p.discount && p.discount > 0;
    const savings = hasDiscount ? (p.originalPrice - p.price) * qty : 0;
    
    row.innerHTML = `
      <div class="item-image">
        <img alt="${p.name}" src="${p.image || imageFor(p.hue, p.name)}" />
        ${hasDiscount ? `<div class="item-discount-badge">${p.discount}%</div>` : ''}
      </div>
      <div class="item-details">
        <div class="item-header">
          <h4 class="item-name">${p.name}</h4>
          <button class="item-remove" data-del="${cartKey}" aria-label="Remove ${p.name}">
            ×
          </button>
        </div>
        ${variantText ? `<div class="item-variant">${variantText}</div>` : ''}
        <div class="item-category">${getCategoryName(p.category)}</div>
        <div class="item-price-info">
          ${hasDiscount ? `
            <span class="item-original-price">${money(p.originalPrice)}</span>
            <span class="item-current-price">${money(p.price)}</span>
          ` : `
            <span class="item-current-price">${money(p.price)}</span>
          `}
          <span class="item-unit-label">${t('cart.each')}</span>
        </div>
        <div class="item-controls">
          <div class="quantity-controls">
            <button class="qty-btn minus" data-dec="${cartKey}" aria-label="Decrease quantity" ${qty <= 1 ? 'disabled' : ''}>
              <svg width="12" height="2" viewBox="0 0 12 2" fill="currentColor">
                <rect width="12" height="2"/>
              </svg>
            </button>
            <span class="qty-number">${qty}</span>
            <button class="qty-btn plus" data-inc="${cartKey}" aria-label="Increase quantity" ${qty >= p.stock ? 'disabled' : ''}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="5" y="0" width="2" height="12"/>
                <rect x="0" y="5" width="12" height="2"/>
              </svg>
            </button>
          </div>
          <div class="item-total">
            <div class="item-total-price">${money(itemTotal)}</div>
            ${savings > 0 ? `<div class="item-savings">Save ${money(savings)}</div>` : ''}
          </div>
        </div>
        ${qty >= p.stock ? `<div class="stock-warning">Maximum quantity reached</div>` : ''}
      </div>`;

    // Add event listeners with better UX feedback
    const decBtn = row.querySelector('[data-dec]');
    const incBtn = row.querySelector('[data-inc]');
    const delBtn = row.querySelector('[data-del]');
    
    decBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (qty > 1) {
        changeQty(cartKey, -1);
        decBtn.classList.add('clicked');
        setTimeout(() => decBtn.classList.remove('clicked'), 150);
      }
    });
    
    incBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (qty < p.stock) {
        changeQty(cartKey, 1);
        incBtn.classList.add('clicked');
        setTimeout(() => incBtn.classList.remove('clicked'), 150);
      }
    });
    
    delBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      // Add confirmation for expensive items
      if (itemTotal > 10000) {
        if (confirm(`Remove ${p.name} (${money(itemTotal)}) from cart?`)) {
          removeFromCart(cartKey);
        }
      } else {
        removeFromCart(cartKey);
      }
    });

    itemsContainer.appendChild(row);
  });

  body.appendChild(itemsContainer);

  // Create cart footer with totals and checkout
  // const cartFooter = document.createElement('div');
  // cartFooter.className = 'cart-footer-enhanced';
  
  const totalSavings = cartItems().reduce((total, item) => {
    if (item.product.discount && item.product.discount > 0) {
      return total + (item.product.originalPrice - item.product.price) * item.qty;
    }
    return total;
  }, 0);

  // cartFooter.innerHTML = `
  //   <div class="cart-totals">
  //     ${totalSavings > 0 ? `
  //       <div class="cart-savings">
  //         <span>You're saving</span>
  //         <span class="savings-amount">${money(totalSavings)}</span>
  //       </div>
  //     ` : ''}
  //     <div class="cart-subtotal">
  //       <span>${t('cart.subtotal')}</span>
  //       <strong class="subtotal-amount">${money(subtotal)}</strong>
  //     </div>
  //   </div>
  //   <div class="cart-actions">
  //     <button class="btn checkout-btn" onclick="proceedToCheckout()">
  //       <span class="checkout-icon">🛒</span>
  //       <span>${t('cart.checkout')} • ${money(subtotal)}</span>
  //     </button>
  //     <div class="cart-secondary-actions">
  //       <button class="btn ghost small" onclick="openDrawer(false)">${t('cart.continueShopping') || 'Continue Shopping'}</button>
  //       <button class="btn ghost small danger" onclick="confirmEmptyCart()">${t('cart.emptyCart')}</button>
  //     </div>
  //   </div>
  // `;

  // body.appendChild(cartFooter);

  // Update checkout button in main footer (legacy)
  $('#subtotal').textContent = money(subtotal);
  $('#checkoutTotal').textContent = money(subtotal);
}

// Enhanced checkout function
function proceedToCheckout() {
  if (Object.keys(state.cart).length === 0) {
    toast(t('cart.empty'), 'error');
    return;
  }
  
  openDrawer(false);
  $('#checkoutModal').showModal();
}

// Confirm before emptying cart
function confirmEmptyCart() {
  const count = Object.values(state.cart).reduce((s, n) => s + n, 0);
  const subtotal = cartSubtotal();
  
  if (confirm(`Empty cart with ${count} items (${money(subtotal)})?`)) {
    emptyCart();
    toast('Cart emptied', 'info');
  }
}

// Initialize cart event listeners
function initCartEvents() {
  // Drawer controls
  $('#openCart').addEventListener('click', () => openDrawer(true));
  $('#closeCart').addEventListener('click', () => openDrawer(false));
  $('#backdrop').addEventListener('click', () => openDrawer(false));
  
  // Legacy checkout and empty cart buttons
  $('#checkout').addEventListener('click', proceedToCheckout);
  $('#emptyCart').addEventListener('click', confirmEmptyCart);
}
