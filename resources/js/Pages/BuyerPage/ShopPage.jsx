import { Footer } from "@/Components/BuyerPage/Footer";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { ProductCard } from "@/Components/BuyerPage/ProductCard";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Filter,
    Truck,
    Shield,
    ChevronUp,
    X,
    ThumbsUp,
    RefreshCw,
    Plus,
    Minus,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Link } from "@inertiajs/react";

export default function ShopPage({ list_shoppingItem, list_categoryItem }) {
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortBy, setSortBy] = useState("recommended");
    const [searchQuery, setSearchQuery] = useState("");
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [expandedFilters, setExpandedFilters] = useState({
        categories: true,
        price: true,
        condition: true,
        rating: false,
        shipping: false,
    });

    // State for products and pagination
    const [products, setProducts] = useState(list_shoppingItem?.data || []);
    const [currentPage, setCurrentPage] = useState(
        list_shoppingItem?.current_page || 1
    );
    const [lastPage, setLastPage] = useState(list_shoppingItem?.last_page || 1);
    const [totalProducts, setTotalProducts] = useState(
        list_shoppingItem?.total || 0
    );
    const [from, setFrom] = useState(list_shoppingItem?.from || 0);
    const [to, setTo] = useState(list_shoppingItem?.to || 0);
    const [loading, setLoading] = useState(false);

    // Scroll to top visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Function to fetch products with current filters
    const fetchProducts = useCallback(
        async (page = 1, filters = {}) => {
            setLoading(true);

            const params = new URLSearchParams({
                page: page,
                search: searchQuery,
                sort_by: sortBy,
                ...filters,
            });

            // Add array parameters properly
            if (selectedCategories.length > 0) {
                selectedCategories.forEach((category) => {
                    params.append("categories[]", category);
                });
            }

            if (selectedConditions.length > 0) {
                selectedConditions.forEach((condition) => {
                    params.append("conditions[]", condition);
                });
            }

            if (priceRange && priceRange.length === 2) {
                params.append("price_range[]", priceRange[0]);
                params.append("price_range[]", priceRange[1]);
            }

            try {
                const response = await fetch(`/shopping?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.list_shoppingItem.data || []);
                    setCurrentPage(data.list_shoppingItem.current_page);
                    setLastPage(data.list_shoppingItem.last_page);
                    setTotalProducts(data.list_shoppingItem.total);
                    setFrom(data.list_shoppingItem.from);
                    setTo(data.list_shoppingItem.to);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        },
        [
            searchQuery,
            sortBy,
            selectedCategories,
            selectedConditions,
            priceRange,
        ]
    );

    // Debounced search function to avoid too many requests
    const debouncedSearch = useCallback(
        debounce((query) => {
            updateFilters({ search: query, page: 1 });
        }, 500),
        []
    );

    const toggleCategory = (category) => {
        const newCategories = selectedCategories.includes(category)
            ? selectedCategories.filter((c) => c !== category)
            : [...selectedCategories, category];
        setSelectedCategories(newCategories);
        fetchProducts(1, { categories: newCategories });
    };

    const toggleCondition = (condition) => {
        const newConditions = selectedConditions.includes(condition)
            ? selectedConditions.filter((c) => c !== condition)
            : [...selectedConditions, condition];
        setSelectedConditions(newConditions);
        fetchProducts(1, { conditions: newConditions });
    };

    // Apply filters (for mobile)
    const applyFilters = () => {
        setMobileFiltersOpen(false);
        fetchProducts(1);
    };

    const resetFilters = () => {
        setPriceRange([0, 1000]);
        setSelectedCategories([]);
        setSelectedConditions([]);
        setSortBy("recommended");
        setSearchQuery("");
        fetchProducts(1, {
            price_range: [0, 1000],
            categories: [],
            conditions: [],
            sort_by: "recommended",
            search: "",
        });
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleFilterSection = (section) => {
        setExpandedFilters((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Update page change handler
    const handlePageChange = (page) => {
        if (page >= 1 && page <= lastPage) {
            fetchProducts(page);
            scrollToTop();
        }
    };

    // Handle sort changes
    const handleSortChange = (sort) => {
        setSortBy(sort);
        fetchProducts(1, { sort_by: sort });
    };

    // Handle search input changes with debouncing
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle price range changes
    const handlePriceRangeChange = (newRange) => {
        setPriceRange(newRange);
        fetchProducts(1, { price_range: newRange });
    };

    const hasProducts = products.length > 0;

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(lastPage, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            {/* Promotional Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-8 mt-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        Discover Amazing Products
                    </h1>
                    <p className="text-xl opacity-90 mb-6">
                        Find exactly what you're looking for from thousands of
                        items
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for products, brands, or categories..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-lg"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 md:px-24 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar - Desktop */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Filters
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reset
                                </button>
                            </div>

                            {/* Categories Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() =>
                                        toggleFilterSection("categories")
                                    }
                                    className="flex items-center justify-between w-full mb-3"
                                >
                                    <span className="font-semibold text-gray-900">
                                        Categories
                                    </span>
                                    {expandedFilters.categories ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </button>
                                {expandedFilters.categories && (
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {list_categoryItem?.map(
                                            (category, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
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
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {category.category_name}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() => toggleFilterSection("price")}
                                    className="flex items-center justify-between w-full mb-3"
                                >
                                    <span className="font-semibold text-gray-900">
                                        Price Range
                                    </span>
                                    {expandedFilters.price ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </button>
                                {expandedFilters.price && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>RM{priceRange[0]}</span>
                                            <span>RM{priceRange[1]}</span>
                                        </div>
                                        <div className="relative py-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[0]}
                                                onChange={(e) => {
                                                    const newRange = [
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                        priceRange[1],
                                                    ];
                                                    setPriceRange(newRange);
                                                }}
                                                onMouseUp={() =>
                                                    handlePriceRangeChange(
                                                        priceRange
                                                    )
                                                }
                                                onTouchEnd={() =>
                                                    handlePriceRangeChange(
                                                        priceRange
                                                    )
                                                }
                                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1000"
                                                value={priceRange[1]}
                                                onChange={(e) => {
                                                    const newRange = [
                                                        priceRange[0],
                                                        parseInt(
                                                            e.target.value
                                                        ),
                                                    ];
                                                    setPriceRange(newRange);
                                                }}
                                                onMouseUp={() =>
                                                    handlePriceRangeChange(
                                                        priceRange
                                                    )
                                                }
                                                onTouchEnd={() =>
                                                    handlePriceRangeChange(
                                                        priceRange
                                                    )
                                                }
                                                className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                            />
                                            <div
                                                className="absolute h-2 bg-blue-500 rounded-lg"
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
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            {[
                                                [0, 50],
                                                [50, 100],
                                                [100, 200],
                                                [200, 1000],
                                            ].map(([min, max], index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handlePriceRangeChange([
                                                            min,
                                                            max,
                                                        ])
                                                    }
                                                    className="text-black px-2 py-1 border rounded hover:bg-gray-50"
                                                >
                                                    {max === 1000
                                                        ? `Over RM${min}`
                                                        : `RM${min}-${max}`}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-6">
                                <button
                                    onClick={() =>
                                        toggleFilterSection("condition")
                                    }
                                    className="flex items-center justify-between w-full mb-3"
                                >
                                    <span className="font-semibold text-gray-900">
                                        Condition
                                    </span>
                                    {expandedFilters.condition ? (
                                        <Minus className="w-4 h-4" />
                                    ) : (
                                        <Plus className="w-4 h-4" />
                                    )}
                                </button>
                                {expandedFilters.condition && (
                                    <div className="space-y-2">
                                        {[
                                            "New",
                                            "Like New",
                                            "Used - Good",
                                            "Used - Fair",
                                            "Vintage",
                                        ].map((condition, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConditions.includes(
                                                        condition
                                                    )}
                                                    onChange={() =>
                                                        toggleCondition(
                                                            condition
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {condition}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                Apply Filters
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-green-600" />
                                    <span className="text-sm font-medium">
                                        Buyer Protection
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Truck className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium">
                                        Fast Shipping
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <ThumbsUp className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-medium">
                                        Verified Sellers
                                    </span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Section */}
                    <section className="flex-1">
                        {/* Results Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                        {searchQuery
                                            ? `Results for "${searchQuery}"`
                                            : "All Products"}
                                    </h2>
                                    <p className="text-sm text-gray-600">
                                        Showing {from}-{to} of {totalProducts}{" "}
                                        products
                                        {selectedCategories.length > 0 &&
                                            ` in ${
                                                selectedCategories.length
                                            } categor${
                                                selectedCategories.length === 1
                                                    ? "y"
                                                    : "ies"
                                            }`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Sort Dropdown */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) =>
                                            handleSortChange(e.target.value)
                                        }
                                        className="text-black border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="recommended">
                                            Recommended
                                        </option>
                                        <option value="newest">
                                            Newest First
                                        </option>
                                        <option value="price-low">
                                            Price: Low to High
                                        </option>
                                        <option value="price-high">
                                            Price: High to Low
                                        </option>
                                        <option value="rating">
                                            Highest Rated
                                        </option>
                                    </select>

                                    {/* Mobile Filters Button */}
                                    <button
                                        onClick={() =>
                                            setMobileFiltersOpen(true)
                                        }
                                        className="lg:hidden bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"
                                    >
                                        <Filter className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!loading && hasProducts ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <Link
                                        key={product.product_id}
                                        href={route(
                                            "product-details",
                                            product.product_id
                                        )}
                                        className="block transition-transform hover:scale-[1.02]"
                                    >
                                        <ProductCard
                                            product={product}
                                            isFlashSale={false}
                                        />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            !loading && (
                                <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        No products found
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Try adjusting your search or filter
                                        criteria
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            )
                        )}

                        {/* Pagination */}
                        {!loading && hasProducts && lastPage > 1 && (
                            <div className="flex justify-center mt-12">
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        className="text-black flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>

                                    {generatePageNumbers().map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`w-10 h-10 rounded-xl text-sm text-black font-medium transition-colors ${
                                                currentPage === page
                                                    ? "bg-blue-600 text-white"
                                                    : "border border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === lastPage}
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        className="text-black flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
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

            {/* Mobile Filters Modal */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setMobileFiltersOpen(false)}
                    />
                    <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Filters
                                </h3>
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            <div className="space-y-6 pb-6">
                                {/* Categories */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">
                                        Categories
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {list_categoryItem?.map(
                                            (category, index) => (
                                                <label
                                                    key={index}
                                                    className="flex items-center gap-3 p-2"
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
                                                        className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {category.category_name}
                                                    </span>
                                                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                        {
                                                            allProducts.filter(
                                                                (p) =>
                                                                    p.category
                                                                        ?.category_name ===
                                                                    category.category_name
                                                            ).length
                                                        }
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">
                                        Price Range
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>RM{priceRange[0]}</span>
                                            <span>RM{priceRange[1]}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <button
                                                onClick={() => {
                                                    setPriceRange([0, 50]);
                                                    setCurrentPage(1);
                                                }}
                                                className="px-2 py-1 border rounded hover:bg-gray-50"
                                            >
                                                Under RM50
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPriceRange([50, 100]);
                                                    setCurrentPage(1);
                                                }}
                                                className="px-2 py-1 border rounded hover:bg-gray-50"
                                            >
                                                RM50-100
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPriceRange([100, 200]);
                                                    setCurrentPage(1);
                                                }}
                                                className="px-2 py-1 border rounded hover:bg-gray-50"
                                            >
                                                RM100-200
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setPriceRange([200, 1000]);
                                                    setCurrentPage(1);
                                                }}
                                                className="px-2 py-1 border rounded hover:bg-gray-50"
                                            >
                                                Over RM200
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Condition Filter */}
                                <div>
                                    <h4 className="font-semibold mb-3 text-gray-900">
                                        Condition
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            "New",
                                            "Like New",
                                            "Used - Good",
                                            "Used - Fair",
                                            "Vintage",
                                        ].map((condition, index) => (
                                            <label
                                                key={index}
                                                className="flex items-center gap-3 p-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedConditions.includes(
                                                        condition
                                                    )}
                                                    onChange={() =>
                                                        toggleCondition(
                                                            condition
                                                        )
                                                    }
                                                    className="w-4 h-4 text-blue-600 rounded border-gray-300"
                                                />
                                                <span className="text-sm text-gray-700">
                                                    {condition}
                                                </span>
                                                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {
                                                        allProducts.filter(
                                                            (p) =>
                                                                p.product_condition ===
                                                                condition
                                                        ).length
                                                    }
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll to Top */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors z-40"
                >
                    <ChevronUp className="w-5 h-5" />
                </button>
            )}

            <Footer />
        </div>
    );
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
