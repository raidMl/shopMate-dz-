# ShopMate E-commerce Application

## GitHub Pages Deployment

This folder contains the production-ready files for the ShopMate e-commerce application, optimized for GitHub Pages deployment.

### Live Demo
Once deployed, your application will be available at: `https://[your-username].github.io/[repository-name]/`

### Features
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart functionality
- 📱 Progressive Web App (PWA) support
- 🎨 Dark/Light theme toggle
- 🌐 Multi-language support
- 📊 Google Sheets integration for data management
- 📱 Fully responsive design

### Deployment Instructions

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder
   - Click "Save"

2. **Custom Domain (Optional):**
   - Add your custom domain in the "Custom domain" field
   - Make sure to configure your DNS settings

### File Structure
```
docs/
├── index.html          # Main application page
├── company.html        # Company/About page
├── support.html        # Support/Contact page
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
├── robots.txt         # SEO robots file
├── sitemap.xml        # SEO sitemap
├── .htaccess          # Apache server configuration
├── js/                # JavaScript modules
│   ├── app.js         # Main application logic
│   ├── components/    # UI components
│   ├── data/          # Data management
│   └── utils/         # Utility functions
├── styles/            # CSS stylesheets
│   ├── base.css       # Base styles
│   ├── responsive.css # Responsive design
│   ├── variables.css  # CSS variables
│   └── components/    # Component styles
└── data/              # Static data files
    ├── products.json  # Product data
    └── orders.json    # Sample orders
```

### Configuration

#### API Endpoints
The application is configured to use the following API endpoints:
- Products: `https://ecommerce-otnyyyhby-raidmls-projects.vercel.app/api/products`
- Categories: `https://ecommerce-otnyyyhby-raidmls-projects.vercel.app/api/categories`
- Contact: `https://ecommerce-otnyyyhby-raidmls-projects.vercel.app/api/contact`

#### PWA Features
- Offline support via service worker
- Add to home screen capability
- Push notifications (when implemented)
- Background sync for orders

### Performance Optimization
- ✅ Minified and optimized assets
- ✅ Service worker caching
- ✅ Lazy loading for images
- ✅ Responsive images
- ✅ SEO optimization

### Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

### Development
For local development, serve the files from this directory using any static file server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server

# Using VS Code Live Server extension
```

### Troubleshooting

#### Common Issues:
1. **Service Worker 404:** Make sure `sw.js` is served from the root directory
2. **CORS Errors:** Check that API endpoints are configured correctly
3. **PWA not installing:** Ensure `manifest.json` is properly linked in HTML
4. **Offline functionality:** Clear browser cache and re-register service worker

#### Support
For issues or questions, please create an issue in the repository or contact support through the application.

---

**Note:** This deployment folder is automatically synced with the main application. Any changes should be made in the source files and then copied to this docs folder for deployment.