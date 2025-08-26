import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log('Adding auth token to request');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    } else {
      console.warn('No user data found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (productData: any) => {
    console.log('Creating product:', productData);
    return api.post('/products', productData);
  },
  update: (id: string, productData: any) => {
    console.log('Updating product:', id, productData);
    return api.put(`/products/${id}`, productData);
  },
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (categoryData: any) => {
    console.log('Creating category:', categoryData);
    return api.post('/categories', categoryData);
  },
  update: (id: string, categoryData: any) => {
    console.log('Updating category:', id, categoryData);
    return api.put(`/categories/${id}`, categoryData);
  },
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (orderData: any) => api.post('/orders', orderData),
  updateStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

export default api;