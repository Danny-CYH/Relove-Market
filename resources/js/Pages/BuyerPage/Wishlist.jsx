import { useState } from "react";
import {
    Trash2,
    Heart,
    ShoppingCart,
    MapPin,
    Edit3,
    Plus,
    Minus,
    Star,
    Loader2,
} from "lucide-react";
import axios from "axios";

import { Link, router, usePage } from "@inertiajs/react";

import { Footer } from "@/Components/BuyerPage/Footer";
import { Navbar } from "@/Components/BuyerPage/Navbar";

export default function Wishlist({ user_wishlist }) {
    const [wishlist, setWishlist] = useState(user_wishlist);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [bulkLoading, setBulkLoading] = useState(false);

    const { auth } = usePage().props;

    // Remove single item from wishlist
    const removeWishlistItem = async (productId) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));

        try {
            const response = await axios.delete(route("remove-wishlist"), {
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                data: {
                    product_id: [productId],
                },
            });

            if (response.data.successMessage) {
                // Remove item from local state immediately
                setWishlist((prev) =>
                    prev.filter((item) => item.product_id !== productId)
                );
                setSelected((prev) => prev.filter((id) => id !== productId));
            } else {
                console.error("Failed to remove item:", response);
            }
        } catch (error) {
            console.error("Error removing wishlist item:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, [productId]: false }));
        }
    };

    // Remove multiple items from wishlist
    const removeSelectedItems = async () => {
        if (selected.length === 0) return;

        setBulkLoading(true);

        try {
            const response = await axios.delete(route("remove-wishlist"), {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                data: {
                    product_id: selected,
                },
            });

            if (response.data.successMessage) {
                // Remove selected items from local state immediately
                setWishlist((prev) =>
                    prev.filter((item) => !selected.includes(item.product_id))
                );
                setSelected([]);
                setSelectAll(false);

                console.log("Selected items removed from wishlist");
            } else {
                console.error(
                    "Failed to remove items:",
                    response.data.errorMessage
                );
            }
        } catch (error) {
            console.error("Error removing wishlist items:", error);
        } finally {
            setBulkLoading(false);
        }
    };

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelected([]);
        } else {
            setSelected(wishlist.map((item) => item.product_id));
        }
        setSelectAll(!selectAll);
    };

    const updateQty = (id, type) => {
        setWishlist((prev) =>
            prev.map((item) => {
                if (item.product_id === id) {
                    const currentQty = item.selected_quantity;
                    const availableStock =
                        item.selected_variant?.quantity ||
                        item.product.product_quantity;

                    let newQty;
                    if (type === "inc") {
                        newQty = Math.min(currentQty + 1, availableStock);
                    } else {
                        newQty = Math.max(1, currentQty - 1);
                    }

                    return {
                        ...item,
                        selected_quantity: newQty,
                    };
                }
                return item;
            })
        );
    };

    // Helper function to get variant display text
    const getVariantDisplayText = (item) => {
        if (!item.selected_variant) return null;

        try {
            const variantData =
                typeof item.selected_variant === "string"
                    ? JSON.parse(item.selected_variant)
                    : item.selected_variant;

            if (
                variantData.variant_combination &&
                Object.keys(variantData.variant_combination).length > 0
            ) {
                return Object.entries(variantData.variant_combination)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
            }
            return null;
        } catch (error) {
            console.error("Error parsing variant data:", error);
            return null;
        }
    };

    // Helper function to get variant price
    const getVariantPrice = (item) => {
        if (!item.selected_variant) {
            return parseFloat(item.product.product_price) || 0;
        }

        try {
            const variantData =
                typeof item.selected_variant === "string"
                    ? JSON.parse(item.selected_variant)
                    : item.selected_variant;

            const price = variantData.price || item.product.product_price;
            return parseFloat(price) || 0;
        } catch (error) {
            console.error("Error getting variant price:", error);
            return parseFloat(item.product.product_price) || 0;
        }
    };

    // Helper function to get available stock
    const getAvailableStock = (item) => {
        if (!item.selected_variant) return item.product.product_quantity;

        try {
            const variantData =
                typeof item.selected_variant === "string"
                    ? JSON.parse(item.selected_variant)
                    : item.selected_variant;

            return variantData.quantity || item.product.product_quantity;
        } catch (error) {
            console.error("Error getting variant stock:", error);
            return item.product.product_quantity;
        }
    };

    const selectedItems = wishlist
        .filter((item) => selected.includes(item.product_id))
        .map((item) => ({
            ...item,
            product: {
                ...item.product,
                product_price: getVariantPrice(item),
                product_quantity: getAvailableStock(item),
            },
        }));

    const totalPrice = selectedItems.reduce(
        (sum, item) => sum + getVariantPrice(item) * item.selected_quantity,
        0
    );

    const totalDiscount = selectedItems.reduce(
        (sum, item) =>
            sum +
            ((item.originalPrice || getVariantPrice(item)) -
                getVariantPrice(item)) *
                item.selected_quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 mt-16">
                {/* Enhanced Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Heart
                                        className="text-white"
                                        size={24}
                                        fill="currentColor"
                                    />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    My Wishlist
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {wishlist.length}{" "}
                                    {wishlist.length === 1
                                        ? "product"
                                        : "products"}{" "}
                                    saved for later
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* LEFT SIDE: Wishlist items */}
                    <div className="xl:col-span-3">
                        {/* Enhanced Action Bar */}
                        {wishlist.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <label className="relative flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={toggleSelectAll}
                                                className="sr-only"
                                            />
                                            <div
                                                className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                                                    selectAll
                                                        ? "bg-blue-500 border-blue-500"
                                                        : "bg-white border-gray-300 hover:border-blue-400"
                                                }`}
                                            >
                                                {selectAll && (
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                Select all ({wishlist.length}{" "}
                                                items)
                                            </span>
                                        </label>
                                    </div>

                                    {selected.length > 0 && (
                                        <button
                                            onClick={removeSelectedItems}
                                            disabled={bulkLoading}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                        >
                                            {bulkLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                            Remove Selected ({selected.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Enhanced Wishlist Items */}
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                                <Heart
                                    className="mx-auto text-gray-300"
                                    size={64}
                                />
                                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                                    Your wishlist is empty
                                </h3>
                                <p className="mt-2 text-gray-500 max-w-md mx-auto">
                                    Save your favorite items here for easy
                                    access later
                                </p>
                                <Link href={route("shopping")}>
                                    <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {wishlist.map((product) => {
                                    const isSelected = selected.includes(
                                        product.product_id
                                    );
                                    const variantText =
                                        getVariantDisplayText(product);
                                    const variantPrice =
                                        getVariantPrice(product);
                                    const availableStock =
                                        getAvailableStock(product);
                                    const isOutOfStock = availableStock === 0;

                                    return (
                                        <div
                                            key={product.product_id}
                                            className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
                                                isSelected
                                                    ? "border-blue-500 border-2"
                                                    : "border-gray-100"
                                            } ${
                                                isOutOfStock ? "opacity-60" : ""
                                            }`}
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                {/* Selection Checkbox - Enhanced */}
                                                <div className="flex items-start p-4 sm:p-6">
                                                    <label className="relative flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    product.product_id
                                                                )
                                                            }
                                                            disabled={
                                                                isOutOfStock
                                                            }
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                                                                isSelected
                                                                    ? "bg-blue-500 border-blue-500"
                                                                    : "bg-white border-gray-300 hover:border-blue-400"
                                                            } ${
                                                                isOutOfStock
                                                                    ? "opacity-50"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {isSelected && (
                                                                <svg
                                                                    className="w-3 h-3 text-white"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </label>
                                                </div>

                                                {/* Product Image - Landscape Optimized */}
                                                <Link
                                                    href={route(
                                                        "product-details",
                                                        product.product_id
                                                    )}
                                                    className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 p-4 sm:p-0 sm:pr-4"
                                                >
                                                    <div className="w-full h-full md:mt-8 bg-gray-100 rounded-xl overflow-hidden">
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_BASE_URL +
                                                                product
                                                                    .product_image
                                                                    .image_path
                                                            }
                                                            alt={
                                                                product.product
                                                                    .product_name
                                                            }
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Product Info - Enhanced Layout */}
                                                <div className="flex-1 p-4 sm:p-6">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                        {/* Left Side - Product Details */}
                                                        <div className="flex-1">
                                                            <Link
                                                                href={`/product-details/${product.product_id}`}
                                                            >
                                                                <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                                                                    {
                                                                        product
                                                                            .product
                                                                            .product_name
                                                                    }
                                                                </h2>
                                                            </Link>

                                                            {/* Variant Information */}
                                                            {variantText && (
                                                                <div className="mt-2">
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                                                        {
                                                                            variantText
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Rating and Stock Status */}
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <div className="flex items-center gap-1">
                                                                    {[
                                                                        ...Array(
                                                                            5
                                                                        ),
                                                                    ].map(
                                                                        (
                                                                            _,
                                                                            i
                                                                        ) => (
                                                                            <Star
                                                                                key={
                                                                                    i
                                                                                }
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="text-yellow-400 fill-current"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        !isOutOfStock
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {!isOutOfStock
                                                                        ? "In Stock"
                                                                        : "Out of Stock"}
                                                                </span>
                                                            </div>

                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <span className="text-sm text-gray-700 font-medium">
                                                                    Quantity:
                                                                </span>
                                                                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            updateQty(
                                                                                product.product_id,
                                                                                "dec"
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            product.selected_quantity <=
                                                                                1 ||
                                                                            isOutOfStock
                                                                        }
                                                                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <Minus
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <span className="px-3 py-1 text-gray-900 min-w-[2rem] text-center text-sm font-medium">
                                                                        {
                                                                            product.selected_quantity
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        onClick={(
                                                                            e
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            updateQty(
                                                                                product.product_id,
                                                                                "inc"
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            product.selected_quantity >=
                                                                                availableStock ||
                                                                            isOutOfStock
                                                                        }
                                                                        className="p-2 text-gray-600 hover:bg-gray-200 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        <Plus
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                                {!isOutOfStock && (
                                                                    <span className="text-xs text-gray-500">
                                                                        {
                                                                            availableStock
                                                                        }{" "}
                                                                        available
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Right Side - Price and Actions */}
                                                        <div className="flex flex-col items-end gap-3">
                                                            {/* Price */}
                                                            <div className="text-right">
                                                                <span className="text-xl font-bold text-gray-900">
                                                                    RM{" "}
                                                                    {
                                                                        variantPrice
                                                                    }
                                                                </span>
                                                                {product.originalPrice &&
                                                                    product.originalPrice >
                                                                        variantPrice && (
                                                                        <span className="text-sm text-gray-500 line-through block">
                                                                            RM{" "}
                                                                            {
                                                                                product.originalPrice
                                                                            }
                                                                        </span>
                                                                    )}
                                                            </div>

                                                            {/* Remove Button */}
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    removeWishlistItem(
                                                                        product.product_id
                                                                    );
                                                                }}
                                                                disabled={
                                                                    loadingStates[
                                                                        product
                                                                            .product_id
                                                                    ]
                                                                }
                                                                className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                {loadingStates[
                                                                    product
                                                                        .product_id
                                                                ] ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                )}
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Enhanced Checkout Summary */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <ShoppingCart
                                    size={20}
                                    className="text-blue-600"
                                />
                                Order Summary
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                {selectedItems.length} items selected
                            </p>

                            {/* Enhanced Address Section */}
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        className="text-blue-600 mt-0.5 flex-shrink-0"
                                        size={18}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Delivery Address
                                        </p>

                                        {auth.user?.address ? (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {auth.user.address}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-red-600 mt-1">
                                                No address found.
                                            </p>
                                        )}
                                    </div>

                                    <Link href={route("profile")}>
                                        <button className="text-blue-600 hover:text-blue-800 flex-shrink-0">
                                            <Edit3 size={16} />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Enhanced Price Breakdown */}
                            <div className="mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Subtotal ({selectedItems.length} items)
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        RM{totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Discount
                                        </span>
                                        <span className="text-green-600 font-medium">
                                            -RM{totalDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900 font-medium">
                                        {totalPrice > 0 ? "RM5.00" : "Free"}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray-200">
                                <span className="text-gray-900">Total</span>
                                <span className="text-blue-600">
                                    RM
                                    {(
                                        totalPrice -
                                        totalDiscount +
                                        (totalPrice > 0 ? 5 : 0)
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout button */}
                            <button
                                disabled={selectedItems.length === 0}
                                onClick={() => {
                                    // Prepare the items in the correct structure for multiple products
                                    const checkoutItems = selectedItems.map(
                                        (item) => {
                                            // Parse selected_variant if it's a string
                                            let selectedVariant =
                                                item.selected_variant;
                                            if (
                                                typeof selectedVariant ===
                                                "string"
                                            ) {
                                                try {
                                                    selectedVariant =
                                                        JSON.parse(
                                                            selectedVariant
                                                        );
                                                } catch (error) {
                                                    console.error(
                                                        "Error parsing selected_variant:",
                                                        error
                                                    );
                                                    selectedVariant = null;
                                                }
                                            }

                                            return {
                                                product_id: item.product_id,
                                                product_name:
                                                    item.product.product_name,
                                                product_price:
                                                    getVariantPrice(item),
                                                product_quantity:
                                                    getAvailableStock(item),
                                                product_image:
                                                    item.product_image,
                                                seller_id:
                                                    item.product.seller_id,
                                                selected_quantity:
                                                    item.selected_quantity,
                                                selected_variant:
                                                    selectedVariant,
                                                user: item.user,
                                                originalPrice:
                                                    item.originalPrice,
                                            };
                                        }
                                    );

                                    console.log(
                                        "Sending to checkout:",
                                        checkoutItems
                                    );

                                    router.post(route("checkout"), {
                                        items: checkoutItems,
                                    });
                                }}
                                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                                    selectedItems.length === 0
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
                                }`}
                            >
                                Proceed to Checkout
                            </button>

                            {/* Continue shopping */}
                            <Link href={route("shopping")}>
                                <button className="w-full mt-3 py-2.5 text-blue-600 font-medium rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
