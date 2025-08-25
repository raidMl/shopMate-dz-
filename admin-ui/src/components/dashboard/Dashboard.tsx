import React from 'react';
// Fix imports to use default imports instead of named imports
import OrderList from '../orders/OrderList';
import ProductList from '../products/ProductList';
import Statistics from './Statistics';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <Statistics />
      <div className="dashboard-lists">
        <ProductList />
        <OrderList />
      </div>
    </div>
  );
};

export default Dashboard;