import { useState, useEffect } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    FaSearch,
    FaFilter,
    FaEye,
    FaBan,
    FaExclamationTriangle,
    FaCheck,
    FaTimes,
    FaStore,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaEllipsisV,
    FaChevronLeft,
    FaChevronRight,
    FaChevronDown,
} from "react-icons/fa";
import { Sidebar } from "@/Components/AdminPage/Sidebar";
import axios from "axios";

export default function ProductManagement() {
    const { auth } = usePage().props;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState("");

    // Pagination state from database
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    // Add this to your component state
    const [actionReason, setActionReason] = useState("");

    // Stats state
    const [stats, setStats] = useState({
        flagged: 0,
        blocked: 0,
        lowRated: 0,
        active: 0,
    });

    const fetchProducts = async (
        page = 1,
        search = searchTerm,
        status = statusFilter,
        rating = ratingFilter
    ) => {
        setLoading(true);
        try {
            const params = {
                page,
                per_page: itemsPerPage,
                search,
                status: status !== "all" ? status : "",
                rating: rating !== "all" ? rating : "",
            };

            const response = await axios.get(route("get-all-products"), {
                params,
            });

            console.log("Products response:", response);

            const data = response.data.products;

            if (data && data.data) {
                setProducts(data.data);
                setCurrentPage(data.current_page);
                setTotalPages(data.last_page);
                setTotalProducts(data.total);
                setFrom(data.from || 0);
                setTo(data.to || 0);
            } else {
                setProducts([]);
                setTotalProducts(0);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(route("get-product-stats"));
            console.log("Stats response:", response.data);

            if (response.data) {
                setStats({
                    flagged: response.data.flagged || 0,
                    blocked: response.data.blocked || 0,
                    lowRated: response.data.lowRated || 0,
                    active: response.data.active || 0,
                });
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    // Debounced search and filter
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts(1, searchTerm, statusFilter, ratingFilter);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, statusFilter, ratingFilter, itemsPerPage]);

    const handleAction = (product, action) => {
        setSelectedProduct(product);
        setActionType(action);
        setShowModal(true);
    };

    const confirmAction = async () => {
        if (!selectedProduct) return;

        try {
            let endpoint;
            let method = "post";

            switch (actionType) {
                case "block":
                    endpoint = route(
                        "admin.products.block",
                        selectedProduct.product_id
                    );
                    break;
                case "unblock":
                    endpoint = route(
                        "admin.products.unblock",
                        selectedProduct.product_id
                    );
                    break;
                case "flag":
                    endpoint = route(
                        "admin.products.flag",
                        selectedProduct.product_id
                    );
                    break;
                default:
                    console.error("Unknown action type:", actionType);
                    return;
            }

            const response = await axios[method](endpoint, {
                reason: `Product ${actionType}ed by admin for policy violation`,
            });

            if (response.data.success) {
                // Show success message
                console.log(response.data.message);

                // Refresh the data
                fetchProducts(
                    currentPage,
                    searchTerm,
                    statusFilter,
                    ratingFilter
                );
                fetchStats();
            } else {
                console.error("Action failed:", response.data.error);
                // You can show an error toast here
            }

            setShowModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error performing action:", error);
            // Show error message to user
            setShowModal(false);
            setSelectedProduct(null);
        }
    };

    // Pagination controls
    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            fetchProducts(page, searchTerm, statusFilter, ratingFilter);
        }
    };

    const renderPaginationButtons = () => {
        const buttons = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        buttons.push(
            <button
                key="prev"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaChevronLeft className="w-4 h-4" />
            </button>
        );

        // First page
        if (startPage > 1) {
            buttons.push(
                <button
                    key={1}
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    1
                </button>
            );
            if (startPage > 2) {
                buttons.push(
                    <span key="ellipsis1" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-2 rounded-lg border ${
                        currentPage === i
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-300 text-gray-600 hover:bg-gray-50"
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                buttons.push(
                    <span key="ellipsis2" className="px-2 py-2 text-gray-500">
                        ...
                    </span>
                );
            }
            buttons.push(
                <button
                    key={totalPages}
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        buttons.push(
            <button
                key="next"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FaChevronRight className="w-4 h-4" />
            </button>
        );

        return buttons;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: { color: "bg-green-100 text-green-800", text: "Active" },
            flagged: {
                color: "bg-yellow-100 text-yellow-800",
                text: "Flagged",
            },
            blocked: { color: "bg-red-100 text-red-800", text: "Blocked" },
            draft: { color: "bg-gray-100 text-gray-800", text: "Draft" },
        };

        const config = statusConfig[status] || statusConfig.available;
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(
                    <FaStar key={i} className="text-yellow-400 w-3 h-3" />
                );
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(
                    <FaStarHalfAlt
                        key={i}
                        className="text-yellow-400 w-3 h-3"
                    />
                );
            } else {
                stars.push(
                    <FaRegStar key={i} className="text-yellow-400 w-3 h-3" />
                );
            }
        }

        return <div className="flex space-x-1">{stars}</div>;
    };

    const getRiskLevel = (product) => {
        const negativeReviews = product.negative_reviews_count || 0;
        const totalReviews = product.reviews_count || 1;
        const negativeRatio = negativeReviews / totalReviews;
        const averageRating = product.average_rating || 0;

        if (negativeRatio > 0.4 || averageRating < 2.0) return "high";
        if (negativeRatio > 0.2 || averageRating < 3.0) return "medium";
        return "low";
    };

    const getRiskBadge = (riskLevel) => {
        const riskConfig = {
            low: { color: "bg-green-100 text-green-800", text: "Low Risk" },
            medium: {
                color: "bg-yellow-100 text-yellow-800",
                text: "Medium Risk",
            },
            high: { color: "bg-red-100 text-red-800", text: "High Risk" },
        };

        const config = riskConfig[riskLevel] || riskConfig.low;
        return (
            <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
            >
                {config.text}
            </span>
        );
    };

    if (loading && products.length === 0) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-lg shadow p-4 md:p-6"
                                    >
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
                <div className="max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Product Management
                        </h1>
                        <p className="text-sm md:text-base text-gray-600">
                            Monitor and manage products, review quality issues,
                            and take necessary actions
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                        <div className="bg-white rounded-lg shadow p-4 md:p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FaExclamationTriangle className="text-blue-600 text-lg md:text-xl" />
                                </div>
                                <div className="ml-3 md:ml-4">
                                    <p className="text-xs md:text-sm font-medium text-gray-600">
                                        Flagged Products
                                    </p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                        {stats.flagged}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 md:p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FaBan className="text-red-600 text-lg md:text-xl" />
                                </div>
                                <div className="ml-3 md:ml-4">
                                    <p className="text-xs md:text-sm font-medium text-gray-600">
                                        Blocked Products
                                    </p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                        {stats.blocked}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 md:p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <FaStar className="text-yellow-600 text-lg md:text-xl" />
                                </div>
                                <div className="ml-3 md:ml-4">
                                    <p className="text-xs md:text-sm font-medium text-gray-600">
                                        Low Rated
                                    </p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                        {stats.lowRated}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-4 md:p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FaCheck className="text-green-600 text-lg md:text-xl" />
                                </div>
                                <div className="ml-3 md:ml-4">
                                    <p className="text-xs md:text-sm font-medium text-gray-600">
                                        Active Products
                                    </p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                        {stats.active}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow mb-4 md:mb-6 p-3 md:p-4">
                        <div className="flex flex-col lg:flex-row gap-3 md:gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products, sellers, or categories..."
                                        className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                                <select
                                    className="text-black w-32 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >
                                    <option value="all">All Status</option>
                                    <option value="available">Active</option>
                                    <option value="flagged">Flagged</option>
                                    <option value="blocked">Blocked</option>
                                </select>

                                <select
                                    className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm md:text-base"
                                    value={ratingFilter}
                                    onChange={(e) =>
                                        setRatingFilter(e.target.value)
                                    }
                                >
                                    <option value="all">All Ratings</option>
                                    <option value="low">Low (&lt; 2.5)</option>
                                    <option value="medium">
                                        Medium (2.5-4)
                                    </option>
                                    <option value="high">High (&gt; 4)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {/* Table Header with Pagination Info */}
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-sm text-gray-700">
                                {totalProducts > 0 ? (
                                    <>
                                        Showing{" "}
                                        <span className="font-medium">
                                            {from}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {to}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {totalProducts}
                                        </span>{" "}
                                        results
                                    </>
                                ) : (
                                    "No results found"
                                )}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-700">Show:</span>
                                <select
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                    className="text-black border border-gray-300 rounded px-2 py-1 w-14 text-sm"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <span className="text-gray-700">per page</span>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                                            Seller
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            Rating & Reviews
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Risk Level
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {products.map((product) => (
                                        <motion.tr
                                            key={product.product_id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                                                        {product.product_image &&
                                                        product.product_image
                                                            .length > 0 ? (
                                                            <img
                                                                src={
                                                                    import.meta
                                                                        .env
                                                                        .VITE_BASE_URL +
                                                                    product
                                                                        .product_image[0]
                                                                        .image_path
                                                                }
                                                                alt={
                                                                    product.product_name
                                                                }
                                                                className="h-full w-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-500 text-xs">
                                                                IMG
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-none">
                                                            {
                                                                product.product_name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500 sm:hidden">
                                                            {product.seller
                                                                ?.seller_name ||
                                                                "N/A"}
                                                        </div>
                                                        <div className="text-xs text-gray-500 md:hidden">
                                                            {product.average_rating?.toFixed(
                                                                1
                                                            ) || 0}{" "}
                                                            ★ (
                                                            {product.reviews_count ||
                                                                0}{" "}
                                                            reviews)
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                                                <div className="text-sm text-gray-900 flex items-center">
                                                    <FaStore className="mr-2 flex-shrink-0 text-gray-400" />
                                                    <span className="truncate max-w-[120px]">
                                                        {product.seller
                                                            ?.seller_name ||
                                                            "N/A"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="flex items-center space-x-2">
                                                    {renderStars(
                                                        product.average_rating ||
                                                            0
                                                    )}
                                                    <span className="text-sm text-gray-900">
                                                        {product.average_rating?.toFixed(
                                                            1
                                                        ) || 0}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {product.reviews_count || 0}{" "}
                                                    reviews
                                                    {product.negative_reviews_count >
                                                        0 && (
                                                        <span className="text-red-600 ml-1">
                                                            (
                                                            {
                                                                product.negative_reviews_count
                                                            }{" "}
                                                            negative)
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                {getRiskBadge(
                                                    getRiskLevel(product)
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                                                {getStatusBadge(
                                                    product.product_status
                                                )}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-1 md:space-x-2">
                                                    <Link
                                                        href={route(
                                                            "product-details",
                                                            product.product_id
                                                        )}
                                                        className="text-indigo-600 hover:text-indigo-900 p-1"
                                                        title="View Details"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </Link>

                                                    {product.product_status !==
                                                        "blocked" && (
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    product,
                                                                    "block"
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900 p-1"
                                                            title="Block Product"
                                                        >
                                                            <FaBan className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    {product.product_status ===
                                                        "blocked" && (
                                                        <button
                                                            onClick={() =>
                                                                handleAction(
                                                                    product,
                                                                    "unblock"
                                                                )
                                                            }
                                                            className="text-green-600 hover:text-green-900 p-1"
                                                            title="Unblock Product"
                                                        >
                                                            <FaCheck className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() =>
                                                            handleAction(
                                                                product,
                                                                "flag"
                                                            )
                                                        }
                                                        className="text-yellow-600 hover:text-yellow-900 p-1"
                                                        title="Flag as Fake"
                                                    >
                                                        <FaExclamationTriangle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {products.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">
                                    No products found
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Try adjusting your search or filter
                                    criteria.
                                </p>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalProducts > 0 && (
                            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <div className="text-sm text-gray-700">
                                        Page{" "}
                                        <span className="font-medium">
                                            {currentPage}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {totalPages}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        {renderPaginationButtons()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Confirmation Modal */}
                {showModal && selectedProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-lg max-w-md w-full p-6"
                        >
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Confirm{" "}
                                {actionType.charAt(0).toUpperCase() +
                                    actionType.slice(1)}
                            </h3>

                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to {actionType} the
                                product "
                                <strong>{selectedProduct.product_name}</strong>"
                                by{" "}
                                {selectedProduct.seller?.seller_name ||
                                    "the seller"}
                                ?
                            </p>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Reason (optional)
                                </label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    rows="3"
                                    placeholder="Enter reason for this action..."
                                    onChange={(e) =>
                                        setActionReason(e.target.value)
                                    }
                                />
                            </div>

                            {actionType === "block" && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                    <div className="flex">
                                        <FaExclamationTriangle className="text-yellow-400 mt-0.5 flex-shrink-0" />
                                        <div className="ml-3">
                                            <p className="text-sm text-yellow-800">
                                                Blocking this product will hide
                                                it from all users, prevent
                                                future purchases, and notify the
                                                seller via email.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmAction}
                                    className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
                                        actionType === "block"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : actionType === "flag"
                                            ? "bg-yellow-600 hover:bg-yellow-700"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    Confirm {actionType}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
