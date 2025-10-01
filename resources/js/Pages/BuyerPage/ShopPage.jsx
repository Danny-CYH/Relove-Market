import { Footer } from "@/Components/BuyerPage/Footer";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { ProductCard } from "@/Components/BuyerPage/ProductCard";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Grid,
    List,
    Check,
    Star,
    MapPin,
    Truck,
    Shield,
    RotateCcw,
    Heart,
    Sparkles,
    TrendingUp,
    Clock,
    Zap,
    ChevronUp,
    X,
    SlidersHorizontal,
    ArrowUpDown,
    Tag,
    Award,
    Clock4,
    Leaf,
    TrendingUp as TrendingUpIcon,
    Crown,
    ShoppingBag,
    Eye,
    Users,
    ThumbsUp,
    Calendar,
    BadgePercent,
    RefreshCw,
    Sparkles as SparklesIcon,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePage, Link } from "@inertiajs/react";

export default function ShopPage({ list_shoppingItem, list_categoryItem }) {
    // Enhanced promotional banners with better images
    const promotions = [
        {
            title: "Mega Summer Sale - Up to 60% Off!",
            description:
                "Premium preloved fashion at unbelievable prices. Limited stock!",
            image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1200&h=600&fit=crop",
            cta: "Shop the Sale",
            theme: "bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600",
            badge: "🔥 HOT DEAL",
            timer: "24:59:59",
            discount: "60% OFF",
            category: "Fashion",
        },
        {
            title: "Buy 2 Get 1 Free 🎉",
            description: "Mix & match from thousands of items. No code needed!",
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
            cta: "Explore Offers",
            theme: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700",
            badge: "EXCLUSIVE",
            discount: "B2G1 FREE",
            category: "All Items",
        },
        {
            title: "Flash Deal - Ends Tonight!",
            description:
                "Last chance to grab these amazing deals before they're gone forever.",
            image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
            cta: "View Flash Deals",
            theme: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-600",
            badge: "⏰ ENDING SOON",
            timer: "06:45:22",
            discount: "70% OFF",
            category: "Electronics",
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPromo, setCurrentPromo] = useState(0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortBy, setSortBy] = useState("recommended");
    const [searchQuery, setSearchQuery] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeFilterTab, setActiveFilterTab] = useState("all");

    const totalPages = 5;
    const itemsPerPage = 12;
    const promoRef = useRef(null);

    // Auto-rotate promotions with pause on hover
    useEffect(() => {
        let timer;
        if (!promoRef.current?.matches(":hover")) {
            timer = setInterval(() => {
                setCurrentPromo((prev) => (prev + 1) % promotions.length);
            }, 5000);
        }
        return () => clearInterval(timer);
    }, [currentPromo]);

    // Scroll to top visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleCategory = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const toggleCondition = (condition) => {
        setSelectedConditions((prev) =>
            prev.includes(condition)
                ? prev.filter((c) => c !== condition)
                : [...prev, condition]
        );
    };

    const applyFilters = () => {
        setMobileFiltersOpen(false);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setSelectedConditions([]);
        setSortBy("recommended");
        setSearchQuery("");
        setActiveFilterTab("all");
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const hasProducts = list_shoppingItem?.data?.length > 0;
    const totalProducts = hasProducts ? list_shoppingItem.data.length : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalProducts);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />

            {/* Enhanced Promotional Banner Carousel with Better Design */}
            <div
                ref={promoRef}
                className="relative w-full h-80 sm:h-96 lg:h-[400px] overflow-hidden group"
                onMouseEnter={() => clearInterval()}
            >
                {promotions.map((promo, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                            index === currentPromo
                                ? "opacity-100 z-10 transform scale-100"
                                : "opacity-0 transform scale-105"
                        }`}
                        style={{
                            backgroundImage: `url(${promo.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundAttachment: "fixed",
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

                        {/* Animated Background Elements */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-20 flex flex-col items-start justify-center h-full text-left px-8 sm:px-12 md:px-16 lg:px-8 xl:px-32">
                            <div className="max-w-2xl transform transition-all duration-700 ease-out mt-20">
                                {/* Title and Description */}
                                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-2xl mt-8 font-black text-white mb-6 leading-tight drop-shadow-2xl">
                                    {promo.title}
                                </h2>
                                <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-lg leading-relaxed drop-shadow-lg">
                                    {promo.description}
                                </p>

                                {/* Additional Info */}
                                <div className="flex items-center gap-6 mt-8 text-white/80">
                                    <div className="flex items-center gap-2">
                                        <ThumbsUp size={18} />
                                        <span className="text-sm">
                                            500+ Happy Customers
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} />
                                        <span className="text-sm">
                                            Limited Time Offer
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Enhanced Navigation Arrows */}
                <button
                    onClick={() =>
                        setCurrentPromo(
                            (prev) =>
                                (prev - 1 + promotions.length) %
                                promotions.length
                        )
                    }
                    className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-4 rounded-full text-white z-30 transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 transform hover:scale-110"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={() =>
                        setCurrentPromo(
                            (prev) => (prev + 1) % promotions.length
                        )
                    }
                    className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-4 rounded-full text-white z-30 transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 transform hover:scale-110"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                {/* Enhanced Indicators */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
                    {promotions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPromo(idx)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                                idx === currentPromo
                                    ? "bg-white w-8 scale-110 shadow-lg"
                                    : "bg-white/50 hover:bg-white/80"
                            }`}
                        />
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
                    <div
                        className="h-full bg-white transition-all duration-5000 ease-linear"
                        style={{
                            width: `${
                                (currentPromo + 1) * (100 / promotions.length)
                            }%`,
                        }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-8 md:px-28">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Enhanced Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-80 bg-white rounded-2xl shadow-lg p-6 sticky top-24 h-fit border border-gray-200">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Filters
                            </h3>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset All
                            </button>
                        </div>

                        {/* Accordion Filters */}
                        <div className="space-y-2">
                            {/* Categories Accordion */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() =>
                                        setActiveFilterTab(
                                            activeFilterTab === "categories"
                                                ? "all"
                                                : "categories"
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <ShoppingBag className="w-4 h-4 text-gray-600" />
                                        <span className="font-semibold text-gray-900">
                                            Categories
                                        </span>
                                        {selectedCategories.length > 0 && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                {selectedCategories.length}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            activeFilterTab === "categories"
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeFilterTab === "categories"
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="p-4 border-t border-gray-100 space-y-2 max-h-60 overflow-y-auto">
                                        {list_categoryItem.map(
                                            (category, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCategories.includes(
                                                            category.category_name
                                                        )}
                                                        onChange={() =>
                                                            toggleCategory(
                                                                category.category_name
                                                            )
                                                        }
                                                        className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900">
                                                        {category.category_name}
                                                    </span>
                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-gray-200">
                                                        248
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Price Range Accordion */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() =>
                                        setActiveFilterTab(
                                            activeFilterTab === "price"
                                                ? "all"
                                                : "price"
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Tag className="w-4 h-4 text-gray-600" />
                                        <span className="font-semibold text-gray-900">
                                            Price Range
                                        </span>
                                        {priceRange[1] < 1000 && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                RM{priceRange[0]} - RM
                                                {priceRange[1]}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            activeFilterTab === "price"
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeFilterTab === "price"
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="p-4 border-t border-gray-100 space-y-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>RM {priceRange[0]}</span>
                                            <span>RM {priceRange[1]}</span>
                                        </div>

                                        {/* Dual Range Slider */}
                                        <div className="relative py-4">
                                            <div className="absolute h-1 bg-gray-200 rounded-full w-full top-1/2 transform -translate-y-1/2"></div>
                                            <div
                                                className="absolute h-1 bg-green-500 rounded-full top-1/2 transform -translate-y-1/2"
                                                style={{
                                                    left: `${
                                                        (priceRange[0] / 1000) *
                                                        100
                                                    }%`,
                                                    width: `${
                                                        ((priceRange[1] -
                                                            priceRange[0]) /
                                                            1000) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>

                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[0]}
                                                onChange={(e) =>
                                                    setPriceRange([
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                        priceRange[1],
                                                    ])
                                                }
                                                className="absolute w-full top-1/2 transform -translate-y-1/2 appearance-none h-1 bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[1]}
                                                onChange={(e) =>
                                                    setPriceRange([
                                                        priceRange[0],
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                    ])
                                                }
                                                className="absolute w-full top-1/2 transform -translate-y-1/2 appearance-none h-1 bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-600 mb-1 block">
                                                    Min
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                                        RM
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={priceRange[0]}
                                                        onChange={(e) =>
                                                            setPriceRange([
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 0,
                                                                priceRange[1],
                                                            ])
                                                        }
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-600 mb-1 block">
                                                    Max
                                                </label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                                        RM
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={priceRange[1]}
                                                        onChange={(e) =>
                                                            setPriceRange([
                                                                priceRange[0],
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                ) || 1000,
                                                            ])
                                                        }
                                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Price Presets */}
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                {
                                                    label: "Under RM50",
                                                    range: [0, 50],
                                                },
                                                {
                                                    label: "RM50-100",
                                                    range: [50, 100],
                                                },
                                                {
                                                    label: "RM100-200",
                                                    range: [100, 200],
                                                },
                                                {
                                                    label: "Over RM200",
                                                    range: [200, 1000],
                                                },
                                            ].map((preset, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        setPriceRange(
                                                            preset.range
                                                        )
                                                    }
                                                    className="text-xs px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                                                >
                                                    {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Condition Accordion */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() =>
                                        setActiveFilterTab(
                                            activeFilterTab === "condition"
                                                ? "all"
                                                : "condition"
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Award className="w-4 h-4 text-gray-600" />
                                        <span className="font-semibold text-gray-900">
                                            Condition
                                        </span>
                                        {selectedConditions.length > 0 && (
                                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                                {selectedConditions.length}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            activeFilterTab === "condition"
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeFilterTab === "condition"
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="p-4 border-t border-gray-100 space-y-2">
                                        {[
                                            {
                                                label: "New",
                                                count: 156,
                                                color: "bg-green-100 text-green-800",
                                            },
                                            {
                                                label: "Like New",
                                                count: 289,
                                                color: "bg-blue-100 text-blue-800",
                                            },
                                            {
                                                label: "Used - Good",
                                                count: 432,
                                                color: "bg-yellow-100 text-yellow-800",
                                            },
                                            {
                                                label: "Used - Fair",
                                                count: 198,
                                                color: "bg-orange-100 text-orange-800",
                                            },
                                            {
                                                label: "Vintage",
                                                count: 87,
                                                color: "bg-purple-100 text-purple-800",
                                            },
                                        ].map((cond, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConditions.includes(
                                                        cond.label
                                                    )}
                                                    onChange={() =>
                                                        toggleCondition(
                                                            cond.label
                                                        )
                                                    }
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900">
                                                    {cond.label}
                                                </span>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded ${cond.color}`}
                                                >
                                                    {cond.count}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Rating Accordion */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() =>
                                        setActiveFilterTab(
                                            activeFilterTab === "rating"
                                                ? "all"
                                                : "rating"
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Star className="w-4 h-4 text-gray-600" />
                                        <span className="font-semibold text-gray-900">
                                            Seller Rating
                                        </span>
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            activeFilterTab === "rating"
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeFilterTab === "rating"
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="p-4 border-t border-gray-100 space-y-3">
                                        {[
                                            {
                                                rating: 5,
                                                label: "5 Stars",
                                                count: 1245,
                                            },
                                            {
                                                rating: 4,
                                                label: "4 Stars & Up",
                                                count: 876,
                                            },
                                            {
                                                rating: 3,
                                                label: "3 Stars & Up",
                                                count: 543,
                                            },
                                            {
                                                rating: 2,
                                                label: "2 Stars & Up",
                                                count: 321,
                                            },
                                        ].map((rating, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                />
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map(
                                                            (_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${
                                                                        i <
                                                                        rating.rating
                                                                            ? "text-yellow-400 fill-yellow-400"
                                                                            : "text-gray-300"
                                                                    }`}
                                                                />
                                                            )
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600 group-hover:text-gray-900">
                                                        {rating.label}
                                                    </span>
                                                </div>
                                                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-gray-200">
                                                    {rating.count}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Accordion */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() =>
                                        setActiveFilterTab(
                                            activeFilterTab === "shipping"
                                                ? "all"
                                                : "shipping"
                                        )
                                    }
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Truck className="w-4 h-4 text-gray-600" />
                                        <span className="font-semibold text-gray-900">
                                            Shipping
                                        </span>
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                            activeFilterTab === "shipping"
                                                ? "rotate-90"
                                                : ""
                                        }`}
                                    />
                                </button>

                                <div
                                    className={`overflow-hidden transition-all duration-300 ${
                                        activeFilterTab === "shipping"
                                            ? "max-h-96 opacity-100"
                                            : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <div className="p-4 border-t border-gray-100 space-y-3">
                                        {[
                                            {
                                                label: "Free Shipping",
                                                count: 567,
                                            },
                                            {
                                                label: "Express Delivery",
                                                count: 234,
                                            },
                                            {
                                                label: "Local Pickup",
                                                count: 89,
                                            },
                                            {
                                                label: "International",
                                                count: 45,
                                            },
                                        ].map((option, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900">
                                                    {option.label}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded group-hover:bg-gray-200">
                                                    {option.count}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={applyFilters}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-all mt-6 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Filter className="w-4 h-4" />
                            Apply Filters
                            {selectedCategories.length +
                                selectedConditions.length >
                                0 && (
                                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                    {selectedCategories.length +
                                        selectedConditions.length}
                                </span>
                            )}
                        </button>
                    </aside>

                    {/* Products Section */}
                    <section className="flex-1">
                        {/* Enhanced Results Header */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <p className="text-sm text-gray-600">
                                        Showing{" "}
                                        <span className="font-semibold">
                                            {startIndex + 1}-{endIndex}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-semibold">
                                            {totalProducts}
                                        </span>{" "}
                                        products
                                    </p>
                                    {selectedCategories.length > 0 && (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            {selectedCategories.length} category
                                            filter(s)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Product Grid/List */}
                        {hasProducts ? (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6"
                                        : "space-y-4"
                                }
                            >
                                {list_shoppingItem.data
                                    .slice(startIndex, endIndex)
                                    .map((item) => (
                                        <Link
                                            key={item.product_id}
                                            href={route(
                                                "product-details",
                                                item.product_id
                                            )}
                                            className="block transition-all hover:scale-[1.02] hover:shadow-lg"
                                        >
                                            <ProductCard
                                                product={item}
                                                isFlashSale={false}
                                                viewMode={viewMode}
                                            />
                                        </Link>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
                                <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    No products found
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Try adjusting your search or filter criteria
                                    to find what you're looking for.
                                </p>
                                <button
                                    onClick={resetFilters}
                                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Enhanced Pagination */}
                        {hasProducts && totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages} •{" "}
                                    {totalProducts} total items
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map(
                                            (_, index) => {
                                                const page = index + 1;
                                                if (
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 &&
                                                        page <= currentPage + 1)
                                                ) {
                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    page
                                                                )
                                                            }
                                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                                                                currentPage ===
                                                                page
                                                                    ? "bg-green-600 text-white shadow-md"
                                                                    : "border hover:bg-gray-50 shadow-sm"
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    );
                                                } else if (
                                                    page === currentPage - 2 ||
                                                    page === currentPage + 2
                                                ) {
                                                    return (
                                                        <span
                                                            key={index}
                                                            className="px-2 text-gray-400"
                                                        >
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            }
                                        )}
                                    </div>

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage(currentPage + 1)
                                        }
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm"
                                    >
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Enhanced Scroll to Top Button */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-green-600 text-white p-4 rounded-2xl shadow-2xl hover:bg-green-700 transition-all z-40 hover:scale-110 group"
                >
                    <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                </button>
            )}

            <Footer />
        </div>
    );
}
