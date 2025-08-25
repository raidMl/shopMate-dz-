// Products Data - Loaded from JSON with localStorage persistence
let products = [];
let categories = [];
let productData = null;

// Load products from localStorage or JSON file
async function loadProducts() {
  try {
    // First try to load from localStorage (for updated quantities)
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      products = JSON.parse(savedProducts);
      console.log('Products loaded from localStorage');
    } else {
      // Load from JSON file if no localStorage data
      const response = await fetch('./data/products.json');
      productData = await response.json();
      products = productData.products;
      
      // Save initial products to localStorage
      saveProductsToStorage();
      console.log('Products loaded from JSON file');
    }
    
    // Load categories from JSON (these don't change)
    if (!productData) {
      const response = await fetch('./data/products.json');
      productData = await response.json();
    }
    categories = productData.categories.map(c => c.name);
    
    // Initialize the app after products are loaded
    if (typeof initializeApp === 'function') {
      initializeApp();
    }
  } catch (error) {
    console.error('Failed to load products:', error);
    // Fallback to empty arrays
    products = [];
    categories = [];
  }
}

// Save products to localStorage
function saveProductsToStorage() {
  try {
    localStorage.setItem('products', JSON.stringify(products, null, 2));
    console.log('Products saved to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
    return false;
  }
}

// Reset products to original JSON data
function resetProductsFromJSON() {
  if (productData && productData.products) {
    products = [...productData.products];
    saveProductsToStorage();
    if (typeof renderProducts === 'function') {
      renderProducts();
    }
    return true;
  }
  return false;
}

// Helper function to get product by ID
function getProduct(id) {
  return products.find(p => p.id === id);
}

// Helper function to get category info
function getCategory(name) {
  return productData?.categories.find(c => c.name === name);
}

// Load products when script loads
loadProducts();
