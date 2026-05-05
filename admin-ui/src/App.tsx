import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';
import './i18n';

const AdminManagementPage = lazy(() => import('./pages/AdminManagementPage'));

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
            
            {/* Protected routes that require admin or super_admin role */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard - available to both admin and super_admin */}
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Regular admin routes - products, categories, orders */}
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Super Admin Only - Admin Management */}
            <Route element={<ProtectedRoute requiredRole="super_admin" />}>
              <Route path="/admin-management" element={
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div>Loading...</div></div>}>
                  <AdminManagementPage />
                </Suspense>
              } />
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