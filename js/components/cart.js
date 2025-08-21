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

function addToCartWithVariant(baseId, variantKey, variantInfo) {
  const prod = products.find(p => p.id === baseId);
  if (!prod || prod.stock === 0) return;
  
  // Check variant stock availability
  let maxStock = prod.stock;
  if (variantInfo.color && prod.colors) {
    const colorOption = prod.colors.find(c => c.name === variantInfo.color);
    if (!colorOption || colorOption.stock === 0) {
      toast(t('message.outOfStock', {color: variantInfo.color}), 'error');
      return;
    }
    maxStock = Math.min(maxStock, colorOption.stock);
  }
  
  if (variantInfo.size && prod.sizes) {
    const sizeOption = prod.sizes.find(s => s.name === variantInfo.size);
    if (!sizeOption || sizeOption.stock === 0) {
      toast(t('message.sizeOutOfStock', {size: variantInfo.size}), 'error');
      return;
    }
    maxStock = Math.min(maxStock, sizeOption.stock);
  }
  
  const currentQty = state.cart[variantKey] || 0;
  const newQty = currentQty + 1;
  
  if (newQty > maxStock) {
    toast(t('message.cantAddVariant', {max: maxStock - currentQty}), 'error');
    return;
  }
  
  // Store variant information in cart
  if (!state.cartVariants) {
    state.cartVariants = {};
  }
  
  state.cart[variantKey] = newQty;
  state.cartVariants[variantKey] = {
    baseId: baseId,
    ...variantInfo
  };
  
  saveCart();
  updateCartUI();
  renderProducts();
  
  const variantText = [variantInfo.color, variantInfo.size].filter(Boolean).join(', ');
  toast(t('message.addedVariant', {name: prod.name, variant: variantText}), 'success');
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

function changeQty(id, delta) { 
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  
  const newQty = Math.max(1, (state.cart[id] || 1) + delta);
  
  if (newQty > prod.stock) {
    toast(t('message.maxQuantity', {max: prod.stock}), 'error');
    return;
  }
  
  state.cart[id] = newQty; 
  saveCart(); 
  updateCartUI(); 
}

function changeQtyVariant(key, delta) {
  const variantInfo = state.cartVariants?.[key];
  const productId = variantInfo ? variantInfo.baseId : key;
  const prod = products.find(p => p.id === productId);
  if (!prod) return;
  
  const newQty = Math.max(1, (state.cart[key] || 1) + delta);
  
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
  
  state.cart[key] = newQty;
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
  return Object.entries(state.cart).map(([key, qty]) => {
    const variantInfo = state.cartVariants?.[key];
    const productId = variantInfo ? variantInfo.baseId : key;
    const product = products.find(p => p.id === productId);
    
    return { 
      key,
      product,
      qty,
      variant: variantInfo || null
    }; 
  }); 
}

function cartSubtotal() { 
  return cartItems().reduce((s, it) => s + it.product.price * it.qty, 0); 
}

function updateCartUI() {
  const count = Object.values(state.cart).reduce((s, n) => s + n, 0);
  $('#cartCount').textContent = count;

  const body = $('#cartBody'); 
  body.innerHTML = '';
  
  if (count === 0) { 
    body.innerHTML = `<div class="muted">${t('cart.empty')}</div>`; 
    $('#subtotal').textContent = formatCurrency(0);
    $('#checkoutTotal').textContent = formatCurrency(0);
    return;
  }

  cartItems().forEach(({key, product: p, qty, variant}) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    
    const variantText = variant ? 
      ` • ${[variant.color, variant.size].filter(Boolean).join(', ')}` : '';
    
    const imageUrl = p.image || imageFor(p.hue, p.name);
    const hasDiscount = p.discount && p.discount > 0;
    const itemTotal = p.price * qty;
    
    row.innerHTML = `
      <div class="cart-item-image">
        <img alt="${p.name}" 
             src="${imageUrl}" 
             onerror="this.src='${imageFor(p.hue, p.name)}'"
             loading="lazy"/>
        ${hasDiscount ? `<div class="cart-discount-badge">${p.discount}% OFF</div>` : ''}
      </div>
      <div class="cart-item-details">
        <div class="cart-item-header">
          <h4 class="cart-item-title">${p.name}</h4>
          <div class="cart-item-rating">⭐ ${p.rating.toFixed(1)}</div>
        </div>
        <div class="cart-item-description">${p.description}</div>
        <div class="cart-item-meta">
          <span class="cart-item-category">${p.category}</span>
          ${variantText ? `<span class="cart-item-variant">${variantText}</span>` : ''}
        </div>
        <div class="cart-item-price-info">
          ${hasDiscount ? `<span class="cart-original-price">${formatCurrency(p.originalPrice)}</span>` : ''}
          <span class="cart-unit-price">${formatCurrency(p.price)} ${t('cart.each')}</span>
        </div>
      </div>
      <div class="cart-item-actions">
        <div class="cart-qty-controls">
          <button class="qty-btn" aria-label="Decrease" data-dec="${key}">−</button>
          <span class="qty-display">${qty}</span>
          <button class="qty-btn" aria-label="Increase" data-inc="${key}">+</button>
        </div>
        <div class="cart-item-total">${formatCurrency(itemTotal)}</div>
        <button class="btn-remove" data-del="${key}" title="${t('cart.remove')}">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>`;

    // Event listeners for cart item actions
    row.querySelector('[data-dec]')?.addEventListener('click', () => changeQtyVariant(key, -1));
    row.querySelector('[data-inc]')?.addEventListener('click', () => changeQtyVariant(key, 1));
    row.querySelector('[data-del]')?.addEventListener('click', () => removeFromCart(key));

    body.appendChild(row);
  });

  $('#subtotal').textContent = formatCurrency(cartSubtotal());
  $('#checkoutTotal').textContent = formatCurrency(cartSubtotal());
}

// Initialize cart event listeners
function initCartEvents() {
  // Drawer controls
  $('#openCart').addEventListener('click', () => openDrawer(true));
  $('#closeCart').addEventListener('click', () => openDrawer(false));
  $('#backdrop').addEventListener('click', () => openDrawer(false));
  
  // Empty cart button
  $('#emptyCart').addEventListener('click', () => emptyCart());
}
