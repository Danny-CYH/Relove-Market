import { FaStar, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { Link } from "@inertiajs/react";

export function FeaturedProductCard({ product, save_wishlist }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    if (!product) return null;

    const { category } = product;
    const currentPrice = product.product_price;
    const rating = product.ratings[0]?.rating || 0;
    const reviewCount = product.ratings[0]?.review_count || 0;
    const isInStock = product.product_quantity > 0;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        save_wishlist(product.product_id);
        setIsLiked(true);
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-gray-100 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden bg-gray-50">
                <div className="relative h-60 sm:h-56 md:h-52 lg:h-48 xl:h-56">
                    <img
                        src={
                            import.meta.env.VITE_BASE_URL +
                            product.product_image[0].image_path
                        }
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistClick}
                        className="absolute top-3 right-3 bg-white hover:bg-gray-50 p-2 rounded-full shadow-md transition-colors duration-200"
                    >
                        <FaHeart
                            className={`w-4 h-4 ${
                                isLiked ? "text-red-500" : "text-gray-600"
                            }`}
                        />
                    </button>

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <div className="bg-white bg-opacity-95 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded">
                            {category.category_name}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Info Section */}
            <div className="p-5 flex-grow flex flex-col">
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base leading-tight group-hover:text-gray-700 transition-colors duration-200">
                    {product.product_name}
                </h3>

                {/* Rating and Reviews */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className={`w-3 h-3 ${
                                        star <= Math.round(rating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
                    </span>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-bold text-gray-900">
                            RM {currentPrice}
                        </span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                    <Link href={route("product-details", product.product_id)}>
                        <button
                            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                                !isInStock
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white shadow-md hover:shadow-lg"
                            }`}
                            disabled={!isInStock}
                        >
                            <FaShoppingCart className="w-4 h-4" />
                            <span>
                                {!isInStock ? "Out of Stock" : "View Details"}
                            </span>
                        </button>
                    </Link>
                </div>

                {/* Seller Info */}
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span className="truncate">
                        {product.seller?.seller_store?.store_name || "Seller"}
                    </span>
                    <span className="flex font-bold items-center">
                        Sold: {product.order_items.length}
                    </span>
                </div>
            </div>
        </div>
    );
}
