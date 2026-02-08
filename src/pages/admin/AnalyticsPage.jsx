import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { analytics as mockAnalytics } from '../../data/mockData';

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const analytics = mockAnalytics;

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg"
            >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-primary text-white p-6 transform transition-transform duration-300 z-40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <h1 className="font-heading text-2xl font-bold mb-8 mt-12 lg:mt-0">MAGDEE</h1>
                <nav className="space-y-2">
                    <Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
                        Products
                    </Link>
                    <Link to="/admin/dashboard/orders" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
                        Orders
                    </Link>
                    <Link to="/admin/dashboard/customers" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
                        Customers
                    </Link>
                    <Link to="/admin/dashboard/analytics" className="block py-2 px-4 bg-white bg-opacity-10 rounded-lg font-medium">
                        Analytics
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="absolute bottom-6 left-6 right-6 flex items-center justify-center py-2 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition"
                >
                    <LogOut size={18} className="mr-2" />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 p-4 lg:p-8">
                <div className="mt-16 lg:mt-0">
                    {/* Header */}
                    <div className="mb-6 lg:mb-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Analytics</h2>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">Business performance overview</p>
                    </div>

                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Revenue</p>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign size={20} className="text-green-600" />
                                </div>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">₩{analytics.overview.totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">+12.5% from last month</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Orders</p>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <ShoppingCart size={20} className="text-blue-600" />
                                </div>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.overview.totalOrders}</p>
                            <p className="text-xs text-blue-600 mt-1">+8.3% from last month</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Total Customers</p>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Users size={20} className="text-purple-600" />
                                </div>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">{analytics.overview.totalCustomers}</p>
                            <p className="text-xs text-purple-600 mt-1">+15.2% from last month</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-gray-600 text-sm">Avg. Order Value</p>
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <TrendingUp size={20} className="text-orange-600" />
                                </div>
                            </div>
                            <p className="text-2xl lg:text-3xl font-bold text-gray-900">₩{analytics.overview.avgOrderValue.toLocaleString()}</p>
                            <p className="text-xs text-orange-600 mt-1">+3.7% from last month</p>
                        </div>
                    </div>

                    {/* Sales Trend */}
                    <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Trend (Last 9 Days)</h3>
                        <div className="overflow-x-auto">
                            <div className="min-w-[500px]">
                                <div className="flex items-end justify-between h-64 space-x-2">
                                    {analytics.salesTrend.map((day, index) => {
                                        const maxRevenue = Math.max(...analytics.salesTrend.map(d => d.revenue));
                                        const height = (day.revenue / maxRevenue) * 100;
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                <div className="w-full bg-primary rounded-t-lg transition-all hover:bg-opacity-80 cursor-pointer relative group" style={{ height: `${height}%` }}>
                                                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                        ₩{day.revenue.toLocaleString()}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-600 mt-2 text-center">{day.date.slice(5)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Products */}
                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
                            <div className="space-y-3">
                                {analytics.topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 text-sm">{product.productName}</p>
                                            <p className="text-xs text-gray-600">{product.sales} sales</p>
                                        </div>
                                        <p className="font-bold text-gray-900">₩{product.revenue.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {analytics.recentActivity.map((activity, index) => (
                                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className={`p-2 rounded-lg ${activity.type === 'order' ? 'bg-blue-100' : 'bg-green-100'}`}>
                                            {activity.type === 'order' ? (
                                                <ShoppingCart size={16} className="text-blue-600" />
                                            ) : (
                                                <Users size={16} className="text-green-600" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-900">{activity.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile menu */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};

export default AnalyticsPage;
