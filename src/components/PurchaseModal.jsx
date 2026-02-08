import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Send } from 'lucide-react';
import Button from './Button';
import Input from './Input';

const PurchaseModal = ({ product, isOpen, onClose, adminPhone, initialSize, initialColor }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        selectedSize: initialSize || product.sizes?.[0] || '',
        selectedColor: initialColor || product.colors?.[0] || '',
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                selectedSize: initialSize || product.sizes?.[0] || '',
                selectedColor: initialColor || product.colors?.[0] || '',
            }));
        }
    }, [isOpen, initialSize, initialColor, product]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format WhatsApp message
        const message = `[MAGDEE 구매 요청]
고객명: ${formData.name}
연락처: ${formData.phone}
제품: ${product.name}
브랜드: ${product.brand}
사이즈: ${formData.selectedSize}
컬러: ${formData.selectedColor}
가격: ₩${product.price.toLocaleString()}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create WhatsApp URL (remove any non-numeric characters from phone)
        const cleanPhone = adminPhone.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank');

        // Close modal
        onClose();
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

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Product Info */}
                    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="font-bold text-primary">₩{product.price.toLocaleString()}</p>
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

                    {/* Submit Button */}
                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="accent"
                            className="w-full flex items-center justify-center"
                        >
                            <Send size={18} className="mr-2" />
                            왓츠앱으로 구매 요청
                        </Button>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            왓츠앱이 열리면서 구매 요청 메시지가 전송됩니다
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

PurchaseModal.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
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
};

export default PurchaseModal;
