import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { products as initialProducts } from '../data/mockData';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState(() => {
        try {
            const savedProducts = localStorage.getItem('magdee_products');
            return savedProducts ? JSON.parse(savedProducts) : initialProducts;
        } catch (error) {
            console.error('Error parsing products from localStorage:', error);
            return initialProducts;
        }
    });

    const [settings, setSettings] = useState(() => {
        try {
            const savedSettings = localStorage.getItem('magdee_settings');
            return savedSettings ? JSON.parse(savedSettings) : {
                adminPhone: '',
                adminEmail: '',
                businessName: 'MAGDEE',
                businessAddress: '',
            };
        } catch (error) {
            console.error('Error parsing settings from localStorage:', error);
            return {
                adminPhone: '',
                adminEmail: '',
                businessName: 'MAGDEE',
                businessAddress: '',
            };
        }
    });

    // Save products to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('magdee_products', JSON.stringify(products));
    }, [products]);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('magdee_settings', JSON.stringify(settings));
    }, [settings]);

    // Sync across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'magdee_products' && e.newValue) {
                setProducts(JSON.parse(e.newValue));
            }
            if (e.key === 'magdee_settings' && e.newValue) {
                setSettings(JSON.parse(e.newValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addProduct = (product) => {
        const newProduct = {
            ...product,
            id: Math.max(...products.map(p => p.id), 0) + 1,
        };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const updateProduct = (id, updatedData) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, ...updatedData } : p
        ));
    };

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };

    const toggleFeatured = (id) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
        ));
    };

    const toggleBestSeller = (id) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, isBestSeller: !p.isBestSeller } : p
        ));
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const value = {
        products,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleBestSeller,
        updateSettings,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

ProductProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
