import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CategoriesPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">E-Commerce Admin</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <Link to="/dashboard" className="text-gray-500 hover:text-gray-900">Dashboard</Link>
                <Link to="/products" className="text-gray-500 hover:text-gray-900">Products</Link>
                <Link to="/categories" className="text-gray-900 font-medium">Categories</Link>
                <Link to="/orders" className="text-gray-500 hover:text-gray-900">Orders</Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <p>Categories page content will go here</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
