import { useState, useEffect } from "react";
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
    AlertCircle,
    ChevronDown,
    MoveLeft,
    X,
    ShoppingBag,
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
    const [variantModal, setVariantModal] = useState(null);
    const [addressError, setAddressError] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: "",
        type: "",
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const { auth } = usePage().props;

    // Check address on component mount
    useEffect(() => {
        if (!auth.user?.address) {
            setAddressError(true);
        }
    }, [auth.user]);

    // Show notification
    const showNotification = (message, type = "success") => {
        setNotification({ show: true, message, type });
        setTimeout(
            () => setNotification({ show: false, message: "", type: "" }),
            3000,
        );
    };

    // Enhanced rating calculation function
    const calculateProductRating = (product) => {
        const ratings = [];
        if (product.product?.total_ratings) {
            const total = parseFloat(product.product.total_ratings);
            if (!isNaN(total) && total > 0) {
                ratings.push({ rating: total });
            }
        } else if (product.ratings && product.ratings.length > 0) {
            ratings.push(...product.ratings);
        }

        if (!ratings || ratings.length === 0) {
            return {
                average: 0,
                total: 0,
                breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            };
        }

        const totalRating = ratings.reduce(
            (sum, rating) => sum + (rating.rating || 0),
            0,
        );
        const averageRating = totalRating / ratings.length;

        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratings.forEach((rating) => {
            const star = Math.round(rating.rating);
            if (breakdown[star] !== undefined) {
                breakdown[star]++;
            }
        });

        return {
            average: parseFloat(averageRating.toFixed(1)),
            total: ratings.length,
            breakdown,
        };
    };

    // Star rating display component
    const StarRating = ({
        rating,
        size = 14,
        showNumber = false,
        className = "",
    }) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        return (
            <div className={`flex items-center gap-1 ${className}`}>
                <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                        if (index < fullStars) {
                            return (
                                <Star
                                    key={index}
                                    size={size}
                                    className="text-yellow-400 fill-current"
                                />
                            );
                        } else if (index === fullStars && hasHalfStar) {
                            return (
                                <div key={index} className="relative">
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
                                            className="text-yellow-400 fill-current"
                                        />
                                    </div>
                                </div>
                            );
                        } else {
                            return (
                                <Star
                                    key={index}
                                    size={size}
                                    className="text-gray-300 fill-current"
                                />
                            );
                        }
                    })}
                </div>
                {showNumber && (
                    <span className="text-sm text-gray-600 ml-1">
                        ({rating})
                    </span>
                )}
            </div>
        );
    };

    // Enhanced variant parsing function
    const parseVariantData = (variantData) => {
        if (!variantData) return null;
        try {
            if (typeof variantData === "object") {
                return variantData;
            }
            if (typeof variantData === "string") {
                return JSON.parse(variantData);
            }
            return null;
        } catch (error) {
            console.error("Error parsing variant data:", error);
            return null;
        }
    };

    // Enhanced variant display text
    const getVariantDisplayText = (item) => {
        const variantData = parseVariantData(item.selected_variant);
        if (!variantData) return null;

        if (
            variantData.variant_combination &&
            typeof variantData.variant_combination === "object"
        ) {
            return Object.entries(variantData.variant_combination)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
        } else if (
            variantData.selected_options &&
            typeof variantData.selected_options === "object"
        ) {
            return Object.entries(variantData.selected_options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ");
        } else if (variantData.variant_name) {
            return variantData.variant_name;
        }

        return null;
    };

    // Enhanced variant price
    const getVariantPrice = (item) => {
        if (!item.selected_variant) {
            return (
                parseFloat(item.product?.product_price) ||
                parseFloat(item.product_price) ||
                0
            );
        }

        const variantData = parseVariantData(item.selected_variant);
        if (!variantData)
            return (
                parseFloat(item.product?.product_price) ||
                parseFloat(item.product_price) ||
                0
            );

        const price =
            variantData.price ||
            variantData.variant_price ||
            item.product?.product_price ||
            item.product_price;
        return parseFloat(price) || 0;
    };

    // Enhanced available stock
    const getAvailableStock = (item) => {
        if (!item.selected_variant) {
            return item.product?.product_quantity || item.product_quantity || 0;
        }

        const variantData = parseVariantData(item.selected_variant);
        if (!variantData)
            return item.product?.product_quantity || item.product_quantity || 0;

        return (
            variantData.quantity ||
            variantData.stock_quantity ||
            item.product?.product_quantity ||
            item.product_quantity ||
            0
        );
    };

    // Enhanced variant ID getter
    const getVariantId = (item) => {
        if (!item.selected_variant) return null;
        const variantData = parseVariantData(item.selected_variant);
        return variantData?.variant_id || variantData?.id || null;
    };

    // Check if product has variants
    const hasVariants = (item) => {
        const variants = item.product_variant || item.product?.product_variant;
        return (
            variants &&
            Array.isArray(variants) &&
            variants.length > 0 &&
            variants.some((variant) => {
                const combination = variant.variant_combination;
                return (
                    combination &&
                    ((typeof combination === "string" &&
                        combination.trim() !== "") ||
                        (typeof combination === "object" &&
                            Object.keys(combination).length > 0))
                );
            })
        );
    };

    // Remove single item from wishlist
    const removeWishlistItem = async (productId, variantId = null) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));

        try {
            const response = await axios.delete(route("remove-wishlist"), {
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                data: {
                    product_id: productId,
                    variant_id: variantId,
                },
            });

            if (response.data.successMessage) {
                setWishlist((prev) =>
                    prev.filter((item) => {
                        const itemVariantId = getVariantId(item);
                        if (variantId) {
                            return !(
                                item.product_id === productId &&
                                itemVariantId === variantId
                            );
                        } else {
                            return item.product_id !== productId;
                        }
                    }),
                );
                setSelected((prev) => prev.filter((id) => id !== productId));
                showNotification("Item removed from wishlist");
            }
        } catch (error) {
            console.error("Error removing wishlist item:", error);
            showNotification("Failed to remove item", "error");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [productId]: false }));
            setShowDeleteModal(false);
            setItemToDelete(null);
        }
    };

    // Remove multiple items from wishlist
    const removeSelectedItems = async () => {
        if (selected.length === 0) return;

        setBulkLoading(true);

        try {
            const itemsToRemove = selected.map((id) => {
                const item = wishlist.find((item) => item.product_id === id);
                return {
                    product_id: id,
                    variant_id: getVariantId(item),
                };
            });

            const response = await axios.delete(route("remove-wishlist"), {
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                data: {
                    items: itemsToRemove,
                },
            });

            if (response.data.successMessage) {
                setWishlist((prev) =>
                    prev.filter((item) => !selected.includes(item.product_id)),
                );
                setSelected([]);
                setSelectAll(false);
                showNotification(
                    `${selected.length} items removed from wishlist`,
                );
            }
        } catch (error) {
            console.error("Error removing wishlist items:", error);
            showNotification("Failed to remove items", "error");
        } finally {
            setBulkLoading(false);
            setShowDeleteModal(false);
        }
    };

    // Update wishlist variant
    const updateWishlistVariant = async (productId, newVariant) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));

        try {
            const response = await axios.post(
                route("update-wishlist-variant"),
                {
                    product_id: productId,
                    variant_data: newVariant,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                },
            );

            if (response.data.success) {
                setWishlist((prev) =>
                    prev.map((item) =>
                        item.product_id === productId
                            ? {
                                  ...item,
                                  selected_variant: newVariant,
                              }
                            : item,
                    ),
                );
                setVariantModal(null);
                showNotification("Variant updated successfully");
            }
        } catch (error) {
            console.error("Error updating variant:", error);
            showNotification("Failed to update variant", "error");
        } finally {
            setLoadingStates((prev) => ({ ...prev, [productId]: false }));
        }
    };

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

    const updateQty = (id, type) => {
        setWishlist((prev) =>
            prev.map((item) => {
                if (item.product_id === id) {
                    const currentQty = item.selected_quantity || 1;
                    const availableStock = getAvailableStock(item);

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
            }),
        );
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
        (sum, item) =>
            sum + getVariantPrice(item) * (item.selected_quantity || 1),
        0,
    );

    const totalDiscount = selectedItems.reduce(
        (sum, item) =>
            sum +
            ((item.originalPrice || getVariantPrice(item)) -
                getVariantPrice(item)) *
                (item.selected_quantity || 1),
        0,
    );

    // Handle checkout with address validation
    const handleCheckout = () => {
        if (!auth.user?.address) {
            setAddressError(true);
            return;
        }

        if (!selectedItems || selectedItems.length === 0) {
            alert("Please select at least one item to checkout.");
            return;
        }

        const checkoutItems = selectedItems.map((item) => {
            const variantData = parseVariantData(item.selected_variant);

            return {
                product_id: item.product_id,
                product_name: item.product?.product_name || item.product_name,
                product_price: getVariantPrice(item),
                product_quantity: getAvailableStock(item),
                product_image:
                    item.product_image || item.product?.product_image?.[0],
                seller_id: item.product?.seller_id,
                selected_quantity: item.selected_quantity || 1,
                selected_variant: variantData,
                variant_id: getVariantId(item),
                user: item.user,
                originalPrice: item.originalPrice,
            };
        });

        router.post(route("checkout-process"), {
            items: checkoutItems,
        });
    };

    // Handle add all to cart
    const handleAddAllToCart = () => {
        const availableItems = wishlist.filter(
            (item) => getAvailableStock(item) > 0,
        );

        if (availableItems.length === 0) {
            showNotification("No available items to add to cart", "error");
            return;
        }

        const cartItems = availableItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.selected_quantity || 1,
            selected_variant: parseVariantData(item.selected_variant),
        }));

        // Add to cart logic here
        showNotification(`${availableItems.length} items added to cart`);
    };

    // Variant Selection Modal Component
    const VariantModal = ({ item, onClose, onUpdate }) => {
        const [selectedOptions, setSelectedOptions] = useState({});
        const [availableVariants, setAvailableVariants] = useState([]);
        const [variantAttributes, setVariantAttributes] = useState([]);

        useEffect(() => {
            if (item) {
                const variants =
                    item.product_variant || item.product?.product_variant || [];
                setAvailableVariants(variants);

                const attributes = extractVariantAttributes(variants);
                setVariantAttributes(attributes);

                initializeSelectedOptions(variants, attributes, item);
            }
        }, [item]);

        const extractVariantAttributes = (variants) => {
            const attributes = new Set();

            variants.forEach((variant) => {
                if (variant.variant_combination) {
                    try {
                        const combination =
                            typeof variant.variant_combination === "string"
                                ? JSON.parse(variant.variant_combination)
                                : variant.variant_combination;

                        if (combination && typeof combination === "object") {
                            Object.keys(combination).forEach((attr) => {
                                attributes.add(attr);
                            });
                        }
                    } catch (error) {
                        console.error(
                            "Error parsing variant combination:",
                            error,
                        );
                    }
                }
            });

            return Array.from(attributes);
        };

        const initializeSelectedOptions = (
            variants,
            attributes,
            currentItem,
        ) => {
            const currentVariant = parseVariantData(
                currentItem.selected_variant,
            );
            const initialOptions = {};

            if (currentVariant?.variant_combination) {
                Object.entries(currentVariant.variant_combination).forEach(
                    ([key, value]) => {
                        initialOptions[key] = value;
                    },
                );
            } else {
                attributes.forEach((attr) => {
                    const options = getAvailableOptions(attr, variants, {});
                    if (options.length > 0) {
                        initialOptions[attr] = options[0];
                    }
                });
            }

            setSelectedOptions(initialOptions);
        };

        const getAvailableOptions = (
            attribute,
            variants = availableVariants,
            currentSelection = selectedOptions,
        ) => {
            const options = new Set();

            variants.forEach((variant) => {
                if (variant.variant_combination && variant.quantity > 0) {
                    try {
                        const combination =
                            typeof variant.variant_combination === "string"
                                ? JSON.parse(variant.variant_combination)
                                : variant.variant_combination;

                        if (combination && combination[attribute]) {
                            const matchesCurrentSelection = Object.entries(
                                currentSelection,
                            )
                                .filter(([key]) => key !== attribute)
                                .every(
                                    ([key, value]) =>
                                        combination[key] === value,
                                );

                            if (matchesCurrentSelection) {
                                options.add(combination[attribute]);
                            }
                        }
                    } catch (error) {
                        console.error(
                            "Error parsing variant combination:",
                            error,
                        );
                    }
                }
            });

            return Array.from(options);
        };

        const handleOptionSelect = (attribute, value) => {
            const newSelection = {
                ...selectedOptions,
                [attribute]: value,
            };
            setSelectedOptions(newSelection);
        };

        const getSelectedVariant = () => {
            return availableVariants.find((variant) => {
                if (!variant.variant_combination) return false;

                try {
                    const combination =
                        typeof variant.variant_combination === "string"
                            ? JSON.parse(variant.variant_combination)
                            : variant.variant_combination;

                    if (!combination || typeof combination !== "object")
                        return false;

                    return Object.keys(selectedOptions).every(
                        (key) => combination[key] === selectedOptions[key],
                    );
                } catch (error) {
                    console.error("Error parsing variant combination:", error);
                    return false;
                }
            });
        };

        const selectedVariant = getSelectedVariant();
        const canUpdate = selectedVariant && selectedVariant.quantity > 0;

        const handleUpdate = () => {
            if (selectedVariant) {
                const variantData = {
                    variant_id: selectedVariant.variant_id,
                    variant_combination: selectedOptions,
                    price: selectedVariant.price,
                    quantity: selectedVariant.quantity,
                };
                onUpdate(variantData);
            }
        };

        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Select Variant
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">
                                {item?.product?.product_name ||
                                    item?.product_name}
                            </h4>

                            {item.selected_variant && (
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-blue-800">
                                        Current Selection:
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        {getVariantDisplayText(item)}
                                    </p>
                                </div>
                            )}

                            {variantAttributes.map((attribute) => {
                                const availableOptions =
                                    getAvailableOptions(attribute);

                                return (
                                    <div key={attribute} className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {attribute.charAt(0).toUpperCase() +
                                                attribute.slice(1)}
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {availableOptions.map((option) => (
                                                <button
                                                    key={option}
                                                    onClick={() =>
                                                        handleOptionSelect(
                                                            attribute,
                                                            option,
                                                        )
                                                    }
                                                    className={`px-3 py-2 border rounded-lg text-sm transition-all ${
                                                        selectedOptions[
                                                            attribute
                                                        ] === option
                                                            ? "border-blue-500 bg-blue-50 text-blue-700 font-medium shadow-sm"
                                                            : "border-gray-300 text-gray-700 hover:border-blue-300 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {selectedVariant ? (
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-lg font-bold text-gray-900">
                                            RM {selectedVariant.price}
                                        </p>
                                        <p
                                            className={`text-sm ${
                                                selectedVariant.quantity > 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {selectedVariant.quantity > 0
                                                ? `${selectedVariant.quantity} in stock`
                                                : "Out of stock"}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-600">
                                    {Object.entries(selectedOptions).map(
                                        ([key, value]) => (
                                            <span key={key} className="mr-2">
                                                {key}: <strong>{value}</strong>
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                                <p className="text-sm text-yellow-800">
                                    {variantAttributes.length === 0
                                        ? "No variants available for this product"
                                        : "Please select all variant options"}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={!canUpdate}
                                className={`flex-1 py-3 px-4 rounded-xl text-white transition-colors font-medium ${
                                    canUpdate
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md"
                                        : "bg-gray-400 cursor-not-allowed"
                                }`}
                            >
                                Update Variant
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
            <Navbar />

            {/* Notification Toast */}
            {notification.show && (
                <div className="fixed top-24 right-4 z-50 animate-slideDown">
                    <div
                        className={`rounded-xl shadow-lg p-4 flex items-center gap-3 backdrop-blur-sm ${
                            notification.type === "error"
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-green-50 text-green-800 border border-green-200"
                        }`}
                    >
                        {notification.type === "error" ? (
                            <AlertCircle className="w-5 h-5" />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">
                                ✓
                            </div>
                        )}
                        <p className="text-sm font-medium">
                            {notification.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scaleUp">
                        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                            <Trash2 className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                            Remove {itemToDelete ? "Item" : "Items"}?
                        </h3>
                        <p className="text-gray-500 text-center mb-6">
                            {itemToDelete
                                ? `Are you sure you want to remove this item from your wishlist?`
                                : `Are you sure you want to remove ${selected.length} selected items from your wishlist?`}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setItemToDelete(null);
                                }}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
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
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-colors font-medium shadow-md"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 mt-16">
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Link
                        href="/"
                        className="hover:text-gray-900 transition-colors"
                    >
                        Home
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">
                        My Wishlist
                    </span>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Heart
                                        className="text-white"
                                        size={24}
                                        fill="white"
                                    />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                    My Wishlist
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    {wishlist.length}{" "}
                                    {wishlist.length === 1 ? "item" : "items"}{" "}
                                    saved for later
                                </p>
                            </div>
                        </div>

                        {wishlist.length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddAllToCart}
                                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Add All to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* LEFT SIDE: Wishlist items */}
                    <div className="xl:col-span-3">
                        {/* Action Bar */}
                        {wishlist.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center">
                                        <label className="relative flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={toggleSelectAll}
                                                className="w-5 h-5 text-pink-600 bg-white border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm font-medium text-gray-700">
                                                Select all ({wishlist.length}{" "}
                                                items)
                                            </span>
                                        </label>
                                    </div>

                                    {selected.length > 0 && (
                                        <button
                                            onClick={() =>
                                                setShowDeleteModal(true)
                                            }
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

                        {/* Empty State */}
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <div className="w-24 h-24 mx-auto mb-6 bg-pink-50 rounded-full flex items-center justify-center">
                                    <Heart className="w-12 h-12 text-pink-500" />
                                </div>
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                                    Your wishlist is empty
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                    Save your favorite items here and they'll
                                    appear in your wishlist for easy shopping
                                    later.
                                </p>
                                <Link href={route("shopping")}>
                                    <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-medium">
                                        Continue Shopping
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {wishlist.map((product) => {
                                    const isSelected = selected.includes(
                                        product.product_id,
                                    );
                                    const variantText =
                                        getVariantDisplayText(product);
                                    const variantPrice =
                                        getVariantPrice(product);
                                    const availableStock =
                                        getAvailableStock(product);
                                    const variantId = getVariantId(product);
                                    const isOutOfStock = availableStock === 0;
                                    const productHasVariants =
                                        hasVariants(product);
                                    const ratingInfo =
                                        calculateProductRating(product);

                                    return (
                                        <div
                                            key={`${product.product_id}-${variantId || "base"}`}
                                            className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                                                isSelected
                                                    ? "border-pink-500 border-2"
                                                    : "border-gray-100"
                                            } ${isOutOfStock ? "opacity-70" : ""}`}
                                        >
                                            <div className="flex flex-col sm:flex-row">
                                                {/* Selection Checkbox */}
                                                <div className="flex items-start p-4 sm:p-6">
                                                    <label className="relative flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    product.product_id,
                                                                )
                                                            }
                                                            disabled={
                                                                isOutOfStock
                                                            }
                                                            className="w-5 h-5 text-pink-600 bg-white border-2 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 cursor-pointer disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed"
                                                        />
                                                    </label>
                                                </div>

                                                {/* Product Image */}
                                                <Link
                                                    href={route(
                                                        "product-details",
                                                        product.product_id,
                                                    )}
                                                    className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 p-4 sm:p-0 sm:pr-4"
                                                >
                                                    <div className="w-full h-full md:mt-6 bg-gray-100 rounded-xl overflow-hidden relative">
                                                        <img
                                                            src={
                                                                import.meta.env
                                                                    .VITE_BASE_URL +
                                                                (product
                                                                    .product_image
                                                                    ?.image_path ||
                                                                    product
                                                                        .product
                                                                        ?.product_image?.[0]
                                                                        ?.image_path ||
                                                                    "/default-product-image.jpg")
                                                            }
                                                            alt={
                                                                product.product
                                                                    ?.product_name ||
                                                                product.product_name
                                                            }
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Product Info */}
                                                <div className="flex-1 p-4 sm:p-6">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                        <div className="flex-1">
                                                            <Link
                                                                href={`/product-details/${product.product_id}`}
                                                            >
                                                                <h2 className="text-lg font-semibold text-gray-900 hover:text-pink-600 transition-colors cursor-pointer line-clamp-2">
                                                                    {product
                                                                        .product
                                                                        ?.product_name ||
                                                                        product.product_name}
                                                                </h2>
                                                            </Link>

                                                            {/* Rating Display */}
                                                            <div className="mt-2 flex items-center gap-3">
                                                                <StarRating
                                                                    rating={
                                                                        ratingInfo.average
                                                                    }
                                                                    size={16}
                                                                    showNumber={
                                                                        true
                                                                    }
                                                                />
                                                                {ratingInfo.total >
                                                                    0 && (
                                                                    <span className="text-sm text-gray-500">
                                                                        (
                                                                        {
                                                                            ratingInfo.total
                                                                        }{" "}
                                                                        reviews)
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {/* Variant Information */}
                                                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                                {variantText && (
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="inline-flex items-center px-2.5 py-0.5 bg-pink-50 text-pink-700 rounded-full text-xs font-medium">
                                                                            {
                                                                                variantText
                                                                            }
                                                                        </span>
                                                                        {productHasVariants && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    setVariantModal(
                                                                                        product,
                                                                                    )
                                                                                }
                                                                                className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 text-xs font-medium transition-colors hover:underline"
                                                                            >
                                                                                Change
                                                                                <ChevronDown
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {!variantText &&
                                                                    productHasVariants && (
                                                                        <button
                                                                            onClick={() =>
                                                                                setVariantModal(
                                                                                    product,
                                                                                )
                                                                            }
                                                                            className="inline-flex items-center gap-1 text-pink-600 hover:text-pink-800 text-xs font-medium transition-colors bg-pink-50 px-2.5 py-0.5 rounded-full hover:bg-pink-100"
                                                                        >
                                                                            Select
                                                                            variant
                                                                            <ChevronDown
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        </button>
                                                                    )}
                                                            </div>

                                                            {/* Price and Stock */}
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className="text-xl font-bold text-gray-900">
                                                                    RM{" "}
                                                                    {variantPrice.toFixed(
                                                                        2,
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        !isOutOfStock
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {!isOutOfStock
                                                                        ? `In Stock (${availableStock})`
                                                                        : "Out of Stock"}
                                                                </span>
                                                            </div>

                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-4 mt-4">
                                                                <span className="text-sm text-gray-700 font-medium">
                                                                    Qty:
                                                                </span>
                                                                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            updateQty(
                                                                                product.product_id,
                                                                                "dec",
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            (product.selected_quantity ||
                                                                                1) <=
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
                                                                        {product.selected_quantity ||
                                                                            1}
                                                                    </span>
                                                                    <button
                                                                        onClick={(
                                                                            e,
                                                                        ) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            updateQty(
                                                                                product.product_id,
                                                                                "inc",
                                                                            );
                                                                        }}
                                                                        disabled={
                                                                            (product.selected_quantity ||
                                                                                1) >=
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
                                                            </div>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <div className="flex flex-col items-end gap-3">
                                                            <button
                                                                onClick={() => {
                                                                    setItemToDelete(
                                                                        product,
                                                                    );
                                                                    setShowDeleteModal(
                                                                        true,
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

                    {/* RIGHT SIDE: Checkout Summary */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <ShoppingCart
                                    size={20}
                                    className="text-pink-600"
                                />
                                Order Summary
                            </h2>
                            <p className="text-gray-500 text-sm mb-6">
                                {selectedItems.length} items selected
                            </p>

                            {/* Address Section */}
                            <div
                                className={`mb-6 p-4 rounded-xl border ${
                                    addressError && !auth.user?.address
                                        ? "bg-red-50 border-red-200"
                                        : "bg-blue-50 border-blue-100"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <MapPin
                                        className={`mt-0.5 flex-shrink-0 ${
                                            addressError && !auth.user?.address
                                                ? "text-red-600"
                                                : "text-blue-600"
                                        }`}
                                        size={18}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                Delivery Address
                                            </p>
                                            {addressError &&
                                                !auth.user?.address && (
                                                    <AlertCircle
                                                        size={16}
                                                        className="text-red-600"
                                                    />
                                                )}
                                        </div>

                                        {auth.user?.address ? (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {auth.user.address}
                                            </p>
                                        ) : (
                                            <div>
                                                <p className="text-sm text-red-600 mt-1">
                                                    Address required for
                                                    checkout
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <Link href={route("profile")}>
                                        <button className="text-blue-600 hover:text-blue-800 flex-shrink-0">
                                            <Edit3 size={16} />
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            {/* Price Breakdown */}
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
                                <span className="text-pink-600">
                                    RM
                                    {(
                                        totalPrice -
                                        totalDiscount +
                                        (totalPrice > 0 ? 5 : 0)
                                    ).toFixed(2)}
                                </span>
                            </div>

                            {/* Checkout Button */}
                            <button
                                disabled={
                                    selectedItems.length === 0 ||
                                    !auth.user?.address
                                }
                                onClick={handleCheckout}
                                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                                    selectedItems.length === 0 ||
                                    !auth.user?.address
                                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
                                }`}
                            >
                                {!auth.user?.address
                                    ? "Update Address to Checkout"
                                    : "Proceed to Checkout"}
                            </button>

                            {/* Continue Shopping */}
                            <Link href={route("shopping")}>
                                <button className="w-full mt-3 py-2.5 text-pink-600 font-medium rounded-xl border-2 border-pink-600 hover:bg-pink-50 transition-colors">
                                    Continue Shopping
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Variant Selection Modal */}
            {variantModal && (
                <VariantModal
                    item={variantModal}
                    onClose={() => setVariantModal(null)}
                    onUpdate={(newVariant) =>
                        updateWishlistVariant(
                            variantModal.product_id,
                            newVariant,
                        )
                    }
                />
            )}

            {/* Custom CSS for animations */}
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

                @keyframes scaleUp {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-slideDown {
                    animation: slideDown 0.3s ease-out;
                }

                .animate-scaleUp {
                    animation: scaleUp 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}
