import { Heart, Star } from "lucide-react";
import { useState } from "react";

export function ProductCard({ product, save_wishlist }) {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Parse variant data to get size, color and price
    const getVariantDetails = () => {
        if (!product.product_variant || product.product_variant.length === 0) {
            return {
                size: null,
                color: null,
                hasVariants: false,
                minVariantPrice: null,
                maxVariantPrice: null,
            };
        }

        let color = null;
        let size = null;
        let prices = [];

        // Check all variants to get min and max prices
        product.product_variant.forEach((variant) => {
            if (variant.price) {
                prices.push(parseFloat(variant.price));
            }

            try {
                if (variant.variant_combination) {
                    const combination =
                        typeof variant.variant_combination === "string"
                            ? JSON.parse(variant.variant_combination)
                            : variant.variant_combination;

                    // Get color from first variant for display
                    if (!color) {
                        if (combination.Colors) color = combination.Colors;
                        else if (combination.color) color = combination.color;
                        else if (variant.variant_key)
                            color = variant.variant_key;
                    }

                    // Get size from first variant for display
                    if (!size) {
                        if (combination.Size) size = combination.Size;
                        else if (combination.size) size = combination.size;
                    }
                }
            } catch (e) {
                console.error("Error parsing variant combination:", e);
            }
        });

        const minPrice = prices.length > 0 ? Math.min(...prices) : null;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

        return {
            color,
            size,
            hasVariants: prices.length > 0,
            minVariantPrice: minPrice,
            maxVariantPrice: maxPrice,
            variantCount: prices.length,
        };
    };

    const variantDetails = getVariantDetails();

    // Determine display price
    const getDisplayPrice = () => {
        const basePrice = parseFloat(product.product_price);

        if (variantDetails.hasVariants) {
            // If there are variants with different prices
            if (
                variantDetails.minVariantPrice !==
                variantDetails.maxVariantPrice
            ) {
                return {
                    main: `RM ${variantDetails.minVariantPrice.toFixed(2)} - RM ${variantDetails.maxVariantPrice.toFixed(2)}`,
                    isRange: true,
                };
            }
            // If all variants have the same price
            else if (
                variantDetails.minVariantPrice ===
                variantDetails.maxVariantPrice
            ) {
                return {
                    main: `RM ${variantDetails.minVariantPrice.toFixed(2)}`,
                    original:
                        basePrice !== variantDetails.minVariantPrice
                            ? basePrice
                            : null,
                    isRange: false,
                };
            }
        }

        // No variants or single price
        return {
            main: `RM ${basePrice.toFixed(2)}`,
            isRange: false,
        };
    };

    const displayPrice = getDisplayPrice();

    // Calculate rating if available
    const averageRating =
        product.ratings && product.ratings.length > 0
            ? product.ratings.reduce(
                  (acc, curr) => acc + (curr.rating || 0),
                  0,
              ) / product.ratings.length
            : 0;

    // Get product image URL
    const getImageUrl = () => {
        if (imageError) return "/api/placeholder/300/400";

        if (product.product_image && product.product_image.length > 0) {
            const baseUrl =
                import.meta.env.VITE_BASE_URL || "http://127.0.0.1:8000";
            const imagePath = product.product_image[0].image_path;

            const cleanPath = imagePath.replace(/^\/+/, "");
            return `${baseUrl}/${cleanPath}`;
        }
        return "/api/placeholder/300/400";
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 group h-full flex flex-col">
            {/* Product Image Container */}
            <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                    {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                    <img
                        src={getImageUrl()}
                        alt={product.product_name}
                        className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                            imageLoaded
                                ? "opacity-100 scale-100 group-hover:scale-105"
                                : "opacity-0"
                        }`}
                        style={{ objectFit: "cover" }}
                        onError={() => {
                            setImageError(true);
                            setImageLoaded(true);
                        }}
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
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                    {product.product_name}
                </h3>

                {/* Store Name */}
                <p className="text-sm text-gray-500 mb-2 line-clamp-1">
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
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Size: {variantDetails.size}
                            </span>
                        )}
                        {variantDetails.color && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                                {variantDetails.color}
                            </span>
                        )}
                    </div>
                )}

                {/* Rating */}
                {product.total_ratings > 0 && (
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
                            ({product.total_ratings})
                        </span>
                    </div>
                )}

                {/* Spacer to push content down */}
                <div className="flex-1"></div>

                {/* Price Section */}
                <div className="mt-2">
                    <div className="text-lg font-bold text-gray-900">
                        {displayPrice.main}
                    </div>
                    {displayPrice.original && (
                        <div className="text-xs text-gray-400 line-through">
                            RM {displayPrice.original.toFixed(2)}
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between mt-2">
                    <div
                        className={`text-xs ${product.product_quantity > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                        {product.product_quantity > 0
                            ? `${product.product_quantity} left`
                            : "Sold Out"}
                    </div>
                    {variantDetails.variantCount > 1 && (
                        <div className="text-xs text-gray-500">
                            {variantDetails.variantCount} variants
                        </div>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={() => save_wishlist(product.product_id)}
                    disabled={product.product_quantity === 0}
                    className={`w-full mt-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.product_quantity > 0
                            ? "bg-pink-500 text-white hover:bg-pink-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                    {product.product_quantity > 0 ? "Add to Cart" : "Sold Out"}
                </button>
            </div>
        </div>
    );
}
