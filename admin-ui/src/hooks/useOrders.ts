import { useEffect, useState, useCallback } from 'react';
import { ordersAPI } from '../services/api';

interface Order {
  _id: string;
  user: string;
  products: any[];
  totalPrice: number;
  status: string;
  qrCode?: string;
  createdAt: string;
  customerName?: string;
}

const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = async (orderData: any) => {
    try {
      const response = await ordersAPI.create(orderData);
      setOrders((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create order');
      throw err;
    }
  };

  const updateOrder = async (id: string, status: string) => {
    try {
      const response = await ordersAPI.updateStatus(id, status);
      setOrders((prev) => prev.map((order) => (order._id === id ? response.data : order)));
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update order');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await ordersAPI.delete(id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete order');
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
    updateOrder,
    deleteOrder,
  };
};

export default useOrders;