import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { categories, sortOptions } from '../data/mockData';
import { useProducts } from '../context/ProductContext';

const ProductsPage = () => {
    const { products } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState('latest');

    const filteredProducts = selectedCategory === 'ALL'
        ? products
        : products.filter(p => p.category === selectedCategory);

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'popular':
                return (b.badge === 'BEST' ? 1 : 0) - (a.badge === 'BEST' ? 1 : 0);
            default:
                return b.id - a.id;
        }
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-6">ALL PRODUCTS</h1>

                {/* Filter and Sort Bar */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Load More Button */}
                <div className="mt-12 text-center">
                    <button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                        LOAD MORE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
