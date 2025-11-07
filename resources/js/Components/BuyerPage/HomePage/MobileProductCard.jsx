// Components/BuyerPage/HomePage/MobileProductCard.jsx
import {
    FaStar,
    FaHeart,
    FaShoppingCart,
    FaStore,
    FaShieldAlt as FaShield,
    FaShippingFast,
    FaClock,
    FaCheckCircle,
    FaMapMarkerAlt,
    FaUser,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

export function MobileProductCard({ product, save_wishlist, get_wishlist }) {
    const [isLiked, setIsLiked] = useState(false);
    const [loadingWishlist, setLoadingWishlist] = useState(false);

    if (!product) return null;

    const { category, seller } = product;
    const currentPrice = product.product_price;
    const rating = product.ratings[0]?.rating || 0;
    const reviewCount = product.ratings.length || 0;

    // Enhanced product information
    const productCondition = product.product_condition || "Like New";
    const createdAt = product.created_at ? new Date(product.created_at) : null;
    const isNewProduct =
        createdAt && Date.now() - createdAt.getTime() < 7 * 24 * 60 * 60 * 1000;
    const stockQuantity = product.product_quantity || 0;
    const isInStock = stockQuantity > 0;

    // Enhanced seller information
    const sellerStore = seller?.seller_store;
    const sellerRating = seller?.average_rating || 0;
    const sellerTotalSales = seller?.total_sales || 0;
    const isVerifiedSeller = seller?.is_verified || false;
    const sellerJoinDate = seller?.created_at
        ? new Date(seller.created_at)
        : null;
    const sellerMemberYears = sellerJoinDate
        ? new Date().getFullYear() - sellerJoinDate.getFullYear()
        : 0;

    // Calculate discount percentage
    const originalPrice =
        product.original_price || product.product_original_price;
    const discountPercentage =
        originalPrice && originalPrice > currentPrice
            ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
            : 0;

    // Check wishlist status
    useEffect(() => {
        const checkWishlistStatus = async () => {
            if (!get_wishlist) return;
            setLoadingWishlist(true);
            try {
                const wishlistData = await get_wishlist(product.product_id);
                if (wishlistData.is_wishlisted) {
                    setIsLiked(true);
                }
            } catch (error) {
                console.error("Error checking wishlist status:", error);
            } finally {
                setLoadingWishlist(false);
            }
        };
        checkWishlistStatus();
    }, [product.product_id, get_wishlist]);

    const handleWishlistClick = async (e) => {
        e.preventDefault();
        if (isLiked) return;

        setLoadingWishlist(true);
        const success = await save_wishlist(product.product_id);
        if (success) {
            setIsLiked(true);
        }
        setLoadingWishlist(false);
    };

    const formatRelativeTime = (date) => {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            return `${Math.floor(diffInHours / 24)}d ago`;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
            {/* Full Width Image Section */}
            <div className="relative">
                <Link href={route("product-details", product.product_id)}>
                    <img
                        src={
                            import.meta.env.VITE_BASE_URL +
                            product.product_image[0].image_path
                        }
                        alt={product.product_name}
                        className="w-full h-48 object-cover"
                    />
                </Link>

                {/* Image Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isNewProduct && (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            NEW ARRIVAL
                        </div>
                    )}
                    {discountPercentage > 0 && (
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                            {discountPercentage}% OFF
                        </div>
                    )}
                </div>

                {/* Condition Badge */}
                <div className="absolute top-3 right-3">
                    <div className="bg-black bg-opacity-80 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                        {productCondition}
                    </div>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistClick}
                    disabled={loadingWishlist || isLiked}
                    className="absolute bottom-3 right-3 bg-white bg-opacity-95 p-3 rounded-full shadow-lg transition-all duration-200 disabled:opacity-50 hover:scale-110"
                >
                    {loadingWishlist ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin"></div>
                    ) : (
                        <FaHeart
                            className={`w-5 h-5 transition-colors ${
                                isLiked
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-600 hover:text-red-400"
                            }`}
                        />
                    )}
                </button>
            </div>

            {/* Product Information Section */}
            <div className="p-4">
                {/* Product Title and Basic Info */}
                <div className="mb-3">
                    <Link href={route("product-details", product.product_id)}>
                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                            {product.product_name}
                        </h3>
                    </Link>

                    {/* Category and Posted Time */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                            {category?.category_name || "General"}
                        </span>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <FaClock className="w-3 h-3" />
                            <span className="text-xs">
                                {createdAt
                                    ? formatRelativeTime(createdAt)
                                    : "Recently"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Rating and Price Row */}
                <div className="flex items-center justify-between mb-4">
                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                            <FaStar className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-gray-900">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600">
                            {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-gray-900">
                                RM {currentPrice}
                            </span>
                            {originalPrice && originalPrice > currentPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    RM {originalPrice}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                    <div
                        className={`flex items-center space-x-2 ${
                            isInStock ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        <FaCheckCircle className="w-4 h-4" />
                        <span className="font-semibold">
                            {isInStock ? "Available" : "Out of Stock"}
                        </span>
                    </div>
                    {isInStock && (
                        <span className="text-sm text-gray-600">
                            {stockQuantity} unit{stockQuantity !== 1 ? "s" : ""}{" "}
                        </span>
                    )}
                </div>

                {/* Seller Information */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <FaStore className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-gray-900">
                                {sellerStore?.store_name || "Individual Seller"}
                            </span>
                        </div>
                        {isVerifiedSeller && (
                            <div className="flex items-center space-x-1 bg-blue-100 px-2 py-1 rounded-full">
                                <FaShield className="w-3 h-3 text-blue-600" />
                                <span className="text-xs text-blue-700 font-semibold">
                                    Verified
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                            <FaStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span>{sellerRating.toFixed(1)} Seller Rating</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaUser className="w-3 h-3 text-green-500" />
                            <span>{sellerTotalSales}+ Sales</span>
                        </div>
                        {sellerMemberYears > 0 && (
                            <div className="col-span-2 flex items-center space-x-2">
                                <FaMapMarkerAlt className="w-3 h-3 text-gray-400" />
                                <span>
                                    Member for {sellerMemberYears} year
                                    {sellerMemberYears > 1 ? "s" : ""}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        href={route("product-details", product.product_id)}
                        className="flex-1"
                    >
                        <button className="w-full py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-all duration-200 font-semibold text-sm">
                            View Details
                        </button>
                    </Link>
                    <button
                        onClick={() => save_wishlist(product.product_id)}
                        disabled={!isInStock}
                        className={`flex-1 py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2 ${
                            isInStock
                                ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 shadow-md hover:shadow-lg"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        <FaShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
