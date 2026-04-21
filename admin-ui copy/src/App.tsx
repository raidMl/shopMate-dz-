import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import './App.css';

// Import i18n configuration
import './i18n';

function App() {
  useEffect(() => {
    // Set initial document direction based on stored language
    const storedLanguage = localStorage.getItem('i18nextLng') || 'en';
    document.documentElement.lang = storedLanguage;
    document.documentElement.dir = storedLanguage === 'ar' ? 'rtl' : 'ltr';
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected admin routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>
            
            {/* Redirect to dashboard if logged in, otherwise to login */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Catch all route - 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;