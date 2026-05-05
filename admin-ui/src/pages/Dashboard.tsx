import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { productsAPI, ordersAPI, categoriesAPI, usersAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalAdmins: 0,
    totalUsers: 0,
    monthlyRevenue: Array(12).fill(0),
    recentOrders: [],
    topProducts: [],
  });
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        let admins = [];
        if (user?.role === 'super_admin') {
          try {
            const adminsResponse = await usersAPI.getAllAdmins();
            admins = adminsResponse.data;
          } catch (err) {
            console.error('Error fetching admins:', err);
          }
        }
        
        const [products, categories, orders, users] = await Promise.all([
          productsAPI.getAll(user?.role === 'super_admin' ? undefined : user?._id).catch(() => ({ data: [] })),
          categoriesAPI.getAll(user?.role === 'super_admin' ? undefined : user?._id).catch(() => ({ data: [] })),
          ordersAPI.getAll().catch(() => ({ data: [] })),
          usersAPI.getAllUsers().catch(() => ({ data: [] })),
        ]);
        
        const pendingOrders = (orders.data || []).filter((order: any) => order.status === 'pending').length;
        
        const totalRevenue = (orders.data || []).reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

        const allUsers = users.data || [];
        const adminCount = user?.role === 'super_admin' 
          ? admins.length 
          : allUsers.filter((u: any) => u.role === 'admin' || u.role === 'super_admin').length;

        const monthlyRevenue = Array(12).fill(0);
        (orders.data || []).forEach((order: any) => {
          const month = new Date(order.createdAt).getMonth();
          monthlyRevenue[month] += order.totalPrice || 0;
        });

        const recentOrders = (orders.data || [])
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        
        setStats({
          products: products.data?.length || 0,
          categories: categories.data?.length || 0,
          orders: orders.data?.length || 0,
          pendingOrders,
          totalRevenue,
          totalAdmins: adminCount,
          totalUsers: allUsers.length,
          monthlyRevenue,
          recentOrders,
          topProducts: (products.data || []).slice(0, 5),
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

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
                    className="bg-indigo-600 h-4 rounded-full"
                    style={{ width: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-sm text-gray-900 text-right">{value.toFixed(0)} DA</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ProgressRing = ({ percentage, size = 120, strokeWidth = 8, color = "#4F46E5" }: { percentage: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} stroke="#E5E7EB" strokeWidth={strokeWidth} fill="transparent" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="py-6 sm:py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
                <p className="mt-2 text-gray-600">{t('dashboard.loading')}</p>
              </div>
            ) : (
              <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
                {/* Super Admin Dashboard */}
                {user?.role === 'super_admin' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">👨</div>
                          <div className="ml-4 flex-1">
                            <dt className="text-sm font-medium text-gray-500">Total Admins</dt>
                            <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalAdmins}</dd>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">👥</div>
                          <div className="ml-4 flex-1">
                            <dt className="text-sm font-medium text-gray-500">Total Benefits</dt> 
                             <dd className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalUsers}</dd>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Regular Admin Dashboard */}
                {user?.role === 'admin' && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 sm:gap-5">
                      <StatCard label={t('dashboard.totalProducts')} value={stats.products} icon="📦" color="bg-blue-500" />
                      <StatCard label={t('dashboard.totalCategories')} value={stats.categories} icon="📁" color="bg-green-500" />
                      <StatCard label={t('dashboard.totalOrders')} value={stats.orders} icon="🛒" color="bg-purple-500" />
                      <StatCard label={t('dashboard.totalRevenue')} value={`${stats.totalRevenue.toFixed(0)} DA`} icon="💰" color="bg-yellow-500" />
                      {/* <StatCard label="Total Admins" value={stats.totalAdmins} icon="👨" color="bg-red-500" />
                      <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="bg-indigo-500" /> */}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <SimpleBarChart data={stats.monthlyRevenue} labels={monthNames} title={t('dashboard.monthlyRevenue')} />
                      <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.orderCompletion')}</h3>
                        <div className="flex items-center justify-center">
                          <ProgressRing percentage={stats.orders > 0 ? Math.round(((stats.orders - stats.pendingOrders) / stats.orders) * 100) : 0} size={windowWidth < 640 ? 100 : 120} />
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-sm text-gray-600">{stats.orders - stats.pendingOrders} of {stats.orders} {t('dashboard.ordersCompleted')}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('dashboard.recentOrders')}</h3>
                        {stats.recentOrders.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('orders.orderId')}</th>
                                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('orders.totalPrice')}</th>
                                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('orders.status')}</th>
                                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">{t('orders.createdAt')}</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {stats.recentOrders.map((order: any) => (
                                  <tr key={order._id}>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order._id.slice(-6)}</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(order.totalPrice || 0).toFixed(2)} DA</td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {t(`orders.statuses.${order.status}`)}
                                      </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4">{t('dashboard.noRecentOrders')}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon, color }: { label: string; value: any; icon: string; color: string }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-4 sm:p-6">
      <div className="flex items-center">
        <div className={`${color} w-8 h-8 rounded-md flex items-center justify-center text-white text-lg`}>{icon}</div>
        <div className="ml-4 flex-1">
          <dt className="text-sm font-medium text-gray-500">{label}</dt>
          <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
