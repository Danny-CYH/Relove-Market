import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    FaShoppingBag,
    FaLock,
    FaTruck,
    FaUndo,
    FaTag,
    FaGift,
    FaHeart,
    FaTimes,
    FaTrashAlt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";
import LoadingSpinner from "@/Components/Ui/LoadingSpinner";
import { Button } from "@/Components/Ui/Button";
import { CartCard } from "@/Components/Ui/CartCard";
import { Icon } from "@/Components/Ui/Icon";

import { GetSelectedVariant } from "@/Components/HelperFunction/GetSelectedVariant";

import { CartItem } from "@/eloquent-types/models/cart-item";

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [loadingStates, setLoadingStates] = useState({});

    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState(false);

    const [notification, setNotification] = useState(null);

    // Fetch cart data from the backend
    const fetchCart = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(route("cart.all"));
            const cartItems = response.data;

            setCartItems(cartItems);
        } catch (error) {
            showNotification("Failed to load your cart", error);
        } finally {
            setIsLoading(false);
        }
    };

    // ========== Notification ==========
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const getProductPrice = (item) => {
        const variant = GetSelectedVariant(item);
        if (variant?.price) {
            return parseFloat(variant.price);
        }
        return parseFloat(item.product?.product_price || 0);
    };

    const getAvailableStock = (item) => {
        const variant = GetSelectedVariant(item);
        if (variant?.quantity) {
            return parseInt(variant.quantity);
        }
        return parseInt(item.product?.product_quantity || 0);
    };

    // ========== Cart Functions ==========
    const updateQuantity = (productId: string, newQuantity: number): void => {
        if (newQuantity < 1) return;

        const item = cartItems.find(
            (item) => item.product.product_id === productId,
        );

        if (!item) return;

        const maxStock = getAvailableStock(item);

        if (newQuantity > maxStock) {
            showNotification(
                `Only ${maxStock} items available in stock`,
                "error",
            );
            return;
        }

        setCartItems((prev) =>
            prev.map((item) =>
                item.product.product_id === productId
                    ? { ...item, selected_quantity: newQuantity }
                    : item,
            ),
        );
    };

    const updateVariant = async (productId, selectedVariant) => {
        await axios.patch(
            route("cart.update-variant", {
                product_id: productId,
                variant_data: selectedVariant,
            }),
        );

        setCartItems((prev) =>
            prev.map((item) => {
                if (item.product.product_id === productId) {
                    return {
                        ...item,
                        selected_variant: {
                            variant_id: selectedVariant.variant_id,
                            variant_combination:
                                selectedVariant.variant_combination || {},
                            price: selectedVariant.price,
                            quantity: selectedVariant.quantity,
                        },
                    };
                }
                return item;
            }),
        );

        showNotification("Variant updated");
    };

    const removeItem = async (productId) => {
        try {
            await axios.delete(route("cart.remove", { product_id: productId }));

            setCartItems((prev) =>
                prev.filter((item) => item.product.product_id !== productId),
            );
        } catch (error) {
            showNotification(
                error.response?.data?.errorMessage || "Failed to remove item",
                "error",
            );
        } finally {
            setLoadingStates((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const removeSelectedItems = async () => {
        if (selectedItems.length === 0) return;

        setLoadingStates((prev) => ({ ...prev, all: true }));
        try {
            // 发送 product_id 数组到后端
            await axios.delete(
                route("cart.remove", { product_id: selectedItems }),
            );

            setCartItems((prev) =>
                prev.filter((item) => !selectedItems.includes(item.product.product_id)),
            );
            setSelectedItems([]);
            showNotification(`${selectedItems.length} items removed from cart`);
        } catch (error) {
            showNotification(error.response);
        } finally {
            setLoadingStates((prev) => ({ ...prev, all: false }));
        }
    };

    const toggleSelect = (productId) => {
        setSelectedItems((prev) => {
            const exists = prev.some((id) => id === productId);
            if (exists) {
                return prev.filter((id) => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    const toggleSelectAll = () => {
        const allProductIds = cartItems.map((item) => item.product.product_id);
        const allSelected = allProductIds.every((id) => {
            selectedItems.includes(id);
        });

        if (allSelected) {
            setSelectedItems([]);
        } else {
            setSelectedItems(allProductIds);
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

    useEffect(() => {
        fetchCart();
    }, []);

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
                            <Icon icon={FaTimes} className="text-red-500" />
                        ) : (
                            <Icon icon={FaTag} className="text-emerald-500" />
                        )}
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 mt-16">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <span className="bg-emerald-100 p-2 rounded-xl">
                                <Icon
                                    icon={FaShoppingBag}
                                    className="text-emerald-600"
                                />
                            </span>
                            Shopping Cart
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {cartItems.length} items in your cart
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedItems.length > 0 && (
                            <Button
                                size="sm"
                                type="button"
                                variant="dangerSoft"
                                buttonText={`Remove Selected (${selectedItems.length})`}
                                leftIcon={
                                    <Icon
                                        icon={FaTrashAlt}
                                        className="text-xs"
                                    />
                                }
                                onClick={removeSelectedItems}
                            />
                        )}
                        <Link href={route("relove-market.shopping")}>
                            <Button
                                size="sm"
                                type="button"
                                variant="primary"
                                buttonText="Continue Shopping"
                                leftIcon={
                                    <Icon
                                        icon={FaShoppingBag}
                                        className="text-sm"
                                    />
                                }
                            />
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="w-28 h-28 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
                            <Icon
                                icon={FaShoppingBag}
                                className="text-5xl text-emerald-400"
                            />
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
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={
                                            cartItems.length > 0 &&
                                            cartItems.every((item) =>
                                                selectedItems.includes(
                                                    item.product.product_id,
                                                ),
                                            )
                                        }
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 text-emerald-600 border-2 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Select All ({cartItems.length} items)
                                    </span>
                                </label>
                                <span className="text-sm text-gray-400">
                                    {selectedItems.length} selected
                                </span>
                            </div>

                            {/* Cart Items */}
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {cartItems.map((item) => {
                                        return (
                                            <motion.div
                                                key={item.product.product_id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <CartCard
                                                    item={item}
                                                    onUpdateQuantity={
                                                        updateQuantity
                                                    }
                                                    onUpdateVariant={
                                                        updateVariant
                                                    }
                                                    onRemove={removeItem}
                                                    isSelected={selectedItems.includes(
                                                        item.product.product_id,
                                                    )}
                                                    onSelect={toggleSelect}
                                                    isLoading={
                                                        loadingStates[
                                                            item.product
                                                                .product_id
                                                        ] || loadingStates.all
                                                    }
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Order Summary */}
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
                                            <Icon
                                                icon={FaTruck}
                                                className="text-xs"
                                            />
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
                                            <Icon
                                                icon={FaGift}
                                                className="text-emerald-500"
                                            />
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
                                    <Icon icon={FaLock} className="text-sm" />
                                    Proceed to Checkout
                                </button>

                                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <Icon
                                            icon={FaLock}
                                            className="text-[10px]"
                                        />
                                        Secure checkout
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Icon
                                            icon={FaUndo}
                                            className="text-[10px]"
                                        />
                                        30-day returns
                                    </span>
                                </div>

                                <Link href={route("relove-market.wishlist")}>
                                    <button className="w-full mt-3 py-2.5 text-emerald-600 font-medium rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                                        <Icon icon={FaHeart} />
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
