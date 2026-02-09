import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Menu, X, Star, TrendingUp, ShoppingBag, DollarSign, Clock, Search, Mail, Phone, ShoppingCart, Users, Save, Package, Printer } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useProducts } from '../context/ProductContext';

// --- Sub-components (formerly separate pages) ---

const CustomersView = ({ customers }) => {
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        let filtered = customers;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(customer => customer.status === selectedStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone.includes(searchTerm)
            );
        }

        setFilteredCustomers(filtered);
    }, [selectedStatus, searchTerm, customers]);

    const getStatusBadge = (status) => {
        const styles = {
            VIP: 'bg-purple-100 text-purple-800',
            Regular: 'bg-blue-100 text-blue-800',
            New: 'bg-green-100 text-green-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="mt-16 lg:mt-0">
            <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Customers</h2>
                <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage customer information</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                    <p className="text-gray-600 text-sm">Total Customers</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">{customers.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                    <p className="text-gray-600 text-sm">VIP Customers</p>
                    <p className="text-2xl lg:text-3xl font-bold text-purple-600 mt-2">
                        {customers.filter(c => c.status === 'VIP').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                    <p className="text-gray-600 text-sm">New This Month</p>
                    <p className="text-2xl lg:text-3xl font-bold text-green-600 mt-2">
                        {customers.filter(c => c.status === 'New').length}
                    </p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
                    <p className="text-gray-600 text-sm">Avg. Spent</p>
                    <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-2">
                        ₩{customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString() : 0}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="relative flex-1 lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        {['all', 'VIP', 'Regular', 'New'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${selectedStatus === status
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {status === 'all' ? 'All' : status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[640px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Email</th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Phone</th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Orders</th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Total Spent</th>
                                <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                                            <p className="text-xs text-gray-500 md:hidden">{customer.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 text-sm hidden md:table-cell">
                                        <div className="flex items-center">
                                            <Mail size={14} className="mr-1 text-gray-400" />
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 text-sm hidden lg:table-cell">
                                        <div className="flex items-center">
                                            <Phone size={14} className="mr-1 text-gray-400" />
                                            {customer.phone}
                                        </div>
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 font-medium text-sm">{customer.totalOrders}</td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 font-medium text-sm hidden sm:table-cell">
                                        ₩{customer.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="px-4 lg:px-6 py-3 lg:py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(customer.status)}`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const AnalyticsView = ({ orders }) => {
    // Dynamic calculations based on real orders
    const analyticsData = () => {
        const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0);
        const totalOrders = orders.length;
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
            message: `${order.customer_name} placed a new order.`,
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

    return (
        <div className="max-w-7xl mx-auto mt-16 lg:mt-0">
            <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-500 mt-1 font-medium">Real-time business performance metrics</p>
            </div>

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
                            <div className="py-10 text-center text-gray-400 font-medium">No data available.</div>
                        )}
                    </div>
                </div>
            </div>

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
        </div>
    );
};

const SettingsView = ({ settings, updateSettings }) => {
    const [formData, setFormData] = useState({
        adminPhone: '',
        adminEmail: '',
        businessName: 'MAGDEE',
        businessAddress: '',
    });

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateSettings(formData);
        alert('Settings saved successfully!');
    };

    return (
        <div className="max-w-3xl mt-16 lg:mt-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600 mb-8">Manage your business contact information</p>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>

                    <div className="space-y-4">
                        <Input
                            label="Admin Phone Number"
                            name="adminPhone"
                            type="tel"
                            value={formData.adminPhone}
                            onChange={handleInputChange}
                            placeholder="010-1234-5678"
                            required
                        />
                        <p className="text-sm text-gray-500 -mt-2">
                            Enter the phone number where you want to receive order inquiries.
                        </p>

                        <Input
                            label="Email Address"
                            name="adminEmail"
                            type="email"
                            value={formData.adminEmail}
                            onChange={handleInputChange}
                            placeholder="admin@magdee.com"
                            required
                        />
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>

                    <div className="space-y-4">
                        <Input
                            label="Business Name"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            placeholder="MAGDEE"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business Address
                            </label>
                            <textarea
                                name="businessAddress"
                                value={formData.businessAddress}
                                onChange={handleInputChange}
                                rows="3"
                                className="input-field w-full"
                                placeholder="Seoul, Gangnam-gu..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button type="submit" variant="primary" className="flex items-center">
                        <Save size={18} className="mr-2" />
                        Save Settings
                    </Button>
                </div>
            </form>
        </div>
    );
};

// --- Main Dashboard Component ---

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { products, orders, settings, loading, addProduct, updateProduct, deleteProduct, toggleFeatured, toggleBestSeller, updateSettings, updateOrderStatus } = useProducts();
    const [activeView, setActiveView] = useState('orders'); // Default to orders
    const [orderFilter, setOrderFilter] = useState('ACTIVE');
    const [showModal, setShowModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [productFormData, setProductFormData] = useState({
        name: '',
        brand: '',
        category: 'TOP',
        price: '',
        stock: '',
        description: '',
        image: '',
        sizes: '',
        colors: '',
        imageType: 'url', // 'url' or 'file'
    });

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

    // Calculate customers derived from orders for CustomersView
    const customers = orders.reduce((acc, order) => {
        const existing = acc.find(c => c.phone === order.customer_phone);
        if (existing) {
            existing.totalSpent += order.price || 0;
            existing.orderCount += 1;
            if (new Date(order.created_at) > new Date(existing.lastOrder)) {
                existing.lastOrder = order.created_at;
            }
        } else {
            acc.push({
                id: order.id,
                name: order.customer_name,
                phone: order.customer_phone,
                email: order.customer_email || 'No Email',
                totalSpent: order.price || 0,
                orderCount: 1,
                lastOrder: order.created_at,
                address: order.address,
                status: (order.price > 1000000) ? 'VIP' : 'Regular' // Simple mock logic
            });
        }
        return acc;
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: productFormData.name,
            brand: productFormData.brand,
            category: productFormData.category,
            price: parseInt(productFormData.price),
            stock: parseInt(productFormData.stock),
            description: productFormData.description,
            image: productFormData.image,
            sizes: productFormData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
            colors: productFormData.colors.split(',').map(c => c.trim()).filter(c => c !== ''),
        };

        try {
            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
                alert('Product updated successfully!');
            } else {
                const result = await addProduct({
                    ...productData,
                    isFeatured: false,
                    isBestSeller: false,
                });

                if (result) {
                    alert('Product added successfully!');
                } else {
                    alert('Failed to add product.');
                    return;
                }
            }

            setShowModal(false);
            setEditingProduct(null);
            resetProductForm();
        } catch (error) {
            console.error('Submit error:', error);
            alert('An unexpected error occurred.');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setProductFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description || '',
            image: product.image || '',
            sizes: product.sizes?.join(', ') || '',
            colors: product.colors?.join(', ') || '',
            imageType: product.image?.startsWith('data:') ? 'file' : 'url',
        });
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            alert('Product deleted successfully!');
        }
    };

    const resetProductForm = () => {
        setProductFormData({
            name: '',
            brand: '',
            category: 'TOP',
            price: '',
            stock: '',
            description: '',
            image: '',
            sizes: '',
            colors: '',
            imageType: 'url',
        });
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const renderCombinedContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-20 mt-12 lg:mt-0">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading data...</p>
                </div>
            );
        }

        switch (activeView) {
            case 'products':
                return (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 mt-16 lg:mt-0">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Product Management</h2>
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your product catalog</p>
                            </div>
                            <Button
                                variant="accent"
                                onClick={() => {
                                    setEditingProduct(null);
                                    resetProductForm();
                                    setShowModal(true);
                                }}
                                className="flex items-center w-full sm:w-auto justify-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Add New Product
                            </Button>
                        </div>

                        {/* Desktop Product Table */}
                        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Featured</th>
                                            <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Best</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 flex items-center gap-4">
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                                                    <span className="font-medium text-gray-900">{product.name}</span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">₩{product.price.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleFeatured(product.id)}
                                                        className={`p-2 rounded-lg transition ${product.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                                                    >
                                                        <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleBestSeller(product.id)}
                                                        className={`p-2 rounded-lg transition ${product.isBestSeller ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                    >
                                                        <TrendingUp size={18} />
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleEdit(product)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                                                            <Edit size={16} />
                                                        </button>
                                                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Product Cards */}
                        <div className="md:hidden space-y-4 pb-20">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                                    <div className="flex-shrink-0">
                                        <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-gray-900 truncate pr-2">{product.name}</h3>
                                                <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => handleEdit(product)} className="p-1.5 bg-gray-50 rounded-lg text-gray-600">
                                                    <Edit size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-red-50 rounded-lg text-red-600">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-2 flex items-center justify-between">
                                            <span className="font-bold text-primary">₩{product.price.toLocaleString()}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleFeatured(product.id)}
                                                    className={`p-1.5 rounded-lg ${product.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                                                >
                                                    <Star size={14} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                                </button>
                                                <button
                                                    onClick={() => toggleBestSeller(product.id)}
                                                    className={`p-1.5 rounded-lg ${product.isBestSeller ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                                >
                                                    <TrendingUp size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                                    No products found. Add your first product!
                                </div>
                            )}
                        </div>
                    </>
                );
            case 'orders':
                // Filter orders
                const filteredOrders = orders.filter(o => {
                    if (orderFilter === 'ALL') return true;
                    if (orderFilter === 'ACTIVE') return ['PENDING', 'PAID', 'SHIPPED'].includes(o.status);
                    return o.status === orderFilter;
                });

                return (
                    <div className="mt-16 lg:mt-0">
                        <div className="mb-6 lg:mb-8">
                            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Order Management</h2>
                        </div>
                        {/* Order Filters */}
                        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                { id: 'ACTIVE', label: 'Active Orders' },
                                { id: 'COMPLETED', label: 'Completed' },
                                { id: 'CANCELLED', label: 'Cancelled' },
                                { id: 'ALL', label: 'All Orders' }
                            ].map(filter => (
                                <button
                                    key={filter.id}
                                    onClick={() => setOrderFilter(filter.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${orderFilter === filter.id ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        {/* Desktop Order Table */}
                        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOrderClick(order)}>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id.slice(0, 8)}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    <div>{order.customer_name}</div>
                                                    <div className="text-xs text-gray-400">{order.customer_phone}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{order.product_name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                                        ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                                            order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); handleOrderClick(order); }}>View</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {/* Mobile Order Cards */}
                        <div className="md:hidden space-y-4 pb-20">
                            {filteredOrders.map(order => (
                                <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100" onClick={() => handleOrderClick(order)}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400">ORDER #{order.id.slice(0, 8)}</span>
                                            <h3 className="font-bold text-gray-900 mt-1">{order.customer_name}</h3>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold 
                                            ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                                                order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Product:</span>
                                            <span className="font-medium text-gray-900">{order.product_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total:</span>
                                            <span className="font-bold text-primary">₩{order.total_amount?.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button size="sm" variant="secondary" className="w-full" onClick={(e) => { e.stopPropagation(); handleOrderClick(order); }}>
                                        View Details
                                    </Button>
                                </div>
                            ))}
                            {filteredOrders.length === 0 && (
                                <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                                    No orders found in this filter.
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'customers':
                return <CustomersView customers={customers} />;
            case 'analytics':
                return <AnalyticsView orders={orders} />;
            case 'settings':
                return <SettingsView settings={settings} updateSettings={updateSettings} />;
            default:
                return <div>Select a menu item</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 px-3 py-2 bg-primary text-white rounded-lg shadow-lg flex items-center gap-2"
            >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                <span className="text-sm font-bold">MENU</span>
            </button>

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-64 bg-primary text-white p-6 transform transition-transform duration-300 z-40 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <h1 className="font-heading text-2xl font-bold mb-8 mt-12 lg:mt-0">MAGDEE</h1>
                <nav className="space-y-2">
                    <button
                        onClick={() => { setActiveView('orders'); setMobileMenuOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition ${activeView === 'orders' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <ShoppingBag size={20} />
                        Orders
                    </button>
                    <button
                        onClick={() => { setActiveView('products'); setMobileMenuOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition ${activeView === 'products' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <Package size={20} />
                        Products
                    </button>
                    <button
                        onClick={() => { setActiveView('customers'); setMobileMenuOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition ${activeView === 'customers' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <Users size={20} />
                        Customers
                    </button>
                    <button
                        onClick={() => { setActiveView('analytics'); setMobileMenuOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition ${activeView === 'analytics' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <TrendingUp size={20} />
                        Analytics
                    </button>
                    <button
                        onClick={() => { setActiveView('settings'); setMobileMenuOpen(false); }}
                        className={`w-full text-left flex items-center gap-3 py-2 px-4 rounded-lg font-medium transition ${activeView === 'settings' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        <Star size={20} />
                        Settings
                    </button>

                    <div className="pt-4 mt-4 border-t border-white border-opacity-10">
                        <Link to="/" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition text-yellow-300 font-semibold" onClick={() => setMobileMenuOpen(false)}>
                            Go to Store
                        </Link>
                    </div>
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
                {renderCombinedContent()}
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleProductSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Product Name" name="name" value={productFormData.name} onChange={handleInputChange} required />
                                <Input label="Brand" name="brand" value={productFormData.brand} onChange={handleInputChange} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={productFormData.category} onChange={handleInputChange} className="input-field w-full">
                                        <option value="TOP">Top</option>
                                        <option value="BOTTOM">Bottom</option>
                                        <option value="OUTER">Outer</option>
                                        <option value="DRESS">Dress</option>
                                        <option value="ACCESSORY">Accessory</option>
                                    </select>
                                </div>
                                <Input label="Price (₩)" name="price" type="number" value={productFormData.price} onChange={handleInputChange} required />
                            </div>
                            <Input label="Stock" name="stock" type="number" value={productFormData.stock} onChange={handleInputChange} required />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={productFormData.description} onChange={handleInputChange} rows="3" className="input-field w-full"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                                <div className="flex gap-2 mb-2">
                                    <button
                                        type="button"
                                        onClick={() => setProductFormData({ ...productFormData, imageType: 'url' })}
                                        className={`flex-1 py-1 text-sm rounded border ${productFormData.imageType !== 'file' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300'}`}
                                    >
                                        Image URL
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProductFormData({ ...productFormData, imageType: 'file' })}
                                        className={`flex-1 py-1 text-sm rounded border ${productFormData.imageType === 'file' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300'}`}
                                    >
                                        Upload File
                                    </button>
                                </div>

                                {productFormData.imageType === 'file' ? (
                                    <div className="mt-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setProductFormData({ ...productFormData, image: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-opacity-90"
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Select an image from your device.</p>
                                    </div>
                                ) : (
                                    <Input
                                        name="image"
                                        value={productFormData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://..."
                                    />
                                )}

                                {productFormData.image && (
                                    <div className="mt-2 p-2 border rounded-lg bg-gray-50 text-center">
                                        <img src={productFormData.image} alt="Preview" className="max-h-40 mx-auto rounded shadow-sm" />
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Sizes (comma separated)" name="sizes" value={productFormData.sizes} onChange={handleInputChange} placeholder="S, M, L" />
                                <Input label="Colors (comma separated)" name="colors" value={productFormData.colors} onChange={handleInputChange} placeholder="Black, White" />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" variant="primary">{editingProduct ? 'Update Product' : 'Add Product'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
                        <button onClick={() => setShowOrderModal(false)} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full print:hidden">
                            <X size={20} />
                        </button>
                        <div className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold">Order Details</h2>
                                <p className="text-gray-500 text-sm mt-1">Order #{selectedOrder.id}</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Product Info</h4>
                                    <div className="flex gap-4">
                                        {selectedOrder.product_image && (
                                            <img src={selectedOrder.product_image} alt="Product" className="w-16 h-16 rounded-lg object-cover" />
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900">{selectedOrder.product_name}</p>
                                            <p className="text-sm text-gray-600">Option: {selectedOrder.size} / {selectedOrder.color}</p>
                                            <p className="text-sm text-gray-600">Qty: {selectedOrder.quantity || 1}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</h4>
                                        <p className="font-medium">{selectedOrder.customer_name}</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.customer_phone}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amount</h4>
                                        <p className="font-bold text-xl text-primary">₩{(selectedOrder.price || 0).toLocaleString()}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Address</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                        {selectedOrder.address}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Status</h4>
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => {
                                            updateOrderStatus(selectedOrder.id, e.target.value);
                                            setSelectedOrder({ ...selectedOrder, status: e.target.value });
                                        }}
                                        className="input-field w-full"
                                    >
                                        <option value="PENDING">Pending Payment</option>
                                        <option value="SHIPPED">Shipped</option>
                                        <option value="COMPLETED">Completed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3 print:hidden">
                                <Button variant="secondary" onClick={handlePrint} className="flex-1 flex items-center justify-center">
                                    <Printer size={18} className="mr-2" />
                                    Print Invoice
                                </Button>
                                <Button variant="primary" onClick={() => setShowOrderModal(false)} className="flex-1">
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
