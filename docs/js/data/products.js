// Products Data - Loaded from API with localStorage persistence
let products = [];
let categories = [];

// API configuration
const API_BASE_URL = 'https://ecommerce-otnyyyhby-raidmls-projects.vercel.app';

// Fetch products from API
async function fetchProducts() {
  try {
    console.log('Fetching products from API...');
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform API data to match frontend format
    products = data.map(product => ({
      id: product._id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice || product.price,
      discount: product.discount || 0,
      category: product.category, // Keep as object with { _id, name, description }
      rating: product.rating || 4.5,
      stock: product.stock || 0,
      createdAt: product.createdAt,
      hue: product.hue || Math.floor(Math.random() * 360),
      colors: product.colors || [],
      sizes: product.sizes || [],
      specifications: product.specifications || {}
    }));
    
    // Extract unique categories - use category names for dropdown values
    categories = [...new Set(products.map(p => getCategoryName(p.category)))].filter(Boolean);
    
    console.log(`Loaded ${products.length} products from API`);
    console.log('Categories:', categories);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Fallback to empty array
    products = [];
    categories = [];
    
    // Show user-friendly error message using existing toast function
    if (typeof toast === 'function') {
      toast('Failed to load products. Please try again later.', 'error');
    }
    return [];
  }
}

// Fetch categories from API (if available)
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (response.ok) {
      const data = await response.json();
      categories = data.map(cat => cat.name || cat._id);
    }
  } catch (error) {
    console.log('Categories endpoint not available, using product categories');
  }
}

// Initialize products and categories
async function initializeProducts() {
  await fetchProducts();
  await fetchCategories();
  
  // Populate category dropdown
  populateCategoryDropdown();
  
  return products;
}

// Populate category dropdown with fetched categories
function populateCategoryDropdown() {
  const categorySelect = document.getElementById('category');
  if (!categorySelect) return;
  
  // Clear existing options except "All"
  const allOption = categorySelect.querySelector('option[value="all"]');
  categorySelect.innerHTML = '';
  if (allOption) categorySelect.appendChild(allOption);
  
  // Add categories from API
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    option.setAttribute('data-i18n', `category.${category.toLowerCase()}`);
    categorySelect.appendChild(option);
  });
}

// Don't auto-initialize, let app.js control the flow
// initializeProducts();
