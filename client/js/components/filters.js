// Filters Management
function initFilters() {
  updateFilters();
  
  // Initialize price display
  $('#priceValue').textContent = formatCurrency(state.maxPrice);
  
  // Initialize favorites count
  updateFavoritesCount();
}

function updateFilters() {
  // Update category dropdown
  const catSel = $('#category');
  catSel.innerHTML = ''; // Clear existing options
  
  // Add "All" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = t('category.all');
  catSel.appendChild(allOption);
  
  // Add category options with translations
  categories.forEach(c => { 
    const o = document.createElement('option'); 
    o.value = c; 
    o.textContent = t(`category.${c.toLowerCase()}`) || c; 
    catSel.appendChild(o); 
  });
  
  // Restore selected value
  catSel.value = state.category;
}

function initFilterEvents() {
  // Filter event listeners
  $('#category').addEventListener('change', (e) => { 
    state.category = e.target.value; 
    renderProducts(); 
  });
  
  $('#sort').addEventListener('change', (e) => { 
    state.sort = e.target.value; 
    renderProducts(); 
  });
  
  $('#onlyStock').addEventListener('change', (e) => { 
    state.onlyStock = e.target.value; 
    renderProducts(); 
  });
  
  $('#showFavorites').addEventListener('change', (e) => { 
    state.showFavorites = e.target.value; 
    renderProducts(); 
  });
  
  $('#priceRange').addEventListener('input', (e) => { 
    state.maxPrice = +e.target.value; 
    $('#priceValue').textContent = formatCurrency(state.maxPrice); 
    renderProducts(); 
  });

  // Search functionality
  const onSearch = debounce((e) => { 
    state.query = e.target.value.trim(); 
    renderProducts(); 
  }, 200);
  
  $('#search').addEventListener('input', onSearch);
  
  $('#clearSearch').addEventListener('click', () => { 
    $('#search').value = ''; 
    state.query = ''; 
    renderProducts(); 
  });
}
