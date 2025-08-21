/**
 * Admin Panel Component
 * Handles order management and admin functions
 */

function initAdminPanel() {
  // Admin panel toggle
  $('#adminPanel').addEventListener('click', () => {
    updateAdminStats();
    $('#adminModal').showModal();
  });

  // Export orders
  $('#exportOrders').addEventListener('click', () => {
    orderManager.exportOrdersToFile();
    toast('Orders exported successfully!', 'success');
  });

  // Import orders
  $('#importOrdersBtn').addEventListener('click', () => {
    $('#importOrders').click();
  });

  $('#importOrders').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const count = await orderManager.importOrdersFromFile(file);
        toast(`Imported ${count} orders successfully!`, 'success');
        updateAdminStats();
        e.target.value = ''; // Reset file input
      } catch (error) {
        toast(`Import failed: ${error.message}`, 'error');
      }
    }
  });

  // View orders
  $('#viewOrders').addEventListener('click', () => {
    showOrdersView();
  });

  // Reset products
  $('#resetProducts').addEventListener('click', () => {
    if (confirm('Reset all product stock to original values?')) {
      if (typeof resetProductsFromJSON === 'function') {
        resetProductsFromJSON();
        toast('Product stock reset successfully!', 'success');
      } else {
        toast('Reset function not available', 'error');
      }
    }
  });

  // Clear all orders
  $('#clearAllOrders').addEventListener('click', () => {
    if (confirm('Delete ALL orders? This cannot be undone!')) {
      orderManager.orders = [];
      orderManager.nextOrderId = 1;
      orderManager.saveOrders();
      updateAdminStats();
      toast('All orders cleared!', 'success');
    }
  });

  // Handle admin modal close
  $('#adminModal').addEventListener('close', handleAdminModalClose);
}

/**
 * Update admin panel statistics
 */
function updateAdminStats() {
  const orderCount = orderManager.getAllOrders().length;
  $('#orderCount').textContent = orderCount;
}

/**
 * Handle admin modal close
 */
function handleAdminModalClose() {
  // Clean up any temporary UI elements
}

/**
 * Show orders view in console (for now)
 */
function showOrdersView() {
  const orders = orderManager.getAllOrders();
  
  if (orders.length === 0) {
    toast('No orders found', 'info');
    return;
  }

  console.group('📋 All Orders');
  orders.forEach((order, index) => {
    console.group(`Order ${index + 1}: ${order.orderId}`);
    console.log('Date:', order.orderDateFormatted);
    console.log('Customer:', order.customer.fullName);
    console.log('Email:', order.customer.email);
    console.log('Wilaya:', order.customer.wilayaName);
    console.log('Items:', order.items.length);
    console.log('Total:', formatCurrency(order.pricing.total));
    console.log('Status:', order.status);
    console.log('Full Order:', order);
    console.groupEnd();
  });
  console.groupEnd();

  toast(`${orders.length} orders logged to console`, 'info');
}

/**
 * Create orders table view (future enhancement)
 */
function createOrdersTableView(orders) {
  // This could be enhanced to show a proper table in a modal
  // For now, we'll just use console logging
  return showOrdersView();
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to ensure orderManager is initialized
  setTimeout(initAdminPanel, 100);
});
