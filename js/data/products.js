// Products Data - Loaded from JSON
let products = [];
let categories = [];
let productData = null;

// Load products from JSON file
async function loadProducts() {
  try {
    const response = await fetch('./data/products.json');
    productData = await response.json();
    products = productData.products;
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
