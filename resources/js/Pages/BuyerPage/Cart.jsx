import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    FaTrash,
    FaPlus,
    FaMinus,
    FaShoppingBag,
    FaLock,
    FaTruck,
    FaUndo,
    FaTag,
    FaGift,
    FaHeart,
    FaTimes,
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
    FaTrashAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";
import LoadingSpinner from "@/Components/Ui/LoadingSpinner";
import { Button } from "@/Components/Ui/Button";

export default function Cart() {
    // ========== States ==========
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    // ========== Pagination ==========
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // ========== Fetch Data ==========
    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(route("cart.all"));
            const items = response.data.data || response.data || [];
            setCartItems(items);
        } catch (error) {
            console.error("Error fetching cart data:", error);
            showNotification("Failed to load your cart", "error");
        } finally {
            setIsLoading(false);
        }
    };

    // ========== Notification ==========
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ========== Helper Functions ==========
    const parseVariantData = (variantData) => {
        if (!variantData) return null;
        try {
            return typeof variantData === "string"
                ? JSON.parse(variantData)
                : variantData;
        } catch {
            return null;
        }
    };

    const getProductImage = (item) => {
        const baseUrl = import.meta.env.VITE_BASE_URL || "";
        if (item.product_image?.image_path) {
            return baseUrl + item.product_image.image_path;
        }
        return "/placeholder.jpg";
    };

    const getProductPrice = (item) => {
        const variant = parseVariantData(item.selected_variant);
        if (variant?.price) {
            return parseFloat(variant.price);
        }
        return parseFloat(item.product?.product_price || 0);
    };

    const getProductName = (item) => {
        return item.product?.product_name || "Unknown Product";
    };

    const getSellerName = (item) => {
        return (
            item.product?.seller?.seller_store?.store_name || "Unknown Store"
        );
    };

    const getCategoryName = (item) => {
        return item.product?.category?.category_name || "Uncategorized";
    };

    const getAvailableStock = (item) => {
        const variant = parseVariantData(item.selected_variant);
        if (variant?.quantity) {
            return parseInt(variant.quantity);
        }
        return parseInt(item.product?.product_quantity || 0);
    };

    const getVariantDisplayText = (item) => {
        const variant = parseVariantData(item.selected_variant);
        if (variant?.variant_combination) {
            return Object.entries(variant.variant_combination)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
        }
        return null;
    };

    // ========== Pagination ==========
    const totalPages = Math.ceil(cartItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, cartItems.length);
    const currentItems = cartItems.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ========== Cart Functions ==========
    const updateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, selected_quantity: newQuantity }
                    : item,
            ),
        );
        try {
            await axios.patch(route("cart.update", { id }), {
                selected_quantity: newQuantity,
            });
        } catch (error) {
            console.error("Error updating quantity:", error);
            showNotification("Failed to update quantity", "error");
            fetchCartData();
        }
    };

    const removeItem = async (id) => {
        setLoadingStates((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.delete(route("cart.remove", { id }));
            setCartItems((prev) => prev.filter((item) => item.id !== id));
            if (currentItems.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            showNotification("Item removed from cart");
        } catch (error) {
            console.error("Error removing item:", error);
            showNotification("Failed to remove item", "error");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    // ========== Calculations ==========
    const subtotal = cartItems.reduce((sum, item) => {
        const price = getProductPrice(item);
        const quantity = item.selected_quantity || 1;
        return sum + price * quantity;
    }, 0);

    const shippingFee = subtotal >= 100 ? 0 : 15;
    const total = subtotal + shippingFee;

    const applyPromo = () => {
        if (promoCode.toUpperCase() === "RELOVE10") {
            setPromoApplied(true);
            showNotification("Promo code applied!");
        } else {
            showNotification("Invalid promo code", "error");
        }
    };

    // ========== Animations ==========
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -30 },
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Notification */}
            {notification && (
                <div className="fixed top-24 right-4 z-50 animate-slideDown">
                    <div
                        className={`rounded-xl shadow-lg p-4 flex items-center gap-3 ${
                            notification.type === "error"
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        }`}
                    >
                        {notification.type === "error" ? (
                            <FaTimes className="text-red-500" />
                        ) : (
                            <FaTag className="text-emerald-500" />
                        )}
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 mt-16">
                {/* ✅ NEW: Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="bg-emerald-100 p-2 rounded-xl">
                                <FaShoppingBag className="text-emerald-600" />
                            </span>
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {cartItems.length} items in your cart
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {cartItems.length > 0 && (
                            <Button
                                size="sm"
                                type="button"
                                variant="dangerSoft"
                                buttonText="Clear Cart"
                                leftIcon={<FaTrashAlt className="text-xs" />}
                            />
                        )}
                        <Link href={route("relove-market.shopping")}>
                            <Button
                                size="sm"
                                type="button"
                                variant="primary"
                                buttonText="Continue Shopping"
                                leftIcon={<FaShoppingBag className="text-sm" />}
                            />
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    // Loading state
                    <div className="flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                ) : cartItems.length === 0 ? (
                    // ✅ 空状态 - 购物车为空
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-28 h-28 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                            <FaShoppingBag className="text-5xl text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Looks like you haven't added any items to your cart
                            yet. Start exploring our products!
                        </p>
                        <Link
                            href={route("relove-market.shopping")}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
                        >
                            <FaShoppingBag />
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* ✅ NEW: Left Column - Cart Items */}
                        <div className="flex-1 min-w-0">
                            {/* Cart Items */}
                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {currentItems.map((item) => {
                                        const price = getProductPrice(item);
                                        const quantity =
                                            item.selected_quantity || 1;
                                        const stock = getAvailableStock(item);
                                        const variantText =
                                            getVariantDisplayText(item);

                                        return (
                                            <motion.div
                                                key={item.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-center">
                                                    {/* Product Info */}
                                                    <div className="flex items-center gap-4 md:col-span-6 w-full md:w-auto">
                                                        <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                                            <img
                                                                src={getProductImage(
                                                                    item,
                                                                )}
                                                                alt={getProductName(
                                                                    item,
                                                                )}
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e,
                                                                ) => {
                                                                    e.target.src =
                                                                        "/placeholder.jpg";
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="font-semibold text-gray-900 truncate">
                                                                {getProductName(
                                                                    item,
                                                                )}
                                                            </h3>
                                                            <p className="text-xs text-gray-500">
                                                                {getCategoryName(
                                                                    item,
                                                                )}
                                                            </p>
                                                            {variantText && (
                                                                <p className="text-xs text-gray-400 truncate">
                                                                    {
                                                                        variantText
                                                                    }
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-gray-400 truncate">
                                                                {getSellerName(
                                                                    item,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="flex items-center justify-between md:justify-center md:col-span-2 w-full md:w-auto mt-3 md:mt-0">
                                                        <span className="text-sm text-gray-500 md:hidden">
                                                            Qty:
                                                        </span>
                                                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        quantity -
                                                                            1,
                                                                    )
                                                                }
                                                                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50"
                                                                disabled={
                                                                    quantity <=
                                                                    1
                                                                }
                                                            >
                                                                <FaMinus className="text-xs text-gray-600" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium text-gray-900">
                                                                {quantity}
                                                            </span>
                                                            <button
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.id,
                                                                        quantity +
                                                                            1,
                                                                    )
                                                                }
                                                                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50"
                                                                disabled={
                                                                    quantity >=
                                                                    stock
                                                                }
                                                            >
                                                                <FaPlus className="text-xs text-gray-600" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="flex items-center justify-between md:justify-end md:col-span-3 w-full md:w-auto mt-3 md:mt-0">
                                                        <span className="text-sm text-gray-500 md:hidden">
                                                            Price:
                                                        </span>
                                                        <div className="text-right">
                                                            <span className="font-bold text-emerald-600 text-base">
                                                                RM{" "}
                                                                {(
                                                                    price *
                                                                    quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                            <p className="text-xs text-gray-400">
                                                                RM{" "}
                                                                {price.toFixed(
                                                                    2,
                                                                )}{" "}
                                                                each
                                                            </p>
                                                            {stock < 5 &&
                                                                stock > 0 && (
                                                                    <p className="text-xs text-amber-500">
                                                                        ⚠️{" "}
                                                                        {stock}{" "}
                                                                        left
                                                                    </p>
                                                                )}
                                                        </div>
                                                    </div>

                                                    {/* Action */}
                                                    <div className="flex justify-end md:col-span-1 w-full md:w-auto mt-3 md:mt-0">
                                                        <button
                                                            onClick={() =>
                                                                removeItem(
                                                                    item.id,
                                                                )
                                                            }
                                                            disabled={
                                                                loadingStates[
                                                                    item.id
                                                                ]
                                                            }
                                                            className="text-gray-300 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                                                        >
                                                            {loadingStates[
                                                                item.id
                                                            ] ? (
                                                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                                            ) : (
                                                                <FaTrash className="text-sm" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>

                            {/* ✅ NEW: Pagination */}
                            {totalPages > 1 && (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
                                    <p className="text-sm text-gray-500">
                                        Showing {startIndex + 1}–{endIndex} of{" "}
                                        {cartItems.length} items
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() =>
                                                goToPage(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <FaChevronLeft className="text-xs" />
                                        </button>
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1,
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => goToPage(page)}
                                                className={`w-8 h-8 rounded-lg text-sm font-medium transition ${
                                                    currentPage === page
                                                        ? "bg-emerald-600 text-white shadow-sm"
                                                        : "hover:bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() =>
                                                goToPage(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            <FaChevronRight className="text-xs" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ✅ NEW: Right Column - Order Summary (sticky) */}
                        <div className="lg:w-96 flex-shrink-0">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                                    Order Summary
                                </h2>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Subtotal ({cartItems.length} items)
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            RM {subtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 flex items-center gap-1">
                                            <FaTruck className="text-xs" />
                                            Shipping
                                        </span>
                                        <span
                                            className={
                                                shippingFee === 0
                                                    ? "text-emerald-600 font-medium"
                                                    : "text-gray-900"
                                            }
                                        >
                                            {shippingFee === 0
                                                ? "FREE"
                                                : `RM ${shippingFee.toFixed(2)}`}
                                        </span>
                                    </div>

                                    {shippingFee > 0 && (
                                        <div className="text-xs text-emerald-600 bg-emerald-50 p-2.5 rounded-lg flex items-center gap-2">
                                            <FaGift className="text-emerald-500" />
                                            Add RM {(100 - subtotal).toFixed(2)}{" "}
                                            more for free shipping
                                        </div>
                                    )}

                                    {/* Promo Code */}
                                    <div className="pt-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Promo code"
                                                value={promoCode}
                                                onChange={(e) =>
                                                    setPromoCode(e.target.value)
                                                }
                                                disabled={promoApplied}
                                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none disabled:bg-gray-50"
                                            />
                                            <button
                                                onClick={applyPromo}
                                                disabled={promoApplied}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                                                    promoApplied
                                                        ? "bg-emerald-100 text-emerald-600 cursor-default"
                                                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                                                }`}
                                            >
                                                {promoApplied
                                                    ? "Applied ✓"
                                                    : "Apply"}
                                            </button>
                                        </div>
                                        {promoApplied && (
                                            <p className="text-xs text-emerald-600 mt-1">
                                                🎉 Promo code applied! 10% off.
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 pt-3 mt-2">
                                        <div className="flex justify-between text-base font-bold">
                                            <span className="text-gray-900">
                                                Total
                                            </span>
                                            <span className="text-emerald-600 text-xl">
                                                RM {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                                    <FaLock className="text-sm" />
                                    Proceed to Checkout
                                </button>

                                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <FaLock className="text-[10px]" />
                                        Secure checkout
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FaUndo className="text-[10px]" />
                                        30-day returns
                                    </span>
                                </div>

                                <Link href={route("relove-market.wishlist")}>
                                    <button className="w-full mt-3 py-2.5 text-emerald-600 font-medium rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                                        <FaHeart />
                                        View My Wishlist
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />

            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
