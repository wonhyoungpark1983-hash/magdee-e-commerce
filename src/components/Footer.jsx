import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Footer = () => {
    const { settings } = useProducts();

    return (
        <footer className="bg-primary text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-heading text-2xl font-bold mb-4">{settings.businessName || 'MAGDEE'}</h3>
                        <p className="text-gray-300 text-sm">
                            Modern Fashion Redefined
                        </p>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
                        <div className="space-y-3 text-sm">
                            {settings.adminEmail && (
                                <div className="flex items-center space-x-2">
                                    <Mail size={16} />
                                    <a href={`mailto:${settings.adminEmail}`} className="hover:text-gray-300 transition">
                                        {settings.adminEmail}
                                    </a>
                                </div>
                            )}
                            {settings.adminPhone && (
                                <div className="flex items-center space-x-2">
                                    <Phone size={16} />
                                    <a
                                        href={`tel:${settings.adminPhone}`}
                                        className="hover:text-gray-300 transition"
                                    >
                                        {settings.adminPhone || '010-1234-5678'}
                                    </a>
                                </div>
                            )}
                            {settings.businessAddress && (
                                <div className="flex items-start space-x-2">
                                    <MapPin size={16} className="mt-1 flex-shrink-0" />
                                    <span className="text-gray-300">{settings.businessAddress}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <div className="space-y-2 text-sm">
                            <Link to="/products" className="block hover:text-gray-300 transition">All Products</Link>
                            <Link to="/new" className="block hover:text-gray-300 transition">New Arrivals</Link>
                            <Link to="/sale" className="block hover:text-gray-300 transition">Sale</Link>
                            <Link to="/my-orders" className="block hover:text-gray-300 transition font-medium text-white">My Orders</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white border-opacity-20 mt-8 pt-8 text-center text-sm text-gray-300 flex flex-col items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} {settings.businessName || 'MAGDEE'}. All rights reserved.</p>
                    <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-400 opacity-50 transition-opacity hover:opacity-100">
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
