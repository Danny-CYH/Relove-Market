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
import { Footer } from "@/Components/BuyerPage/Footer";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Link, router } from "@inertiajs/react";
import axios from "axios";

export default function Wishlist({ user_wishlist }) {
    const [wishlist, setWishlist] = useState(user_wishlist);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [bulkLoading, setBulkLoading] = useState(false);

    // Remove single item from wishlist
    const removeWishlistItem = async (productId) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));

        try {
            const response = await axios.post(`/wishlist/${productId}`, {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.data.successMessage) {
                // Remove item from local state immediately
                setWishlist((prev) =>
                    prev.filter((item) => item.product_id !== productId)
                );
                setSelected((prev) => prev.filter((id) => id !== productId));
            } else {
                console.error(
                    "Failed to remove item:",
                    response.data.errorMessage
                );
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
            const response = await axios.post(
                "/wishlist/remove",
                {
                    product_id: selected,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );

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

    // Remove all items from wishlist
    const removeAllItems = async () => {
        setBulkLoading(true);

        try {
            const response = await axios.delete("/wishlist/remove-all", {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            if (response.data.success) {
                // Clear all items from local state immediately
                setWishlist([]);
                setSelected([]);
                setSelectAll(false);

                console.log("All items removed from wishlist");
            } else {
                console.error(
                    "Failed to remove all items:",
                    response.data.message
                );
            }
        } catch (error) {
            console.error("Error clearing wishlist:", error);
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
            prev.map((item) =>
                item.product_id === id
                    ? {
                          ...item,
                          product: {
                              ...item.product,
                              product_quantity:
                                  type === "inc"
                                      ? item.product.product_quantity + 1
                                      : Math.max(
                                            1,
                                            item.product.product_quantity - 1
                                        ),
                          },
                      }
                    : item
            )
        );
    };

    const selectedItems = wishlist.filter((item) =>
        selected.includes(item.product_id)
    );

    const totalPrice = selectedItems.reduce(
        (sum, item) =>
            sum + item.product.product_price * item.product.product_quantity,
        0
    );

    const totalDiscount = selectedItems.reduce(
        (sum, item) =>
            sum +
            ((item.originalPrice || item.product.product_price) -
                item.product.product_price) *
                item.product.product_quantity,
        0
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 mt-16">
                {/* Page Header */}
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 md:px-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Heart
                                className="text-red-500 fill-current"
                                size={28}
                            />
                            My Wishlist
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {wishlist.length}{" "}
                            {wishlist.length === 1 ? "product" : "products"}{" "}
                            saved for view
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT SIDE: Wishlist items */}
                    <div className="lg:col-span-2">
                        {/* Action Bar */}
                        {wishlist.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={toggleSelectAll}
                                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label className="ml-2 text-sm font-medium text-gray-700">
                                        Select all ({wishlist.length} items)
                                    </label>
                                </div>

                                {selected.length > 0 && (
                                    <button
                                        onClick={removeSelectedItems}
                                        disabled={bulkLoading}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        )}

                        {/* Wishlist Items */}
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                                <Heart
                                    className="mx-auto text-gray-300"
                                    size={48}
                                />
                                <h3 className="mt-4 text-lg font-medium text-gray-900">
                                    Your wishlist is empty
                                </h3>
                                <p className="mt-2 text-gray-500">
                                    Save your favorite items here for easy
                                    access later
                                </p>
                                <Link href={route("shopping")}>
                                    <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {wishlist.map((product) => (
                                    <div
                                        key={product.product_id}
                                        className="flex items-start bg-white rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md relative"
                                    >
                                        {/* Desktop Checkbox - Hidden on Mobile */}
                                        <div className="flex-shrink-0 p-4 hidden md:block">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(
                                                    product.product_id
                                                )}
                                                onChange={() =>
                                                    toggleSelect(
                                                        product.product_id
                                                    )
                                                }
                                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-1"
                                            />
                                        </div>

                                        {/* Card Content */}
                                        <Link
                                            href={`/product-details/${product.product_id}`}
                                            className="flex-1 flex flex-col sm:flex-row cursor-pointer"
                                        >
                                            {/* Image */}
                                            <div className="flex-shrink-0 w-full sm:w-32 h-40 sm:h-32 mb-4 sm:mb-0 p-4">
                                                <img
                                                    src={
                                                        import.meta.env
                                                            .VITE_BASE_URL +
                                                        product.product_image
                                                            .image_path
                                                    }
                                                    alt={
                                                        product.product
                                                            .product_name
                                                    }
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 sm:ml-4 flex flex-col justify-between px-5 pb-5 md:p-4">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h2 className="text-lg font-medium text-gray-900 line-clamp-2 flex-1 mr-4">
                                                            {
                                                                product.product
                                                                    .product_name
                                                            }
                                                        </h2>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xl font-bold text-gray-900">
                                                                RM{" "}
                                                                {
                                                                    product
                                                                        .product
                                                                        .product_price
                                                                }
                                                            </span>
                                                            {product.originalPrice &&
                                                                product.originalPrice >
                                                                    product
                                                                        .product
                                                                        .product_price && (
                                                                    <span className="text-sm text-gray-500 line-through">
                                                                        RM{" "}
                                                                        {
                                                                            product.originalPrice
                                                                        }
                                                                    </span>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Stock status */}
                                                    <div className="flex justify-between items-center mt-2">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                product.inStock !==
                                                                false
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"
                                                            }`}
                                                        >
                                                            {product.inStock !==
                                                            false
                                                                ? "In Stock"
                                                                : "Out of Stock"}
                                                        </span>

                                                        {/* Star rating */}
                                                        <div className="flex">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-yellow-400 fill-current"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Quantity and Remove Button */}
                                                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-gray-700 mr-3">
                                                            Quantity:
                                                        </span>
                                                        <div className="flex items-center border border-gray-300 rounded-md">
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
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                                                disabled={
                                                                    product
                                                                        .product
                                                                        .product_quantity <=
                                                                    1
                                                                }
                                                            >
                                                                <Minus
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <span className="px-3 py-1 text-gray-900 min-w-[2rem] text-center">
                                                                {
                                                                    product
                                                                        .product
                                                                        .product_quantity
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
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                                            >
                                                                <Plus
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center gap-3">
                                                        {/* Mobile Checkbox - Bottom Right */}
                                                        <div className="md:hidden flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">
                                                                Select:
                                                            </span>
                                                            <button
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleSelect(
                                                                        product.product_id
                                                                    );
                                                                }}
                                                                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                                                    selected.includes(
                                                                        product.product_id
                                                                    )
                                                                        ? "bg-green-500 border-green-500 text-white"
                                                                        : "bg-white border-gray-300 text-transparent hover:border-gray-400"
                                                                }`}
                                                            >
                                                                {selected.includes(
                                                                    product.product_id
                                                                ) && (
                                                                    <svg
                                                                        className="w-3 h-3"
                                                                        fill="currentColor"
                                                                        viewBox="0 0 20 20"
                                                                    >
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                            clipRule="evenodd"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={(e) => {
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
                                                                    size={16}
                                                                />
                                                            )}
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: Checkout Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            {/* Address Section */}
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <div className="flex items-start">
                                    <MapPin
                                        className="text-gray-500 mt-0.5 mr-2"
                                        size={18}
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            Delivery Address
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            John Doe, 123 Main Street, Kuala
                                            Lumpur, 50480
                                        </p>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-800">
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="mb-6 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Subtotal ({selectedItems.length} items)
                                    </span>
                                    <span className="text-gray-900">
                                        RM{totalPrice.toFixed(2)}
                                    </span>
                                </div>

                                {totalDiscount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Discount
                                        </span>
                                        <span className="text-green-600">
                                            -RM{totalDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Shipping
                                    </span>
                                    <span className="text-gray-900">
                                        {totalPrice > 0 ? "RM5.00" : "Free"}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">
                                        RM{(totalPrice * 0.06).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between text-lg font-bold mb-6 pt-4 border-t border-gray-200">
                                <span className="text-black">Total</span>
                                <span className="text-blue-600">
                                    RM
                                    {(
                                        totalPrice -
                                        totalDiscount +
                                        (totalPrice > 0 ? 5 : 0) +
                                        totalPrice * 0.06
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout button */}
                            <button
                                disabled={selectedItems.length === 0}
                                onClick={() =>
                                    router.post(route("checkout"), {
                                        items: selectedItems,
                                    })
                                }
                                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                                    selectedItems.length === 0
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                            >
                                Proceed to Checkout
                            </button>

                            {/* Continue shopping */}
                            <Link href={route("shopping")}>
                                <button className="w-full mt-3 py-2.5 text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
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
