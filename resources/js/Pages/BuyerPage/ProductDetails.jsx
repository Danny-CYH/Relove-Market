import {
    ShoppingCart,
    Truck,
    Heart,
    Share2,
    Star,
    Check,
    Shield,
    Minus,
    Plus,
    RotateCcw,
    ThumbsUp,
    ChevronRight,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react";

import { FaStar } from "react-icons/fa";

import { Link, router, usePage } from "@inertiajs/react";

import { useEffect, useCallback, useState } from "react";

import axios from "axios";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";

import { MobileVariantsPanel } from "@/Components/BuyerPage/ProductDetails/MobileVariantsPanel";
import { ShowReviewModal } from "@/Components/BuyerPage/ProductDetails/ShowReviewModal";
import { ShowZoomModal } from "@/Components/BuyerPage/ProductDetails/ShowZoomModal";
import { ShowConversationModal } from "@/Components/BuyerPage/ProductDetails/ShowConversationModal";
import { ShowAllReviewsModal } from "@/Components/BuyerPage/ProductDetails/ShowAllReviewsModal";

export default function ProductDetails({ product_info }) {
    console.log(product_info);

    const [selectedImage, setSelectedImage] = useState(
        product_info[0]?.product_image[0]?.image_path || ""
    );
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showConversationModal, setShowConversationModal] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");
    const [isStartingConversation, setIsStartingConversation] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const [variantError, setVariantError] = useState("");

    // Review and comment states
    const [reviewFilter, setReviewFilter] = useState("all");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: "",
        images: [],
    });

    // Mobile specific states
    const [showMobileVariants, setShowMobileVariants] = useState(false);

    // Reviews pagination and loading states
    const [allReviews, setAllReviews] = useState([]);
    const [currentReviewsPage, setCurrentReviewsPage] = useState(1);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [isLoadingReviews, setIsLoadingReviews] = useState(false);

    const [reviews, setReviews] = useState(() => {
        const initialReviews = product_info[0]?.ratings || [];
        return initialReviews;
    });

    const { auth } = usePage().props;

    const reviewCount = reviews.length;

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + (review.rating || 0), 0) /
              reviews.length
            : 0;

    // Check if product has variants
    const hasVariants = product_info[0]?.product_variant?.length > 0;
    const variants = product_info[0]?.product_variant || [];

    // Get available stock for selected variant or product
    const availableStock = selectedVariant
        ? selectedVariant.quantity
        : product_info[0]?.product_quantity || 0;

    // Get price for selected variant or product
    const displayPrice = selectedVariant
        ? selectedVariant.price
        : product_info[0]?.product_price;

    // Auto-select first variant if none selected and variants exist
    useEffect(() => {
        if (hasVariants && !selectedVariant && variants.length > 0) {
            setSelectedVariant(variants[0]);
        }
    }, [hasVariants, selectedVariant, variants]);

    // Validate variant before action
    const validateVariant = (action) => {
        if (hasVariants && !selectedVariant) {
            setVariantError(`Please select a variant before ${action}`);

            // Auto-hide error after 5 seconds
            setTimeout(() => {
                setVariantError("");
            }, 5000);

            return false;
        }
        setVariantError("");
        return true;
    };

    // Filter reviews based on rating
    const filteredReviews =
        reviewFilter === "all"
            ? reviews.slice(0, 3)
            : reviews
                  .filter((review) => review.rating === parseInt(reviewFilter))
                  .slice(0, 3);

    // Check if user has liked the product
    const checkWishlistStatus = useCallback(async () => {
        try {
            const response = await axios.get(
                `/api/get-wishlist/${product_info[0]?.product_id}`
            );

            setIsWishlisted(response.data.is_wishlisted);
        } catch (error) {
            console.error("Error checking wishlist status:", error);
        }
    }, [product_info[0]?.product_id]);

    // Load all reviews for modal with pagination
    const loadAllReviews = useCallback(
        async (page = 1) => {
            if (isLoadingReviews) return;

            setIsLoadingReviews(true);
            try {
                const response = await axios.get(
                    `/api/product/${product_info[0]?.product_id}/reviews`,
                    {
                        params: { page, per_page: 10 },
                    }
                );

                const newReviews = response.data.reviews || [];
                console.log("Loaded reviews page", page, ":", newReviews);

                if (page === 1) {
                    setAllReviews(newReviews);
                } else {
                    setAllReviews((prev) => [...prev, ...newReviews]);
                }

                setHasMoreReviews(
                    response.data.hasMore ||
                        response.data.next_page_url !== null
                );
                setCurrentReviewsPage(page);
            } catch (error) {
                console.error("Error loading reviews:", error);
                if (page === 1) {
                    setAllReviews(reviews);
                }
            } finally {
                setIsLoadingReviews(false);
            }
        },
        [product_info[0]?.product_id, isLoadingReviews, reviews]
    );

    // Load more reviews for infinite scroll
    const loadMoreReviews = useCallback(() => {
        if (hasMoreReviews && !isLoadingReviews) {
            loadAllReviews(currentReviewsPage + 1);
        }
    }, [hasMoreReviews, isLoadingReviews, currentReviewsPage, loadAllReviews]);

    // Initialize data
    useEffect(() => {
        checkWishlistStatus();
        setAllReviews(reviews);

        if (reviews.length > 0) {
            setHasMoreReviews(true);
        }
    }, [checkWishlistStatus, reviews]);

    // Variant selection handler
    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);

        // Clear error when user selects a variant
        if (variantError) {
            setVariantError("");
        }
    };

    // Get variant combination text
    const getVariantCombinationText = (variant) => {
        if (
            !variant.variant_key ||
            Object.keys(variant.variant_key).length === 0
        ) {
            return "Standard";
        }

        return variant.variant_key;
    };

    // Prepare selected variant data
    const prepareSelectedVariantData = () => {
        return {
            variant_id: selectedVariant?.variant_id || null,
            variant_key: selectedVariant?.variant_key || "default",
            combination: selectedVariant?.variant_combination || {},
            quantity:
                selectedVariant?.quantity || product_info[0]?.product_quantity,
            price: selectedVariant?.price || product_info[0]?.product_price,
        };
    };

    // NEW FUNCTION: Prepare checkout data in same structure as wishlist
    const prepareCheckoutData = () => {
        const variantData = prepareSelectedVariantData();
        console.log(variantData);

        // Create the same data structure as wishlist items
        const checkoutItem = {
            user: {
                user_id: auth.user.user_id,
            },
            product_id: product_info[0].product_id,
            selected_quantity: quantity,
            selected_variant: JSON.stringify(variantData),
            product: {
                product_id: product_info[0].product_id,
                product_name: product_info[0].product_name,
                product_price: parseFloat(product_info[0].product_price),
                product_quantity: product_info[0].product_quantity,
                product_image: product_info[0].product_image[0] || {},
                seller_id: product_info[0].seller_id,
                // Add any other product fields that are used in wishlist
            },
        };

        return [checkoutItem]; // Return as array to match wishlist structure
    };

    // UPDATED: Handle Buy Now - Send data in same structure as wishlist
    const handleBuyNow = () => {
        if (!validateVariant("buying")) {
            return;
        }

        const checkoutData = prepareCheckoutData();

        console.log("Sending checkout data (same as wishlist):", checkoutData);

        router.post(route("checkout"), {
            items: checkoutData, // Same structure as wishlist
        });
    };

    // Review and comment handlers
    const handleAddReview = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.comment.trim()) return;

        try {
            const payload = {
                product_id: product_info[0].product_id,
                rating: newReview.rating,
                comment: newReview.comment,
            };

            const response = await axios.post("/api/make-reviews", payload);
            console.log("Review submitted:", response);

            // Fix: Immediately update the UI with the new review
            const newReviewData = response.data.review;

            // Transform the API response to match your frontend structure
            const transformedReview = {
                id: newReviewData.id,
                rating: newReviewData.rating,
                comment: newReviewData.comment,
                user: "You", // Since the user just submitted this
                avatar: "YU",
                date: new Date(newReviewData.created_at)
                    .toISOString()
                    .split("T")[0],
                verified: true,
                helpful: 0,
                created_at: newReviewData.created_at,
                user_id: newReviewData.user_id,
            };

            // Update both reviews states immediately
            setReviews((prev) => [transformedReview, ...prev]);
            setAllReviews((prev) => [transformedReview, ...prev]);

            // Clear the form
            setNewReview({
                rating: 0,
                comment: "",
                images: [],
            });

            setShowReviewModal(false);

            // Show success message
            alert("Review submitted successfully!");
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        }
    };

    // UPDATED: Handle Add to Cart - Send data in same structure as wishlist
    const handleAddToCart = async () => {
        if (!validateVariant("adding to cart")) {
            return;
        }

        setLoadingStates((prev) => ({ ...prev, addToCart: true }));

        try {
            const cartData = prepareCheckoutData();
            const cartItem = cartData[0]; // Get single item

            const response = await axios.post("/api/store-wishlist", {
                product_id: cartItem.product_id,
                quantity: cartItem.selected_quantity,
                selected_variant: cartItem.selected_variant,
            });

            if (response.data.successMessage) {
                console.log("Added to cart:", response.data);
                // Show success message or update cart count
            } else {
                console.error("Failed to add to cart:", response.data);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, addToCart: false }));
        }
    };

    // UPDATED: Handle Wishlist Toggle - Send data in same structure
    const handleWishlistToggle = async (product_id) => {
        if (!validateVariant("adding to wishlist")) {
            return;
        }

        setLoadingStates((prev) => ({ ...prev, wishlist: true }));

        try {
            if (isWishlisted) {
                await axios.delete("/api/remove-wishlist", {
                    data: { product_id: [product_id] },
                });
            } else {
                const variantData = prepareSelectedVariantData();

                const response = await axios.post(
                    `/api/store-wishlist/${product_id}`,
                    {
                        selected_variant: variantData,
                        selected_quantity: quantity,
                        // This matches the wishlist data structure
                    }
                );

                console.log("Wishlist added:", response);
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error("Error updating wishlist:", error);
        } finally {
            setLoadingStates((prev) => ({ ...prev, wishlist: false }));
        }
    };

    // Handle showing all reviews modal
    const handleShowAllReviews = () => {
        setShowAllReviewsModal(true);
        if (allReviews.length === 0) {
            loadAllReviews(1);
        }
    };

    // Preserved existing functions
    const startConversation = async (e) => {
        e.preventDefault();
        if (!initialMessage.trim()) return;

        setIsStartingConversation(true);
        try {
            await axios.post("/start-conversation", {
                seller_id: product_info[0].seller_id,
                product_id: product_info[0].product_id,
                message: initialMessage,
            });
            setShowConversationModal(false);
            setInitialMessage("");
            alert("Conversation started successfully!");
            router.visit("/buyer-chat");
        } catch (error) {
            console.error("Error starting conversation:", error);
            alert("Failed to start conversation. Please try again.");
        } finally {
            setIsStartingConversation(false);
        }
    };

    const getRecommendations = async () => {
        try {
            const res = await axios.post("/recommend", {
                product_id: product_info[0].product_id,
                top_k: 4,
            });
            setRecommendations(res.data.recommendations);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    // WebSocket and other preserved effects
    useEffect(() => {
        getRecommendations();
    }, [product_info[0].product_id]);

    useEffect(() => {
        if (!product_info[0]) return;

        const channel = window.Echo.channel(
            `product.${product_info[0].product_id}`
        );

        channel.listen(".ReviewsUpdate", (e) => {
            console.log("New review received via WebSocket:", e);

            const newReviewData = e.review || e;

            const transformedReview = {
                id: newReviewData.id,
                rating: newReviewData.rating,
                comment: newReviewData.comment,
                user: newReviewData.user?.name || "Anonymous",
                avatar: (newReviewData.user?.name || "A")
                    .charAt(0)
                    .toUpperCase(),
                date: new Date(newReviewData.created_at)
                    .toISOString()
                    .split("T")[0],
                verified: true,
                helpful: 0,
                created_at: newReviewData.created_at,
                user_id: newReviewData.user_id,
            };

            setReviews((prev) => {
                const exists = prev.find((r) => r.id === transformedReview.id);
                if (exists) return prev;
                return [transformedReview, ...prev];
            });

            setAllReviews((prev) => {
                const exists = prev.find((r) => r.id === transformedReview.id);
                if (exists) return prev;
                return [transformedReview, ...prev];
            });
        });

        return () => {
            console.log("Cleaning up WebSocket listener");
            channel.stopListening(".ReviewsUpdate");
        };
    }, [product_info]);

    useEffect(() => {
        if (typeof window.Echo === "undefined") {
            console.error(
                "Echo is not available. WebSocket connections will not work."
            );
            return;
        }

        const connection = window.Echo.connector.pusher?.connection;

        if (!connection) {
            console.error("WebSocket connection object not available yet.");
            return;
        }

        connection.bind("connected", () => {
            console.log("WebSocket connected successfully");
        });

        connection.bind("disconnected", () => {
            console.log("WebSocket disconnected");
        });

        connection.bind("error", (error) => {
            console.error("WebSocket error:", error);
        });

        return () => {
            connection.unbind_all();
        };
    }, []);

    const increaseQty = () => setQuantity((prev) => prev + 1);
    const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Main Product Section */}
            <div className="max-w-7xl mx-auto mt-4 md:mt-16 px-4 sm:px-6 py-4 lg:py-6">
                <div className="flex items-center mb-4">
                    <Link
                        href={route("shopping")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Shop</span>
                    </Link>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                    {/* Image Gallery */}
                    <div className="lg:col-span-5">
                        <div className="lg:sticky lg:top-6 space-y-3 lg:space-y-4">
                            {/* Main Image */}
                            <div
                                className="bg-white rounded-xl lg:rounded-2xl p-3 lg:p-4 cursor-zoom-in border"
                                onClick={() => setShowZoomModal(true)}
                            >
                                <img
                                    src={
                                        import.meta.env.VITE_BASE_URL +
                                        selectedImage
                                    }
                                    alt={product_info[0]?.product_name}
                                    className="w-full h-48 sm:h-64 lg:h-80 object-contain transition-transform hover:scale-105"
                                />
                            </div>

                            {/* Thumbnails */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product_info[0]?.product_image.map(
                                    (img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() =>
                                                setSelectedImage(img.image_path)
                                            }
                                            className={`flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-lg border-2 overflow-hidden transition-all ${
                                                selectedImage === img.image_path
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <img
                                                src={
                                                    import.meta.env
                                                        .VITE_BASE_URL +
                                                    img.image_path
                                                }
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="lg:col-span-7 space-y-4 lg:space-y-6">
                        {/* Variant Error Message */}
                        {variantError && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle
                                    className="text-red-500 mt-0.5 flex-shrink-0"
                                    size={18}
                                />
                                <div>
                                    <p className="text-red-800 font-medium text-sm">
                                        {variantError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Product Header */}
                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border">
                            <div className="flex items-start justify-between mb-3 lg:mb-4">
                                <div className="flex-1">
                                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                                        {product_info[0]?.product_name}
                                    </h1>
                                    <div className="flex items-center gap-2 lg:gap-3 text-sm text-gray-600 flex-wrap">
                                        <div className="flex items-center">
                                            <div className="flex text-yellow-400 mr-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={
                                                            i <
                                                            Math.floor(
                                                                averageRating
                                                            )
                                                                ? "fill-current"
                                                                : ""
                                                        }
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-semibold text-gray-900 ml-1 text-sm">
                                                {averageRating.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="hidden lg:inline">
                                            •
                                        </span>
                                        <button
                                            onClick={handleShowAllReviews}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            {reviewCount}{" "}
                                            {reviewCount === 1
                                                ? "review"
                                                : "reviews"}
                                        </button>
                                        <span className="hidden lg:inline">
                                            •
                                        </span>
                                        <span className="text-sm">
                                            {product_info[0].orders.length} sold
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-1 lg:gap-2">
                                    <button
                                        onClick={() =>
                                            handleWishlistToggle(
                                                product_info[0].product_id
                                            )
                                        }
                                        disabled={
                                            loadingStates.wishlist ||
                                            (hasVariants && !selectedVariant)
                                        }
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={
                                            hasVariants && !selectedVariant
                                                ? "Please select a variant first"
                                                : ""
                                        }
                                    >
                                        {loadingStates.wishlist ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Heart
                                                size={18}
                                                className={
                                                    isWishlisted
                                                        ? "fill-red-500 text-red-500 stroke-red-500"
                                                        : "text-gray-600 hover:text-red-500 stroke-gray-600 hover:stroke-red-500"
                                                }
                                            />
                                        )}
                                    </button>
                                    <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                        <Share2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-4 lg:mb-6">
                                <div className="flex items-baseline gap-2 lg:gap-3 mb-1 flex-wrap">
                                    <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                                        RM {product_info[0]?.product_price}
                                    </span>
                                    {product_info[0]?.original_price && (
                                        <>
                                            <span className="text-lg lg:text-xl text-gray-400 line-through">
                                                RM{" "}
                                                {
                                                    product_info[0]
                                                        ?.original_price
                                                }
                                            </span>
                                            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                                                {Math.round(
                                                    (1 -
                                                        product_info[0]
                                                            ?.product_price /
                                                            product_info[0]
                                                                ?.original_price) *
                                                        100
                                                )}
                                                % OFF
                                            </span>
                                        </>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Inclusive of all taxes
                                </p>
                            </div>

                            {/* Stock Status */}
                            <div className="mb-4 lg:mb-6">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                        availableStock > 0
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {availableStock > 0
                                        ? "In Stock"
                                        : "Out of Stock"}{" "}
                                    • {availableStock} available
                                </span>
                            </div>

                            {/* Product Options Summary - Mobile */}
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setShowMobileVariants(true)}
                                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-left hover:border-gray-400 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Variant Selected
                                            </p>
                                            <p
                                                className={`text-sm font-bold mt-1 ${
                                                    selectedVariant
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {selectedVariant
                                                    ? getVariantCombinationText(
                                                          selectedVariant
                                                      )
                                                    : "No variant selected"}
                                            </p>
                                            {!selectedVariant &&
                                                hasVariants && (
                                                    <p className="text-xs text-red-500 mt-1">
                                                        Please select a variant
                                                    </p>
                                                )}
                                        </div>
                                        <ChevronRight
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* Product variant - Desktop */}
                            <div className="hidden lg:block space-y-4">
                                {hasVariants && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <label className="font-semibold text-gray-900">
                                                Available Variants
                                                <span className="text-red-500 ml-1">
                                                    *
                                                </span>
                                            </label>
                                            {!selectedVariant && (
                                                <span className="text-xs text-red-500">
                                                    Required
                                                </span>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {variants.map((variant) => (
                                                <button
                                                    key={variant.variant_id}
                                                    onClick={() =>
                                                        handleVariantSelect(
                                                            variant
                                                        )
                                                    }
                                                    disabled={
                                                        variant.quantity <= 0
                                                    }
                                                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                                                        selectedVariant?.variant_id ===
                                                        variant.variant_id
                                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                    } ${
                                                        variant.quantity <= 0
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : ""
                                                    }`}
                                                >
                                                    <div className="font-medium">
                                                        {getVariantCombinationText(
                                                            variant
                                                        )}
                                                    </div>
                                                    <div className="flex justify-between items-center mt-1">
                                                        <span className="text-sm font-semibold">
                                                            RM {variant.price}
                                                        </span>
                                                        <span
                                                            className={`text-xs ${
                                                                variant.quantity >
                                                                0
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            {variant.quantity >
                                                            0
                                                                ? `${variant.quantity} available`
                                                                : "Out of stock"}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity and Actions */}
                            <div className="mt-4 lg:mt-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <label className="font-semibold text-gray-900">
                                        Quantity:
                                    </label>
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={decreaseQty}
                                            disabled={quantity <= 1}
                                            className="p-2 lg:p-3 hover:bg-gray-100 transition-colors text-black"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-3 lg:px-4 py-2 min-w-[40px] lg:min-w-[50px] text-center text-black font-medium border-x">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={increaseQty}
                                            disabled={
                                                quantity >= availableStock
                                            }
                                            className="p-2 lg:p-3 hover:bg-gray-100 transition-colors text-black"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                                            (hasVariants && !selectedVariant) ||
                                            availableStock === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                        onClick={handleAddToCart}
                                        disabled={
                                            loadingStates.addToCart ||
                                            (hasVariants && !selectedVariant) ||
                                            availableStock === 0
                                        }
                                        title={
                                            hasVariants && !selectedVariant
                                                ? "Please select a variant first"
                                                : availableStock === 0
                                                ? "Out of stock"
                                                : ""
                                        }
                                    >
                                        {loadingStates.addToCart ? (
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <>
                                                <ShoppingCart size={18} />
                                                Add to Cart
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleBuyNow}
                                        disabled={
                                            (hasVariants && !selectedVariant) ||
                                            availableStock === 0
                                        }
                                        className={`flex-1 py-3 rounded-lg font-semibold ${
                                            (hasVariants && !selectedVariant) ||
                                            availableStock === 0
                                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                : "bg-orange-400 text-white hover:bg-orange-600"
                                        }`}
                                        title={
                                            hasVariants && !selectedVariant
                                                ? "Please select a variant first"
                                                : availableStock === 0
                                                ? "Out of stock"
                                                : ""
                                        }
                                    >
                                        Buy Now
                                    </button>
                                </div>

                                {/* Variant requirement note */}
                                {hasVariants && !selectedVariant && (
                                    <div className="text-center">
                                        <p className="text-sm text-red-500 font-medium">
                                            Please select a variant to continue
                                        </p>
                                    </div>
                                )}

                                {/* Stock limitation note */}
                                {availableStock === 0 && (
                                    <div className="text-center">
                                        <p className="text-sm text-red-500 font-medium">
                                            This product is currently out of
                                            stock
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Quick Info */}
                            <div className="mt-4 lg:mt-6 grid grid-cols-3 gap-2 lg:gap-4 text-center">
                                <div className="p-2 lg:p-3 bg-gray-50 rounded-lg">
                                    <Truck
                                        size={16}
                                        className="text-blue-600 mx-auto mb-1"
                                    />
                                    <p className="text-xs text-gray-600">
                                        Free Shipping
                                    </p>
                                </div>
                                <div className="p-2 lg:p-3 bg-gray-50 rounded-lg">
                                    <RotateCcw
                                        size={16}
                                        className="text-green-600 mx-auto mb-1"
                                    />
                                    <p className="text-xs text-gray-600">
                                        30-Day Return
                                    </p>
                                </div>
                                <div className="p-2 lg:p-3 bg-gray-50 rounded-lg">
                                    <Shield
                                        size={16}
                                        className="text-purple-600 mx-auto mb-1"
                                    />
                                    <p className="text-xs text-gray-600">
                                        2-Year Warranty
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border">
                            <div className="flex items-center gap-3 lg:gap-4 mb-3 lg:mb-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                                    {product_info[0]?.seller?.seller_store?.store_name?.charAt(
                                        0
                                    ) || "S"}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base">
                                        {product_info[0]?.seller?.seller_store
                                            ?.store_name || "Seller Store"}
                                    </h3>
                                    <p className="text-xs lg:text-sm text-gray-600">
                                        98% Positive Rating
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setShowConversationModal(true)
                                    }
                                    className="px-3 lg:px-4 py-2 border border-gray-300 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors text-sm font-medium"
                                >
                                    Chat
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Details Tabs */}
                <div className="mt-6 lg:mt-8">
                    <div className="bg-white rounded-xl lg:rounded-2xl border overflow-hidden">
                        {/* Tab Headers */}
                        <div className="border-b overflow-x-auto">
                            <div className="flex min-w-max">
                                {[
                                    "description",
                                    "reviews",
                                    "include_items",
                                ].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 lg:px-6 py-3 lg:py-4 font-semibold border-b-2 transition-colors capitalize whitespace-nowrap text-sm lg:text-base ${
                                            activeTab === tab
                                                ? "border-blue-600 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {tab === "description"
                                            ? "Description"
                                            : tab === "reviews"
                                            ? "Reviews"
                                            : tab === "include_items"
                                            ? "Included Items"
                                            : ""}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab content remains the same */}
                        <div className="p-4 lg:p-6">
                            {/* Description Tab */}
                            {activeTab === "description" && (
                                <div className="space-y-4 lg:space-y-6">
                                    <div>
                                        <h3 className="text-lg lg:text-xl text-black font-semibold mb-3 lg:mb-4">
                                            Product Description
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                                            {product_info[0]
                                                ?.product_description ||
                                                "No description provided"}
                                        </p>
                                    </div>

                                    {product_info[0]?.product_feature?.length >
                                        0 && (
                                        <div>
                                            <h4 className="text-base lg:text-lg text-black font-semibold mb-3 lg:mb-4">
                                                Key Features
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
                                                {product_info[0].product_feature.map(
                                                    (feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <Check
                                                                size={16}
                                                                className="text-green-500 mt-0.5 flex-shrink-0"
                                                            />
                                                            <span className="text-gray-700 text-sm lg:text-base">
                                                                {
                                                                    feature.feature_text
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Reviews Tab */}
                            {activeTab === "reviews" && (
                                <div className="space-y-4 lg:space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg lg:text-xl text-black font-semibold">
                                            Customer Reviews
                                        </h3>
                                        <button
                                            onClick={() =>
                                                setShowReviewModal(true)
                                            }
                                            className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm lg:text-base"
                                        >
                                            Write Review
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                                        <div className="space-y-4">
                                            <div className="text-center p-4 lg:p-6 bg-gray-50 rounded-lg">
                                                <div className="text-2xl lg:text-3xl font-bold text-gray-900">
                                                    {averageRating.toFixed(1)}
                                                </div>
                                                <div className="flex justify-center mt-1">
                                                    {[...Array(5)].map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                size={18}
                                                                className={
                                                                    i <
                                                                    Math.floor(
                                                                        averageRating
                                                                    )
                                                                        ? "text-yellow-400 fill-current"
                                                                        : "text-gray-300"
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    {reviewCount}{" "}
                                                    {reviewCount === 1
                                                        ? "review"
                                                        : "reviews"}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                                            {filteredReviews.length > 0 ? (
                                                <>
                                                    {filteredReviews.map(
                                                        (review) => (
                                                            <div
                                                                key={review.id}
                                                                className="border-b pb-4 lg:pb-6 last:border-b-0"
                                                            >
                                                                <div className="flex items-start gap-3 lg:gap-4">
                                                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                                        {review.avatar ||
                                                                            (review.user?.name?.charAt(
                                                                                0
                                                                            ) ??
                                                                                "U")}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                            <span className="font-semibold text-sm text-black lg:text-base">
                                                                                {review
                                                                                    .user
                                                                                    .name ||
                                                                                    "Anonymous"}
                                                                            </span>
                                                                            {review.verified && (
                                                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                                    Verified
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex text-yellow-400 mb-2">
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
                                                                                        className={
                                                                                            i <
                                                                                            review.rating
                                                                                                ? "fill-current"
                                                                                                : ""
                                                                                        }
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </div>
                                                                        <p className="text-gray-700 text-sm lg:text-base mb-3">
                                                                            {
                                                                                review.comment
                                                                            }
                                                                        </p>
                                                                        <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-500">
                                                                            <span>
                                                                                {review.date ||
                                                                                    new Date()
                                                                                        .toISOString()
                                                                                        .split(
                                                                                            "T"
                                                                                        )[0]}
                                                                            </span>
                                                                            <button className="flex items-center gap-1 hover:text-gray-700">
                                                                                <ThumbsUp
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                                Helpful
                                                                                (
                                                                                {review.helpful ||
                                                                                    0}

                                                                                )
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}

                                                    {reviewCount > 3 && (
                                                        <div className="text-center pt-4">
                                                            <button
                                                                onClick={
                                                                    handleShowAllReviews
                                                                }
                                                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                                            >
                                                                View All{" "}
                                                                {reviewCount}{" "}
                                                                Reviews
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <p className="text-gray-500">
                                                        No reviews yet. Be the
                                                        first to review this
                                                        product!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "include_items" && (
                                <div className="space-y-4 lg:space-y-6">
                                    <div>
                                        <h3 className="text-lg lg:text-xl text-black font-semibold mb-3 lg:mb-4">
                                            Product Include Item
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                                            This product package includes the
                                            following items for your
                                            convenience.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3 mt-6">
                                            {product_info[0].product_include_item.map(
                                                (include_item) => (
                                                    <div
                                                        key={
                                                            include_item.item_id
                                                        }
                                                        className="flex items-start gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg"
                                                    >
                                                        <Check
                                                            size={16}
                                                            className="text-green-500 mt-0.5 flex-shrink-0"
                                                        />
                                                        <span className="text-gray-700 text-sm lg:text-base">
                                                            {
                                                                include_item.item_name
                                                            }
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {recommendations.length > 0 && (
                    <div className="mt-8 lg:mt-12">
                        <h2 className="text-xl lg:text-2xl text-black font-bold mb-4 lg:mb-6">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                            {recommendations.map((product) => (
                                <Link
                                    href={route(
                                        "product-details",
                                        product.product_id
                                    )}
                                    key={product.product_id}
                                >
                                    <div className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                                        <img
                                            src={
                                                product?.product
                                                    ?.product_image?.[0]
                                                    ?.image_path
                                                    ? import.meta.env
                                                          .VITE_BASE_URL +
                                                      product.product
                                                          .product_image[0]
                                                          .image_path
                                                    : "/placeholder.png"
                                            }
                                            alt={
                                                product.product?.product_name ||
                                                ""
                                            }
                                            className="w-full h-24 sm:h-32 lg:h-32 object-cover"
                                        />
                                        <div className="p-2 lg:p-3">
                                            <h3 className="font-medium text-xs lg:text-sm text-black line-clamp-2 mb-1 lg:mb-2">
                                                {product.product?.product_name}
                                            </h3>
                                            <div className="flex items-center mb-3">
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <FaStar
                                                                key={star}
                                                                className={`w-3 h-3 ${
                                                                    star <=
                                                                    Math.round(
                                                                        product
                                                                            .product
                                                                            ?.ratings[0]
                                                                            ?.rating ||
                                                                            0
                                                                    )
                                                                        ? "text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        )
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-500 ml-1">
                                                    ({" "}
                                                    {product.product
                                                        ?.ratings?.[0]
                                                        ?.rating || 0}{" "}
                                                    )
                                                </span>
                                            </div>
                                            <p className="text-blue-600 font-semibold text-sm lg:text-base">
                                                RM{" "}
                                                {product.product?.product_price}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showMobileVariants && (
                <MobileVariantsPanel
                    product_info={product_info}
                    selectedVariant={selectedVariant}
                    setShowMobileVariants={setShowMobileVariants}
                    handleVariantSelect={handleVariantSelect}
                    getVariantCombinationText={getVariantCombinationText}
                />
            )}

            {showAllReviewsModal && (
                <ShowAllReviewsModal
                    allReviews={allReviews}
                    hasMoreReviews={hasMoreReviews}
                    isLoadingReviews={isLoadingReviews}
                    reviewCount={reviewCount}
                    setShowAllReviewsModal={setShowAllReviewsModal}
                    loadMoreReviews={loadMoreReviews}
                />
            )}

            {showReviewModal && (
                <ShowReviewModal
                    setShowReviewModal={setShowReviewModal}
                    handleAddReview={handleAddReview}
                    setNewReview={setNewReview}
                    newReview={newReview}
                />
            )}

            {showZoomModal && (
                <ShowZoomModal
                    product_info={product_info}
                    setShowZoomModal={setShowZoomModal}
                />
            )}

            {showConversationModal && (
                <ShowConversationModal
                    initialMessage={initialMessage}
                    setInitialMessage={setInitialMessage}
                    setShowConversationModal={setShowConversationModal}
                    startConversation={startConversation}
                />
            )}

            <Footer />
        </div>
    );
}
