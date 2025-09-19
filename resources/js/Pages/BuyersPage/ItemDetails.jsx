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
    ImageIcon,
    InfoIcon,
    FileTextIcon,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";
import axios from "axios";

export default function ItemDetails({ product_info }) {
    const BASE_URL = "http://127.0.0.1:8000/storage/";

    // Default selected image
    const [selectedImage, setSelectedImage] = useState(
        product_info[0]?.product_image[0]?.image_path || ""
    );

    const [activeTab, setActiveTab] = useState("description");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [showZoomModal, setShowZoomModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState("reviews");
    const [expandedSection, setExpandedSection] = useState(null);
    const [chatMessage, setChatMessage] = useState("");
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [reviewFilter, setReviewFilter] = useState("all");

    const [isLoading, setIsLoading] = useState(false);

    const [recommendations, setRecommendations] = useState([]);

    console.log(recommendations);

    // Sample data
    const variants = [
        { id: 1, name: "128GB", value: "128gb", inStock: true, price: 799 },
        { id: 2, name: "256GB", value: "256gb", inStock: true, price: 899 },
        { id: 3, name: "512GB", value: "512gb", inStock: false, price: 1099 },
    ];

    const colors = [
        {
            id: 1,
            name: "Midnight Black",
            value: "black",
            hex: "#000000",
            inStock: true,
        },
        {
            id: 2,
            name: "Arctic White",
            value: "white",
            hex: "#FFFFFF",
            inStock: true,
        },
        {
            id: 3,
            name: "Ocean Blue",
            value: "blue",
            hex: "#007AFF",
            inStock: true,
        },
        {
            id: 4,
            name: "Rose Gold",
            value: "rose",
            hex: "#B76E79",
            inStock: false,
        },
    ];

    const dummyReviews = [
        {
            id: 1,
            user: "Alice Johnson",
            avatar: "AJ",
            comment:
                "Great product! Very durable and worth the price. The quality exceeded my expectations. The noise cancellation is amazing and battery life lasts all day.",
            rating: 5,
            date: "2 days ago",
            verified: true,
            helpful: 12,
            images: [
                "https://via.placeholder.com/150",
                "https://via.placeholder.com/150",
            ],
        },
        {
            id: 2,
            user: "Bob Smith",
            avatar: "BS",
            comment:
                "Decent quality, but shipping was a bit slow. Product works as described. Comfortable for long periods but could have better bass response.",
            rating: 3,
            date: "1 week ago",
            verified: true,
            helpful: 5,
            images: ["https://via.placeholder.com/150"],
        },
        {
            id: 3,
            user: "Charlie Brown",
            avatar: "CB",
            comment:
                "Amazing, exceeded my expectations! Will definitely purchase again. The sound quality is crystal clear and the build quality feels premium.",
            rating: 4,
            date: "3 weeks ago",
            verified: false,
            helpful: 8,
            images: [],
        },
        {
            id: 4,
            user: "Diana Prince",
            avatar: "DP",
            comment:
                "Absolutely love these headphones! The comfort and sound quality are unmatched at this price point. The battery easily lasts through my workday.",
            rating: 5,
            date: "1 month ago",
            verified: true,
            helpful: 15,
            images: [
                "https://via.placeholder.com/150",
                "https://via.placeholder.com/150",
                "https://via.placeholder.com/150",
            ],
        },
    ];

    const dummyComments = [
        {
            id: 1,
            user: "David Wilson",
            avatar: "DW",
            text: "Is this product waterproof? I want to use it during workouts.",
            date: "1 day ago",
            replies: [
                {
                    user: "TechGadget Support",
                    avatar: "TS",
                    text: "Yes, it has an IPX4 rating which means it's resistant to sweat and light splashes.",
                    date: "23 hours ago",
                    isSeller: true,
                },
            ],
        },
        {
            id: 2,
            user: "Emma Thompson",
            avatar: "ET",
            text: "Does it come with a carrying case?",
            date: "2 days ago",
            replies: [
                {
                    user: "TechGadget Support",
                    avatar: "TS",
                    text: "Yes, it includes a premium hard-shell carrying case for protection.",
                    date: "1 day ago",
                    isSeller: true,
                },
            ],
        },
        {
            id: 3,
            user: "John Davis",
            avatar: "JD",
            text: "Can I connect it to multiple devices simultaneously?",
            date: "3 days ago",
            replies: [],
        },
        {
            id: 4,
            user: "Sarah Connor",
            avatar: "SC",
            text: "How long does it take to fully charge?",
            date: "4 days ago",
            replies: [
                {
                    user: "TechGadget Support",
                    avatar: "TS",
                    text: "It takes approximately 2 hours for a full charge, which gives you up to 30 hours of playback.",
                    date: "3 days ago",
                    isSeller: true,
                },
            ],
        },
    ];

    // get the similar product item
    const getRecommendations = async () => {
        try {
            const res = await axios.post("/recommend", {
                product_id: product_info[0].product_id,
                top_k: 5,
            });
            setRecommendations(res.data.recommendations);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    // check the item is added into wishlist or not
    const handleWishlistToggle = async (product_id) => {
        setIsLoading(true);

        try {
            if (isWishlisted) {
                const res = await axios.delete(`/wishlist/${product_id}`);

                console.log(res);
            } else {
                const res = await axios.post("/wishlist", {
                    product_id: product_id,
                });

                console.log(res);
            }

            // Toggle local state
            setIsWishlisted(!isWishlisted);
        } catch (error) {
            setIsLoading(false);

            console.error("Error updating wishlist:", error);
            // Handle error (show notification, etc.)
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getRecommendations();
    }, [product_info[0].product_id]);

    const openModal = (type) => {
        setModalContent(type);
        setShowModal(true);
    };

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const increaseQty = () => setQuantity((prev) => prev + 1);
    const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

    const handleSendMessage = () => {
        if (chatMessage.trim()) {
            // Send message logic here
            console.log("Sending message:", chatMessage);
            setChatMessage("");
        }
    };

    // Calculate average rating
    const averageRating = product_info[0]?.rating || 4.3;
    const reviewCount = product_info[0]?.review_count || 47;
    const soldCount = product_info[0]?.sold || 128;

    // Filter reviews based on rating
    const filteredReviews =
        reviewFilter === "all"
            ? dummyReviews
            : dummyReviews.filter(
                  (review) => review.rating === parseInt(reviewFilter)
              );

    // Get rating distribution
    const ratingDistribution = {
        5: dummyReviews.filter((r) => r.rating === 5).length,
        4: dummyReviews.filter((r) => r.rating === 4).length,
        3: dummyReviews.filter((r) => r.rating === 3).length,
        2: dummyReviews.filter((r) => r.rating === 2).length,
        1: dummyReviews.filter((r) => r.rating === 1).length,
    };

    return (
        <div className="bg-gray-50 min-h-screen text-black">
            <Navbar />

            <div className="max-w-7xl mx-auto my-14 px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Media Gallery */}
                <div className="lg:col-span-6 bg-white rounded-xl shadow-sm p-4 md:p-6">
                    <div className="relative flex flex-col items-center">
                        <div
                            className="w-full max-h-[500px] overflow-hidden rounded-xl cursor-zoom-in"
                            onClick={() => setShowZoomModal(true)}
                        >
                            <img
                                src={BASE_URL + selectedImage}
                                alt={product_info[0]?.product_name}
                                className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                        <button
                            className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                            onClick={() => setShowZoomModal(true)}
                        >
                            <ZoomIn size={20} />
                        </button>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex mt-4 gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                        {product_info[0]?.product_image.map((img, idx) => (
                            <div
                                key={idx}
                                className="relative flex-shrink-0 transition-all duration-200 hover:scale-105"
                                onClick={() => setSelectedImage(img.image_path)}
                            >
                                <img
                                    src={BASE_URL + img.image_path}
                                    className={`h-16 w-16 md:h-20 md:w-20 object-cover rounded-lg cursor-pointer border-2 transition ${
                                        selectedImage === img.image_path
                                            ? "border-blue-500"
                                            : "border-gray-200"
                                    }`}
                                    alt={`thumb-${idx}`}
                                />
                                {selectedImage === img.image_path && (
                                    <div className="absolute inset-0 border-2 border-blue-500 rounded-lg"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Trust badges */}
                    <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3">
                        <div className="flex flex-col items-center text-center p-2 md:p-3 bg-gray-50 rounded-lg transition-colors hover:bg-blue-50">
                            <Truck size={18} className="text-blue-600 mb-1" />
                            <span className="text-xs font-medium">
                                Free Shipping
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 md:p-3 bg-gray-50 rounded-lg transition-colors hover:bg-blue-50">
                            <RotateCcw
                                size={18}
                                className="text-blue-600 mb-1"
                            />
                            <span className="text-xs font-medium">
                                30-Day Returns
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-center p-2 md:p-3 bg-gray-50 rounded-lg transition-colors hover:bg-blue-50">
                            <Shield size={18} className="text-blue-600 mb-1" />
                            <span className="text-xs font-medium">
                                2-Year Warranty
                            </span>
                        </div>
                    </div>
                </div>

                {/* Middle: Product Info */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-start">
                            {/* Title */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {product_info[0]?.product_name}
                                </h1>

                                {/* Ratings + Sold */}
                                <div className="flex flex-col md:flex-row md:items-center md:gap-3 mt-2">
                                    {/* Rating */}
                                    <div className="flex items-center justify-start md:justify-center">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={`${
                                                        i <
                                                        Math.floor(
                                                            averageRating
                                                        )
                                                            ? "fill-current"
                                                            : ""
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700">
                                            {averageRating.toFixed(1)}
                                        </span>
                                    </div>

                                    {/* Reviews / Sold / Views */}
                                    <div className="flex flex-wrap items-center gap-x-4 text-xs md:text-sm text-gray-500 mt-2 md:mt-0 md:ml-4">
                                        <button
                                            onClick={() => openModal("reviews")}
                                            className="text-blue-600 hover:underline transition-colors"
                                        >
                                            {reviewCount} reviews
                                        </button>
                                        <span>{soldCount} sold</span>
                                        <div className="flex items-center">
                                            <Eye size={14} className="mr-1" />
                                            1.2K views
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Share and Wishlist */}
                            <div className="flex gap-2">
                                <button
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        handleWishlistToggle(
                                            product_info[0].product_id
                                        );
                                    }}
                                >
                                    <Heart
                                        size={20}
                                        className={
                                            isWishlisted
                                                ? "fill-red-500 text-red-500 transition-colors"
                                                : "transition-colors"
                                        }
                                    />
                                </button>
                                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Price & Promo */}
                        <div className="mt-4">
                            <div className="flex items-center gap-3">
                                <span className="text-3xl font-bold text-blue-600">
                                    RM {product_info[0]?.product_price}
                                </span>
                                {product_info[0]?.original_price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            RM {product_info[0]?.original_price}
                                        </span>
                                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
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
                            <p className="text-sm text-gray-500 mt-1">
                                Inclusive of all taxes
                            </p>
                        </div>

                        {/* Voucher / Promotions */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection("promotions")}
                            >
                                <div className="flex items-center">
                                    <Gift
                                        size={16}
                                        className="text-blue-600 mr-2"
                                    />
                                    <span className="text-sm font-medium text-blue-800">
                                        Special Promotions
                                    </span>
                                </div>
                                {expandedSection === "promotions" ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                )}
                            </div>
                            {expandedSection === "promotions" && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center text-sm p-2 bg-white rounded-md">
                                        <Check
                                            size={14}
                                            className="text-green-500 mr-2"
                                        />
                                        <span>
                                            Get RM5 OFF with voucher{" "}
                                            <strong>SAVE5</strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm p-2 bg-white rounded-md">
                                        <Check
                                            size={14}
                                            className="text-green-500 mr-2"
                                        />
                                        <span>
                                            Free shipping on orders over RM100
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm p-2 bg-white rounded-md">
                                        <Check
                                            size={14}
                                            className="text-green-500 mr-2"
                                        />
                                        <span>
                                            12 months 0% interest installment
                                            with Maybank
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Selection */}
                        {colors.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    Color:{" "}
                                    <span className="font-normal text-gray-700">
                                        {colors.find(
                                            (c) => c.id === selectedColor
                                        )?.name || "Select color"}
                                    </span>
                                </h3>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color.id}
                                            onClick={() =>
                                                setSelectedColor(color.id)
                                            }
                                            disabled={!color.inStock}
                                            className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                                                selectedColor === color.id
                                                    ? "border-blue-500 ring-2 ring-blue-200"
                                                    : "border-gray-300 hover:border-gray-400"
                                            } ${
                                                !color.inStock
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                            style={{
                                                backgroundColor: color.hex,
                                            }}
                                            title={color.name}
                                        >
                                            {!color.inStock && (
                                                <div className="absolute w-full h-0.5 bg-gray-400 transform rotate-45"></div>
                                            )}
                                            {selectedColor === color.id && (
                                                <Check
                                                    size={16}
                                                    className="text-white"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Variant Selection */}
                        {variants.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">
                                    Storage Capacity
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {variants.map((variant) => (
                                        <button
                                            key={variant.id}
                                            onClick={() =>
                                                setSelectedVariant(variant.id)
                                            }
                                            disabled={!variant.inStock}
                                            className={`p-3 rounded-lg border text-left transition ${
                                                selectedVariant === variant.id
                                                    ? "border-blue-500 bg-blue-50 text-blue-700"
                                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                                            } ${
                                                !variant.inStock
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            <div className="font-medium">
                                                {variant.name}
                                            </div>
                                            <div className="text-sm">
                                                RM {variant.price}
                                            </div>
                                            {!variant.inStock && (
                                                <div className="text-xs text-red-500 mt-1">
                                                    Out of stock
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                                Quantity
                            </h3>
                            <div className="flex items-center">
                                <button
                                    onClick={decreaseQty}
                                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100 transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 border-y border-gray-300 min-w-[50px] text-center font-medium">
                                    {quantity}
                                </span>
                                <button
                                    onClick={increaseQty}
                                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                                <span className="ml-3 text-sm text-gray-500">
                                    {product_info[0]?.stock > 0
                                        ? `${product_info[0]?.stock} available`
                                        : "Out of stock"}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex flex-wrap gap-3">
                            <button
                                disabled={
                                    product_info[0]?.product_quantity <= 0
                                }
                                onClick={() => {
                                    handleWishlistToggle(
                                        product_info[0].product_id
                                    );
                                }}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                            <button
                                disabled={
                                    product_info[0]?.product_quantity <= 0
                                }
                                className="flex-1 bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Buy Now
                            </button>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-6 flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Truck
                                size={18}
                                className="text-gray-500 mt-0.5 flex-shrink-0"
                            />
                            <div>
                                <p className="text-sm font-medium">
                                    Free shipping
                                </p>
                                <p className="text-xs text-gray-500">
                                    Ships from Kuala Lumpur • Delivery in 2-4
                                    days •
                                    <button className="ml-1 text-blue-600 hover:underline">
                                        Learn more
                                    </button>
                                </p>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                Payment methods:
                            </span>
                            <div className="flex gap-1">
                                <div className="p-1 bg-gray-100 rounded-sm">
                                    <CreditCard size={14} />
                                </div>
                                <div className="p-1 bg-gray-100 rounded-sm">
                                    <span className="text-xs font-medium">
                                        FPX
                                    </span>
                                </div>
                                <div className="p-1 bg-gray-100 rounded-sm">
                                    <span className="text-xs font-medium">
                                        BNPL
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Seller Info */}
                    {/* <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Seller Information
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                TS
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">
                                    {
                                        product_info[0].seller.seller_store
                                            .store_name
                                    }
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                    <span>98% Positive Ratings</span>
                                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                    <span>2+ Years on Platform</span>
                                </p>
                            </div>
                            <Link href={route("seller-shop")}>
                                <button className="text-blue-600 text-sm font-medium hover:underline">
                                    Visit Shop
                                </button>
                            </Link>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Response Rate
                                </p>
                                <p className="font-medium">95%</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Response Time
                                </p>
                                <p className="font-medium">Within hours</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">
                                    Followership
                                </p>
                                <p className="font-medium">2.5K</p>
                            </div>
                        </div>
                        <button className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                            <MessageCircle size={16} />
                            Chat with Seller
                        </button>
                    </div> */}

                    {/* Customer Support Chat */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Need help?
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Our support team is here to answer your questions
                        </p>
                        <div className="border rounded-lg p-3">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Users
                                        size={16}
                                        className="text-blue-600"
                                    />
                                </div>
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <p className="text-sm">
                                        Hi there! How can we help you today?
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                    value={chatMessage}
                                    onChange={(e) =>
                                        setChatMessage(e.target.value)
                                    }
                                />
                                <button
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    onClick={handleSendMessage}
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("description")}
                            className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === "description"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab("reviews")}
                            className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === "reviews"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Reviews ({reviewCount})
                        </button>
                        <button
                            onClick={() => setActiveTab("comments")}
                            className={`px-6 py-4 font-medium whitespace-nowrap border-b-2 transition-colors ${
                                activeTab === "comments"
                                    ? "border-blue-600 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Q&A ({dummyComments.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === "description" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">
                                        Product Description
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        {product_info[0]?.product_description ||
                                            "No description provided"}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-3">
                                        Key Features
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-1">
                                        {product_info[0].product_feature.map(
                                            (feature, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
                                                >
                                                    <Check
                                                        size={18}
                                                        className="text-green-500 mt-0.5 flex-shrink-0"
                                                    />
                                                    <span>
                                                        {feature.feature_text}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-3">
                                        Product Include:
                                    </h4>
                                    <ul className="list-disc list-inside text-gray-700 pl-4 space-y-1">
                                        {product_info[0].product_include_item.map(
                                            (item, index) => (
                                                <li key={index}>
                                                    {item.item_name}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {activeTab === "reviews" && (
                            <div className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="md:w-1/3">
                                        <div className="text-center p-6 bg-gray-50 rounded-lg">
                                            <div className="text-4xl font-bold text-blue-600">
                                                {averageRating.toFixed(1)}
                                            </div>
                                            <div className="flex justify-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={20}
                                                        className={`${
                                                            i <
                                                            Math.floor(
                                                                averageRating
                                                            )
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reviewCount} reviews
                                            </div>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div
                                                    key={rating}
                                                    className="flex items-center gap-2"
                                                >
                                                    <div className="flex items-center w-16">
                                                        <span className="text-sm w-4">
                                                            {rating}
                                                        </span>
                                                        <Star
                                                            size={14}
                                                            className="text-yellow-400 fill-current ml-1"
                                                        />
                                                    </div>
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 transition-all duration-500"
                                                            style={{
                                                                width: `${
                                                                    (ratingDistribution[
                                                                        rating
                                                                    ] /
                                                                        dummyReviews.length) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 w-10">
                                                        {
                                                            ratingDistribution[
                                                                rating
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="font-medium mb-2">
                                                Filter Reviews
                                            </h4>
                                            <select
                                                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                value={reviewFilter}
                                                onChange={(e) =>
                                                    setReviewFilter(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="all">
                                                    All Ratings
                                                </option>
                                                <option value="5">
                                                    5 Stars
                                                </option>
                                                <option value="4">
                                                    4 Stars
                                                </option>
                                                <option value="3">
                                                    3 Stars
                                                </option>
                                                <option value="2">
                                                    2 Stars
                                                </option>
                                                <option value="1">
                                                    1 Star
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:w-2/3">
                                        <div className="space-y-6">
                                            {filteredReviews.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="border-b pb-6 last:border-b-0 last:pb-0 transition-all duration-200 hover:bg-gray-50 p-3 rounded-lg -m-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                            {review.avatar}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <p className="font-medium">
                                                                    {
                                                                        review.user
                                                                    }
                                                                </p>
                                                                {review.verified && (
                                                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                        Verified
                                                                        Purchase
                                                                    </span>
                                                                )}
                                                                <span className="text-xs text-gray-500">
                                                                    {
                                                                        review.date
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex text-yellow-400 mt-1">
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
                                                                            className={`${
                                                                                i <
                                                                                review.rating
                                                                                    ? "fill-current"
                                                                                    : ""
                                                                            }`}
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                            <p className="mt-2 text-gray-700">
                                                                {review.comment}
                                                            </p>

                                                            {review.images
                                                                .length > 0 && (
                                                                <div className="flex gap-2 mt-3">
                                                                    {review.images.map(
                                                                        (
                                                                            img,
                                                                            idx
                                                                        ) => (
                                                                            <img
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                src={
                                                                                    img
                                                                                }
                                                                                alt="Review image"
                                                                                className="w-16 h-16 object-cover rounded-lg border transition-transform duration-200 hover:scale-105"
                                                                            />
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="flex items-center gap-4 mt-3">
                                                                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                                    <ThumbsUp
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Helpful (
                                                                    {
                                                                        review.helpful
                                                                    }
                                                                    )
                                                                </button>
                                                                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                                    Report
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {filteredReviews.length === 0 && (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500">
                                                    No reviews match your
                                                    selected filter
                                                </p>
                                            </div>
                                        )}

                                        {filteredReviews.length > 0 && (
                                            <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                                Load More Reviews
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "comments" && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium mb-2">
                                        Have a question about this product?
                                    </h4>
                                    <p className="text-sm text-gray-700 mb-3">
                                        Get answers from the seller or other
                                        customers
                                    </p>
                                    <textarea
                                        placeholder="Type your question here..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        rows="3"
                                    ></textarea>
                                    <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                        Post Question
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {dummyComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border-b pb-6 last:border-b-0 last:pb-0 transition-all duration-200 hover:bg-gray-50 p-3 rounded-lg -m-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {comment.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-medium">
                                                            {comment.user}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {comment.date}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-gray-700">
                                                        {comment.text}
                                                    </p>

                                                    {comment.replies.length >
                                                        0 && (
                                                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                                            {comment.replies.map(
                                                                (
                                                                    reply,
                                                                    idx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="mb-3 last:mb-0 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div className="flex items-start gap-2">
                                                                            <div
                                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                                                                    reply.isSeller
                                                                                        ? "bg-green-500"
                                                                                        : "bg-blue-500"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    reply.avatar
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="font-medium">
                                                                                        {
                                                                                            reply.user
                                                                                        }
                                                                                    </p>
                                                                                    {reply.isSeller && (
                                                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                                            Seller
                                                                                        </span>
                                                                                    )}
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {
                                                                                            reply.date
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-700 mt-1">
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
                                                    )}

                                                    <button className="mt-3 text-sm text-blue-600 hover:underline transition-colors">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full mt-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Load More Questions
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        You Might Also Like
                    </h2>
                    <Link
                        href="/category/audio"
                        className="text-blue-600 hover:underline flex items-center transition-colors"
                    >
                        View all <ChevronRight size={16} />
                    </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendations.map((product) => (
                        <div
                            key={product.product_id}
                            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={
                                        BASE_URL +
                                        product.product.product_image[0]
                                            .image_path
                                    }
                                    alt={product.product.product_name}
                                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                />
                                <button className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                                    <Heart size={16} />
                                </button>
                                {/* {product.discount && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                        -{product.discount}%
                                    </div>
                                )} */}
                            </div>
                            <div className="p-4">
                                <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">
                                    {product.product.product_name}
                                </h3>
                                <div className="flex items-center mb-2">
                                    <div className="flex text-yellow-400">
                                        <Star
                                            size={12}
                                            className="fill-current"
                                        />
                                        <span className="text-xs ml-1 text-gray-600">
                                            {/* {product.rating} */}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {/* ({product.reviews}) */}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold text-blue-600">
                                            RM {product.product.product_price}
                                        </p>
                                        {/* {product.originalPrice && (
                                            <p className="text-xs text-gray-400 line-through">
                                                RM {product.originalPrice}
                                            </p>
                                        )} */}
                                    </div>
                                    <button className="p-1.5 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">
                                        <ShoppingCart
                                            size={16}
                                            className="text-blue-600"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Zoom Modal */}
            {showZoomModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowZoomModal(false)}
                >
                    <button className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                    <div className="max-w-4xl w-full max-h-full flex items-center justify-center">
                        <img
                            src={BASE_URL + selectedImage}
                            alt={product_info[0]?.product_name}
                            className="max-w-full max-h-full object-contain transition-transform duration-300"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}

            {/* Reviews/Comments Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {modalContent === "reviews"
                                    ? "Product Reviews"
                                    : "Customer Questions"}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {modalContent === "reviews" ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-blue-600">
                                                {averageRating.toFixed(1)}
                                            </div>
                                            <div className="flex justify-center mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={20}
                                                        className={`${
                                                            i <
                                                            Math.floor(
                                                                averageRating
                                                            )
                                                                ? "text-yellow-400 fill-current"
                                                                : "text-gray-300"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {reviewCount} reviews
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            {[5, 4, 3, 2, 1].map((rating) => (
                                                <div
                                                    key={rating}
                                                    className="flex items-center gap-2 mb-1"
                                                >
                                                    <span className="text-sm w-4">
                                                        {rating}
                                                    </span>
                                                    <Star
                                                        size={14}
                                                        className="text-yellow-400 fill-current"
                                                    />
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-yellow-400 transition-all duration-500"
                                                            style={{
                                                                width: `${
                                                                    (ratingDistribution[
                                                                        rating
                                                                    ] /
                                                                        dummyReviews.length) *
                                                                    100
                                                                }%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-500 w-10">
                                                        {
                                                            ratingDistribution[
                                                                rating
                                                            ]
                                                        }
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {dummyReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="border-b pb-6 last:border-b-0 last:pb-0 transition-all duration-200 hover:bg-gray-50 p-3 rounded-lg -m-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {review.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-medium">
                                                            {review.user}
                                                        </p>
                                                        {review.verified && (
                                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                Verified
                                                                Purchase
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">
                                                            {review.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex text-yellow-400 mt-1">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={`${
                                                                        i <
                                                                        review.rating
                                                                            ? "fill-current"
                                                                            : ""
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <p className="mt-2 text-gray-700">
                                                        {review.comment}
                                                    </p>

                                                    {review.images.length >
                                                        0 && (
                                                        <div className="flex gap-2 mt-3">
                                                            {review.images.map(
                                                                (img, idx) => (
                                                                    <img
                                                                        key={
                                                                            idx
                                                                        }
                                                                        src={
                                                                            img
                                                                        }
                                                                        alt="Review image"
                                                                        className="w-16 h-16 object-cover rounded-lg border transition-transform duration-200 hover:scale-105"
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex items-center gap-4 mt-3">
                                                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                            <ThumbsUp
                                                                size={14}
                                                            />
                                                            Helpful (
                                                            {review.helpful})
                                                        </button>
                                                        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                                                            Report
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {dummyComments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="border-b pb-6 last:border-b-0 last:pb-0 transition-all duration-200 hover:bg-gray-50 p-3 rounded-lg -m-3"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                    {comment.avatar}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <p className="font-medium">
                                                            {comment.user}
                                                        </p>
                                                        <span className="text-xs text-gray-500">
                                                            {comment.date}
                                                        </span>
                                                    </div>
                                                    <p className="mt-1 text-gray-700">
                                                        {comment.text}
                                                    </p>

                                                    {comment.replies.length >
                                                        0 && (
                                                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                                                            {comment.replies.map(
                                                                (
                                                                    reply,
                                                                    idx
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="mb-3 last:mb-0 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div className="flex items-start gap-2">
                                                                            <div
                                                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                                                                    reply.isSeller
                                                                                        ? "bg-green-500"
                                                                                        : "bg-blue-500"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    reply.avatar
                                                                                }
                                                                            </div>
                                                                            <div>
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="font-medium">
                                                                                        {
                                                                                            reply.user
                                                                                        }
                                                                                    </p>
                                                                                    {reply.isSeller && (
                                                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                                                                            Seller
                                                                                        </span>
                                                                                    )}
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {
                                                                                            reply.date
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm text-gray-700 mt-1">
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
                                                    )}

                                                    <button className="mt-3 text-sm text-blue-600 hover:underline transition-colors">
                                                        Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
