import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, PackageSearch } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { categories, sortOptions } from '../data/mockData';
import { useProducts } from '../context/ProductContext';
import Input from '../components/Input';

const ProductsPage = () => {
    const { products, loading } = useProducts();
    const [selectedCategory, setSelectedCategory] = useState('ALL');
    const [sortBy, setSortBy] = useState('latest');
    const [searchQuery, setSearchQuery] = useState('');

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading products...</p>
            </div>
        );
    }

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const inStock = product.stock > 0;
        return matchesCategory && matchesSearch && inStock;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'popular':
                return (b.badge === 'BEST' ? 1 : 0) - (a.badge === 'BEST' ? 1 : 0);
            default:
                // Handle different ID types (string UUID vs number) for sort
                if (typeof a.id === 'number' && typeof b.id === 'number') {
                    return b.id - a.id;
                }
                return (b.created_at || '').localeCompare(a.created_at || '');
        }
    });

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-8 border-b border-gray-100">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SHOP ALL</h1>
                        <p className="text-gray-500 mt-2">Discover our curated collection of premium products</p>
                    </div>
                    <div className="mt-6 md:mt-0 flex items-center text-sm font-medium text-gray-500">
                        <span className="text-primary font-bold mr-1">{filteredProducts.length}</span> items found
                    </div>
                </div>

                {/* Search and Filters Container */}
                <div className="space-y-6 mb-12">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <Input
                                name="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search products or brands..."
                                icon={Search}
                                className="w-full"
                            />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-400 whitespace-nowrap hidden sm:block">SORT BY</span>
                            <div className="relative flex-1 lg:flex-none">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full lg:w-48 px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-bold text-gray-700 appearance-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                >
                                    {sortOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <SlidersHorizontal size={16} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex items-center text-gray-400 mr-2 border-r border-gray-200 pr-4">
                            <Filter size={18} className="mr-2" />
                            <span className="text-xs font-bold uppercase tracking-wider">Category</span>
                        </div>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shadow-sm border ${selectedCategory === category
                                    ? 'bg-primary text-white border-primary shadow-primary/20 scale-105'
                                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Grid */}
                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PackageSearch size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No products found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your search or category filters</p>
                        <button
                            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Load More Button - Only if there are many products */}
                {sortedProducts.length > 12 && (
                    <div className="mt-16 text-center">
                        <button className="px-10 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-2xl font-bold hover:border-primary hover:text-primary transition-all shadow-sm">
                            LOAD MORE PRODUCTS
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
