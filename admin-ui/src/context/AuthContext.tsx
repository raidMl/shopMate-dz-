import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthLogoutCallback } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = () => {
    console.log('🔐 Logging out user');
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('✅ User loaded from localStorage:', parsedUser.email);
        setUser(parsedUser);
        // Ensure axios default header is set
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
      } catch (err) {
        console.error('Failed to parse user data');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);

    // Register logout callback for API interceptor
    setAuthLogoutCallback(logout);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔑 Attempting login for:', email);
      
      const response = await axios.post('http://localhost:8080/api/users/login', { 
        email, 
        password 
      });
      
      const userData = response.data;
      console.log('✅ Login successful for:', email, 'Role:', userData.role);
      
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      // Set axios default header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      console.log('✅ Token set in axios headers');
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('✅ User data stored in localStorage');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login';
      console.error('❌ Login failed:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
