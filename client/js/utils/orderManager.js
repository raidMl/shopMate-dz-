/**
 * Order Management System
 * Handles order creation, storage, and product quantity updates
 */

class OrderManager {
  constructor() {
    this.orders = [];
    this.nextOrderId = 1;
    this.loadOrders();
  }

  /**
   * Calculate delivery price based on wilaya location
   * @param {string} wilaya - Selected wilaya name or code
   * @returns {number} - Delivery price in DA
   */
  calculateDeliveryPrice(wilaya) {
    // Use the centralized wilaya function if available
    if (typeof calculateWilayaDeliveryPrice === 'function') {
      return calculateWilayaDeliveryPrice(wilaya);
    }
    
    // Fallback implementation
    if (!wilaya) return 500; // Default price
    
    // Southern/remote wilayas (800 DA)
    const southernWilayas = [
      'Tamanrasset', 'Adrar', 'Ouargla', 'El Oued', 'Ghardaïa', 'Laghouat',
      'Biskra', 'Béchar', 'Tindouf', 'Illizi', 'El Bayadh', 'Naâma'
    ];
    
    // Check if wilaya is in southern list (higher price)
    const isRemoteWilaya = southernWilayas.some(southWilaya => 
      wilaya.toLowerCase().includes(southWilaya.toLowerCase()) ||
      southWilaya.toLowerCase().includes(wilaya.toLowerCase())
    );
    
    return isRemoteWilaya ? 800 : 500;
  }

  /**
   * Load orders from localStorage (simulating JSON file storage)
   */
  loadOrders() {
    try {
      const ordersData = localStorage.getItem('orders');
      if (ordersData) {
        const data = JSON.parse(ordersData);
        this.orders = data.orders || [];
        this.nextOrderId = data.nextOrderId || 1;
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      this.orders = [];
      this.nextOrderId = 1;
    }
  }

  /**
   * Save orders to localStorage (browser storage)
   */
  saveOrders() {
    try {
      const data = {
        orders: this.orders,
        nextOrderId: this.nextOrderId
      };
      localStorage.setItem('orders', JSON.stringify(data, null, 2));
      
      console.log(`Orders saved to localStorage. Total orders: ${this.orders.length}`);
      
      return true;
    } catch (error) {
      console.error('Error saving orders:', error);
      return false;
    }
  }

  /**
   * Download orders as JSON file to user's computer
   */
  downloadOrdersAsJSON() {
    try {
      const data = {
        orders: this.orders,
        nextOrderId: this.nextOrderId,
        lastUpdated: new Date().toISOString(),
        totalOrders: this.orders.length
      };
      
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `orders-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      console.log('Orders JSON file downloaded successfully');
    } catch (error) {
      console.error('Error downloading orders JSON:', error);
    }
  }

  /**
   * Generate a unique order ID
   */
  generateOrderId() {
    const orderId = `ORD-${new Date().getFullYear()}-${String(this.nextOrderId).padStart(4, '0')}`;
    this.nextOrderId++;
    return orderId;
  }

  /**
   * Create a new order from checkout data
   * @param {Object} checkoutData - Customer and order information
   * @param {Object} cart - Shopping cart items
   * @param {number} subtotal - Order subtotal
   * @returns {Object} Created order object
   */
  createOrder(checkoutData, cart, subtotal) {
    console.log('Creating order with data:', { checkoutData, cart, subtotal });
    
    const orderId = this.generateOrderId();
    const currentDate = new Date();
    
    // Calculate order items with quantities (handle variants)
    const orderItems = Object.keys(cart).map(cartKey => {
      // Extract product ID from cart key (handle variants)
      const productId = cartKey.split('-')[0];
      const product = products.find(p => p.id === productId);
      const quantity = cart[cartKey];
      
      // Get variant info if available
      let variantInfo = null;
      if (window.state && window.state.cartVariants && window.state.cartVariants[cartKey]) {
        variantInfo = window.state.cartVariants[cartKey];
      }
      
      console.log(`Processing item: Product ID ${productId}, Quantity ${quantity}`, product);
      
      return {
        productId: productId,
        productName: product ? product.name : 'Unknown Product',
        productPrice: product ? product.price : 0,
        quantity: quantity,
        itemTotal: product ? product.price * quantity : 0,
        selectedColor: variantInfo ? variantInfo.color : null,
        selectedSize: variantInfo ? variantInfo.size : null,
        cartKey: cartKey // Store for reference
      };
    });

    // Calculate totals
    const orderSubtotal = orderItems.reduce((sum, item) => sum + item.itemTotal, 0);
    const deliveryPrice = this.calculateDeliveryPrice(checkoutData.wilaya);
    const orderTotal = orderSubtotal + deliveryPrice;

    const order = {
      orderId: orderId,
      orderDate: currentDate.toISOString(),
      orderDateFormatted: currentDate.toLocaleDateString(getCurrentLanguage() === 'ar' ? 'ar-DZ' : 'en-US'),
      status: 'pending',
      customer: {
        fullName: checkoutData.fullName,
        email: checkoutData.email,
        phone: checkoutData.phone,
        wilaya: checkoutData.wilaya,
        wilayaName: this.getWilayaName(checkoutData.wilaya),
        address: checkoutData.address
      },
      items: orderItems,
      pricing: {
        subtotal: orderSubtotal,
        deliveryPrice: deliveryPrice,
        total: orderTotal
      },
      language: getCurrentLanguage(),
      createdAt: currentDate.getTime(),
      isGuestOrder: true // Since this is frontend-only order management
    };

    console.log('Created order:', order);

    // Add order to collection
    this.orders.push(order);
    
    // Save orders
    const saveResult = this.saveOrders();
    console.log('Order save result:', saveResult);
    
    // Update product quantities
    this.updateProductQuantities(orderItems);
    
    return order;
  }

  /**
   * Get wilaya name from code
   * @param {string} wilayaCode - Wilaya code
   * @returns {string} Wilaya name
   */
  getWilayaName(wilayaCode) {
    if (typeof getWilayaByCode === 'function') {
      const wilaya = getWilayaByCode(wilayaCode);
      if (wilaya) {
        const language = getCurrentLanguage();
        switch (language) {
          case 'ar':
            return wilaya.nameAr;
          case 'fr':
            return wilaya.nameFr;
          default:
            return wilaya.name;
        }
      }
    }
    return wilayaCode;
  }

  /**
   * Update product quantities after order
   * @param {Array} orderItems - Array of order items
   */
  updateProductQuantities(orderItems) {
    orderItems.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        // Reduce main stock
        product.stock = Math.max(0, product.stock - item.quantity);
        
        // Reduce variant stock if applicable
        if (item.selectedColor && product.colors) {
          const colorVariant = product.colors.find(c => c.name === item.selectedColor);
          if (colorVariant) {
            colorVariant.stock = Math.max(0, colorVariant.stock - item.quantity);
          }
        }
        
        if (item.selectedSize && product.sizes) {
          const sizeVariant = product.sizes.find(s => s.name === item.selectedSize);
          if (sizeVariant) {
            sizeVariant.stock = Math.max(0, sizeVariant.stock - item.quantity);
          }
        }
        
        // Update availability status
        if (product.stock === 0) {
          product.available = false;
        }
        
        console.log(`Updated product ${product.name}: stock ${product.stock}, available ${product.available}`);
      }
    });

    // Save updated products to localStorage
    this.saveProducts();
    
    // Trigger product grid update
    if (typeof renderProducts === 'function') {
      renderProducts();
    }
  }

  /**
   * Save products to localStorage (simulating JSON file update)
   */
  saveProducts() {
    try {
      if (typeof saveProductsToStorage === 'function') {
        return saveProductsToStorage();
      } else {
        localStorage.setItem('products', JSON.stringify(products, null, 2));
        console.log('Products updated after order');
        return true;
      }
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  }

  /**
   * Get order by ID
   * @param {string} orderId - Order ID
   * @returns {Object|null} Order object or null
   */
  getOrderById(orderId) {
    return this.orders.find(order => order.orderId === orderId) || null;
  }

  /**
   * Get all orders
   * @returns {Array} Array of all orders
   */
  getAllOrders() {
    return [...this.orders];
  }

  /**
   * Get orders by status
   * @param {string} status - Order status
   * @returns {Array} Array of orders with specified status
   */
  getOrdersByStatus(status) {
    return this.orders.filter(order => order.status === status);
  }

  /**
   * Get current delivery price for selected wilaya
   * Used by cart system for real-time price updates
   * @returns {number} Current delivery price
   */
  getCurrentDeliveryPrice() {
    const wilayaSelect = document.getElementById('wilayaSelect');
    const selectedWilaya = wilayaSelect ? wilayaSelect.value : '';
    return this.calculateDeliveryPrice(selectedWilaya);
  }

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} newStatus - New status
   * @returns {boolean} Success status
   */
  updateOrderStatus(orderId, newStatus) {
    const order = this.getOrderById(orderId);
    if (order) {
      order.status = newStatus;
      order.updatedAt = new Date().getTime();
      this.saveOrders();
      return true;
    }
    return false;
  }

  /**
   * Manual export of all orders to JSON file
   */
  exportOrdersToFile() {
    this.downloadOrdersAsJSON();
  }

  /**
   * Upload and import orders from JSON file
   */
  importOrdersFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          if (data.orders && Array.isArray(data.orders)) {
            this.orders = data.orders;
            this.nextOrderId = data.nextOrderId || this.orders.length + 1;
            
            // Save to localStorage
            localStorage.setItem('orders', JSON.stringify({
              orders: this.orders,
              nextOrderId: this.nextOrderId
            }, null, 2));
            
            console.log(`Imported ${this.orders.length} orders from file`);
            resolve(this.orders.length);
          } else {
            reject(new Error('Invalid orders file format'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  }

  /**
   * Generate order summary for customer
   * @param {Object} order - Order object
   * @returns {string} Formatted order summary
   */
  generateOrderSummary(order) {
    const currency = getCurrentLanguage() === 'ar' ? 'دج' : (getCurrentLanguage() === 'fr' ? 'DA' : 'DA');
    
    let summary = `${t('order.confirmation')}\n\n`;
    summary += `${t('order.id')}: ${order.orderId}\n`;
    summary += `${t('order.date')}: ${order.orderDateFormatted}\n`;
    summary += `${t('customer.name')}: ${order.customer.fullName}\n`;
    summary += `${t('customer.wilaya')}: ${order.customer.wilayaName}\n\n`;
    
    summary += `${t('order.items')}:\n`;
    order.items.forEach(item => {
      const variantText = [item.selectedColor, item.selectedSize].filter(Boolean).join(', ');
      const itemDescription = variantText ? `${item.productName} (${variantText})` : item.productName;
      summary += `- ${itemDescription} x${item.quantity} = ${formatCurrency(item.itemTotal)}\n`;
    });
    
    summary += `\n${t('order.subtotal')}: ${formatCurrency(order.pricing.subtotal)}\n`;
    summary += `${t('order.delivery')}: ${formatCurrency(order.pricing.deliveryPrice)}\n`;
    summary += `${t('order.total')}: ${formatCurrency(order.pricing.total)}\n`;
    
    return summary;
  }
}

// Create global order manager instance
const orderManager = new OrderManager();

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.orderManager = orderManager;
  window.OrderManager = OrderManager;
}
