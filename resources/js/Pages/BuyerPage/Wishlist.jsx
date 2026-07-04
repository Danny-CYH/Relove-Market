import { useState } from "react";
import { Link } from "@inertiajs/react";
import {
    Heart,
    ShoppingBag,
    Trash2,
    Star,
    X,
    Loader2,
    AlertCircle,
    CheckCircle,
    Eye,
    LayoutGrid,
    List,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

import Navbar from "@/Components/Ui/Navbar";
import Footer from "@/Components/Ui/Footer";

export default function Wishlist({ user_wishlist = [] }) {
    // ========== States ==========
    const [wishlist, setWishlist] = useState(user_wishlist);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [bulkLoading, setBulkLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [viewMode, setViewMode] = useState("grid");

    // ========== Notification ==========
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // ========== Rating Helper ==========
    const calculateProductRating = (product) => {
        if (!product) return { average: 0, total: 0 };
        const ratings = product.ratings || [];
        if (ratings.length === 0) return { average: 0, total: 0 };
        const total = ratings.reduce((sum, r) => sum + (r.rating || 0), 0);
        return {
            average: parseFloat((total / ratings.length).toFixed(1)),
            total: ratings.length,
        };
    };

    const StarRating = ({ rating, size = 14 }) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 >= 0.5;
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return (
                            <Star
                                key={i}
                                size={size}
                                className="text-amber-400 fill-current"
                            />
                        );
                    }
                    if (i === fullStars && hasHalf) {
                        return (
                            <div key={i} className="relative">
                                <Star
                                    size={size}
                                    className="text-gray-300 fill-current"
                                />
                                <div
                                    className="absolute inset-0 overflow-hidden"
                                    style={{ width: "50%" }}
                                >
                                    <Star
                                        size={size}
                                        className="text-amber-400 fill-current"
                                    />
                                </div>
                            </div>
                        );
                    }
                    return (
                        <Star
                            key={i}
                            size={size}
                            className="text-gray-300 fill-current"
                        />
                    );
                })}
            </div>
        );
    };

    // ========== Variant Helpers ==========
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

    const getVariantDisplayText = (item) => {
        const variantData = parseVariantData(item.selected_variant);
        if (!variantData) return null;
        if (variantData.variant_combination) {
            return Object.entries(variantData.variant_combination)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
        }
        return variantData.variant_name || null;
    };

    const getVariantPrice = (item) => {
        const variantData = parseVariantData(item.selected_variant);
        return (
            variantData?.price ||
            item.product?.product_price ||
            item.product_price ||
            0
        );
    };

    const getAvailableStock = (item) => {
        const variantData = parseVariantData(item.selected_variant);
        return (
            variantData?.quantity ||
            item.product?.product_quantity ||
            item.product_quantity ||
            0
        );
    };

    const getVariantId = (item) => {
        const variantData = parseVariantData(item.selected_variant);
        return variantData?.variant_id || variantData?.id || null;
    };

    const hasVariants = (item) => {
        const variants = item.product_variant || item.product?.product_variant;
        return (
            variants?.some((v) => {
                const combo = v.variant_combination;
                return combo && Object.keys(combo).length > 0;
            }) || false
        );
    };

    // ========== Wishlist Functions ==========
    const removeWishlistItem = async (productId, variantId = null) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));
        try {
            await axios.delete(route("remove-wishlist"), {
                data: { product_id: productId, variant_id: variantId },
            });
            setWishlist((prev) =>
                prev.filter((item) => {
                    const itemVariantId = getVariantId(item);
                    if (variantId) {
                        return !(
                            item.product_id === productId &&
                            itemVariantId === variantId
                        );
                    }
                    return item.product_id !== productId;
                }),
            );
            setSelected((prev) => prev.filter((id) => id !== productId));
            showNotification("Item removed from wishlist");
        } catch (error) {
            showNotification("Failed to remove item", "error");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [productId]: false }));
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    const removeSelectedItems = async () => {
        if (selected.length === 0) return;
        setBulkLoading(true);
        try {
            const itemsToRemove = selected.map((id) => ({
                product_id: id,
                variant_id: getVariantId(
                    wishlist.find((i) => i.product_id === id),
                ),
            }));
            await axios.delete(route("remove-wishlist"), {
                data: { items: itemsToRemove },
            });
            setWishlist((prev) =>
                prev.filter((item) => !selected.includes(item.product_id)),
            );
            setSelected([]);
            setSelectAll(false);
            showNotification(`${selected.length} items removed from wishlist`);
        } catch (error) {
            showNotification("Failed to remove items", "error");
        } finally {
            setBulkLoading(false);
            setShowDeleteModal(false);
        }
    };

    const addAllToCart = async () => {
        const availableItems = wishlist.filter(
            (item) => getAvailableStock(item) > 0,
        );
        if (availableItems.length === 0) {
            showNotification("No available items to add to cart", "error");
            return;
        }
        try {
            for (const item of availableItems) {
                await axios.post(route("cart-add"), {
                    product_id: item.product_id,
                    quantity: 1,
                    selected_variant: parseVariantData(item.selected_variant),
                });
            }
            showNotification(`${availableItems.length} items added to cart!`);
        } catch (error) {
            showNotification("Failed to add items to cart", "error");
        }
    };

    // ========== Toggle Functions ==========
    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
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

    // ========== Animations ==========
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
    };

    // ========== Render ==========
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-white to-emerald-100/30 flex flex-col">
            <Navbar />

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-24 right-4 z-50"
                    >
                        <div
                            className={`rounded-2xl shadow-xl p-4 flex items-center gap-3 backdrop-blur-sm ${
                                notification.type === "error"
                                    ? "bg-red-50/95 text-red-800 border border-red-200"
                                    : "bg-emerald-50/95 text-emerald-800 border border-emerald-200"
                            }`}
                        >
                            {notification.type === "error" ? (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                            ) : (
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                            )}
                            <p className="text-sm font-medium">
                                {notification.message}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                Remove {itemToDelete ? "Item" : "Items"}?
                            </h3>
                            <p className="text-gray-500 text-center mb-6">
                                {itemToDelete
                                    ? "Are you sure you want to remove this item from your wishlist?"
                                    : `Are you sure you want to remove ${selected.length} selected items?`}
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setItemToDelete(null);
                                    }}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        itemToDelete
                                            ? removeWishlistItem(
                                                  itemToDelete.product_id,
                                                  getVariantId(itemToDelete),
                                              )
                                            : removeSelectedItems()
                                    }
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition font-medium shadow-lg shadow-red-100"
                                >
                                    Remove
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 mt-16">
                {/* ===== Page Header ===== */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <Heart
                                        className="text-white"
                                        size={28}
                                        fill="white"
                                    />
                                </div>
                                {wishlist.length > 0 && (
                                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md">
                                        {wishlist.length}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    My Wishlist
                                    <Sparkles className="w-5 h-5 text-emerald-500" />
                                </h1>
                                <p className="text-gray-500 mt-0.5 flex items-center gap-2">
                                    <span>
                                        {wishlist.length} items saved for later
                                    </span>
                                    {wishlist.length > 0 && (
                                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <TrendingUp className="w-3 h-3 inline" />{" "}
                                            Ready to shop
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {wishlist.length > 0 && (
                            <div className="flex gap-3">
                                <div className="flex bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`px-3 py-1.5 rounded-lg transition text-sm font-medium flex items-center gap-1.5 ${
                                            viewMode === "grid"
                                                ? "bg-emerald-600 text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewMode("list")}
                                        className={`px-3 py-1.5 rounded-lg transition text-sm font-medium flex items-center gap-1.5 ${
                                            viewMode === "list"
                                                ? "bg-emerald-600 text-white shadow-sm"
                                                : "text-gray-600 hover:bg-gray-100"
                                        }`}
                                    >
                                        <List className="w-4 h-4" />
                                        List
                                    </button>
                                </div>
                                <button
                                    onClick={addAllToCart}
                                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition shadow-md shadow-emerald-200 flex items-center gap-2 text-sm font-medium"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Add All to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* ===== Empty State ===== */}
                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center"
                    >
                        <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center">
                            <Heart className="w-14 h-14 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            Your wishlist is empty
                        </h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            Start saving your favorite items by clicking the
                            heart icon on any product.
                        </p>
                        <Link href={route("shopping")}>
                            <button className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 mx-auto">
                                <ShoppingBag className="w-5 h-5" />
                                Explore Products
                            </button>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* ===== Action Bar ===== */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-100 p-4 mb-6"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2.5 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 cursor-pointer transition"
                                        />
                                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition">
                                            Select all ({wishlist.length} items)
                                        </span>
                                    </label>
                                    {selected.length > 0 && (
                                        <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                                            {selected.length} selected
                                        </span>
                                    )}
                                </div>

                                {selected.length > 0 && (
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        disabled={bulkLoading}
                                        className="flex items-center gap-2 px-5 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition disabled:opacity-50 font-medium text-sm"
                                    >
                                        {bulkLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                        Remove Selected ({selected.length})
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* ===== Wishlist Items ===== */}
                        {viewMode === "grid" ? (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                            >
                                <AnimatePresence>
                                    {wishlist.map((item) => {
                                        const isSelected = selected.includes(
                                            item.product_id,
                                        );
                                        const variantText =
                                            getVariantDisplayText(item);
                                        const variantPrice =
                                            getVariantPrice(item);
                                        const availableStock =
                                            getAvailableStock(item);
                                        const isOutOfStock =
                                            availableStock === 0;
                                        const ratingInfo =
                                            calculateProductRating(
                                                item.product,
                                            );
                                        const productHasVariants =
                                            hasVariants(item);

                                        return (
                                            <motion.div
                                                key={item.product_id}
                                                variants={itemVariants}
                                                exit="exit"
                                                layout
                                                className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 ${
                                                    isSelected
                                                        ? "border-emerald-400 ring-2 ring-emerald-200 shadow-emerald-100"
                                                        : "border-gray-100 hover:border-emerald-200"
                                                } ${isOutOfStock ? "opacity-60" : ""}`}
                                            >
                                                <div className="relative">
                                                    {/* Selection Checkbox */}
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    item.product_id,
                                                                )
                                                            }
                                                            disabled={
                                                                isOutOfStock
                                                            }
                                                            className="w-5 h-5 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 cursor-pointer disabled:opacity-50"
                                                        />
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button
                                                        onClick={() => {
                                                            setItemToDelete(
                                                                item,
                                                            );
                                                            setShowDeleteModal(
                                                                true,
                                                            );
                                                        }}
                                                        disabled={
                                                            loadingStates[
                                                                item.product_id
                                                            ]
                                                        }
                                                        className="absolute top-3 right-3 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 transition disabled:opacity-50"
                                                    >
                                                        {loadingStates[
                                                            item.product_id
                                                        ] ? (
                                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition" />
                                                        )}
                                                    </button>

                                                    {/* Product Image */}
                                                    <Link
                                                        href={route(
                                                            "product-details",
                                                            item.product_id,
                                                        )}
                                                    >
                                                        <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden">
                                                            <img
                                                                src={
                                                                    import.meta
                                                                        .env
                                                                        .VITE_BASE_URL +
                                                                    (item
                                                                        .product_image
                                                                        ?.image_path ||
                                                                        item
                                                                            .product
                                                                            ?.product_image?.[0]
                                                                            ?.image_path ||
                                                                        "/placeholder.jpg")
                                                                }
                                                                alt={
                                                                    item.product
                                                                        ?.product_name ||
                                                                    item.product_name
                                                                }
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                            />
                                                        </div>
                                                    </Link>

                                                    {/* Stock Badge */}
                                                    <div className="absolute bottom-3 left-3">
                                                        <span
                                                            className={`px-3 py-1 rounded-xl text-xs font-medium shadow-sm ${
                                                                !isOutOfStock
                                                                    ? "bg-emerald-500 text-white"
                                                                    : "bg-gray-600 text-white"
                                                            }`}
                                                        >
                                                            {!isOutOfStock
                                                                ? `${availableStock} in stock`
                                                                : "Out of Stock"}
                                                        </span>
                                                    </div>

                                                    {/* Heart Badge */}
                                                    <div className="absolute top-3 right-12">
                                                        <span className="px-2 py-0.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
                                                            ❤️ Wishlist
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4">
                                                    {/* Product Name */}
                                                    <Link
                                                        href={route(
                                                            "product-details",
                                                            item.product_id,
                                                        )}
                                                    >
                                                        <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition line-clamp-2">
                                                            {item.product
                                                                ?.product_name ||
                                                                item.product_name}
                                                        </h3>
                                                    </Link>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-2 mt-1.5">
                                                        <StarRating
                                                            rating={
                                                                ratingInfo.average
                                                            }
                                                        />
                                                        {ratingInfo.total >
                                                            0 && (
                                                            <span className="text-xs text-gray-400">
                                                                (
                                                                {
                                                                    ratingInfo.total
                                                                }
                                                                )
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Variant Info */}
                                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                                        {variantText && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-200">
                                                                {variantText}
                                                            </span>
                                                        )}
                                                        {productHasVariants &&
                                                            !variantText && (
                                                                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-0.5 rounded-full">
                                                                    Multiple
                                                                    variants
                                                                </span>
                                                            )}
                                                    </div>

                                                    {/* Price & Action */}
                                                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                                        <div>
                                                            <span className="text-lg font-bold text-emerald-600">
                                                                RM{" "}
                                                                {variantPrice}
                                                            </span>
                                                            {item.originalPrice &&
                                                                item.originalPrice >
                                                                    variantPrice && (
                                                                    <span className="text-xs text-gray-400 line-through ml-2">
                                                                        RM{" "}
                                                                        {item.originalPrice.toFixed(
                                                                            2,
                                                                        )}
                                                                    </span>
                                                                )}
                                                        </div>
                                                        <Link
                                                            href={route(
                                                                "product-details",
                                                                item.product_id,
                                                            )}
                                                        >
                                                            <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition text-xs font-medium shadow-md hover:shadow-lg flex items-center gap-1.5">
                                                                <Eye className="w-3.5 h-3.5" />
                                                                View
                                                            </button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            // List View
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {wishlist.map((item) => {
                                        const isSelected = selected.includes(
                                            item.product_id,
                                        );
                                        const variantText =
                                            getVariantDisplayText(item);
                                        const variantPrice =
                                            getVariantPrice(item);
                                        const availableStock =
                                            getAvailableStock(item);
                                        const isOutOfStock =
                                            availableStock === 0;
                                        const ratingInfo =
                                            calculateProductRating(
                                                item.product,
                                            );

                                        return (
                                            <motion.div
                                                key={item.product_id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                                className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-md ${
                                                    isSelected
                                                        ? "border-emerald-400 ring-2 ring-emerald-200"
                                                        : "border-gray-100 hover:border-emerald-200"
                                                } ${isOutOfStock ? "opacity-60" : ""}`}
                                            >
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex items-start gap-4 flex-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    item.product_id,
                                                                )
                                                            }
                                                            disabled={
                                                                isOutOfStock
                                                            }
                                                            className="w-5 h-5 text-emerald-600 bg-white border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 cursor-pointer mt-5 disabled:opacity-50"
                                                        />

                                                        <Link
                                                            href={route(
                                                                "product-details",
                                                                item.product_id,
                                                            )}
                                                        >
                                                            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        import.meta
                                                                            .env
                                                                            .VITE_BASE_URL +
                                                                        (item
                                                                            .product_image
                                                                            ?.image_path ||
                                                                            item
                                                                                .product
                                                                                ?.product_image?.[0]
                                                                                ?.image_path ||
                                                                            "/placeholder.jpg")
                                                                    }
                                                                    alt={
                                                                        item
                                                                            .product
                                                                            ?.product_name ||
                                                                        item.product_name
                                                                    }
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </Link>

                                                        <div className="flex-1 min-w-0">
                                                            <Link
                                                                href={route(
                                                                    "product-details",
                                                                    item.product_id,
                                                                )}
                                                            >
                                                                <h3 className="font-semibold text-gray-900 hover:text-emerald-600 transition">
                                                                    {item
                                                                        .product
                                                                        ?.product_name ||
                                                                        item.product_name}
                                                                </h3>
                                                            </Link>

                                                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                                                                <StarRating
                                                                    rating={
                                                                        ratingInfo.average
                                                                    }
                                                                />
                                                                {ratingInfo.total >
                                                                    0 && (
                                                                    <span className="text-xs text-gray-400">
                                                                        (
                                                                        {
                                                                            ratingInfo.total
                                                                        }
                                                                        )
                                                                    </span>
                                                                )}
                                                                {variantText && (
                                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                                                                        {
                                                                            variantText
                                                                        }
                                                                    </span>
                                                                )}
                                                                <span
                                                                    className={`text-xs font-medium ${
                                                                        !isOutOfStock
                                                                            ? "text-emerald-600"
                                                                            : "text-red-600"
                                                                    }`}
                                                                >
                                                                    {!isOutOfStock
                                                                        ? `${availableStock} in stock`
                                                                        : "Out of stock"}
                                                                </span>
                                                            </div>

                                                            <div className="mt-2">
                                                                <span className="text-xl font-bold text-emerald-600">
                                                                    RM{" "}
                                                                    {variantPrice.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                                {item.originalPrice &&
                                                                    item.originalPrice >
                                                                        variantPrice && (
                                                                        <span className="text-xs text-gray-400 line-through ml-2">
                                                                            RM{" "}
                                                                            {item.originalPrice.toFixed(
                                                                                2,
                                                                            )}
                                                                        </span>
                                                                    )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex sm:flex-col gap-2 justify-end">
                                                        <Link
                                                            href={route(
                                                                "product-details",
                                                                item.product_id,
                                                            )}
                                                        >
                                                            <button className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setItemToDelete(
                                                                    item,
                                                                );
                                                                setShowDeleteModal(
                                                                    true,
                                                                );
                                                            }}
                                                            disabled={
                                                                loadingStates[
                                                                    item
                                                                        .product_id
                                                                ]
                                                            }
                                                            className="px-5 py-2 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm font-medium flex items-center gap-2 justify-center w-full sm:w-auto"
                                                        >
                                                            {loadingStates[
                                                                item.product_id
                                                            ] ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />

            {/* Custom CSS */}
            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}
