import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI, categoriesAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: Array(12).fill(0),
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [products, categories, orders] = await Promise.all([
          productsAPI.getAll(),
          categoriesAPI.getAll(),
          ordersAPI.getAll(),
        ]);
        
        const pendingOrders = orders.data.filter(
          (order: any) => order.status === 'pending'
        ).length;

        const totalRevenue = orders.data.reduce((sum: number, order: any) => 
          sum + (order.totalPrice || 0), 0
        );

        // Calculate monthly revenue for the chart
        const monthlyRevenue = Array(12).fill(0);
        orders.data.forEach((order: any) => {
          const orderDate = new Date(order.createdAt);
          const month = orderDate.getMonth();
          monthlyRevenue[month] += order.totalPrice || 0;
        });

        // Get recent orders (last 5)
        const recentOrders = orders.data
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setStats({
          products: products.data.length,
          categories: categories.data.length,
          orders: orders.data.length,
          pendingOrders,
          totalRevenue,
          monthlyRevenue,
          recentOrders,
          topProducts: products.data.slice(0, 5), // Top 5 products
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Simple bar chart component
  const SimpleBarChart = ({ data, labels, title }: { data: number[], labels: string[], title: string }) => {
    const maxValue = Math.max(...data);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((value, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 text-sm text-gray-600">{labels[index]}</div>
              <div className="flex-1 mx-3">
                <div className="bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">
                {value.toFixed(0)} da
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Progress ring component
  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = "#4F46E5" }: { 
    percentage: number; 
    size?: number; 
    strokeWidth?: number; 
    color?: string; 
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main Content */}
      <div className="py-6 sm:py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading dashboard...</p>
              </div>
            ) : (
              <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
                {/* Stats Cards - Responsive Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4-8-4m16 0v10l-8 4-8-4V7" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{stats.products}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{stats.categories}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{stats.orders}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                            <dd className="mt-1 text-2xl sm:text-3xl font-semibold text-gray-900">{stats.totalRevenue.toFixed(0)} da</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <SimpleBarChart 
                    data={stats.monthlyRevenue} 
                    labels={monthNames} 
                    title="Monthly Revenue"
                  />

                  <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Completion Rate</h3>
                    <div className="flex items-center justify-center">
                      <ProgressRing 
                        percentage={stats.orders > 0 ? Math.round(((stats.orders - stats.pendingOrders) / stats.orders) * 100) : 0}
                        size={window.innerWidth < 640 ? 100 : 120}
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-600">
                        {stats.orders - stats.pendingOrders} of {stats.orders} orders completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table - Responsive */}
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                    {stats.recentOrders.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentOrders.map((order: any) => (
                              <tr key={order._id}>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  #{order._id.slice(-6)}
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  ${order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'paid' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No recent orders</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
                          