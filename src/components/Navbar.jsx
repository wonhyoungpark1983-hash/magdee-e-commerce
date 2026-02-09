import { Link, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';

import logo from '../assets/magdee_logo.png';

const Navbar = () => {
    const location = useLocation();

    // Menu items are currently empty as requested to remove the menu
    const menuItems = [];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 backdrop-blur-sm bg-opacity-95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3">
                        <img src={logo} alt="MAGDEE" className="h-10 md:h-12 w-auto object-contain" />
                        <div className="flex flex-col">
                            <span className="font-heading text-lg md:text-xl font-bold text-primary leading-none tracking-tight">MAGDEE</span>
                            <span className="text-[8px] md:text-[10px] tracking-[0.2em] text-gray-500 font-medium mt-0.5">LUXURY WEARS</span>
                        </div>
                    </Link>

                    {/* Desktop Menu (Hidden for now as list is empty, but keeping structure if needed later) */}
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

                    {/* Icons / Actions */}
                    <div className="flex items-center gap-3">
                        {/* Order Tracking Button - Visible on ALL screens now */}
                        <Link
                            to="/my-orders"
                            className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-sm transform hover:scale-105"
                        >
                            <Package size={14} className="md:hidden" />
                            <Package size={16} className="hidden md:block" />
                            <span className="text-[10px] md:text-xs font-bold tracking-wide">ORDER TRACKING</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
