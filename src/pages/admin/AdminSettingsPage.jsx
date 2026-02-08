import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X, Save } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useProducts } from '../../context/ProductContext';

const AdminSettingsPage = () => {
    const navigate = useNavigate();
    const { settings, updateSettings } = useProducts();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [formData, setFormData] = useState({
        adminPhone: '',
        adminEmail: '',
        businessName: 'MAGDEE',
        businessAddress: '',
    });

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            navigate('/admin');
        }
    }, [navigate]);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleLogout = () => {
        localStorage.removeItem('isAdminAuthenticated');
        navigate('/admin');
    };

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
                    <Link to="/admin/dashboard/analytics" className="block py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-lg transition">
                        Analytics
                    </Link>
                    <Link to="/admin/dashboard/settings" className="block py-2 px-4 bg-white bg-opacity-10 rounded-lg font-medium">
                        Settings
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
                                        placeholder="서울시 강남구..."
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

export default AdminSettingsPage;
