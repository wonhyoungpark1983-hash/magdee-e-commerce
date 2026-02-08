import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Button from '../components/Button';
import PurchaseModal from '../components/PurchaseModal';
import { useProducts } from '../context/ProductContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { products, settings } = useProducts();
    const product = products.find(p => p.id === parseInt(id));

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [showDescription, setShowDescription] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    const stockStatus = product.stock > 10 ? 'In Stock' : 'Low Stock';
    const stockColor = product.stock > 10 ? 'text-green-600' : 'text-orange-600';

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Product Images */}
                    <div>
                        <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="flex gap-2 mb-2">
                            {product.isFeatured && (
                                <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                    NEW ARRIVAL
                                </span>
                            )}
                        </div>
                        <p className="text-xs uppercase text-gray-500 tracking-wider mb-2">
                            {product.brand}
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-bold text-gray-900 mb-4">
                            ₩{product.price.toLocaleString()}
                        </p>
                        {product.stock > 0 && (
                            <p className={`text-sm font-semibold mb-6 ${stockColor}`}>
                                {stockStatus} ({product.stock} items)
                            </p>
                        )}

                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {product.category}
                            </span>
                        </div>

                        {/* Available Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Available Sizes
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${selectedSize === size
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Available Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-900 mb-3">
                                    Available Colors
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-4 py-2 border-2 rounded-lg font-medium transition-colors ${selectedColor === color
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                }`}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Purchase Button */}
                        <div className="space-y-3 mb-8">
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={() => {
                                    if (!selectedSize && product.sizes?.length > 0) {
                                        alert('사이즈를 선택해주세요.');
                                        return;
                                    }
                                    if (!selectedColor && product.colors?.length > 0) {
                                        alert('컬러를 선택해주세요.');
                                        return;
                                    }
                                    setShowPurchaseModal(true);
                                }}
                            >
                                <MessageCircle className="mr-2" size={24} />
                                구매/문의하기
                            </Button>
                            <p className="text-sm text-gray-500 text-center">
                                왓츠앱으로 간편하게 구매 요청하세요
                            </p>
                        </div>

                        {/* Product Description */}
                        <div className="border-t border-gray-200">
                            <button
                                onClick={() => setShowDescription(!showDescription)}
                                className="w-full py-4 flex items-center justify-between text-left font-semibold"
                            >
                                Product Description
                                <span>{showDescription ? '−' : '+'}</span>
                            </button>
                            {showDescription && (
                                <div className="pb-4 text-gray-600">
                                    {product.description}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Modal */}
            <PurchaseModal
                product={product}
                isOpen={showPurchaseModal}
                onClose={() => setShowPurchaseModal(false)}
                adminPhone={settings.adminPhone || ''}
                initialSize={selectedSize}
                initialColor={selectedColor}
            />
        </div>
    );
};

export default ProductDetailPage;
