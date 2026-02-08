import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, Menu, X, Star, TrendingUp, TrendingDown, ShoppingBag, DollarSign, Clock, Printer, User, MapPin, Phone, Calendar, Package } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { supabase } from '../lib/supabaseClient';
import { useProducts } from '../context/ProductContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { products, orders, loading, addProduct, updateProduct, deleteProduct, toggleFeatured, toggleBestSeller, updateOrderStatus } = useProducts();
    const [activeView, setActiveView] = useState('orders'); // Default to orders for better overview
    const [orderFilter, setOrderFilter] = useState('ALL'); // 'ALL', 'PENDING', 'SHIPPED', etc.
    const [showModal, setShowModal] = useState(false);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        category: 'TOP',
        price: '',
        stock: '',
        description: '',
        image: '',
        sizes: '',
        colors: '',
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const productData = {
            name: formData.name,
            brand: formData.brand,
            category: formData.category,
            price: parseInt(formData.price),
            stock: parseInt(formData.stock),
            description: formData.description,
            image: formData.image,
            sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
            colors: formData.colors.split(',').map(c => c.trim()).filter(c => c !== ''),
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
                    alert('Failed to add product. Please check your database connection or console.');
                    return;
                }
            }

            setShowModal(false);
            setEditingProduct(null);
            resetForm();
        } catch (error) {
            console.error('Submit error:', error);
            alert('An unexpected error occurred. Please try again.');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description || '',
            image: product.image || '',
            sizes: product.sizes?.join(', ') || '',
            colors: product.colors?.join(', ') || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (productId) => {
        if (confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
            alert('Product deleted successfully!');
        }
    };

    const filteredOrders = orderFilter === 'ALL'
        ? orders
        : orders.filter(o => o.status === orderFilter);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            brand: '',
            category: 'TOP',
            price: '',
            stock: '',
            description: '',
            image: '',
            sizes: '',
            colors: '',
        });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'PENDING': return 'Awaiting Payment';
            case 'SHIPPED': return 'Shipped';
            case 'COMPLETED': return 'Completed';
            case 'CANCELLED': return 'Cancelled';
            default: return status;
        }
    };

    // Calculate Stats
    const stats = {
        totalRevenue: orders.filter(o => o.status !== 'CANCELLED').reduce((sum, o) => sum + (o.price || 0), 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        todayOrders: orders.filter(o => {
            const today = new Date().toLocaleDateString();
            const orderDate = new Date(o.created_at).toLocaleDateString();
            return today === orderDate;
        }).length
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
                        onClick={() => { setActiveView('products'); setMobileMenuOpen(false); }}
                        className={`w-full text-left py-2 px-4 rounded-lg font-medium transition ${activeView === 'products' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => { setActiveView('orders'); setMobileMenuOpen(false); }}
                        className={`w-full text-left py-2 px-4 rounded-lg font-medium transition ${activeView === 'orders' ? 'bg-white bg-opacity-10' : 'hover:bg-white hover:bg-opacity-10'}`}
                    >
                        Orders
                    </button>
                    <Link to="/admin/dashboard/settings" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition" onClick={() => setMobileMenuOpen(false)}>
                        Settings
                    </Link>
                    <div className="pt-4 mt-4 border-t border-white border-opacity-10">
                        <Link to="/" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition text-yellow-300 font-semibold">
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
                {/* Summary Cards */}
                {!loading && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-12 lg:mt-0">
                        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                    <DollarSign size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                            <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">₩{stats.totalRevenue.toLocaleString()}</h4>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Today</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">New Orders</p>
                            <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats.todayOrders} EA</h4>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                    <Clock size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">Wait</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Awaiting Payment</p>
                            <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats.pendingOrders} EA</h4>
                        </div>
                        <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Total</span>
                            </div>
                            <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                            <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats.totalOrders} EA</h4>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 mt-12 lg:mt-0">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium animate-pulse">Loading data...</p>
                    </div>
                ) : activeView === 'products' ? (
                    <>
                        {/* Top Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 lg:mb-8 mt-16 lg:mt-0">
                            <div className="mb-4 sm:mb-0">
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Product Management</h2>
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage your product catalog</p>
                            </div>
                            <Button
                                variant="accent"
                                onClick={() => {
                                    setEditingProduct(null);
                                    resetForm();
                                    setShowModal(true);
                                }}
                                className="flex items-center w-full sm:w-auto justify-center"
                            >
                                <Plus size={20} className="mr-2" />
                                Add New Product
                            </Button>
                        </div>

                        {/* Product Table */}
                        <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Image</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Brand</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Category</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Featured</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-center text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Best</th>
                                            <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <img src={product.image} alt={product.name} className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-lg" />
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-gray-900 text-sm lg:text-base">{product.name}</td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 text-sm hidden md:table-cell">{product.brand}</td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 hidden sm:table-cell">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 text-sm lg:text-base">₩{product.price.toLocaleString()}</td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 text-center hidden lg:table-cell">
                                                    <button
                                                        onClick={() => toggleFeatured(product.id)}
                                                        className={`p-2 rounded-lg transition ${product.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                        title="New Arrival"
                                                    >
                                                        <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                                    </button>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4 text-center hidden lg:table-cell">
                                                    <button
                                                        onClick={() => toggleBestSeller(product.id)}
                                                        className={`p-2 rounded-lg transition ${product.isBestSeller ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                                                        title="Best Seller"
                                                    >
                                                        <TrendingUp size={18} />
                                                    </button>
                                                </td>
                                                <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                    <div className="flex items-center space-x-1 lg:space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition"
                                                        >
                                                            <Edit size={16} className="text-gray-600 lg:w-[18px] lg:h-[18px]" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-1.5 lg:p-2 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <Trash2 size={16} className="text-red-600 lg:w-[18px] lg:h-[18px]" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Product List */}
                        <div className="md:hidden space-y-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex gap-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{product.brand}</p>
                                                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                                                </div>
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 max-w-[100px] truncate">{product.category}</span>
                                            </div>
                                            <p className="font-bold text-gray-900 mt-1">₩{product.price.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => toggleFeatured(product.id)}
                                                className={`p-2 rounded-lg transition ${product.isFeatured ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                                            >
                                                <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                            </button>
                                            <button
                                                onClick={() => toggleBestSeller(product.id)}
                                                className={`p-2 rounded-lg transition ${product.isBestSeller ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                                            >
                                                <TrendingUp size={18} />
                                            </button>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Orders View */}
                        <div className="mb-6 lg:mb-8 mt-16 lg:mt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Order Management</h2>
                                <p className="text-gray-600 mt-1 text-sm lg:text-base">View and manage customer orders ({filteredOrders.length})</p>
                            </div>
                            <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100 overflow-x-auto">
                                {['ALL', 'PENDING', 'SHIPPED', 'COMPLETED', 'CANCELLED'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setOrderFilter(status)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition whitespace-nowrap ${orderFilter === status
                                            ? 'bg-primary text-white'
                                            : 'text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1000px]">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Contact</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Details (Size/Color)</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                    No orders found in this category.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-gray-50 font-sans cursor-pointer transition-colors"
                                                    onClick={() => handleOrderClick(order)}
                                                >
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {new Date(order.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-bold text-gray-900">{order.customer_name}</div>
                                                        <div className="text-xs text-gray-500 truncate max-w-[200px]" title={order.address}>{order.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        {order.customer_phone}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                        {order.product_name}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs mr-1">{order.size}</span>
                                                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{order.color}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                        ₩{(order.price || 0).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                        <select
                                                            value={order.status}
                                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer 
                                                                ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                                                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                                                            'bg-red-100 text-red-600'}`}
                                                        >
                                                            <option value="PENDING">Awaiting Payment</option>
                                                            <option value="SHIPPED">Shipped</option>
                                                            <option value="COMPLETED">Completed</option>
                                                            <option value="CANCELLED">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="md:hidden mt-4 space-y-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-all"
                                    onClick={() => handleOrderClick(order)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-gray-900">{order.customer_name}</h4>
                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-full border-0 
                                                ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                                                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                                            'bg-red-100 text-red-600'}`}
                                        >
                                            <option value="PENDING">Awaiting Payment</option>
                                            <option value="SHIPPED">Shipped</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                        <p><span className="font-semibold">Product:</span> {order.product_name}</p>
                                        <p><span className="font-semibold">Details:</span> {order.size} / {order.color}</p>
                                        <p><span className="font-semibold text-primary">Price:</span> ₩{(order.price || 0).toLocaleString()}</p>
                                        <p><span className="font-semibold">Contact:</span> {order.customer_phone}</p>
                                        <p className="truncate"><span className="font-semibold">Address:</span> {order.address}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Add/Edit Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 lg:p-6 border-b border-gray-200">
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                            {/* Form Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                                <Input
                                    label="Brand"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="input-field w-full"
                                        required
                                    >
                                        <option value="OUTER">OUTER</option>
                                        <option value="TOP">TOP</option>
                                        <option value="BOTTOM">BOTTOM</option>
                                        <option value="SHOES">SHOES</option>
                                        <option value="ACCESSORIES">ACCESSORIES</option>
                                    </select>
                                </div>
                                <Input
                                    label="Price (₩)"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <Input
                                label="Stock Quantity"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleInputChange}
                                required
                            />

                            <div className="space-y-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Product Image
                                </label>
                                <div className="flex flex-col space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            try {
                                                const fileExt = file.name.split('.').pop();
                                                const fileName = `${Math.random()}.${fileExt}`;
                                                const filePath = `${fileName}`;

                                                const { error: uploadError } = await supabase.storage
                                                    .from('product-images')
                                                    .upload(filePath, file);

                                                if (uploadError) throw uploadError;

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('product-images')
                                                    .getPublicUrl(filePath);

                                                setFormData(prev => ({ ...prev, image: publicUrl }));
                                                alert('Image uploaded successfully!');
                                            } catch (error) {
                                                console.error('Error uploading image:', error.message);
                                                alert('Error uploading image. Please make sure the "product-images" bucket exists in Supabase.');
                                            }
                                        }}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent file:bg-opacity-10 file:text-accent hover:file:bg-opacity-20 transition-all cursor-pointer"
                                    />
                                    <p className="text-xs text-gray-500">Or enter an image URL below:</p>
                                </div>
                                <Input
                                    label="Image URL"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                    required
                                />
                            </div>

                            <Input
                                label="Sizes (comma-separated)"
                                name="sizes"
                                value={formData.sizes}
                                onChange={handleInputChange}
                                placeholder="S, M, L, XL or Free size"
                                required
                            />

                            <Input
                                label="Colors (comma-separated)"
                                name="colors"
                                value={formData.colors}
                                onChange={handleInputChange}
                                placeholder="Black, White, Gray"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="input-field w-full"
                                    required
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingProduct(null);
                                        resetForm();
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="w-full sm:w-auto">
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col print:m-0 print:p-0 print:shadow-none print:max-h-none">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between print:hidden">
                            <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition"
                                    title="Print Order"
                                >
                                    <Printer size={20} />
                                </button>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="p-8 overflow-y-auto flex-1">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-8 tracking-tight">
                                <div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase mb-2 inline-block
                                        ${selectedOrder.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                            selectedOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-600' :
                                                selectedOrder.status === 'COMPLETED' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'}`}>
                                        {selectedOrder.status}
                                    </span>
                                    <h4 className="text-3xl font-extrabold text-gray-900">INV-{selectedOrder.id.slice(0, 8).toUpperCase()}</h4>
                                    <p className="text-gray-500 mt-1 flex items-center gap-2">
                                        <Calendar size={14} />
                                        {new Date(selectedOrder.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">₩{(selectedOrder.price || 0).toLocaleString()}</p>
                                    <p className="text-gray-400 text-xs font-mono uppercase mt-1">Status: {selectedOrder.status}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-gray-100">
                                {/* Customer Info */}
                                <div className="space-y-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Customer Information</h5>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                                            <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                                                <Phone size={12} />
                                                {selectedOrder.customer_phone}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]">{selectedOrder.address}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-4">
                                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Details</h5>
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{selectedOrder.product_name}</p>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Size: {selectedOrder.size}</span>
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Color: {selectedOrder.color}</span>
                                                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Qty: {selectedOrder.quantity || 1}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8">
                                <div className="flex justify-between items-center bg-gray-50 p-6 rounded-2xl">
                                    <div className="text-sm text-gray-500">
                                        <p className="font-bold text-gray-900 mb-1">Payment Confirmation</p>
                                        <p>The administrator will contact the customer shortly.</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 font-medium">Total Amount</p>
                                        <p className="text-3xl font-black text-gray-900 tracking-tight">₩{(selectedOrder.price || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 print:hidden">
                            <Button variant="secondary" onClick={() => setShowOrderModal(false)}>Close</Button>
                            <Button variant="primary" onClick={handlePrint} className="flex items-center gap-2">
                                <Printer size={18} />
                                Print Slip
                            </Button>
                        </div>
                    </div>
                </div>
            )}

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

export default AdminDashboard;
