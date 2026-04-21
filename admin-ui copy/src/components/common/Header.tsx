import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1>Admin Dashboard</h1>
            <nav>
                <ul>
                    <li><a href="/orders">Orders</a></li>
                    <li><a href="/products">Products</a></li>
                    <li><a href="/dashboard">Dashboard</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;