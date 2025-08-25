import React, { useEffect } from 'react';
import useOrders from '../../hooks/useOrders';
import { Order } from '../../types/order';

const OrderList: React.FC = () => {
    const { orders, fetchOrders, loading, error } = useOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) {
        return <div>Loading orders...</div>;
    }

    if (error) {
        return <div>Error loading orders: {error}</div>;
    }

    return (
        <div className="order-list">
            <h2>Recent Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer Name</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.customerName}</td>
                                <td>${order.totalPrice.toFixed(2)}</td>
                                <td>{order.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default OrderList;