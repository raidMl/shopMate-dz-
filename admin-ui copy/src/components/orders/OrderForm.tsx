import React, { useState, useEffect } from 'react';
import { Order, OrderFormData } from '../../types/order';

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: OrderFormData) => Promise<void>;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    products: order?.products || [{ product: '', quantity: 1 }],
    totalPrice: order?.totalPrice || 0,
    status: order?.status || 'pending',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        products: order.products,
        totalPrice: order.totalPrice,
        status: order.status,
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onCancel();
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  const handleProductChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    setFormData({ ...formData, products: updatedProducts });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {order ? 'Edit Order' : 'Create New Order'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product ID
            </label>
            <input
              type="text"
              value={formData.products[0]?.product || ''}
              onChange={(e) => handleProductChange(0, 'product', e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter product ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={formData.products[0]?.quantity || 1}
              onChange={(e) => handleProductChange(0, 'quantity', parseInt(e.target.value))}
              min="1"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Price
            </label>
            <input
              type="number"
              value={formData.totalPrice}
              onChange={(e) => setFormData({ ...formData, totalPrice: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {order ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;