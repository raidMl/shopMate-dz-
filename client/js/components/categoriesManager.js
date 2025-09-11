// Categories Manager - Dynamic category loading from backend
class CategoriesManager {
    constructor() {
        this.categories = [];
        this.apiBaseUrl = 'http://localhost:5000/api';
        this.cache = {
            categories: null,
            lastFetch: null,
            ttl: 5 * 60 * 1000 // 5 minutes cache
        };
        
        this.init();
    }

    async init() {
        console.log('📂 Categories Manager initializing...');
        
        // Load categories on page load
        await this.loadCategories();
        
        // Populate various UI elements with categories
        this.populateFooterCategories();
        this.populateCategoryFilter();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Categories Manager initialized');
    }

    async loadCategories(forceRefresh = false) {
        // Check cache first
        if (!forceRefresh && this.isCacheValid()) {
            this.categories = this.cache.categories;
            return this.categories;
        }

        try {
            console.log('🔄 Loading categories from backend...');
            
            // Show loading state
            this.showLoadingState();
            
            const response = await fetch(`${this.apiBaseUrl}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats
            this.categories = Array.isArray(data) ? data : data.categories || [];
            
            // Update cache
            this.updateCache(this.categories);
            
            console.log('✅ Categories loaded:', this.categories);
            return this.categories;

        } catch (error) {
            console.error('❌ Error loading categories:', error);
            
            // Fallback to default categories
            this.categories = this.getDefaultCategories();
            console.log('🔄 Using fallback categories');
            
            return this.categories;
        }
    }

    isCacheValid() {
        return this.cache.categories && 
               this.cache.lastFetch && 
               (Date.now() - this.cache.lastFetch) < this.cache.ttl;
    }

    updateCache(categories) {
        this.cache.categories = categories;
        this.cache.lastFetch = Date.now();
    }

    getDefaultCategories() {
        return [
            { id: 'audio', name: 'Audio', slug: 'audio' },
            { id: 'peripherals', name: 'Peripherals', slug: 'peripherals' },
            { id: 'wearables', name: 'Wearables', slug: 'wearables' },
            { id: 'accessories', name: 'Accessories', slug: 'accessories' }
        ];
    }

    showLoadingState() {
        const footerCategories = document.getElementById('footerCategories');
        if (footerCategories) {
            footerCategories.innerHTML = '<li><span class="loading-placeholder">Loading categories...</span></li>';
        }
    }

    populateFooterCategories() {
        const footerCategories = document.getElementById('footerCategories');
        if (!footerCategories || this.categories.length === 0) return;

        // Limit to maximum 5 categories for footer display
        const maxCategories = 3;
        const displayCategories = this.categories.slice(0, maxCategories);

        const categoriesHTML = displayCategories.map(category => `
            <li>
                <a href="#" 
                   data-category="${category.slug || category.name}" 
                   class="footer-category-link"
                   data-category-id="${category.id || category.slug}">
                    ${category.name}
                </a>
            </li>
        `).join('');

        // Add "View All" link if there are more than 5 categories
        const viewAllHTML = this.categories.length > maxCategories ? `
            <li>
                <a href="#" 
                   class="footer-category-link view-all-categories"
                   data-action="view-all">
                    View All Categories
                </a>
            </li>
        ` : '';

        footerCategories.innerHTML = categoriesHTML + viewAllHTML;
        
        // Add click handlers for footer category links
        footerCategories.querySelectorAll('.footer-category-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (e.target.dataset.action === 'view-all') {
                    this.showAllCategories();
                } else {
                    const categoryName = e.target.dataset.category;
                    this.filterByCategory(categoryName);
                }
            });
        });
    }

    populateCategoryFilter() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect || this.categories.length === 0) return;

        // Keep the "All" option
        const allOption = categorySelect.querySelector('option[value="all"]');
        categorySelect.innerHTML = '';
        
        if (allOption) {
            categorySelect.appendChild(allOption);
        } else {
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All';
            defaultOption.setAttribute('data-i18n', 'category.all');
            categorySelect.appendChild(defaultOption);
        }

        // Add category options
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.slug || category.name.toLowerCase();
            option.textContent = category.name;
            option.setAttribute('data-category-id', category.id || category.slug);
            categorySelect.appendChild(option);
        });

        console.log('📂 Category filter populated with', this.categories.length, 'categories');
    }

    filterByCategory(categoryName) {
        // Update the category filter
        const categorySelect = document.getElementById('category');  
        if (categorySelect) {
            categorySelect.value = categoryName.toLowerCase();
            
            // Trigger change event to apply filter
            const changeEvent = new Event('change', { bubbles: true });
            categorySelect.dispatchEvent(changeEvent);
        }

        // Scroll to products section
        const productsSection = document.getElementById('grid');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }

        // Track analytics
        this.trackCategoryClick(categoryName);
    }

    setupEventListeners() {
        // Listen for category filter changes
        document.addEventListener('categoryChanged', (event) => {
            const selectedCategory = event.detail;
            this.highlightActiveCategory(selectedCategory);
        });

        // Refresh categories periodically
        setInterval(() => {
            this.loadCategories(false); // Use cache if valid
        }, 10 * 60 * 1000); // Every 10 minutes
    }

    highlightActiveCategory(activeCategory) {
        // Remove active class from all footer category links
        document.querySelectorAll('.footer-category-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current category
        if (activeCategory && activeCategory !== 'all') {
            const activeLink = document.querySelector(`[data-category="${activeCategory}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    async refreshCategories() {
        console.log('🔄 Refreshing categories...');
        await this.loadCategories(true); // Force refresh
        this.populateFooterCategories();
        this.populateCategoryFilter();
    }

    showAllCategories() {
        // Show modal or expand view with all categories
        this.createCategoriesModal();
        
        // Track view all categories
        if (window.gtag) {
            window.gtag('event', 'view_all_categories', {
                event_category: 'Navigation',
                event_label: 'Footer View All',
                value: 1
            });
        }
        
        console.log('📂 Showing all categories modal');
    }

    createCategoriesModal() {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('categoriesModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'categoriesModal';
        modal.className = 'categories-modal';
        modal.innerHTML = `
            <div class="categories-modal-backdrop"></div>
            <div class="categories-modal-content">
                <div class="categories-modal-header">
                    <h3>All Categories</h3>
                    <button class="categories-modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="categories-modal-body">
                    <div class="categories-grid">
                        ${this.categories.map(category => `
                            <div class="category-item">
                                <a href="#" 
                                   data-category="${category.slug || category.name}" 
                                   class="category-link">
                                    <div class="category-icon">📂</div>
                                    <span class="category-name">${category.name}</span>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add to body
        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('.categories-modal-close');
        const backdrop = modal.querySelector('.categories-modal-backdrop');
        const categoryLinks = modal.querySelectorAll('.category-link');

        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        };

        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryName = e.target.closest('.category-link').dataset.category;
                this.filterByCategory(categoryName);
                closeModal();
            });
        });

        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
    }

    trackCategoryClick(categoryName) {
        // Track category clicks for analytics
        if (window.gtag) {
            window.gtag('event', 'category_click', {
                event_category: 'Navigation',
                event_label: categoryName,
                value: 1
            });
        }
        
        console.log('📊 Category clicked:', categoryName);
    }

    // Get category by ID or slug
    getCategoryById(id) {
        return this.categories.find(cat => 
            cat.id === id || 
            cat.slug === id || 
            cat.name.toLowerCase() === id.toLowerCase()
        );
    }

    // Get all categories
    getCategories() {
        return this.categories;
    }

    // Add new category (if needed for admin functionality)
    async addCategory(categoryData) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(categoryData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const newCategory = await response.json();
            this.categories.push(newCategory);
            
            // Refresh UI
            this.populateFooterCategories();
            this.populateCategoryFilter();
            
            return newCategory;
        } catch (error) {
            console.error('❌ Error adding category:', error);
            throw error;
        }
    }

    // Static method to get instance
    static getInstance() {
        if (!window.categoriesManager) {
            window.categoriesManager = new CategoriesManager();
        }
        return window.categoriesManager;
    }
}

// Initialize Categories Manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        CategoriesManager.getInstance();
    });
} else {
    CategoriesManager.getInstance();
}

// Export for use in other modules
window.CategoriesManager = CategoriesManager;