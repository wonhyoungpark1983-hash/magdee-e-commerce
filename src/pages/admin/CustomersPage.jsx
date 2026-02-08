import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, Search, Mail, Phone } from 'lucide-react';
import { customers as mockCustomers } from '../../data/mockData';

const CustomersPage = () => {
    const navigate = useNavigate();
    const { orders, loading } = useProducts();
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Derive customers from orders
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
                totalSpent: order.price || 0,
                orderCount: 1,
                lastOrder: order.created_at,
                address: order.address,
                // Status mapping for visual variety (mocked for now but based on data)
                status: (order.price > 1000000) ? 'VIP' : 'Regular'
            });
        }
        return acc;
    }, []);

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

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
    }, [selectedStatus, searchTerm, orders]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin');
    };

    const getStatusBadge = (status) => {
        const styles = {
            VIP: 'bg-purple-100 text-purple-800',
            Regular: 'bg-blue-100 text-blue-800',
            New: 'bg-green-100 text-green-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
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
                    <Link to="/admin/dashboard/customers" className="block py-2 px-4 bg-white bg-opacity-10 rounded-lg font-medium">
                        Customers
                    </Link>
                    <Link to="/admin/dashboard/analytics" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Customers</h2>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage customer information</p>
                    </div>

                    {/* Stats Cards */}
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
                                ₩{Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
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

                            {/* Status Filter */}
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
                                        {status === 'all' ? '전체' : status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Customers Table */}
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

export default CustomersPage;
