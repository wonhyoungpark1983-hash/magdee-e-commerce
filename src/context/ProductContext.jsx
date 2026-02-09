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
    const [orders, setOrders] = useState([]);
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

                // Fetch Orders
                const { data: ordersData, error: ordersError } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (ordersError) throw ordersError;
                if (ordersData) setOrders(ordersData);

                // Fetch Settings
                const { data: settingsData, error: settingsError } = await supabase
                    .from('settings')
                    .select('value')
                    .eq('key', 'site_config')
                    .single();

                if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;
                if (settingsData && settingsData.value) {
                    setSettings(prev => ({ ...prev, ...settingsData.value }));
                }

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

        const ordersChannel = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setOrders(prev => [payload.new, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setOrders(prev => prev.map(o => o.id === payload.new.id ? payload.new : o));
                } else if (payload.eventType === 'DELETE') {
                    setOrders(prev => prev.filter(o => o.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(productsChannel);
            supabase.removeChannel(settingsChannel);
            supabase.removeChannel(ordersChannel);
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

    const createOrder = async (orderData) => {
        try {
            // 1. Check current stock first
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('stock')
                .eq('id', orderData.product_id)
                .single();

            if (productError || !productData) {
                console.error('Error checking stock:', productError);
                return null;
            }

            if (productData.stock < orderData.quantity) {
                alert(`Not enough stock! Only ${productData.stock} left.`);
                return null;
            }

            // 2. Deduct stock
            const newStock = productData.stock - orderData.quantity;
            const { error: updateError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', orderData.product_id);

            if (updateError) {
                console.error('Error updating stock:', updateError);
                return null;
            }

            // 3. Create Order
            const { data, error } = await supabase
                .from('orders')
                .insert([orderData])
                .select();

            if (error) {
                console.error('Error creating order:', error.message);
                // ROLLBACK: Restore stock if order fails
                await supabase
                    .from('products')
                    .update({ stock: productData.stock })
                    .eq('id', orderData.product_id);
                return null;
            }
            return data[0];
        } catch (err) {
            console.error('Unexpected error in createOrder:', err);
            return null;
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

        const { error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', orderId);

        if (error) {
            console.error('Error updating order status:', error.message);
            // Revert on error - re-fetch from supabase to be safe
            const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            if (data) setOrders(data);
        }
    };

    const deleteOrder = async (id) => {
        const { error, count } = await supabase
            .from('orders')
            .delete({ count: 'exact' })
            .eq('id', id);

        if (error) {
            console.error('Error deleting order:', error.message);
            alert(`Failed to delete order: ${error.message}`);
            return false;
        } else if (count === 0) {
            // RLS Policy likely blocked the deletion silently
            console.error('Delete operation returned 0 rows affected (RLS blocked?)');
            alert('Delete Failed: Permission Denied (Database Policy blocked existing deletion). Please check Supabase RLS.');
            return false;
        } else {
            // Optimistic update
            setOrders(prev => prev.filter(o => String(o.id) !== String(id)));
            return true;
        }
    };

    const getOrdersByPhone = (phone) => {
        return orders.filter(order => order.customer_phone === phone);
    };

    const value = {
        products,
        orders,
        settings,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleFeatured,
        toggleBestSeller,
        updateSettings,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        getOrdersByPhone,
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
