import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Send } from 'lucide-react';
import Button from './Button';
import Input from './Input';

import { useProducts } from '../context/ProductContext';

const PurchaseModal = ({ product, isOpen, onClose, adminPhone, initialSize, initialColor, initialQuantity }) => {
    // Safety check: Don't render if product is missing
    if (isOpen && !product) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                    <p className="text-gray-600 mb-4">Unable to load product information.</p>
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        );
    }
    const { createOrder } = useProducts();
    const [orderResult, setOrderResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: localStorage.getItem('magdee_last_phone') || '',
        address: '',
        selectedSize: initialSize || '',
        selectedColor: initialColor || '',
        quantity: initialQuantity || 1,
    });


    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                selectedSize: initialSize || product.sizes?.[0] || '',
                selectedColor: initialColor || product.colors?.[0] || '',
                quantity: initialQuantity || 1,
            }));
            setOrderResult(null); // Reset result when opening
        }
    }, [isOpen, initialSize, initialColor, initialQuantity, product]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const orderData = {
            product_id: product.id,
            product_name: product.name,
            customer_name: formData.name,
            customer_phone: formData.phone,
            address: formData.address,
            size: formData.selectedSize,
            color: formData.selectedColor,
            quantity: parseInt(formData.quantity) || 1,
            status: 'PENDING',
            price: product.price // Save price at order time
        };

        try {
            // 1. Save to Supabase
            const result = await createOrder(orderData);

            if (!result) {
                alert('Failed to save order. Please try again.');
                setLoading(false);
                return;
            }

            // 2. Set success state
            setOrderResult(result);

            // Store phone in localStorage for easy lookup later
            localStorage.setItem('magdee_last_phone', formData.phone);

        } catch (error) {
            console.error('Order submission error:', error);
            alert('An error occurred while processing your order.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Purchase Request</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 sm:pb-6">
                    {orderResult ? (
                        <div className="py-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">Order Completed!</h3>
                            <p className="text-gray-600">
                                Thank you for your order. We will contact you shortly after verification.
                            </p>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                                <p className="text-sm text-gray-500 mb-1">Order Number</p>
                                <p className="font-mono font-bold text-lg text-primary">{orderResult.id}</p>
                            </div>
                            <div className="pt-4 space-y-3">
                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={() => {
                                        onClose();
                                        window.location.href = '/my-orders';
                                    }}
                                >
                                    Check Order History
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="w-full"
                                    onClick={onClose}
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <form id="purchase-form" onSubmit={handleSubmit} className="space-y-4">
                            {/* Product Info */}
                            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm sm:text-base leading-tight">{product?.name || 'No Product Name'}</h4>
                                    <p className="text-xs text-gray-500">{product?.brand || ''}</p>
                                    <p className="font-black text-primary text-sm sm:text-base mt-0.5">₩{(product?.price || 0).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Input
                                    label="Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="John Doe"
                                    required
                                />

                                <Input
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="010-1234-5678"
                                    required
                                />
                            </div>

                            <Input
                                label="Delivery Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="123 Street, City..."
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                {/* Size Selection */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Size <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="selectedSize"
                                            value={formData.selectedSize}
                                            onChange={handleInputChange}
                                            className="input-field w-full text-sm py-2"
                                            required
                                        >
                                            {product.sizes.map((size) => (
                                                <option key={size} value={size}>{size}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Color Selection */}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                            Color <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="selectedColor"
                                            value={formData.selectedColor}
                                            onChange={handleInputChange}
                                            className="input-field w-full text-sm py-2"
                                            required
                                        >
                                            {product.colors.map((color) => (
                                                <option key={color} value={color}>{color}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Selection */}
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Quantity <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, parseInt(prev.quantity) - 1) }))}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                        disabled={formData.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value) || 1;
                                            // Enforce max stock limit
                                            const validVal = Math.min(Math.max(1, val), product.stock);
                                            setFormData(prev => ({ ...prev, quantity: validVal }));
                                        }}
                                        className="input-field w-16 text-center text-sm font-bold"
                                        min="1"
                                        max={product.stock}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, quantity: Math.min(product.stock, parseInt(prev.quantity) + 1) }))}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                                        disabled={formData.quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                    <span className="text-xs text-gray-400 ml-2">
                                        (Max: {product.stock})
                                    </span>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* Fixed Footer for Mobile */}
                {!orderResult && (
                    <div className="p-4 sm:p-6 border-t border-gray-100 bg-white sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] sm:shadow-none">
                        <Button
                            form="purchase-form"
                            type="submit"
                            variant="accent"
                            className="w-full flex items-center justify-center py-4 sm:py-3"
                            disabled={loading}
                        >
                            <Send size={18} className="mr-2" />
                            {loading ? 'Processing...' : 'Place Order'}
                        </Button>
                        <p className="text-[10px] text-gray-400 text-center mt-3 uppercase font-bold tracking-tight">
                            Order info is saved and can be tracked in real-time
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

PurchaseModal.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        sizes: PropTypes.arrayOf(PropTypes.string),
        colors: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    adminPhone: PropTypes.string.isRequired,
    initialSize: PropTypes.string,
    initialColor: PropTypes.string,
    initialQuantity: PropTypes.number,
};

export default PurchaseModal;
