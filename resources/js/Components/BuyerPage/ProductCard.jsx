// Components/BuyerPage/ProductCard.jsx
import { FaStar, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Link } from "@inertiajs/react";

export function ProductCard({
    product,
    isFlashSale,
    save_wishlist,
    isAiResult = false,
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [showVariantModal, setShowVariantModal] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({});
    const [wishlistPending, setWishlistPending] = useState(false);

    if (!product) {
        console.warn("ProductCard: No product data provided");
        return null;
    }

    // Safe data extraction with fallbacks
    const productData = product.product || product;
    // console.log(productData);

    const productName =
        productData.product_name || productData.name || "Unnamed Product";
    const productId =
        product.product_id ||
        productData.product_id ||
        `unknown-${Math.random()}`;
    const productPrice = productData.product_price || 0;
    const productImages = productData.product_image || [];
    const primaryImage =
        productImages[0]?.image_path || "/default-product-image.jpg";
    const category = productData.category ||
        product.category || { category_name: "General" };
    const ratings = productData.product_ratings || 0;
    const rating = parseFloat(ratings[0]?.rating ?? ratings ?? 0);
    const reviewCount = ratings[0]?.review_count || productData.ratings || 0;
    const seller = productData.seller || {
        seller_store: { store_name: "Unknown Seller" },
    };

    // Check if product has variants
    const hasVariants =
        productData.product_variant && productData.product_variant.length > 0;
    const variantGroups = {};

    if (hasVariants) {
        productData.product_variant.forEach((variant) => {
            try {
                const combination =
                    typeof variant.variant_combination === "string"
                        ? JSON.parse(variant.variant_combination)
                        : variant.variant_combination;
                Object.entries(combination).forEach(([type, value]) => {
                    if (!variantGroups[type]) {
                        variantGroups[type] = new Set();
                    }
                    variantGroups[type].add(value);
                });
            } catch (error) {
                console.error("Error parsing variant combination:", error);
            }
        });

        Object.keys(variantGroups).forEach((type) => {
            variantGroups[type] = Array.from(variantGroups[type]);
        });
    }

    const allVariantsSelected = hasVariants
        ? Object.keys(variantGroups).every((type) => selectedVariants[type])
        : true;

    const findMatchingVariant = () => {
        if (!hasVariants || !allVariantsSelected) return null;

        return productData.product_variant.find((variant) => {
            try {
                const combination =
                    typeof variant.variant_combination === "string"
                        ? JSON.parse(variant.variant_combination)
                        : variant.variant_combination;
                return Object.keys(selectedVariants).every(
                    (type) => combination[type] === selectedVariants[type]
                );
            } catch (error) {
                console.error("Error parsing variant combination:", error);
                return false;
            }
        });
    };

    const selectedVariant = findMatchingVariant();
    const displayPrice = selectedVariant?.price || productPrice;
    const displayQuantity =
        selectedVariant?.quantity || productData.product_quantity || 0;
    const isInStock = displayQuantity > 0;

    const handleWishlistClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasVariants && !allVariantsSelected) {
            setWishlistPending(true);
            setShowVariantModal(true);
            return;
        }

        save_wishlist(productId, selectedVariant?.variant_id);
        setIsLiked(true);
    };

    const handleVariantSelect = (variantType, variantValue) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [variantType]: variantValue,
        }));
    };

    const confirmWishlist = () => {
        if (allVariantsSelected) {
            save_wishlist(productId, selectedVariant?.variant_id);
            setIsLiked(true);
            setShowVariantModal(false);
            setWishlistPending(false);
        }
    };

    return (
        <>
            <div
                className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col group border border-gray-100 overflow-hidden relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section */}
                <div className="relative overflow-hidden bg-gray-50">
                    <div className="relative h-60 sm:h-56 md:h-52 lg:h-48 xl:h-56">
                        <img
                            src={import.meta.env.VITE_BASE_URL + primaryImage}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                                e.target.src = "/default-product-image.jpg";
                            }}
                        />

                        {/* Overlay with quick actions */}
                        <div
                            className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 ${
                                isHovered ? "bg-opacity-10" : ""
                            }`}
                        ></div>

                        {/* Top badges */}
                        <div className="absolute top-3 left-3 flex flex-col space-y-2">
                            {/* Category badge */}
                            <div className="bg-white bg-opacity-95 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded">
                                {category.category_name}
                            </div>

                            {/* Variant indicator */}
                            {hasVariants && (
                                <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                                    {Object.keys(variantGroups).length} Options
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Product Info Section */}
                <div className="p-5 flex-grow flex flex-col">
                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base leading-tight group-hover:text-gray-700 transition-colors duration-200">
                        {productName}
                    </h3>

                    {/* Selected Variant Display */}
                    {hasVariants &&
                        Object.keys(selectedVariants).length > 0 && (
                            <div className="mb-2">
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(selectedVariants).map(
                                        ([type, value]) => (
                                            <span
                                                key={type}
                                                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                            >
                                                {type}: {value}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

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
                                RM {displayPrice}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                        <Link href={route("product-details", productId)}>
                            <button
                                className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                                    isFlashSale
                                        ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                        : "bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
                                } ${
                                    !isInStock
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                                disabled={!isInStock}
                            >
                                <span>
                                    {!isInStock
                                        ? "Out of Stock"
                                        : isFlashSale
                                        ? "Buy Now"
                                        : "View Details"}
                                </span>
                            </button>
                        </Link>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                        <span>
                            {seller.seller_store?.store_name ||
                                seller.store_name ||
                                "Unknown Store"}
                        </span>
                    </div>
                </div>

                {/* Hover effect border */}
                <div
                    className={`absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-2xl pointer-events-none transition-all duration-300 ${
                        isHovered ? "border-gray-200" : ""
                    }`}
                ></div>
            </div>

            {/* Variant Selection Modal */}
            {showVariantModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Select Variants
                            </h3>
                            <button
                                onClick={() => {
                                    setShowVariantModal(false);
                                    setWishlistPending(false);
                                }}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <img
                                    src={
                                        import.meta.env.VITE_BASE_URL +
                                        primaryImage
                                    }
                                    alt={productName}
                                    className="w-16 h-16 object-cover rounded-lg"
                                    onError={(e) => {
                                        e.target.src =
                                            "/default-product-image.jpg";
                                    }}
                                />
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                        {productName}
                                    </h4>
                                    <p className="text-lg font-bold text-gray-900">
                                        RM {displayPrice}
                                    </p>
                                </div>
                            </div>

                            {/* Variant Selection */}
                            {Object.entries(variantGroups).map(
                                ([type, values]) => (
                                    <div key={type} className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-3 capitalize">
                                            {type}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {values.map((value) => {
                                                const variantForValue =
                                                    productData.product_variant.find(
                                                        (v) => {
                                                            try {
                                                                const combination =
                                                                    typeof v.variant_combination ===
                                                                    "string"
                                                                        ? JSON.parse(
                                                                              v.variant_combination
                                                                          )
                                                                        : v.variant_combination;
                                                                return (
                                                                    combination[
                                                                        type
                                                                    ] === value
                                                                );
                                                            } catch (error) {
                                                                return false;
                                                            }
                                                        }
                                                    );

                                                const isAvailable =
                                                    variantForValue &&
                                                    variantForValue.quantity >
                                                        0;
                                                const priceDifference =
                                                    variantForValue &&
                                                    variantForValue.price !==
                                                        productPrice
                                                        ? (
                                                              variantForValue.price -
                                                              productPrice
                                                          ).toFixed(2)
                                                        : null;

                                                return (
                                                    <button
                                                        key={value}
                                                        onClick={() =>
                                                            handleVariantSelect(
                                                                type,
                                                                value
                                                            )
                                                        }
                                                        disabled={!isAvailable}
                                                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                                            selectedVariants[
                                                                type
                                                            ] === value
                                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                : isAvailable
                                                                ? "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                                                : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        }`}
                                                    >
                                                        {value}
                                                        {priceDifference &&
                                                            priceDifference !==
                                                                "0.00" && (
                                                                <span className="text-xs text-gray-500 ml-1">
                                                                    (+RM{" "}
                                                                    {
                                                                        priceDifference
                                                                    }
                                                                    )
                                                                </span>
                                                            )}
                                                        {!isAvailable && (
                                                            <span className="text-xs text-red-500 ml-1">
                                                                (Out of Stock)
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )
                            )}

                            {/* Selected Variants Summary */}
                            {Object.keys(selectedVariants).length > 0 && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Selected Options:
                                    </h4>
                                    <div className="space-y-1">
                                        {Object.entries(selectedVariants).map(
                                            ([type, value]) => (
                                                <div
                                                    key={type}
                                                    className="flex justify-between text-sm"
                                                >
                                                    <span className="text-gray-600 capitalize">
                                                        {type}:
                                                    </span>
                                                    <span className="font-medium">
                                                        {value}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                    {selectedVariant && (
                                        <div className="mt-2 pt-2 border-t border-gray-200">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Stock:
                                                </span>
                                                <span
                                                    className={`font-medium ${
                                                        selectedVariant.quantity >
                                                        0
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {selectedVariant.quantity >
                                                    0
                                                        ? `${selectedVariant.quantity} available`
                                                        : "Out of stock"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => {
                                        setShowVariantModal(false);
                                        setWishlistPending(false);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmWishlist}
                                    disabled={
                                        !allVariantsSelected ||
                                        !selectedVariant ||
                                        selectedVariant.quantity === 0
                                    }
                                    className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors ${
                                        allVariantsSelected &&
                                        selectedVariant &&
                                        selectedVariant.quantity > 0
                                            ? "bg-red-600 hover:bg-red-700 text-white"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                >
                                    {wishlistPending
                                        ? "Add to Wishlist"
                                        : "Confirm Selection"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
