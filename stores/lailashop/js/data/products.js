// Products Data - Loaded from API with localStorage persistence
let products = [];
let categories = [];

// API configuration
const API_BASE_URL = 'http://localhost:8080';
window.API_BASE_URL = API_BASE_URL;

// Global config for the store
let storeConfig = {
  adminId: null,
  siteName: 'ShopMate',
  logo: null,
  description: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  socialLinks: {}
};

/**
 * Apply store configuration to the UI
 */
function applyStoreConfigToUI() {
  if (!storeConfig.siteName) return;

  console.log('🎨 Applying store branding:', storeConfig.siteName);

  // Update Page Title
  document.title = `${storeConfig.siteName} - Quality Products`;

  // Update Navbar Brand Name
  const brandNames = document.querySelectorAll('.brand-name, .mobile-drawer-brand span');
  brandNames.forEach(el => {
    el.textContent = storeConfig.siteName;
  });

  // Update Contact Info
  if (storeConfig.email) {
    const emailEls = document.querySelectorAll('.contact-email');
    emailEls.forEach(el => el.textContent = storeConfig.email);
  }

  if (storeConfig.phone) {
    const phoneEls = document.querySelectorAll('.contact-phone');
    phoneEls.forEach(el => el.textContent = storeConfig.phone);
  }

  if (storeConfig.address || storeConfig.city) {
    const locationEls = document.querySelectorAll('.contact-location');
    const locationText = [storeConfig.address, storeConfig.city].filter(Boolean).join(', ');
    locationEls.forEach(el => el.textContent = locationText);
  }

  // Update Meta Tags
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && storeConfig.description) {
    metaDescription.setAttribute('content', storeConfig.description);
  }

  const ogSiteName = document.querySelector('meta[property="og:site_name"]');
  if (ogSiteName) {
    ogSiteName.setAttribute('content', storeConfig.siteName);
  }

  // Update Copyright Text
  const copyrightEls = document.querySelectorAll('.copyright-text, .footer-bottom a');
  if (copyrightEls.length > 0) {
    const currentYear = new Date().getFullYear();
    copyrightEls.forEach(el => {
      el.innerHTML = `&copy; ${currentYear} ${storeConfig.siteName}. All rights reserved. Made with &hearts; &mdash; pure HTML/CSS/JS`;
    });
  }

  // Update Logo if provided
  if (storeConfig.logo) {
    const brandLogos = document.querySelectorAll('.brand-logo');
    console.log('🖼️ Updating logo elements:', brandLogos.length);
    brandLogos.forEach(logoContainer => {
      // Replace SVG with Image
      logoContainer.innerHTML = `<img src="${storeConfig.logo}" alt="${storeConfig.siteName}" style="height: 32px; width: auto; object-fit: contain; display: block;">`;
      // Remove any background-color or border that might hide the img
      logoContainer.style.background = 'transparent';
    });
  }

  // Update Social Links in footer if they exist
  if (storeConfig.socialLinks) {
    const socialContainer = document.querySelector('.social-links');
    if (socialContainer) {
      // Mapping of social network names to their common icon paths/names
      const socialIcons = {
        facebook: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
        instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986 6.618 0 11.986-5.368 11.986-11.986C24.003 5.367 18.635.001 12.017.001zM8.449 16.988c-2.508 0-4.541-2.036-4.541-4.544s2.033-4.544 4.541-4.544c2.507 0 4.544 2.036 4.544 4.544s-2.037 4.544-4.544 4.544zm3.568-8.172c-.914 0-1.656-.742-1.656-1.656s.742-1.656 1.656-1.656 1.656.742 1.656 1.656-.742 1.656-1.656 1.656z"/></svg>',
        tiktok: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
        linkedin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
        twitter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>',
        whatsapp: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
        youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
      };

      let html = '';
      Object.entries(storeConfig.socialLinks).forEach(([platform, url]) => {
        if (!url) return;
        const icon = socialIcons[platform.toLowerCase()];
        if (icon) {
          html += `<a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${platform}">${icon}</a>`;
        }
      });
      
      if (html) socialContainer.innerHTML = html;
    }
  }
}

// Load store local configuration
async function loadStoreConfig() {
  try {
    const [configRes, credentialsRes] = await Promise.all([
      fetch('js/config.json').then(res => res.ok ? res.json() : null),
      fetch('js/credentials.json').then(res => res.ok ? res.json() : null)
    ]);
    
    if (credentialsRes && credentialsRes.adminId) {
      storeConfig.adminId = credentialsRes.adminId;
    }
    
    if (configRes) {
      storeConfig.siteName = configRes.siteName || storeConfig.siteName;
      storeConfig.logo = configRes.logo || null;
      storeConfig.description = configRes.description || '';
      storeConfig.email = configRes.email || '';
      storeConfig.phone = configRes.phone || '';
      storeConfig.address = configRes.address || '';
      storeConfig.city = configRes.city || '';
      storeConfig.socialLinks = configRes.socialLinks || configRes.socialMedia || {};
      
      // Apply to UI immediately after loading
      applyStoreConfigToUI();
    }
    
    console.log('📦 Store Configuration Loaded:', storeConfig);
  } catch (error) {
    console.warn('⚠️ Could not load store specific configuration, falling back to global view:', error);
  }
}

// Fetch products from API
async function fetchProducts() {
  try {
    // Ensure config is loaded
    if (storeConfig.adminId === null) {
      await loadStoreConfig();
    }

    console.log('Fetching products from API...');
    // If we have an adminId, filter products by it
    const url = storeConfig.adminId 
      ? `${API_BASE_URL}/api/products?adminId=${storeConfig.adminId}`
      : `${API_BASE_URL}/api/products`;
      
    console.log(`🔍 Fetching from: ${url}`);
    const response = await fetch(url);
    
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
    // If we have an adminId, filter categories by it
    const url = storeConfig.adminId 
      ? `${API_BASE_URL}/api/categories?adminId=${storeConfig.adminId}`
      : `${API_BASE_URL}/api/categories`;
      
    console.log(`🔍 Fetching categories from: ${url}`);
    const response = await fetch(url);
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
  const footerCategories = document.getElementById('footerCategories');
  
  if (categorySelect) {
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

  // Populate footer categories
  if (footerCategories) {
    footerCategories.innerHTML = '';
    categories.forEach(category => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = "#"; // Using # so it doesn't navigate
      a.textContent = category;
      a.className = "hover:text-blue-500 transition-colors";
      a.onclick = (e) => {
        e.preventDefault();
        const catSelect = document.getElementById('category');
        if (catSelect) {
          catSelect.value = category;
          catSelect.dispatchEvent(new Event('change'));
          // Smooth scroll to product selection area
          const productSection = document.querySelector('.category-filter') || document.getElementById('category');
          if (productSection) {
            window.scrollTo({ top: productSection.offsetTop - 100, behavior: 'smooth' });
          }
        }
      };
      li.appendChild(a);
      footerCategories.appendChild(li);
    });
  }
}

// Start loading process
loadStoreConfig();
