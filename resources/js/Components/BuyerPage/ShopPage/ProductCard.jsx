import { Heart, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";

import { GetColorValue } from "../../HelperFunction/GetColorValue";
import { getVariantDetails } from "../../HelperFunction/GetVariantDetails";
import { getDisplayPrice } from "../../HelperFunction/GetDisplayPrice";

export function ProductCard({ product, save_wishlist }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageUrl, setImageUrl] = useState("/api/placeholder/300/400");

    // Get variant details for display
    const variantDetails = getVariantDetails(product);

    // Get display price based on variants
    const displayPrice = getDisplayPrice(product, variantDetails);

    // Calculate sold count from order items or fallback to sold_count
    const soldCount = product.order_items?.length || product.sold_count || 0;

    // Calculate rating if available
    const averageRating =
        product.ratings && product.ratings.length > 0
            ? product.ratings.reduce(
                  (acc, curr) => acc + (curr.rating || 0),
                  0,
              ) / product.ratings.length
            : 0;

    // Handle image load error by setting error state and showing placeholder
    const handleImageError = () => {
        console.log("Image failed to load:", imageUrl);
        setImageError(true);
        setImageLoaded(true);
    };

    // Set image URL on component mount and when product changes
    useEffect(() => {
        const constructImageUrl = () => {
            if (product.product_image && product.product_image.length > 0) {
                const baseUrl = import.meta.env.VITE_BASE_URL;
                let imagePath = product.product_image[0].image_path;

                setImageUrl(baseUrl + imagePath);
            }
        };

        constructImageUrl();
        setImageError(false);
        setImageLoaded(false);
    }, [product]);

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 group flex flex-col h-full">
            {/* Product Image */}
            <div className="w-full h-48 sm:h-56 lg:h-52 xl:h-48 flex-shrink-0">
                <div
                    className="relative w-full h-full bg-gray-100"
                    style={{ minHeight: "192px" }}
                >
                    {/* Loading Spinner */}
                    {!imageLoaded && !imageError && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Image */}
                    <img
                        src={imageError ? "/api/placeholder/300/400" : imageUrl}
                        alt={product.product_name}
                        className={`absolute inset-0 w-full md:min-h-48 transition-all duration-300 object-cover ${
                            imageLoaded && !imageError
                                ? "opacity-100 scale-100 group-hover:scale-105"
                                : "opacity-0"
                        }`}
                        onError={handleImageError}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {product.featured && (
                            <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded shadow-md">
                                Featured
                            </span>
                        )}
                        {product.product_condition && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded capitalize shadow-md">
                                {product.product_condition}
                            </span>
                        )}
                    </div>

                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-10">
                        {variantDetails.variantCount > 1 && (
                            <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded capitalize shadow-md">
                                {variantDetails.variantCount} variants
                            </div>
                        )}
                    </div>

                    {/* Wishlist Button */}
                    <button
                        onClick={() => save_wishlist(product.product_id)}
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-50 z-10"
                    >
                        <Heart className="w-4 h-4 text-pink-500" />
                    </button>
                </div>
            </div>

            {/* Product Details */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                        {product.product_name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2">
                        {product.seller?.seller_store?.store_name ||
                            "Unknown Store"}
                    </p>

                    {/* Category Tag */}
                    {product.category && (
                        <span className="inline-block text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded mb-2 w-fit">
                            {product.category.category_name}
                        </span>
                    )}

                    {/* Quick Specs */}
                    {(variantDetails.size || variantDetails.color) && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {variantDetails.size && (
                                <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
                                    Size: {variantDetails.size}
                                </span>
                            )}
                            {variantDetails.color && (
                                <div className="group relative">
                                    <div className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors px-2 py-1 rounded-full">
                                        <span
                                            className="w-4 min-h-4 rounded-full shadow-sm"
                                            style={{
                                                backgroundColor: GetColorValue(
                                                    variantDetails.color,
                                                ),
                                                border: "1px solid rgba(0,0,0,0.1)",
                                            }}
                                        />
                                        <span className="text-xs text-gray-700 font-medium capitalize">
                                            {variantDetails.color}
                                        </span>
                                    </div>
                                    {/* Tooltip on hover for accessibility */}
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                        Color: {variantDetails.color}
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 fill-current ${
                                        i < Math.floor(averageRating)
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">
                            ({product.total_ratings || 0})
                        </span>
                    </div>
                </div>

                {/* Price, stock, sold count, and action */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    {/* Price Section - Main price with smaller range */}
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-lg font-bold text-gray-900">
                            {displayPrice.main}
                        </span>
                        {displayPrice.original && (
                            <span className="text-xs text-gray-400 line-through ml-1">
                                RM {displayPrice.original.toFixed(2)}
                            </span>
                        )}
                    </div>

                    {/* Stock and Sold Info - Two line layout */}
                    <div className="flex items-center justify-between text-xs mb-3">
                        {/* Stock Status */}
                        <div className="flex items-center gap-2">
                            <span
                                className={`font-medium ${
                                    product.product_quantity > 5
                                        ? "text-green-600"
                                        : product.product_quantity > 0
                                          ? "text-orange-500"
                                          : "text-red-600"
                                }`}
                            >
                                {product.product_quantity > 5
                                    ? "● In Stock"
                                    : product.product_quantity > 0
                                      ? `● Only ${product.product_quantity} left`
                                      : "● Sold Out"}
                            </span>
                        </div>

                        {/* Sold Count */}
                        <div className="text-gray-500">
                            {soldCount} {soldCount === 1 ? "sold" : "sold"}
                        </div>
                    </div>

                    {/* View Details Button */}
                    <Link
                        href={route("product-details", {
                            productId: product.product_id,
                        })}
                    >
                        <button
                            disabled={product.product_quantity === 0}
                            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                product.product_quantity > 0
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            {product.product_quantity > 0
                                ? "View Details"
                                : "Sold Out"}
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
