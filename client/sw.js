// Service Worker for ShopMate PWA
const CACHE_NAME = 'shopmate-v1.0.0';
const API_CACHE_NAME = 'shopmate-api-v1.0.0';

// Files to cache for offline access
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles/base.css',
  '/styles/responsive.css',
  '/styles/variables.css',
  '/styles/components/cart-drawer.css',
  '/styles/components/contact-footer.css',
  '/styles/components/hero.css',
  '/styles/components/language-switcher.css',
  '/styles/components/modal.css',
  '/styles/components/navbar.css',
  '/styles/components/product-grid.css',
  '/styles/components/toast.css',
  '/styles/components/toolbar.css',
  '/js/app.js',
  '/js/components/cart.js',
  '/js/components/checkout.js',
  '/js/components/favorites.js',
  '/js/components/filters.js',
  '/js/components/language-switcher.js',
  '/js/components/navbar.js',
  '/js/components/productCard.js',
  '/js/components/theme-contact.js',
  '/js/data/languages.js',
  '/js/data/products.js',
  '/js/data/wilayas.js',
  '/js/utils/googleSheetsService.js',
  '/js/utils/helpers.js',
  '/js/utils/orderManager.js',
  '/js/utils/state.js',
  '/data/products.json',
  '/data/orders.json',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  'http://localhost:5000/api/products',
  'http://localhost:5000/api/categories'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('📁 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache API responses
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('🌐 Service Worker: Pre-caching API data');
        return Promise.all(
          API_ENDPOINTS.map(url => 
            fetch(url)
              .then(response => {
                if (response.ok) {
                  return cache.put(url, response.clone());
                }
              })
              .catch(err => console.log(`⚠️ Failed to cache ${url}:`, err))
          )
        );
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.origin === 'http://localhost:5000' || url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// Handle API requests with cache-first strategy for GET requests
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  if (request.method === 'GET') {
    try {
      // Try network first for fresh data
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Update cache with fresh data
        cache.put(request, networkResponse.clone());
        return networkResponse;
      }
      
      // If network fails, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('📱 Service Worker: Serving API from cache:', request.url);
        return cachedResponse;
      }
      
      return networkResponse;
    } catch (error) {
      // Network completely unavailable, try cache
      const cachedResponse = await cache.match(request);
      if (cachedResponse) {
        console.log('🔄 Service Worker: Offline - serving API from cache:', request.url);
        return cachedResponse;
      }
      
      // Return offline page for API failures
      return new Response(
        JSON.stringify({ 
          error: 'Offline', 
          message: 'No internet connection. Some features may be limited.' 
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }
  
  // For non-GET requests, always try network
  return fetch(request);
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try cache first for better performance
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      console.log('⚡ Service Worker: Serving from cache:', request.url);
      
      // Update cache in background
      fetch(request).then(response => {
        if (response.ok) {
          cache.put(request, response.clone());
        }
      }).catch(() => {
        // Ignore network errors for background updates
      });
      
      return cachedResponse;
    }
    
    // If not in cache, try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful network responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed and not in cache
    console.log('❌ Service Worker: Network and cache failed for:', request.url);
    
    // Return offline fallback for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Background sync for orders when online
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered');
  
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncPendingOrders());
  }
});

// Sync pending orders when connection is restored
async function syncPendingOrders() {
  try {
    const pendingOrders = await getPendingOrders();
    
    for (const order of pendingOrders) {
      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order.data)
        });
        
        if (response.ok) {
          await removePendingOrder(order.id);
          console.log('✅ Service Worker: Synced pending order:', order.id);
        }
      } catch (error) {
        console.log('❌ Service Worker: Failed to sync order:', order.id, error);
      }
    }
  } catch (error) {
    console.log('❌ Service Worker: Background sync failed:', error);
  }
}

// Helper functions for pending orders (would be implemented with IndexedDB)
async function getPendingOrders() {
  // Implementation would use IndexedDB to store pending orders
  return [];
}

async function removePendingOrder(orderId) {
  // Implementation would remove order from IndexedDB
  console.log('Removing pending order:', orderId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Products',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('ShopMate', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('🎉 Service Worker: Loaded successfully');