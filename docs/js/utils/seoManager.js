// SEO Manager for ShopMate - Dynamic SEO optimization
class SEOManager {
    constructor() {
        this.baseTitle = "ShopMate - Modern E-Commerce Algeria";
        this.baseDescription = "Shop quality electronics, accessories, and gadgets at ShopMate Algeria. Fast delivery across all 58 wilayas.";
        this.baseUrl = "https://shopmate.dz";
        this.defaultImage = "https://shopmate.dz/images/og-image.jpg";
        this.businessInfo = {
            name: "ShopMate Algeria",
            phone: "+213669453240",
            email: "shopemate.dz@gmail.com",
            address: "Street Constantine, Setif, Algeria"
        };
        
        this.init();
    }

    init() {
        // Update page SEO based on current view
        this.updatePageSEO();
        
        // Monitor URL changes for single page app
        this.monitorPageChanges();
        
        // Setup product view SEO
        this.setupProductSEO();
        
        console.log('📈 SEO Manager initialized');
    }

    updatePageSEO(pageData = {}) {
        const {
            title = this.baseTitle,
            description = this.baseDescription,
            keywords = "",
            image = this.defaultImage,
            url = this.baseUrl,
            type = "website",
            productInfo = null
        } = pageData;

        // Update title
        document.title = title;
        
        // Update meta description
        this.updateMetaTag('name', 'description', description);
        
        // Update keywords if provided
        if (keywords) {
            this.updateMetaTag('name', 'keywords', keywords);
        }
        
        // Update Open Graph tags
        this.updateMetaTag('property', 'og:title', title);
        this.updateMetaTag('property', 'og:description', description);
        this.updateMetaTag('property', 'og:image', image);
        this.updateMetaTag('property', 'og:url', url);
        this.updateMetaTag('property', 'og:type', type);
        
        // Update Twitter Card
        this.updateMetaTag('name', 'twitter:title', title);
        this.updateMetaTag('name', 'twitter:description', description);
        this.updateMetaTag('name', 'twitter:image', image);
        
        // Update canonical URL
        this.updateCanonicalUrl(url);
        
        // Update structured data if product info provided
        if (productInfo) {
            this.updateProductStructuredData(productInfo);
        }
    }

    updateMetaTag(attribute, name, content) {
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        
        if (element) {
            element.setAttribute('content', content);
        } else {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            element.setAttribute('content', content);
            document.head.appendChild(element);
        }
    }

    updateCanonicalUrl(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        
        if (canonical) {
            canonical.setAttribute('href', url);
        } else {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            canonical.setAttribute('href', url);
            document.head.appendChild(canonical);
        }
    }

    setupProductSEO() {
        // Listen for product view events
        document.addEventListener('productView', (event) => {
            const product = event.detail;
            this.updateProductPageSEO(product);
        });
    }

    updateProductPageSEO(product) {
        const title = `${product.name} - ${this.baseTitle}`;
        const description = `${product.description} | Fast delivery across Algeria | Price: ${window.formatPrice(product.price)} | ${this.baseDescription}`;
        const keywords = `${product.name}, ${product.category}, Algeria, ${product.tags ? product.tags.join(', ') : ''}, electronics, gadgets`;
        const url = `${this.baseUrl}/product/${this.slugify(product.name)}`;
        const image = product.image || this.defaultImage;

        this.updatePageSEO({
            title,
            description,
            keywords,
            image,
            url,
            type: 'product',
            productInfo: product
        });
    }

    updateProductStructuredData(product) {
        // Remove existing product structured data
        const existingScript = document.querySelector('#product-structured-data');
        if (existingScript) {
            existingScript.remove();
        }

        // Create new product structured data
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.image,
            "sku": product.id,
            "brand": {
                "@type": "Brand",
                "name": "ShopMate"
            },
            "offers": {
                "@type": "Offer",
                "price": product.price,
                "priceCurrency": "DZD",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                    "@type": "Organization",
                    "name": this.businessInfo.name,
                    "telephone": this.businessInfo.phone,
                    "email": this.businessInfo.email
                }
            },
            "aggregateRating": product.rating ? {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "ratingCount": product.reviewCount || 1
            } : undefined
        };

        const script = document.createElement('script');
        script.id = 'product-structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    updateCategoryPageSEO(category, products) {
        const title = `${category} Products - ${this.baseTitle}`;
        const description = `Shop ${category.toLowerCase()} products at ShopMate Algeria. ${products.length} products available with fast delivery across all wilayas.`;
        const keywords = `${category}, Algeria, electronics, gadgets, ${category.toLowerCase()} products`;
        const url = `${this.baseUrl}/category/${this.slugify(category)}`;

        this.updatePageSEO({
            title,
            description,
            keywords,
            url,
            type: 'website'
        });

        // Update category structured data
        this.updateCategoryStructuredData(category, products);
    }

    updateCategoryStructuredData(category, products) {
        const existingScript = document.querySelector('#category-structured-data');
        if (existingScript) {
            existingScript.remove();
        }

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${category} Products`,
            "description": `Browse our ${category.toLowerCase()} collection`,
            "url": `${this.baseUrl}/category/${this.slugify(category)}`,
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": products.length,
                "itemListElement": products.slice(0, 10).map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "item": {
                        "@type": "Product",
                        "name": product.name,
                        "url": `${this.baseUrl}/product/${this.slugify(product.name)}`,
                        "image": product.image,
                        "offers": {
                            "@type": "Offer",
                            "price": product.price,
                            "priceCurrency": "DZD"
                        }
                    }
                }))
            }
        };

        const script = document.createElement('script');
        script.id = 'category-structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    monitorPageChanges() {
        // Monitor URL hash changes for SPA routing
        window.addEventListener('hashchange', () => {
            this.updatePageSEO();
        });

        // Monitor search events
        document.addEventListener('searchPerformed', (event) => {
            const query = event.detail.query;
            const results = event.detail.results;
            
            if (query) {
                const title = `Search: ${query} - ${this.baseTitle}`;
                const description = `Search results for "${query}" at ShopMate Algeria. ${results.length} products found.`;
                const url = `${this.baseUrl}/?search=${encodeURIComponent(query)}`;
                
                this.updatePageSEO({ title, description, url });
            }
        });
    }

    slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Track SEO events for analytics
    trackSEOEvent(eventName, data = {}) {
        // Send to analytics
        if (window.gtag) {
            window.gtag('event', eventName, {
                event_category: 'SEO',
                ...data
            });
        }
        
        console.log(`📊 SEO Event: ${eventName}`, data);
    }

    // Generate meta tags for sharing
    generateShareableContent(product) {
        const shareData = {
            title: `${product.name} - ${this.baseTitle}`,
            text: `Check out ${product.name} at ShopMate Algeria! ${window.formatPrice(product.price)}`,
            url: `${this.baseUrl}/product/${this.slugify(product.name)}`
        };

        return shareData;
    }

    // Optimize images for SEO
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add alt text if missing
            if (!img.alt) {
                const productCard = img.closest('[data-product]');
                if (productCard) {
                    const productName = productCard.dataset.product;
                    img.alt = `${productName} - ShopMate Algeria`;
                }
            }
            
            // Add loading attribute for performance
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    // Update breadcrumbs for better navigation
    updateBreadcrumbs(breadcrumbs) {
        // Remove existing breadcrumb structured data
        const existingScript = document.querySelector('#breadcrumb-structured-data');
        if (existingScript) {
            existingScript.remove();
        }

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": breadcrumb.name,
                "item": breadcrumb.url
            }))
        };

        const script = document.createElement('script');
        script.id = 'breadcrumb-structured-data';
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Static method to get instance
    static getInstance() {
        if (!window.seoManager) {
            window.seoManager = new SEOManager();
        }
        return window.seoManager;
    }
}

// Initialize SEO Manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        SEOManager.getInstance();
    });
} else {
    SEOManager.getInstance();
}

// Export for use in other modules
window.SEOManager = SEOManager;