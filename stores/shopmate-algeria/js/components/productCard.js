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
        <div class="muted">${p.category.name} • ⭐ ${p.rating.toFixed(1)} • Stock: ${p.stock}</div>
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
    // Navigate to product detail page
    window.location.href = `./porductDetail.html?id=${p.id}`;
  });

  card.querySelector('[data-fav]')?.addEventListener('click', (e) => {
    toggleFavorite(p.id);
    e.currentTarget.blur();
  });

  card.querySelector('[data-id]')?.addEventListener('click', (e) => {
    if (canAddMore) {
      addToCart(p.id);
    }
    e.currentTarget.blur();
  });

  return card;
}

// Refresh products function for manual reload
async function refreshProducts() {
  try {
    showLoadingState();
    await fetchProducts();
    renderProducts();
    hideLoadingState();
    showToast('Products refreshed successfully');
  } catch (error) {
    hideLoadingState();
    showToast('Failed to refresh products', 'error');
  }
}

// Update results count display
function updateResultsCount(count) {
  const resultsElement = document.querySelector('.results-count');
  if (resultsElement) {
    resultsElement.textContent = `${count} ${count === 1 ? 'product' : 'products'} found`;
  }
}

// Render products grid
function renderProducts() {
  const grid = $('#grid');
  grid.innerHTML = '';

  let list = products.filter(p => p.price <= state.maxPrice);
  
  // Apply filters
  if (state.category !== 'all') {
    list = list.filter(p => {
      // Handle both object and string category formats
      const categoryName = getCategoryName(p.category);
      const categoryId = getCategoryId(p.category);
      return categoryName === state.category || categoryId === state.category || 
             (typeof p.category === 'string' && p.category === state.category);
    });
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
      getCategoryName(p.category).toLowerCase().includes(q) ||
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
  
  // Update results count
  updateResultsCount(list.length);
  
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
