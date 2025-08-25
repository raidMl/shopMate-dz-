// Product Card Component
function productCard(p) {
  const card = document.createElement('article');
  card.className = 'card';
  const isFavorited = state.favorites.includes(p.id);
  const cartQty = state.cart[p.id] || 0;
  const canAddMore = cartQty < p.stock;
  
  // Calculate discount info
  const hasDiscount = p.discount && p.discount > 0;
  const discountText = hasDiscount ? `${p.discount}% OFF` : '';
  const originalPriceText = hasDiscount ? `<span class="original-price">${money(p.originalPrice)}</span>` : '';
  
  // Get primary color if available
  const primaryColor = p.colors && p.colors.length > 0 ? p.colors[0] : null;
  
  // Use real image or fallback to generated one
  const imageUrl = p.image || imageFor(p.hue, p.name);
  
  card.innerHTML = `
    <div class="thumb">
      <img alt="${p.name}" src="${imageUrl}" onerror="this.src='${imageFor(p.hue, p.name)}'"/>
      ${hasDiscount ? `<div class="discount-badge">${discountText}</div>` : ''}
      <button class="fav ${isFavorited ? 'favorited' : ''}" 
              title="${isFavorited ? t('product.removeFromFavorites') : t('product.addToFavorites')}" 
              data-fav="${p.id}">
        <span>${isFavorited ? '★' : '☆'}</span>
      </button>
    </div>
    <div class="meta">
      <div class="title">${p.name}</div>
      <div class="description">${p.description}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; gap: 8px; margin-top: 8px;">
        <div class="muted">${p.category} • ⭐ ${p.rating.toFixed(1)} • Stock: ${p.stock}</div>
        <div class="price-container">
          ${originalPriceText}
          <div class="price">${money(p.price)}</div>
        </div>
      </div>
      ${p.colors && p.colors.length > 0 ? `
        <div class="colors">
          ${p.colors.slice(0, 3).map(color => `
            <div class="color-dot" 
                 style="background-color: ${color.hex}" 
                 title="${color.name} (${color.stock} available)"></div>
          `).join('')}
          ${p.colors.length > 3 ? `<span class="more-colors">+${p.colors.length - 3}</span>` : ''}
        </div>
      ` : ''}
      ${p.sizes && p.sizes.length > 0 ? `
        <div class="sizes">
          <span class="size-label">Sizes:</span>
          ${p.sizes.map(size => `
            <span class="size-option ${size.stock === 0 ? 'out-of-stock' : ''}">${size.name}</span>
          `).join('')}
        </div>
      ` : ''}
      <div class="actions">
        <button class="btn" ${!canAddMore ? 'disabled' : ''} data-id="${p.id}">
          ${p.stock === 0 ? t('product.outOfStock') : 
            cartQty >= p.stock ? t('product.maxAdded') : 
            cartQty > 0 ? `${t('product.addMore')} (${cartQty} ${t('product.inCart')})` : t('product.addToCart')}
        </button>
        <button class="btn secondary" data-preview="${p.id}">${t('product.preview')}</button>
      </div>
    </div>`;

  // Event listeners
  card.querySelector('[data-preview]')?.addEventListener('click', () => {
    showProductPreview(p);
  });

  card.querySelector('[data-fav]')?.addEventListener('click', (e) => {
    toggleFavorite(p.id);
    e.currentTarget.blur();
  });

  card.querySelector('[data-id]')?.addEventListener('click', (e) => {
    if (canAddMore) {
      // Check if product has variants (colors or sizes)
      const hasVariants = (p.colors && p.colors.length > 0) || (p.sizes && p.sizes.length > 0);
      
      if (hasVariants) {
        showVariantSelection(p);
      } else {
        addToCart(p.id);
      }
    }
    e.currentTarget.blur();
  });

  return card;
}

// Show product preview modal
function showProductPreview(product) {
  const modal = document.createElement('dialog');
  modal.className = 'product-preview-modal';
  
  const imageUrl = product.image || imageFor(product.hue, product.name);
  const hasDiscount = product.discount && product.discount > 0;
  
  modal.innerHTML = `
    <div class="preview-content">
      <div class="preview-header">
        <h3>${product.name}</h3>
        <button class="btn ghost close-preview">×</button>
      </div>
      <div class="preview-body">
        <div class="preview-image">
          <img src="${imageUrl}" alt="${product.name}" onerror="this.src='${imageFor(product.hue, product.name)}'"/>
          ${hasDiscount ? `<div class="discount-badge large">${product.discount}% OFF</div>` : ''}
        </div>
        <div class="preview-details">
          <p class="preview-description">${product.description}</p>
          <div class="preview-specs">
            <h4>Specifications:</h4>
            <ul>
              ${Object.entries(product.specifications || {}).map(([key, value]) => 
                `<li><strong>${key.charAt(0).toUpperCase() + key.slice(1)}:</strong> ${value}</li>`
              ).join('')}
            </ul>
          </div>
          <div class="preview-price">
            ${hasDiscount ? `<span class="original-price large">${money(product.originalPrice)}</span>` : ''}
            <span class="current-price large">${money(product.price)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
  
  modal.querySelector('.close-preview').addEventListener('click', () => {
    modal.close();
    modal.remove();
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

// Show variant selection modal
function showVariantSelection(product) {
  const modal = document.createElement('dialog');
  modal.className = 'variant-selection-modal';
  
  const imageUrl = product.image || imageFor(product.hue, product.name);
  const hasDiscount = product.discount && product.discount > 0;
  
  // Check available variants
  const availableColors = product.colors ? product.colors.filter(c => c.stock > 0) : [];
  const availableSizes = product.sizes ? product.sizes.filter(s => s.stock > 0) : [];
  
  modal.innerHTML = `
    <div class="variant-content">
      <div class="variant-header">
        <h3>${t('variant.selectOptions')} ${product.name}</h3>
        <button class="btn ghost close-variant">×</button>
      </div>
      <div class="variant-body">
        <div class="variant-image">
          <img src="${imageUrl}" alt="${product.name}" onerror="this.src='${imageFor(product.hue, product.name)}'"/>
          ${hasDiscount ? `<div class="discount-badge">${product.discount}% OFF</div>` : ''}
        </div>
        <div class="variant-options">
          <div class="variant-price">
            ${hasDiscount ? `<span class="original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
            <span class="current-price">${formatCurrency(product.price)}</span>
          </div>
          
          ${product.colors && product.colors.length > 0 ? `
            <div class="variant-section">
              <label class="variant-label">${t('variant.color')} <span class="required">${t('variant.required')}</span></label>
              <div class="color-options">
                ${product.colors.map(color => `
                  <label class="color-option ${color.stock === 0 ? 'disabled' : ''}">
                    <input type="radio" name="color" value="${color.name}" ${color.stock === 0 ? 'disabled' : ''}>
                    <div class="color-swatch" style="background-color: ${color.hex}"></div>
                    <span class="color-name">${color.name}</span>
                    <span class="stock-info">(${formatNumber(color.stock)} ${t('variant.left')})</span>
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${product.sizes && product.sizes.length > 0 ? `
            <div class="variant-section">
              <label class="variant-label">${t('variant.size')} <span class="required">${t('variant.required')}</span></label>
              <div class="size-options">
                ${product.sizes.map(size => `
                  <label class="size-option ${size.stock === 0 ? 'disabled' : ''}">
                    <input type="radio" name="size" value="${size.name}" ${size.stock === 0 ? 'disabled' : ''}>
                    <span class="size-name">${size.name}</span>
                    <span class="stock-info">(${formatNumber(size.stock)} ${t('variant.left')})</span>
                  </label>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <div class="variant-actions">
            <button class="btn secondary cancel-variant">${t('variant.cancel')}</button>
            <button class="btn add-to-cart-variant" disabled>${t('variant.addToCart')}</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Get required selections
  const colorRequired = product.colors && product.colors.length > 0;
  const sizeRequired = product.sizes && product.sizes.length > 0;
  
  // Validate selections and enable/disable add button
  function validateSelections() {
    const selectedColor = modal.querySelector('input[name="color"]:checked');
    const selectedSize = modal.querySelector('input[name="size"]:checked');
    const addButton = modal.querySelector('.add-to-cart-variant');
    
    const colorValid = !colorRequired || selectedColor;
    const sizeValid = !sizeRequired || selectedSize;
    
    addButton.disabled = !(colorValid && sizeValid);
  }
  
  // Add event listeners for radio buttons
  modal.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', validateSelections);
  });
  
  // Close handlers
  const closeModal = () => {
    modal.close();
    modal.remove();
  };
  
  modal.querySelector('.close-variant').addEventListener('click', closeModal);
  modal.querySelector('.cancel-variant').addEventListener('click', closeModal);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  // Add to cart with selected variants
  modal.querySelector('.add-to-cart-variant').addEventListener('click', () => {
    const selectedColor = modal.querySelector('input[name="color"]:checked')?.value;
    const selectedSize = modal.querySelector('input[name="size"]:checked')?.value;
    
    // Create unique product ID with variants
    const variantKey = [
      product.id,
      selectedColor,
      selectedSize
    ].filter(Boolean).join('-');
    
    // Add to cart with variant information
    addToCartWithVariant(product.id, variantKey, {
      color: selectedColor,
      size: selectedSize
    });
    
    closeModal();
  });
  
  document.body.appendChild(modal);
  modal.showModal();
}

// Render products grid
function renderProducts() {
  const grid = $('#grid');
  grid.innerHTML = '';

  let list = products.filter(p => p.price <= state.maxPrice);
  
  // Apply filters
  if (state.category !== 'all') {
    list = list.filter(p => p.category === state.category);
  }
  
  if (state.onlyStock === 'in') {
    list = list.filter(p => p.stock > 0);
  }
  
  if (state.onlyStock === 'out') {
    list = list.filter(p => p.stock === 0);
  }
  
  if (state.showFavorites === 'favorites') {
    list = list.filter(p => state.favorites.includes(p.id));
  }
  
  if (state.query) {
    const q = state.query.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sort products
  switch (state.sort) {
    case 'price-asc': 
      list.sort((a, b) => a.price - b.price); 
      break;
    case 'price-desc': 
      list.sort((a, b) => b.price - a.price); 
      break;
    case 'new': 
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); 
      break;
    case 'name': 
      list.sort((a, b) => a.name.localeCompare(b.name)); 
      break;
    default: 
      list.sort((a, b) => b.rating - a.rating); // popular
  }

  // Render cards
  list.forEach(p => grid.appendChild(productCard(p)));

  // Show empty state if no products
  if (list.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.style.padding = '24px';
    empty.innerHTML = `
      <div class="muted">
        ${t('message.noProducts')}
      </div>`;
    grid.appendChild(empty);
  }
}
