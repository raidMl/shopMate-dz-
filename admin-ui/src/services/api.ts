import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store a reference to the auth context's logout function
let logoutCallback: (() => void) | null = null;

export const setAuthLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
          // Ensure headers object exists
          if (!config.headers) {
            config.headers = {};
          }
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log(`✅ Token added for ${user.email} (${user.role}): ${user.token.substring(0, 20)}...`);
        } else {
          console.warn('⚠️ No token in user data');
        }
      } else {
        console.warn('⚠️ No user data in localStorage for request');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      const url = error.config?.url || 'unknown';
      const method = error.config?.method?.toUpperCase() || 'unknown';
      console.error(`❌ 401 Unauthorized on ${method} ${url}`);
      console.log('Authorization header:', error.config?.headers?.Authorization ? 'Present' : 'Missing');
      console.log('Token in localStorage:', localStorage.getItem('user') ? 'Yes' : 'No');
      console.warn('⚠️ Unauthorized (401) - Clearing auth token and logging out');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      
      // Call the logout callback if it exists
      if (logoutCallback) {
        logoutCallback();
      }
    } else if (error.response?.data) {
      console.error('❌ API Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: (adminId?: string) => {
    const params = adminId ? { adminId } : {};
    return api.get('/products', { params });
  },
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
  getAll: (adminId?: string) => {
    const params = adminId ? { adminId } : {};
    return api.get('/categories', { params });
  },
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

// Users/Admins API
export const usersAPI = {
  // Admin management
  getAllAdmins: () => api.get('/users/admins'),
  getAdminById: (id: string) => api.get(`/users/admins/${id}`),
  createAdmin: (adminData: any) => api.post('/users/admins', adminData),
  updateAdmin: (id: string, adminData: any) => api.put(`/users/admins/${id}`, adminData),
  deleteAdmin: (id: string) => api.delete(`/users/admins/${id}`),
  changeAdminStatus: (id: string, status: string) => api.patch(`/users/admins/${id}/status`, { status }),
  changeAdminPassword: (id: string, data: any) => api.put(`/users/admins/${id}/password`, data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData: { name: string }) => api.put('/users/profile', profileData),
  
  // All users
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
};

// Site Config API
export const siteConfigAPI = {
  getConfig: () => api.get('/site-config'),
  initialize: (data: { siteName: string; email: string; phone: string }) => api.post('/site-config/initialize', data),
  update: (id: string, configData: any) => api.put(`/site-config/${id}`, configData),
  updateSection: (id: string, section: string, data: any) => api.patch(`/site-config/${id}/${section}`, data)
};

// Delivery API
export const deliveryAPI = {
  getPrices: () => api.get('/delivery'),
  updatePrice: (data: { wilaya: string; domicile: number; bureau: number }) => api.post('/delivery', data),
  updateAllPrices: (prices: any) => api.post('/delivery/bulk', { prices })
};

export default api;