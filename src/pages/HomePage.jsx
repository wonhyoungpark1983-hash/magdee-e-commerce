import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { useProducts } from '../context/ProductContext';

const HomePage = () => {
    const { products, loading } = useProducts();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading MAGDEE LUXURY...</p>
            </div>
        );
    }

    // Filter products based on admin selection
    const newArrivals = products.filter(p => p.isFeatured);
    const bestSellers = products.filter(p => p.isBestSeller);

    // If no featured products, show all products
    const hasFeatures = newArrivals.length > 0 || bestSellers.length > 0;
    const allProducts = products.slice(0, 12); // Show up to 12 products on homepage

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="relative h-[60vh] md:h-[70vh] bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920"
                    alt="MAGDEE Collection"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                        <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4">
                            MAGDEE
                        </h1>
                        <p className="text-lg md:text-2xl font-light mb-8">
                            Modern Fashion Redefined
                        </p>
                        <Link to="/products">
                            <Button variant="accent" size="lg">
                                Shop Now <ArrowRight className="ml-2" size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* New Arrivals - Show only if admin selected featured products */}
            {newArrivals.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
                        <Link to="/products" className="text-primary hover:underline flex items-center">
                            View All <ArrowRight className="ml-1" size={18} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto pb-4">
                        <div className="flex space-x-6 md:grid md:grid-cols-4 md:gap-6 md:space-x-0">
                            {newArrivals.map((product) => (
                                <div key={product.id} className="flex-shrink-0 w-64 md:w-auto">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Best Sellers - Show only if admin selected */}
            {bestSellers.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Best Sellers</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {bestSellers.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Products Section - Always show this for maximum visibility of updates */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Our Collection</h2>
                        <p className="text-gray-500 mt-1">Discover our latest curated pieces ({products.length})</p>
                    </div>
                    <Link to="/products" className="text-primary hover:underline flex items-center">
                        View All <ArrowRight className="ml-1" size={18} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {allProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* Brand Story */}
            <section className="relative h-96 bg-secondary">
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
                    alt="MAGDEE Brand Story"
                    className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-[6px]">
                    <div className="text-center bg-white/30 backdrop-blur-xl border border-white/40 p-10 md:p-16 rounded-[2rem] shadow-2xl max-w-4xl mx-auto transform transition-all hover:scale-[1.01]">
                        <h2 className="font-heading text-3xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                            Curated Fashion for <br />
                            <span className="text-primary italic font-serif">Modern Lifestyle</span>
                        </h2>
                        <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full"></div>
                        <p className="text-lg md:text-2xl text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed">
                            Discover timeless pieces that blend contemporary design with exceptional quality.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
