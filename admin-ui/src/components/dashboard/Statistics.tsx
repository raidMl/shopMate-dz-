import React from 'react';
// Fix the import to use default import
import useStats from '../../hooks/useStats';

const Statistics: React.FC = () => {
    const { totalOrders, totalProducts, totalRevenue } = useStats();

    return (
        <div className="statistics-container">
            <div className="stat-card">
                <h3>Total Orders</h3>
                <p>{totalOrders || 0}</p>
            </div>
            <div className="stat-card">
                <h3>Total Products</h3>
                <p>{totalProducts || 0}</p>
            </div>
            <div className="stat-card">
                <h3>Total Revenue</h3>
                <p>${totalRevenue ? totalRevenue.toFixed(2) : '0.00'}</p>
            </div>
        </div>
    );
};

export default Statistics;