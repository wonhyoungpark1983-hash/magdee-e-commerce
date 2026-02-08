import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, Search, Eye } from 'lucide-react';
import { orders as mockOrders } from '../../data/mockData';

const OrdersPage = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState(mockOrders);
    const [filteredOrders, setFilteredOrders] = useState(mockOrders);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

    useEffect(() => {
        let filtered = orders;

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(order => order.status === selectedStatus);
        }

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredOrders(filtered);
    }, [selectedStatus, searchTerm, orders]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin');
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: '대기',
            processing: '처리중',
            shipped: '배송중',
            delivered: '완료',
            cancelled: '취소',
        };
        return labels[status] || status;
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
                    <Link to="/admin/dashboard/orders" className="block py-2 px-4 bg-white bg-opacity-10 rounded-lg font-medium">
                        Orders
                    </Link>
                    <Link to="/admin/dashboard/customers" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
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
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Orders</h2>
                        <p className="text-gray-600 mt-1 text-sm lg:text-base">Manage customer orders</p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                            {/* Search */}
                            <div className="relative flex-1 lg:max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search by order ID or customer..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
                                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition ${selectedStatus === status
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {status === 'all' ? '전체' : getStatusLabel(status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px]">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Date</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 font-medium text-gray-900 text-sm">{order.id}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 text-sm">{order.customerName}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 text-sm hidden md:table-cell">{order.date}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-900 font-medium text-sm">₩{order.total.toLocaleString()}</td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </td>
                                            <td className="px-4 lg:px-6 py-3 lg:py-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-1.5 lg:p-2 hover:bg-gray-100 rounded-lg transition"
                                                >
                                                    <Eye size={16} className="text-gray-600 lg:w-[18px] lg:h-[18px]" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-4 lg:p-6 border-b border-gray-200">
                            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Order Details</h3>
                            <p className="text-gray-600 mt-1">{selectedOrder.id}</p>
                        </div>

                        <div className="p-4 lg:p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                                <div className="space-y-1 text-sm">
                                    <p><span className="text-gray-600">Name:</span> {selectedOrder.customerName}</p>
                                    <p><span className="text-gray-600">Email:</span> {selectedOrder.customerEmail}</p>
                                    <p><span className="text-gray-600">Address:</span> {selectedOrder.shippingAddress}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.productName}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                            </div>
                                            <p className="font-medium text-gray-900">₩{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium">{selectedOrder.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedOrder.status)}`}>
                                        {getStatusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold mt-4">
                                    <span>Total:</span>
                                    <span>₩{selectedOrder.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
                            >
                                Close
                            </button>
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

export default OrdersPage;
