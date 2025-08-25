import { useEffect, useState } from 'react';
import { productsAPI, ordersAPI, categoriesAPI } from '../services/api';

interface Stats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalCategories: number;
  pendingOrders: number;
}

const useStats = () => {
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    totalCategories: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsResponse, ordersResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAll(),
        ordersAPI.getAll(),
        categoriesAPI.getAll(),
      ]);

      const totalRevenue = ordersResponse.data.reduce((sum: number, order: any) => {
        return sum + (order.totalPrice || 0);
      }, 0);

      const pendingOrders = ordersResponse.data.filter((order: any) => 
        order.status === 'pending'
      ).length;

      setStats({
        totalProducts: productsResponse.data.length,
        totalOrders: ordersResponse.data.length,
        totalRevenue,
        totalCategories: categoriesResponse.data.length,
        pendingOrders,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch statistics');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    ...stats,
    loading,
    error,
    refetch: fetchStats,
  };
};

export default useStats;