import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const { id, image, brand, name, price, badge } = product;

    return (
        <Link to={`/product/${id}`} className="block">
            <div className="product-card">
                <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                        {product.isFeatured && (
                            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                NEW
                            </span>
                        )}
                    </div>
                    <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
                        {brand}
                    </p>
                    <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2">
                        {name}
                    </h3>
                    <p className="text-lg font-bold text-gray-900">
                        ₩{price.toLocaleString()}
                    </p>
                </div>
            </div>
        </Link>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        image: PropTypes.string.isRequired,
        brand: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        badge: PropTypes.string,
    }).isRequired,
};

export default ProductCard;
