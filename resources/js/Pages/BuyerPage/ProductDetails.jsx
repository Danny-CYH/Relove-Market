import { useEffect, useState } from "react";
import {
    ShoppingCart,
    MessageCircle,
    Truck,
    X,
    Heart,
    Share2,
    Star,
    Check,
    Shield,
    ZoomIn,
    Minus,
    Plus,
    ChevronDown,
    ChevronUp,
    RotateCcw,
    Gift,
    Send,
    ThumbsUp,
    Eye,
    Users,
    ChevronRight,
    CreditCard,
    Package,
    MapPin,
    Clock,
    Calendar,
    Image as ImageIcon,
    ChevronLeft,
} from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";
import axios from "axios";

export default function ItemDetails({ product_info }) {
    console.log(product_info);

    // State management
    const [selectedImage, setSelectedImage] = useState(
        product_info[0]?.product_image[0]?.image_path || ""
    );
    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [showConversationModal, setShowConversationModal] = useState(false);
    const [initialMessage, setInitialMessage] = useState("");
    const [isStartingConversation, setIsStartingConversation] = useState(false);

    // Review and comment states
    const [reviewFilter, setReviewFilter] = useState("all");
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: "",
        images: [],
    });
    const [newComment, setNewComment] = useState("");

    // Mobile specific states
    const [showMobileOptions, setShowMobileOptions] = useState(false);

    // Product options data
    const productOptions = {
        color: [
            {
                id: 1,
                name: "Black",
                value: "black",
                hex: "#000000",
                inStock: true,
            },
            {
                id: 2,
                name: "White",
                value: "white",
                hex: "#FFFFFF",
                inStock: true,
            },
            {
                id: 3,
                name: "Blue",
                value: "blue",
                hex: "#007AFF",
                inStock: true,
            },
            {
                id: 4,
                name: "Rose",
                value: "rose",
                hex: "#B76E79",
                inStock: false,
            },
        ],
        storage: [
            { id: 1, name: "128GB", value: "128gb", price: 0, inStock: true },
            { id: 2, name: "256GB", value: "256gb", price: 100, inStock: true },
            {
                id: 3,
                name: "512GB",
                value: "512gb",
                price: 200,
                inStock: false,
            },
        ],
        size: [
            { id: 1, name: "Standard", value: "standard", inStock: true },
            { id: 2, name: "Large", value: "large", inStock: true },
            { id: 3, name: "XL", value: "xl", inStock: true },
        ],
    };

    // Sample reviews and comments
    const [reviews, setReviews] = useState([
        {
            id: 1,
            user: "Sarah Chen",
            avatar: "SC",
            comment:
                "Absolutely love this product! The quality exceeded my expectations and it arrived faster than expected.",
            rating: 5,
            date: "2024-01-15",
            verified: true,
            helpful: 24,
            images: [],
        },
        {
            id: 2,
            user: "Mike Rodriguez",
            avatar: "MR",
            comment:
                "Good value for money. The product works as described but the packaging could be better.",
            rating: 4,
            date: "2024-01-10",
            verified: true,
            helpful: 8,
            images: [],
        },
    ]);

    const [comments, setComments] = useState([
        {
            id: 1,
            user: "Alex Thompson",
            avatar: "AT",
            text: "Does this come with a warranty?",
            date: "2024-01-14",
            replies: [
                {
                    user: "Seller Support",
                    avatar: "SS",
                    text: "Yes, it comes with a 2-year manufacturer warranty.",
                    date: "2024-01-14",
                    isSeller: true,
                },
            ],
        },
    ]);

    // Calculate average rating
    const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
    const reviewCount = reviews.length;

    // Filter reviews based on rating
    const filteredReviews =
        reviewFilter === "all"
            ? reviews
            : reviews.filter(
                  (review) => review.rating === parseInt(reviewFilter)
              );

    // Get rating distribution
    const ratingDistribution = {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
    };

    // Option selection handlers
    const handleOptionSelect = (optionType, optionId) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionType]: optionId,
        }));
    };

    const getSelectedOptionName = (optionType) => {
        const option = productOptions[optionType]?.find(
            (opt) => opt.id === selectedOptions[optionType]
        );
        return option?.name || "Select option";
    };

    // Review and comment handlers
    const handleAddReview = async (e) => {
        e.preventDefault();
        if (newReview.rating === 0 || !newReview.comment.trim()) return;

        const review = {
            id: reviews.length + 1,
            user: "You",
            avatar: "YU",
            comment: newReview.comment,
            rating: newReview.rating,
            date: new Date().toISOString().split("T")[0],
            verified: true,
            helpful: 0,
            images: newReview.images,
        };

        setReviews((prev) => [review, ...prev]);
        setNewReview({ rating: 0, comment: "", images: [] });
        setShowReviewModal(false);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: comments.length + 1,
            user: "You",
            avatar: "YU",
            text: newComment,
            date: new Date().toISOString().split("T")[0],
            replies: [],
        };

        setComments((prev) => [comment, ...prev]);
        setNewComment("");
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

    const handleWishlistToggle = async (product_id) => {
        try {
            if (isWishlisted) {
                await axios.delete(`/wishlist/${product_id}`);
            } else {
                await axios.post("/wishlist", { product_id });
            }
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            console.error("Error updating wishlist:", error);
        }
    };

    useEffect(() => {
        getRecommendations();
    }, [product_info[0].product_id]);

    const increaseQty = () => setQuantity((prev) => prev + 1);
    const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    // Mobile Options Component
    const MobileOptionsPanel = () => (
        <div className="fixed inset-0 bg-white z-50 lg:hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <button
                    onClick={() => setShowMobileOptions(false)}
                    className="p-2"
                >
                    <ChevronLeft size={24} className="text-black"/>
                </button>
                <h2 className="text-lg text-black font-semibold">
                    Select Options
                </h2>
                <div className="w-10"></div>
            </div>

            {/* Options Content */}
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-140px)]">
                {product_info[0].product_option.map((optionGroup, index) => (
                    <div key={index} className="space-y-3">
                        <label className="block text-lg text-black font-semibold capitalize">
                            {optionGroup.option_name}
                        </label>

                        <div className="space-y-2">
                            {optionGroup.product_option_value.map((option) => (
                                <button
                                    key={option.value_id}
                                    onClick={() =>
                                        handleOptionSelect(
                                            optionGroup.type,
                                            option.value_id
                                        )
                                    }
                                    disabled={!option.inStock}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                                        selectedOptions[optionGroup.type] ===
                                        option.value_id
                                            ? "border-blue-500 bg-blue-50 text-blue-700"
                                            : "border-gray-200 text-gray-700"
                                    } ${
                                        !option.inStock
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-black">
                                                {option.option_value}
                                            </span>
                                        </div>

                                        {option.price > 0 && (
                                            <span className="text-blue-600 font-semibold">
                                                +RM{option.price}
                                            </span>
                                        )}

                                        {selectedOptions[optionGroup.type] ===
                                            option.value_id && (
                                            <Check
                                                size={20}
                                                className="text-blue-500"
                                            />
                                        )}
                                    </div>

                                    {!option.inStock && (
                                        <div className="text-red-500 text-sm mt-1">
                                            Out of stock
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <button
                    onClick={() => setShowMobileOptions(false)}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold"
                >
                    Confirm Selection
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Mobile Back Button */}
            <div className="lg:hidden bg-white border-b">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-2 text-gray-600"
                    >
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </button>
                </div>
            </div>

            {/* Compact Breadcrumb - Hidden on mobile */}
            <div className="bg-white border-b hidden lg:block">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-gray-900">
                            Home
                        </Link>
                        <ChevronRight size={14} />
                        <Link href="/products" className="hover:text-gray-900">
                            Electronics
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-gray-900 font-medium">
                            Headphones
                        </span>
                    </nav>
                </div>
            </div>

            {/* Main Product Section - Responsive Design */}
            <div className="max-w-6xl mx-auto mt-8 px-4 sm:px-6 py-4 lg:py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8">
                    {/* Image Gallery - Responsive */}
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

                    {/* Product Info - Responsive */}
                    <div className="lg:col-span-7 space-y-4 lg:space-y-6">
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
                                        <button className="text-blue-600 hover:underline text-sm">
                                            {reviewCount} reviews
                                        </button>
                                        <span className="hidden lg:inline">
                                            •
                                        </span>
                                        <span className="text-sm">
                                            128 sold
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
                                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <Heart
                                            size={18}
                                            className={
                                                isWishlisted
                                                    ? "fill-red-500 text-red-500"
                                                    : "fill-blue-500 text-blue-500"
                                            }
                                        />
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
                                <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    In Stock • {product_info[0]?.stock}{" "}
                                    available
                                </span>
                            </div>

                            {/* Product Options Summary - Mobile */}
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setShowMobileOptions(true)}
                                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-left hover:border-gray-400 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Options Selected
                                            </p>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {Object.keys(selectedOptions)
                                                    .length > 0
                                                    ? Object.entries(
                                                          selectedOptions
                                                      )
                                                          .map(
                                                              ([type, id]) =>
                                                                  `${getSelectedOptionName(
                                                                      type
                                                                  )}`
                                                          )
                                                          .join(", ")
                                                    : "Tap to select options"}
                                            </p>
                                        </div>
                                        <ChevronRight
                                            size={20}
                                            className="text-gray-400"
                                        />
                                    </div>
                                </button>
                            </div>

                            {/* Product Options - Desktop */}
                            <div className="hidden lg:block space-y-4">
                                {product_info[0].product_option.map(
                                    (optionType, options) => (
                                        <div
                                            key={optionType.option_id}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center justify-between">
                                                <label className="font-semibold text-gray-900 capitalize">
                                                    {optionType.option_name}
                                                </label>
                                                <span className="text-sm text-gray-600">
                                                    {getSelectedOptionName(
                                                        optionType
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {optionType.product_option_value.map(
                                                    (option) => (
                                                        <button
                                                            key={
                                                                option.value_id
                                                            }
                                                            onClick={() =>
                                                                handleOptionSelect(
                                                                    optionType,
                                                                    option.option_id
                                                                )
                                                            }
                                                            disabled={
                                                                !option.inStock
                                                            }
                                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                                                selectedOptions[
                                                                    optionType
                                                                ] ===
                                                                option.option_id
                                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                                            } ${
                                                                !option.inStock
                                                                    ? "opacity-50 cursor-not-allowed"
                                                                    : ""
                                                            } ${
                                                                optionType ===
                                                                "color"
                                                                    ? "flex items-center gap-2"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {optionType ===
                                                                "color" && (
                                                                <div
                                                                    className="w-4 h-4 rounded-full border"
                                                                    style={{
                                                                        backgroundColor:
                                                                            option.hex,
                                                                    }}
                                                                />
                                                            )}
                                                            {
                                                                option.option_value
                                                            }
                                                            {option.price >
                                                                0 && (
                                                                <span className="text-blue-600 ml-1">
                                                                    +RM
                                                                    {
                                                                        option.price
                                                                    }
                                                                </span>
                                                            )}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
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
                                            className="p-2 lg:p-3 hover:bg-gray-100 transition-colors text-black"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <span className="px-3 lg:px-4 py-2 min-w-[40px] lg:min-w-[50px] text-center text-black font-medium border-x">
                                            {quantity}
                                        </span>
                                        <button
                                            onClick={increaseQty}
                                            className="p-2 lg:p-3 hover:bg-gray-100 transition-colors text-black"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                                        <ShoppingCart size={18} />
                                        Add to Cart
                                    </button>
                                    <button className="flex-1 bg-orange-400 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                                        Buy Now
                                    </button>
                                </div>
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

                {/* Product Details Tabs - Responsive */}
                <div className="mt-6 lg:mt-8">
                    <div className="bg-white rounded-xl lg:rounded-2xl border overflow-hidden">
                        {/* Tab Headers - Scrollable on mobile */}
                        <div className="border-b overflow-x-auto">
                            <div className="flex min-w-max">
                                {["description", "reviews", "comments"].map(
                                    (tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`px-4 lg:px-6 py-3 lg:py-4 font-semibold border-b-2 transition-colors capitalize whitespace-nowrap text-sm lg:text-base ${
                                                activeTab === tab
                                                    ? "border-blue-600 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                            }`}
                                        >
                                            {tab === "reviews"
                                                ? `Reviews (${reviewCount})`
                                                : tab === "comments"
                                                ? `Q&A (${comments.length})`
                                                : "Details"}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

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

                            {/* Reviews Tab - Responsive */}
                            {activeTab === "reviews" && (
                                <div className="space-y-4 lg:space-y-6">
                                    {/* Add Review Button */}
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

                                    {/* Reviews Content */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                                        {/* Rating Summary */}
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
                                                    {reviewCount} reviews
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                                            {filteredReviews.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="border-b pb-4 lg:pb-6 last:border-b-0"
                                                >
                                                    <div className="flex items-start gap-3 lg:gap-4">
                                                        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                            {review.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                                <span className="font-semibold text-sm lg:text-base">
                                                                    {
                                                                        review.user
                                                                    }
                                                                </span>
                                                                {review.verified && (
                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                        Verified
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="flex text-yellow-400 mb-2">
                                                                {[
                                                                    ...Array(5),
                                                                ].map(
                                                                    (_, i) => (
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
                                                                {review.comment}
                                                            </p>
                                                            <div className="flex items-center gap-3 lg:gap-4 text-xs lg:text-sm text-gray-500">
                                                                <span>
                                                                    {
                                                                        review.date
                                                                    }
                                                                </span>
                                                                <button className="flex items-center gap-1 hover:text-gray-700">
                                                                    <ThumbsUp
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    Helpful (
                                                                    {
                                                                        review.helpful
                                                                    }
                                                                    )
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comments Tab - Responsive */}
                            {activeTab === "comments" && (
                                <div className="space-y-4 lg:space-y-6">
                                    {/* Add Question */}
                                    <div className="bg-blue-50 rounded-lg p-3 lg:p-4">
                                        <h4 className="font-semibold mb-2 lg:mb-3 text-sm lg:text-base text-black">
                                            Have a question?
                                        </h4>
                                        <form
                                            onSubmit={handleAddComment}
                                            className="space-y-2 lg:space-y-3"
                                        >
                                            <textarea
                                                value={newComment}
                                                onChange={(e) =>
                                                    setNewComment(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ask a question about this product..."
                                                className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                                                rows="3"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newComment.trim()}
                                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm lg:text-base"
                                            >
                                                Post Question
                                            </button>
                                        </form>
                                    </div>

                                    {/* Questions List */}
                                    <div className="space-y-4 lg:space-y-6">
                                        {comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="border-b pb-4 lg:pb-6 last:border-b-0"
                                            >
                                                <div className="flex items-start gap-3 lg:gap-4">
                                                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {comment.avatar}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                            <span className="font-semibold text-sm lg:text-base">
                                                                {comment.user}
                                                            </span>
                                                            <span className="text-xs lg:text-sm text-gray-500">
                                                                {comment.date}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700 text-sm lg:text-base mb-3">
                                                            {comment.text}
                                                        </p>
                                                        {comment.replies.map(
                                                            (reply, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="ml-3 lg:ml-4 pl-3 lg:pl-4 border-l-2 border-gray-200"
                                                                >
                                                                    <div className="flex items-start gap-2 lg:gap-3 py-2 lg:py-3">
                                                                        <div
                                                                            className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                                                                reply.isSeller
                                                                                    ? "bg-green-500"
                                                                                    : "bg-blue-500"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                reply.avatar
                                                                            }
                                                                        </div>
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                                <span className="font-semibold text-sm">
                                                                                    {
                                                                                        reply.user
                                                                                    }
                                                                                </span>
                                                                                {reply.isSeller && (
                                                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                        Seller
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-gray-700 text-sm">
                                                                                {
                                                                                    reply.text
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Related Products - Responsive */}
                {recommendations.length > 0 && (
                    <div className="mt-8 lg:mt-12">
                        <h2 className="text-xl lg:text-2xl text-black font-bold mb-4 lg:mb-6">
                            You Might Also Like
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
                            {recommendations.map((product) => (
                                <div
                                    key={product.product_id}
                                    className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    <img
                                        src={
                                            import.meta.env.VITE_BASE_URL +
                                            product.product.product_image[0]
                                                .image_path
                                        }
                                        alt={product.product.product_name}
                                        className="w-full h-24 sm:h-32 lg:h-32 object-cover"
                                    />
                                    <div className="p-2 lg:p-3">
                                        <h3 className="font-medium text-xs lg:text-sm text-black line-clamp-2 mb-1 lg:mb-2">
                                            {product.product.product_name}
                                        </h3>
                                        <p className="text-blue-600 font-semibold text-sm lg:text-base">
                                            RM {product.product.product_price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Options Panel */}
            {showMobileOptions && <MobileOptionsPanel />}

            {/* Review Modal - Responsive */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl lg:rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
                            <h2 className="text-lg lg:text-xl text-black font-semibold">
                                Write a Review
                            </h2>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleAddReview}
                            className="p-4 lg:p-6 space-y-4"
                        >
                            <div>
                                <label className="block text-sm text-black font-medium mb-2">
                                    Your Rating
                                </label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setNewReview((prev) => ({
                                                    ...prev,
                                                    rating: star,
                                                }))
                                            }
                                            className="text-2xl"
                                        >
                                            <Star
                                                className={
                                                    star <= newReview.rating
                                                        ? "text-yellow-400 fill-current"
                                                        : "text-gray-300"
                                                }
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-black font-medium mb-2">
                                    Your Review
                                </label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) =>
                                        setNewReview((prev) => ({
                                            ...prev,
                                            comment: e.target.value,
                                        }))
                                    }
                                    className="text-black w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                                    rows="4"
                                    placeholder="Share your experience with this product..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    newReview.rating === 0 ||
                                    !newReview.comment.trim()
                                }
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Preserved other modals */}
            {showZoomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <button
                        onClick={() => setShowZoomModal(false)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                    <img
                        src={import.meta.env.VITE_BASE_URL + selectedImage}
                        alt={product_info[0]?.product_name}
                        className="max-w-full max-h-full object-contain"
                    />
                </div>
            )}

            {/* Preserved conversation modal */}
            {showConversationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl lg:rounded-2xl max-w-md w-full">
                        <div className="flex items-center justify-between p-4 lg:p-6 border-b">
                            <h2 className="text-lg lg:text-xl text-black font-semibold">
                                Message Seller
                            </h2>
                            <button
                                onClick={() => setShowConversationModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form
                            onSubmit={startConversation}
                            className="p-4 lg:p-6 space-y-4"
                        >
                            <textarea
                                value={initialMessage}
                                onChange={(e) =>
                                    setInitialMessage(e.target.value)
                                }
                                placeholder="Type your message to the seller..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm lg:text-base"
                                rows="4"
                            />
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConversationModal(false)
                                    }
                                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm lg:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!initialMessage.trim()}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm lg:text-base"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
