import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

const ProductContext = createContext();

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [settings, setSettings] = useState({
        adminPhone: '',
        adminEmail: '',
        businessName: 'MAGDEE',
        businessAddress: '',
    });
    const [loading, setLoading] = useState(true);

    // Initial data fetch from Supabase
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (productsError) throw productsError;
                if (productsData) setProducts(productsData);

                // Fetch Settings
                const { data: settingsData, error: settingsError } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'site_config')
                    .single();

                if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
                if (settingsData) setSettings(settingsData.value);

            } catch (error) {
                console.error('Error fetching data from Supabase:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Real-time synchronization
    useEffect(() => {
        const productsChannel = supabase
            .channel('public:products')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setProducts(prev => [...prev, payload.new]);
                } else if (payload.eventType === 'UPDATE') {
                    setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
                } else if (payload.eventType === 'DELETE') {
                    setProducts(prev => prev.filter(p => p.id !== payload.old.id));
                }
            })
            .subscribe();

        const settingsChannel = supabase
            .channel('public:settings')
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'settings', filter: 'key=eq.site_config' }, (payload) => {
                setSettings(payload.new.value);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(settingsChannel);
        };
    }, []);

    const addProduct = async (product) => {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();

        if (error) {
            console.error('Error adding product:', error.message);
            return null;
        }
        return data[0];
    };

    const updateProduct = async (id, updatedData) => {
        const { error } = await supabase
            .from('products')
            .update(updatedData)
            .eq('id', id);

        if (error) {
            console.error('Error updating product:', error.message);
        }
    };

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting product:', error.message);
        }
    };

    const toggleFeatured = async (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        await updateProduct(id, { isFeatured: !product.isFeatured });
    };

    const toggleBestSeller = async (id) => {
        const product = products.find(p => p.id === id);
        if (!product) return;

        await updateProduct(id, { isBestSeller: !product.isBestSeller });
    };

    const updateSettings = async (newSettings) => {
        const updatedSettings = { ...settings, ...newSettings };
        const { error } = await supabase
            .from('settings')
            .update({ value: updatedSettings })
            .eq('key', 'site_config');

        if (error) {
            console.error('Error updating settings:', error.message);
        } else {
            setSettings(updatedSettings);
        }
    };

    const value = {
        products,
        settings,
        loading,
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
