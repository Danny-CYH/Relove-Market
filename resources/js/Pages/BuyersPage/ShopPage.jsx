import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";
import { ProductCard } from "@/Components/Buyer/ProductCard";

import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Grid,
    List,
    Check,
} from "lucide-react";

import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";

export default function ShopPage({ list_shoppingItem, list_categoryItem }) {
    const promotions = [
        {
            title: "Mega Sale - Up to 50% Off!",
            description:
                "Grab your favorite preloved items before the deal ends.",
            image: "../image/promo1.jpg",
            cta: "Shop Now",
            theme: "bg-gradient-to-r from-purple-600 to-indigo-700",
        },
        {
            title: "Buy 1 Get 1 Free 🎉",
            description:
                "Limited time only – double the value for the same price.",
            image: "../image/promo2.jpg",
            cta: "Grab the Deal",
            theme: "bg-gradient-to-r from-orange-500 to-pink-600",
        },
        {
            title: "Flash Deal - 24 Hours Only",
            description: "Exclusive discounts available for the next 24 hours.",
            image: "../image/promo3.jpg",
            cta: "View Deals",
            theme: "bg-gradient-to-r from-green-600 to-teal-700",
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const [currentPromo, setCurrentPromo] = useState(0);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortBy, setSortBy] = useState("recommended");

    const totalPages = 5; // Replace with backend data later

    // Auto-rotate promotions every 5s
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPromo((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(
                selectedCategories.filter((c) => c !== category)
            );
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const toggleCondition = (condition) => {
        if (selectedConditions.includes(condition)) {
            setSelectedConditions(
                selectedConditions.filter((c) => c !== condition)
            );
        } else {
            setSelectedConditions([...selectedConditions, condition]);
        }
    };

    const applyFilters = () => {
        // Implement filter application logic here
        console.log("Applying filters:", {
            priceRange,
            selectedCategories,
            selectedConditions,
            sortBy,
        });
        setMobileFiltersOpen(false);
    };

    const resetFilters = () => {
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setSelectedConditions([]);
        setSortBy("recommended");
    };

    // Check if there are products to display
    const hasProducts =
        list_shoppingItem &&
        list_shoppingItem.data &&
        list_shoppingItem.data.length > 0;

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Navbar />

            {/* Promotional Banner Carousel */}
            <div className="relative w-full h-80 h-48 sm:h-64 md:h-80 overflow-hidden">
                {promotions.map((promo, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                            promo.theme
                        } ${
                            index === currentPromo
                                ? "opacity-100 z-10"
                                : "opacity-0"
                        }`}
                        style={{
                            backgroundColor: `url(${promo.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />

                        {/* Content */}
                        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4 sm:px-6">
                            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                                {promo.title}
                            </h2>
                            <p className="text-xs sm:text-sm md:text-lg text-gray-100 max-w-md sm:max-w-xl mb-4 sm:mb-6">
                                {promo.description}
                            </p>
                            <button className="bg-white text-gray-900 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium shadow-md hover:bg-gray-100 transition">
                                {promo.cta}
                            </button>
                        </div>
                    </div>
                ))}

                {/* Navigation */}
                <button
                    onClick={() =>
                        setCurrentPromo(
                            (prev) =>
                                (prev - 1 + promotions.length) %
                                promotions.length
                        )
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 sm:p-2 rounded-full text-white z-30"
                >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                    onClick={() =>
                        setCurrentPromo(
                            (prev) => (prev + 1) % promotions.length
                        )
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 p-1.5 sm:p-2 rounded-full text-white z-30"
                >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Indicators */}
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-30">
                    {promotions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPromo(idx)}
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                                idx === currentPromo
                                    ? "bg-white w-4 sm:w-6"
                                    : "bg-white/60"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Section */}
            <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:px-12 md:py-12">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 mt-6 sm:mt-10">
                        Shop Preloved Items
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Discover unique finds and give items a second life
                    </p>
                </div>

                {/* Mobile Filter Button */}
                <div className="lg:hidden flex items-center justify-between mb-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm">
                    <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm sm:text-base text-gray-700"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <div className="flex items-center gap-2">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price-low">
                                Price: Low to High
                            </option>
                            <option value="price-high">
                                Price: High to Low
                            </option>
                            <option value="newest">Newest First</option>
                            <option value="popular">Most Popular</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-72 bg-white rounded-xl shadow-sm p-4 sm:p-6 sticky top-24 h-fit border border-gray-100">
                        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
                            <h3 className="text-lg font-semibold">Filters</h3>
                            <button
                                onClick={resetFilters}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                            >
                                Reset All
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {/* Search */}
                            <div>
                                <h4 className="font-medium mb-2 sm:mb-3 text-gray-900">
                                    Search
                                </h4>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <h4 className="font-medium mb-2 sm:mb-3 text-gray-900">
                                    Category
                                </h4>
                                <div className="space-y-1 sm:space-y-2">
                                    {list_categoryItem.map(
                                        (category, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <div className="relative">
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
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-4 h-4 sm:w-5 sm:h-5 border rounded flex items-center justify-center ${
                                                            selectedCategories.includes(
                                                                category.category_name
                                                            )
                                                                ? "bg-green-600 border-green-600"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {selectedCategories.includes(
                                                            category.category_name
                                                        ) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-700">
                                                    {category.category_name}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <h4 className="font-medium mb-2 sm:mb-3 text-gray-900">
                                    Price Range
                                </h4>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                                        <span>RM {priceRange[0]}</span>
                                        <span>RM {priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                            setPriceRange([
                                                priceRange[0],
                                                parseInt(e.target.value),
                                            ])
                                        }
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={priceRange[0]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    parseInt(e.target.value),
                                                    priceRange[1],
                                                ])
                                            }
                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm"
                                            placeholder="Min"
                                        />
                                        <input
                                            type="number"
                                            value={priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    priceRange[0],
                                                    parseInt(e.target.value),
                                                ])
                                            }
                                            className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <h4 className="font-medium mb-2 sm:mb-3 text-gray-900">
                                    Condition
                                </h4>
                                <div className="space-y-1 sm:space-y-2">
                                    {["New", "Like New", "Used", "Vintage"].map(
                                        (cond) => (
                                            <label
                                                key={cond}
                                                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedConditions.includes(
                                                            cond
                                                        )}
                                                        onChange={() =>
                                                            toggleCondition(
                                                                cond
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-4 h-4 sm:w-5 sm:h-5 border rounded flex items-center justify-center ${
                                                            selectedConditions.includes(
                                                                cond
                                                            )
                                                                ? "bg-green-600 border-green-600"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {selectedConditions.includes(
                                                            cond
                                                        ) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs sm:text-sm text-gray-700">
                                                    {cond}
                                                </span>
                                            </label>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h4 className="font-medium mb-2 sm:mb-3 text-gray-900">
                                    Location
                                </h4>
                                <select className="w-full px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                    <option>All Locations</option>
                                    <option>Kuala Lumpur</option>
                                    <option>Penang</option>
                                    <option>Johor</option>
                                    <option>Selangor</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={applyFilters}
                            className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-green-700 transition-colors mt-4 sm:mt-6 text-sm sm:text-base"
                        >
                            Apply Filters
                        </button>
                    </aside>

                    {/* Products Section */}
                    <section className="flex-1">
                        {/* Desktop Header */}
                        <div className="hidden lg:flex items-center justify-between mb-4 sm:mb-6 p-4 bg-white rounded-xl shadow-sm">
                            <p className="text-sm text-gray-600">
                                Showing{" "}
                                <span className="font-medium">1-12</span> of{" "}
                                <span className="font-medium">48</span> products
                            </p>
                            <div className="flex items-center gap-3">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="recommended">
                                        Recommended
                                    </option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                    <option value="newest">Newest First</option>
                                    <option value="popular">
                                        Most Popular
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid/List */}
                        {hasProducts ? (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                                        : "space-y-4"
                                }
                            >
                                {list_shoppingItem.data.map((item) => (
                                    <Link
                                        key={item.product_id}
                                        href={`/item-details/${item.product_id}`}
                                        className="flex flex-col flex-1"
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
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
                                <div className="text-center max-w-md mx-auto px-4">
                                    <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Search className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 mb-6">
                                        Try adjusting your search or filter to
                                        find what you're looking for.
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                                    >
                                        Reset all filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Pagination - Only show if there are products */}
                        {hasProducts && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-200">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {(currentPage - 1) * 12 + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {Math.min(currentPage * 12, 48)}
                                    </span>{" "}
                                    of <span className="font-medium">48</span>{" "}
                                    results
                                </p>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage(currentPage - 1)
                                        }
                                        className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {[...Array(totalPages)].map(
                                            (_, index) => {
                                                const page = index + 1;
                                                // Show limited pages with ellipsis
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
                                                            className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium ${
                                                                currentPage ===
                                                                page
                                                                    ? "bg-green-600 text-white"
                                                                    : "border hover:bg-gray-50"
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
                                                            className="px-1 sm:px-2"
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
                                        className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Mobile Filters Slide-in */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl overflow-y-auto">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-lg font-semibold">
                                    Filters
                                </h3>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Mobile filter content */}
                            <div className="space-y-6">
                                {/* Search */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">
                                        Search
                                    </h4>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search products..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">
                                        Category
                                    </h4>
                                    <div className="space-y-2">
                                        {list_categoryItem.map(
                                            (category, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                                >
                                                    <div className="relative">
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
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            className={`w-5 h-5 border rounded-md flex items-center justify-center ${
                                                                selectedCategories.includes(
                                                                    category.category_name
                                                                )
                                                                    ? "bg-green-600 border-green-600"
                                                                    : "border-gray-300"
                                                            }`}
                                                        >
                                                            {selectedCategories.includes(
                                                                category.category_name
                                                            ) && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm text-gray-700">
                                                        {category.category_name}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">
                                        Price Range
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>RM {priceRange[0]}</span>
                                            <span>RM {priceRange[1]}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1000"
                                            value={priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    priceRange[0],
                                                    parseInt(e.target.value),
                                                ])
                                            }
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) =>
                                                    setPriceRange([
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                        priceRange[1],
                                                    ])
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="Min"
                                            />
                                            <input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) =>
                                                    setPriceRange([
                                                        priceRange[0],
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                    ])
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Condition */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">
                                        Condition
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            "New",
                                            "Like New",
                                            "Used",
                                            "Vintage",
                                        ].map((cond) => (
                                            <label
                                                key={cond}
                                                className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 transition"
                                            >
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedConditions.includes(
                                                            cond
                                                        )}
                                                        onChange={() =>
                                                            toggleCondition(
                                                                cond
                                                            )
                                                        }
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`w-5 h-5 border rounded-md flex items-center justify-center ${
                                                            selectedConditions.includes(
                                                                cond
                                                            )
                                                                ? "bg-green-600 border-green-600"
                                                                : "border-gray-300"
                                                        }`}
                                                    >
                                                        {selectedConditions.includes(
                                                            cond
                                                        ) && (
                                                            <Check className="w-3 h-3 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-700">
                                                    {cond}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <h4 className="font-medium mb-3 text-gray-900">
                                        Location
                                    </h4>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
                                        <option>All Locations</option>
                                        <option>Kuala Lumpur</option>
                                        <option>Penang</option>
                                        <option>Johor</option>
                                        <option>Selangor</option>
                                    </select>
                                </div>
                            </div>

                            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                                <div className="flex gap-3">
                                    <button
                                        onClick={resetFilters}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
