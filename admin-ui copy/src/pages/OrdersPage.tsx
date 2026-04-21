import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

interface Order {
  _id: string;
  user?: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image?: string;
    };
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
  }>;
  totalPrice: number;
  deliveryPrice: number;
  finalTotal: number;
  customerInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    wilaya: string;
  };
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  qrCode?: string;
  isGuestOrder: boolean;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      await ordersAPI.delete(orderId);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const deleteSelectedOrders = async () => {
    if (selectedOrders.size === 0) {
      alert('Please select orders to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedOrders.size} selected order(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      const deletePromises = Array.from(selectedOrders).map(orderId => ordersAPI.delete(orderId));
      await Promise.all(deletePromises);
      setSelectedOrders(new Set());
      setSelectAll(false);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error deleting selected orders:', error);
    }
  };

  const bulkUpdateStatus = async (newStatus: string) => {
    if (selectedOrders.size === 0) {
      alert('Please select orders to update.');
      return;
    }

    try {
      const updatePromises = Array.from(selectedOrders).map(orderId => 
        ordersAPI.updateStatus(orderId, newStatus)
      );
      await Promise.all(updatePromises);
      setSelectedOrders(new Set());
      setSelectAll(false);
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating selected orders:', error);
    }
  };

  const toggleSelectOrder = (orderId: string) => {
    const newSelectedOrders = new Set(selectedOrders);
    if (newSelectedOrders.has(orderId)) {
      newSelectedOrders.delete(orderId);
    } else {
      newSelectedOrders.add(orderId);
    }
    setSelectedOrders(newSelectedOrders);
    setSelectAll(newSelectedOrders.size === orders.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders(new Set());
      setSelectAll(false);
    } else {
      setSelectedOrders(new Set(orders.map(order => order._id)));
      setSelectAll(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const printOrderDetails = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order._id.slice(-8).toUpperCase()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              font-size: 12px; 
              line-height: 1.4; 
              color: #333;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
            }
            .company-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: #0ea5e9;
              margin-bottom: 5px;
            }
            .order-title { 
              font-size: 18px; 
              margin-top: 10px;
              color: #333;
            }
            .section { 
              margin-bottom: 25px; 
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .section-title { 
              font-size: 14px; 
              font-weight: bold; 
              margin-bottom: 10px;
              color: #0ea5e9;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
            }
            .info-row { 
              display: flex; 
              margin-bottom: 8px; 
            }
            .info-label { 
              font-weight: bold; 
              min-width: 80px; 
              color: #555;
            }
            .info-value { 
              flex: 1; 
            }
            .products-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px;
            }
            .products-table th, .products-table td { 
              border: 1px solid #ddd; 
              padding: 8px; 
              text-align: left; 
            }
            .products-table th { 
              background-color: #f5f5f5; 
              font-weight: bold;
            }
            .total-section { 
              background-color: #f8f9fa; 
              padding: 15px;
              border-radius: 5px;
              margin-top: 20px;
            }
            .total-row { 
              display: flex; 
              justify-content: space-between; 
              font-size: 16px; 
              font-weight: bold;
              color: #0ea5e9;
            }
            .status-badge { 
              display: inline-block; 
              padding: 4px 8px; 
              border-radius: 15px; 
              font-size: 10px; 
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-pending { background-color: #fef3c7; color: #92400e; }
            .status-paid { background-color: #dbeafe; color: #1e40af; }
            .status-shipped { background-color: #e0e7ff; color: #5b21b6; }
            .status-delivered { background-color: #d1fae5; color: #065f46; }
            .status-cancelled { background-color: #fee2e2; color: #991b1b; }
            .footer { 
              margin-top: 30px; 
              text-align: center; 
              font-size: 10px; 
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .qr-code { 
              text-align: center; 
              margin: 15px 0; 
            }
            .qr-code img { 
              width: 80px; 
              height: 80px; 
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            @media print {
              body { padding: 10px; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">ShopMate</div>
            <div style="font-size: 12px; color: #666;">Modern E-Commerce Platform</div>
            <div class="order-title">DELIVERY LABEL</div>
            <div style="font-size: 14px; margin-top: 5px;">Order #${order._id.slice(-8).toUpperCase()}</div>
          </div>

          <div class="grid">
            <div class="section">
              <div class="section-title">📦 DELIVERY INFORMATION</div>
              <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value">${order.customerInfo.fullName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${order.customerInfo.phone}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Wilaya:</span>
                <span class="info-value">${order.customerInfo.wilaya}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Address:</span>
                <span class="info-value">${order.customerInfo.address}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${order.customerInfo.email}</span>
              </div>
            </div>

            <div class="section">
              <div class="section-title">📋 ORDER INFORMATION</div>
              <div class="info-row">
                <span class="info-label">Order ID:</span>
                <span class="info-value">#${order._id.slice(-8).toUpperCase()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">${new Date(order.createdAt).toLocaleTimeString()}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                  <span class="status-badge status-${order.status}">
                    ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Type:</span>
                <span class="info-value">${order.isGuestOrder ? 'Guest Order' : 'Registered User'}</span>
              </div>
              ${order.qrCode ? `
                <div class="qr-code">
                  <div style="font-weight: bold; margin-bottom: 5px;">QR Code:</div>
                  <img src="${order.qrCode}" alt="Order QR Code" />
                </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">🛍️ PRODUCTS (${order.products.length} items)</div>
            <table class="products-table">
              <thead>
                <tr>
                  <th style="width: 40%;">Product</th>
                  <th style="width: 10%;">Qty</th>
                  <th style="width: 15%;">Color</th>
                  <th style="width: 15%;">Size</th>
                  <th style="width: 20%; text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.products.map(item => `
                  <tr>
                    <td>${item.product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.selectedColor || '-'}</td>
                    <td>${item.selectedSize || '-'}</td>
                    <td style="text-align: right;">${(item.product.price * item.quantity).toFixed(2)} DA</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ddd;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: bold;">Subtotal:</span>
                <span>${order.totalPrice.toFixed(2)} DA</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-weight: bold;">Delivery:</span>
                <span>${(order.deliveryPrice || 500).toFixed(2)} DA</span>
              </div>
            </div>
          </div>

          <div class="total-section">
            <div class="total-row">
              <span>TOTAL AMOUNT:</span>
              <span>${order.finalTotal ? order.finalTotal.toFixed(2) : (order.totalPrice + (order.deliveryPrice || 500)).toFixed(2)} DA</span>
            </div>
          </div>

          <div class="footer">
            <div><strong>ShopMate</strong> - Modern E-Commerce Platform</div>
            <div>Contact: shopemate.dz@gmail.com | (+213) 669453240</div>
            <div>Printed on: ${new Date().toLocaleString()}</div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{t('orders.title')}</h2>
          
          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <div className="flex items-center space-x-4 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                {selectedOrders.size} order(s) selected
              </span>
              
              <div className="flex space-x-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      bulkUpdateStatus(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="text-xs border border-blue-300 rounded px-2 py-1 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>Update Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <button
                  onClick={deleteSelectedOrders}
                  className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Delete Selected
                </button>
                
                <button
                  onClick={() => {
                    setSelectedOrders(new Set());
                    setSelectAll(false);
                  }}
                  className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors duration-200"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-4">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className={`hover:bg-gray-50 ${selectedOrders.has(order._id) ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedOrders.has(order._id)}
                            onChange={() => toggleSelectOrder(order._id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{order.customerInfo.fullName}</div>
                            <div className="text-gray-500 text-xs">{order.customerInfo.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {order.finalTotal ? order.finalTotal.toFixed(2) : (order.totalPrice + (order.deliveryPrice || 500)).toFixed(2)} DA
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                            <div className="text-gray-500 text-xs">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="paid">Paid</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => printOrderDetails(order)}
                              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                              title="Print Delivery Label"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => deleteOrder(order._id)}
                              className="inline-flex items-center px-2 py-1 border border-red-300 text-xs font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                              title="Delete Order"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => toggleOrderDetails(order._id)}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md transition-all duration-200 ${
                              expandedOrderId === order._id
                                ? 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                                : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                          >
                            <span className="mr-1">
                              {expandedOrderId === order._id ? 'Hide' : 'Show'} Details
                            </span>
                            <svg
                              className={`w-4 h-4 transition-transform duration-200 ${
                                expandedOrderId === order._id ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                      {/* Order Details Row */}
                      <tr className={`transition-all duration-300 ease-in-out ${expandedOrderId === order._id ? 'opacity-100' : 'opacity-0'}`}>
                        <td colSpan={8} className="px-0 py-0">
                          <div 
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                              expandedOrderId === order._id ? 'max-h-96' : 'max-h-0'
                            }`}
                          >
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Customer Information */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Customer Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div><span className="font-medium text-gray-600">Name:</span> {order.customerInfo.fullName}</div>
                                    <div><span className="font-medium text-gray-600">Email:</span> {order.customerInfo.email}</div>
                                    <div><span className="font-medium text-gray-600">Phone:</span> {order.customerInfo.phone}</div>
                                    <div><span className="font-medium text-gray-600">Wilaya:</span> {order.customerInfo.wilaya}</div>
                                    <div><span className="font-medium text-gray-600">Address:</span> {order.customerInfo.address}</div>
                                    <div>
                                      <span className="font-medium text-gray-600">Order Type:</span>
                                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                        order.isGuestOrder ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                                      }`}>
                                        {order.isGuestOrder ? 'Guest Order' : 'Registered User'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Products Information */}
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                  <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    Products ({order.products.length} items)
                                  </h4>
                                  <div className="space-y-3">
                                    {order.products.map((item, index) => (
                                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                                        {item.product.image && (
                                          <img 
                                            src={item.product.image} 
                                            alt={item.product.name}
                                            className="w-12 h-12 object-cover rounded-md"
                                          />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <div className="text-sm font-medium text-gray-900 truncate">
                                            {item.product.name}
                                          </div>
                                          <div className="text-xs text-gray-500 space-x-2">
                                            <span>Qty: {item.quantity}</span>
                                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                          </div>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {(item.product.price * item.quantity).toFixed(2)} DA
                                        </div>
                                      </div>
                                      
                                    ))}
                                  </div>
                                  
                                  {/* Order Summary */}
                                  <div className="mt-4 pt-3 border-t border-gray-200">
                                   <div className="text-xs font-semibold text-gray-600">
                                     Livraison: {order.deliveryPrice ? order.deliveryPrice.toFixed(2) : '500.00'} DA
                                   </div>
                                    <br />
                                    <div className="flex justify-between items-center">
                                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                                      <span className="text-lg font-bold text-blue-600">
                                        {order.finalTotal ? order.finalTotal.toFixed(2) : (order.totalPrice + (order.deliveryPrice || 500)).toFixed(2)} DA
                                      </span>
                                    </div>
                                    {order.qrCode && (
                                      <div className="mt-3">
                                        <span className="text-sm font-medium text-gray-600">QR Code:</span>
                                        <img 
                                          src={order.qrCode} 
                                          alt="Order QR Code" 
                                          className="mt-1 w-20 h-20 border rounded-md"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;
             