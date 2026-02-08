import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, User } from 'lucide-react';

import logo from '../assets/magdee_logo.png';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: 'MY ORDERS', path: '/my-orders' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="MAGDEE" className="h-12 w-auto object-contain" />
                        <div className="flex flex-col">
                            <span className="font-heading text-xl font-bold text-primary leading-none tracking-tight">MAGDEE</span>
                            <span className="text-[10px] tracking-[0.2em] text-gray-500 font-medium mt-0.5">LUXURY WEARS</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${isActive(item.path) ? 'nav-link-active' : 'nav-link'} text-sm`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <Search size={20} className="text-gray-700" />
                        </button>
                        <Link to="/admin" className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden md:block">
                            <User size={20} className="text-gray-700" />
                        </Link>


                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 hover:bg-gray-50 rounded-full transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`block py-2 ${isActive(item.path) ? 'nav-link-active' : 'nav-link'}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            to="/admin"
                            onClick={() => setIsMenuOpen(false)}
                            className="block py-2 nav-link font-bold text-primary flex items-center"
                        >
                            <User size={18} className="mr-2" />
                            ADMIN PAGE
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
