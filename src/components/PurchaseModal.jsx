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
                    <p className="text-gray-600 mb-4">상품 정보를 불러올 수 없습니다.</p>
                    <Button onClick={onClose}>닫기</Button>
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
                alert('주문 저장에 실패했습니다. 다시 시도해 주세요.');
                setLoading(false);
                return;
            }

            // 2. Set success state
            setOrderResult(result);

            // Store phone in localStorage for easy lookup later
            localStorage.setItem('magdee_last_phone', formData.phone);

        } catch (error) {
            console.error('Order submission error:', error);
            alert('주문 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">구매 요청</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {orderResult ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Send size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">주문이 완료되었습니다!</h3>
                        <p className="text-gray-600">
                            주문해 주셔서 감사합니다. 관리자가 확인 후 순차적으로 연락 드릴 예정입니다.
                        </p>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left">
                            <p className="text-sm text-gray-500 mb-1">주문 번호</p>
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
                                주문 내역 확인하기
                            </Button>
                            <Button
                                variant="secondary"
                                className="w-full"
                                onClick={onClose}
                            >
                                쇼핑 계속하기
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Product Info */}
                        <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                                <h4 className="font-semibold text-gray-900">{product?.name || '상품명 없음'}</h4>
                                <p className="text-sm text-gray-600">{product?.brand || ''}</p>
                                <p className="font-bold text-primary">₩{(product?.price || 0).toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Customer Info */}
                        <Input
                            label="이름"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="홍길동"
                            required
                        />

                        <Input
                            label="연락처"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="010-1234-5678"
                            required
                        />

                        <Input
                            label="배송 주소"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="서울특별시 강남구..."
                            required
                        />

                        {/* Size Selection */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    사이즈 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="selectedSize"
                                    value={formData.selectedSize}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    컬러 <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="selectedColor"
                                    value={formData.selectedColor}
                                    onChange={handleInputChange}
                                    className="input-field w-full"
                                    required
                                >
                                    {product.colors.map((color) => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Quantity Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                수량 <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, quantity: Math.max(1, parseInt(prev.quantity) - 1) }))}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleInputChange}
                                    className="input-field w-20 text-center"
                                    min="1"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, quantity: parseInt(prev.quantity) + 1 }))}
                                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="accent"
                                className="w-full flex items-center justify-center"
                                disabled={loading}
                            >
                                <Send size={18} className="mr-2" />
                                {loading ? '처리 중...' : '주문하기'}
                            </Button>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                주문 정보가 저장되며 실시간으로 확인 가능합니다
                            </p>
                        </div>
                    </form>
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
