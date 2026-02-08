import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, TrendingUp, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { analytics as mockAnalytics } from '../../data/mockData';

const AnalyticsPage = () => {
    const navigate = useNavigate();
    const { orders, loading } = useProducts();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Dynamic calculations based on real orders
    const analyticsData = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
        const totalOrders = orders.length;

        // Count unique customers
        const uniqueCustomers = new Set(orders.map(o => o.customer_phone)).size;

        const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        // Sales trend (last 7 days)
        const salesTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dailyRevenue = orders
                .filter(o => o.created_at.startsWith(dateStr))
                .reduce((sum, o) => sum + (o.price || 0), 0);
            salesTrend.push({ date: dateStr, revenue: dailyRevenue });
        }

        // Top products
        const productStats = orders.reduce((acc, order) => {
            const name = order.product_name || 'Unknown Product';
            if (!acc[name]) {
                acc[name] = { productName: name, sales: 0, revenue: 0 };
            }
            acc[name].sales += (order.quantity || 1);
            acc[name].revenue += (order.price || 0);
            return acc;
        }, {});

        const topProducts = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // Recent activity
        const recentActivity = orders.slice(0, 5).map(order => ({
            type: 'order',
            message: `${order.customer_name}님이 새로운 주문을 하셨습니다.`,
            time: new Date(order.created_at).toLocaleString()
        }));

        return {
            overview: { totalRevenue, totalOrders, totalCustomers: uniqueCustomers, avgOrderValue },
            salesTrend,
            topProducts,
            recentActivity
        };
    };

    const stats = analyticsData();

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
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            <div className="lg:hidden bg-primary text-white p-4 flex items-center justify-between sticky top-0 z-50">
                <h1 className="font-heading text-xl font-bold">MAGDEE ADMIN</h1>
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-primary text-white p-6 transform transition-transform duration-300 z-50 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
                <h1 className="font-heading text-2xl font-bold mb-10 hidden lg:block">MAGDEE</h1>
                <nav className="space-y-2 flex-grow">
                    <Link to="/admin/dashboard" className="flex items-center gap-3 py-3 px-4 hover:bg-white/10 rounded-xl transition-all">
                        <ShoppingCart size={20} />
                        <span className="font-medium">Orders & Products</span>
                    </Link>
                    <Link to="/admin/dashboard/customers" className="flex items-center gap-3 py-3 px-4 hover:bg-white/10 rounded-xl transition-all">
                        <Users size={20} />
                        <span className="font-medium">Customers</span>
                    </Link>
                    <Link to="/admin/dashboard/analytics" className="flex items-center gap-3 py-3 px-4 bg-white/10 rounded-xl transition-all">
                        <TrendingUp size={20} />
                        <span className="font-bold">Analytics</span>
                    </Link>
                </nav>
                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center justify-center gap-2 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-200 rounded-xl transition-all border border-red-500/20"
                >
                    <LogOut size={18} />
                    <span className="font-bold">Logout</span>
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Analytics Dashboard</h2>
                        <p className="text-gray-500 mt-1 font-medium">Real-time business performance metrics</p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Calculating analytics data...</p>
                        </div>
                    ) : (
                        <>
                            {/* Overview Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <AnalyticsCard
                                    label="Total Revenue"
                                    value={`₩${stats.overview.totalRevenue.toLocaleString()}`}
                                    icon={<DollarSign className="text-green-600" />}
                                    bgColor="bg-green-50"
                                    accentColor="text-green-600"
                                />
                                <AnalyticsCard
                                    label="Total Orders"
                                    value={stats.overview.totalOrders}
                                    icon={<ShoppingCart className="text-blue-600" />}
                                    bgColor="bg-blue-50"
                                    accentColor="text-blue-600"
                                />
                                <AnalyticsCard
                                    label="Active Customers"
                                    value={stats.overview.totalCustomers}
                                    icon={<Users className="text-purple-600" />}
                                    bgColor="bg-purple-50"
                                    accentColor="text-purple-600"
                                />
                                <AnalyticsCard
                                    label="Average Order"
                                    value={`₩${stats.overview.avgOrderValue.toLocaleString()}`}
                                    icon={<TrendingUp className="text-orange-600" />}
                                    bgColor="bg-orange-50"
                                    accentColor="text-orange-600"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Sales Trend */}
                                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-bold text-gray-900">Sales Velocity (Last 7 Days)</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-3 h-3 bg-primary rounded-full"></div>
                                                <span>Revenue</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-72 flex items-end gap-3 lg:gap-6">
                                        {stats.salesTrend.map((day, idx) => {
                                            const maxVal = Math.max(...stats.salesTrend.map(d => d.revenue), 1);
                                            const height = (day.revenue / maxVal) * 100;
                                            return (
                                                <div key={idx} className="flex-1 flex flex-col items-center group">
                                                    <div
                                                        className="w-full bg-primary/20 hover:bg-primary transition-all duration-500 rounded-t-xl relative cursor-help"
                                                        style={{ height: `${Math.max(height, 5)}%` }}
                                                    >
                                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-xl">
                                                            ₩{day.revenue.toLocaleString()}
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-tighter">
                                                        {day.date.split('-').slice(1).join('/')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Top Products */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing</h3>
                                    <div className="space-y-5">
                                        {stats.topProducts.map((product, idx) => (
                                            <div key={idx} className="flex items-center gap-4 group">
                                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 text-xs border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                                                    {idx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{product.productName}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{product.sales} Sales</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-primary text-sm">₩{product.revenue.toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {stats.topProducts.length === 0 && (
                                            <div className="py-10 text-center text-gray-400 font-medium">데이터가 없습니다.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Live Activity Feed</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {stats.recentActivity.map((activity, idx) => (
                                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                            <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-50 text-blue-600">
                                                <ShoppingCart size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-snug">{activity.message}</p>
                                                <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase flex items-center gap-1.5">
                                                    <TrendingUp size={10} />
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {stats.recentActivity.length === 0 && (
                                        <div className="col-span-full py-10 text-center text-gray-400 font-medium font-bold uppercase tracking-widest text-xs">No Recent Activity Detected</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

const AnalyticsCard = ({ label, value, icon, bgColor, accentColor }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-all hover:shadow-md">
        <div className={`p-3.5 ${bgColor} rounded-2xl shadow-sm border border-white/50`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black text-gray-900 tracking-tight`}>{value}</p>
        </div>
    </div>
);

export default AnalyticsPage;
