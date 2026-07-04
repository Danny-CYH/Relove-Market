import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    FaTrash,
    FaPlus,
    FaMinus,
    FaShoppingBag,
    FaArrowLeft,
    FaLock,
    FaTruck,
    FaUndo,
    FaTag,
    FaGift,
    FaHeart,
    FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);
    const [notification, setNotification] = useState(null);
    const [loadingStates, setLoadingStates] = useState({});

    // ========== Fetch Data ==========
    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        setIsLoading(true);
        try {
            // ✅ 使用正确的购物车 endpoint
            const response = await axios.get(route("cart-data"));
            setCartItems(response.data.cart_items || []);
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

    // ========== Cart Functions ==========
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, quantity: newQuantity } : item,
            ),
        );
    };

    const removeItem = async (id) => {
        setLoadingStates((prev) => ({ ...prev, [id]: true }));
        try {
            await axios.delete(route("cart-remove", { id }));
            setCartItems((prev) => prev.filter((item) => item.id !== id));
            showNotification("Item removed from cart");
        } catch (error) {
            console.error("Error removing item:", error);
            showNotification("Failed to remove item", "error");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [id]: false }));
        }
    };

    // ========== Cart Calculations ==========
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
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
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 },
    };

    // ========== Render ==========
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500">Loading your cart...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />

            {/* Notification Toast */}
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

            <main className="flex-grow container mx-auto px-4 py-8 mt-8">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("shopping")}
                            className="text-gray-500 hover:text-emerald-600 transition-colors"
                        >
                            <FaArrowLeft className="text-xl" />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Your Cart
                        </h1>
                        <span className="text-sm text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                            {cartItems.length} items
                        </span>
                    </div>
                    <Link
                        href={route("shopping")}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center gap-2"
                    >
                        <FaShoppingBag />
                        Continue Shopping
                    </Link>
                </div>

                {cartItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 mb-6">
                            <FaShoppingBag className="text-4xl text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Looks like you haven't added any items to your cart
                            yet.
                        </p>
                        <Link
                            href={route("shopping")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors shadow-sm hover:shadow-md"
                        >
                            <FaShoppingBag />
                            Start Shopping
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex gap-4">
                                            {/* Product Image */}
                                            <div className="w-24 h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 truncate">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {item.category}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-0.5">
                                                            Seller:{" "}
                                                            {item.seller}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        disabled={
                                                            loadingStates[
                                                                item.id
                                                            ]
                                                        }
                                                        className="text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
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

                                                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity -
                                                                        1,
                                                                )
                                                            }
                                                            className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50"
                                                            disabled={
                                                                item.quantity <=
                                                                1
                                                            }
                                                        >
                                                            <FaMinus className="text-xs text-gray-600" />
                                                        </button>
                                                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantity +
                                                                        1,
                                                                )
                                                            }
                                                            className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50"
                                                            disabled={
                                                                item.quantity >=
                                                                item.stock
                                                            }
                                                        >
                                                            <FaPlus className="text-xs text-gray-600" />
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <span className="font-bold text-emerald-600 text-lg">
                                                            RM{" "}
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </span>
                                                        <p className="text-xs text-gray-400">
                                                            RM{" "}
                                                            {item.price.toFixed(
                                                                2,
                                                            )}{" "}
                                                            each
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
                                        <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg flex items-center gap-1">
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

                                    <div className="border-t border-gray-100 pt-3">
                                        <div className="flex justify-between text-base font-semibold">
                                            <span className="text-gray-900">
                                                Total
                                            </span>
                                            <span className="text-emerald-600 text-xl">
                                                RM {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <button className="w-full mt-4 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
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

                                {/* ✅ 链接到 Wishlist 页面 */}
                                <Link href={route("wishlist")}>
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

            {/* Animation Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
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
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }
            `}</style>
        </div>
    );
}
