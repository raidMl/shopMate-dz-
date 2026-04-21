import { useState, useCallback } from 'react';
import { productsAPI } from '../services/api';

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  rating?: number;
  stock: number;
  createdAt: string;
  hue?: number;
  colors?: Array<{
    name: string;
    hex: string;
    stock: number;
  }>;
  sizes?: Array<{
    name: string;
    stock: number;
  }>;
  specifications?: any;
}

const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productsAPI.getAll();
      setProducts(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (productData: any) => {
    try {
      const response = await productsAPI.create(productData);
      setProducts((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: any) => {
    try {
      const response = await productsAPI.update(id, productData);
      setProducts((prev) => 
        prev.map((product) => (product.id === id ? response.data : product))
      );
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;