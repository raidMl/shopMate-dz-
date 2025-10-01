# ShopMate - Modern E-Commerce UI

A beautiful, responsive e-commerce interface built with pure HTML, CSS, and JavaScript. No frameworks required!

## 🚀 Features

- **Product Grid** with filtering, sorting, and search
- **Rich Product Data** with images, descriptions, and specifications
- **Discount System** with original prices and percentage off
- **Color & Size Variants** for applicable products
- **Product Preview Modal** with detailed specifications
- **Shopping Cart** with quantity management and stock validation
- **Favorites System** with persistent storage
- **Responsive Design** for all screen sizes
- **Checkout Flow** with form validation
- **Toast Notifications** with different types
- **Keyboard Shortcuts** for better UX
- **Local Storage** for cart and favorites persistence
- **Real Images** with fallback to generated placeholders

## 📁 Project Structure

```
├── index.html                 # Main HTML file
├── index1.html               # Original single-file version
├── data/                     # Data files
│   └── products.json         # Product catalog with full details
├── styles/                   # CSS files organized by component
│   ├── variables.css         # CSS custom properties
│   ├── base.css             # Base styles and utilities
│   ├── responsive.css       # Media queries
│   └── components/          # Component-specific styles
│       ├── navbar.css
│       ├── hero.css
│       ├── toolbar.css
│       ├── product-grid.css
│       ├── cart-drawer.css
│       ├── modal.css
│       └── toast.css
└── js/                      # JavaScript files organized by feature
    ├── app.js              # Main application entry point
    ├── utils/              # Utility functions
    │   ├── helpers.js      # Helper functions and utilities
    │   └── state.js        # State management
    ├── data/               # Data and configuration
    │   └── products.js     # Product data loader
    └── components/         # Component-specific logic
        ├── productCard.js  # Product card rendering
        ├── cart.js         # Shopping cart functionality
        ├── favorites.js    # Favorites management
        ├── filters.js      # Filtering and search
        └── checkout.js     # Checkout process
```

## 🎯 Usage

1. **Open `index.html`** in your browser
2. **Browse products** using the grid view
3. **Filter and search** using the toolbar controls
4. **Add to cart** and manage quantities
5. **Mark favorites** by clicking the star icons
6. **Checkout** with form validation

## ⌨️ Keyboard Shortcuts

- **Escape** - Close modals and drawer
- **Ctrl/Cmd + K** - Focus search input
- **Ctrl/Cmd + Enter** - Submit checkout form (when modal is open)

## 🎨 Customization

### Colors
Edit `styles/variables.css` to change the color scheme:

```css
:root {
  --bg: #0b0c10;        /* Background */
  --brand: #6ee7b7;     /* Primary brand color */
  --brand-2: #38bdf8;   /* Secondary brand color */
  /* ... other colors */
}
```

### Products
The product catalog is now stored in `data/products.json` with rich product information:

```json
{
  "products": [
    {
      "id": "p1",
      "name": "Product Name",
      "description": "Detailed product description",
      "image": "https://example.com/image.jpg",
      "price": 99,
      "originalPrice": 129,
      "discount": 23,
      "category": "Category",
      "rating": 4.5,
      "stock": 10,
      "createdAt": "2025-01-01",
      "hue": 200,
      "colors": [
        { "name": "Black", "hex": "#000000", "stock": 5 }
      ],
      "sizes": [
        { "name": "Medium", "stock": 3 }
      ],
      "specifications": {
        "feature1": "value1",
        "feature2": "value2"
      }
    }
  ],
  "categories": [
    {
      "id": "category-id",
      "name": "Category Name",
      "description": "Category description"
    }
  ]
}
```

#### Product Features:
- **Images** - Real product images with fallback to generated ones
- **Descriptions** - Detailed product descriptions
- **Discounts** - Original price and discount percentage
- **Colors** - Available color options with stock levels
- **Sizes** - Size variants where applicable
- **Specifications** - Technical specifications
- **Enhanced Search** - Search includes descriptions

## 🔧 Components

### Product Card
- Displays product information
- Handles add to cart functionality
- Manages favorite state
- Shows stock availability

### Shopping Cart
- Persistent storage via localStorage
- Quantity management with stock validation
- Real-time subtotal calculation
- Slide-out drawer interface

### Favorites
- Toggle favorite products
- Persistent storage via localStorage
- Filter to show favorites only
- Visual indicators

### Filters & Search
- Category filtering
- Price range slider
- Stock availability filter
- Real-time search
- Multiple sorting options

### Checkout
- Form validation
- Loading states
- Error handling
- Demo payment processing

## 📱 Responsive Design

The application is fully responsive with breakpoints at:
- **1024px** - Tablet layout
- **720px** - Small tablet/large phone
- **420px** - Phone layout
- **320px** - Small phone optimization

## 🚀 Getting Started

1. Clone or download the files
2. Open `index.html` in a web browser
3. No build process required!

## 🔄 Migration from Single File

If you're using the original `index1.html`, the new modular version (`index.html`) provides the same functionality with better organization and maintainability.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with ♥ — Pure HTML/CSS/JS
