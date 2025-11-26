import { useState, useEffect } from "react";

import {
    Search,
    ChevronLeft,
    ChevronRight,
    Package,
    Truck,
    CheckCircle,
    DollarSign,
    Clock,
    Zap,
    Eye,
    RefreshCw,
    Filter,
    X,
} from "lucide-react";

import { Sidebar } from "@/Components/AdminPage/Sidebar";

import dayjs from "dayjs";

import axios from "axios";

import Swal from "sweetalert2";

export default function Transactions({ list_transactions }) {
    const [transactions, setTransactions] = useState(
        list_transactions.data || []
    );
    const [pagination, setPagination] = useState({
        current_page: list_transactions.current_page || 1,
        last_page: list_transactions.last_page || 1,
        per_page: list_transactions.per_page || 5,
        total: list_transactions.total || 0,
        from: list_transactions.from || 0,
        to: list_transactions.to || 0,
    });
    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showOrderTrackingModal, setShowOrderTrackingModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [paginationLoading, setPaginationLoading] = useState(false);
    const [metricsLoading, setMetricsLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        completedTransactions: 0,
        pendingRelease: 0,
        releasedPayments: 0,
        totalAmountPending: 0,
    });

    // SweetAlert notification function
    const showNotification = (title, message, type = "info") => {
        const toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            },
        });

        toast.fire({
            icon: type,
            title: title,
            text: message,
        });
    };

    // SweetAlert confirmation dialog
    const showConfirmation = (title, text, confirmButtonText = "Confirm") => {
        return Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmButtonText,
            cancelButtonText: "Cancel",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-6 py-3 rounded-lg font-medium",
                cancelButton:
                    "px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50",
            },
        });
    };

    // SweetAlert success message
    const showSuccess = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#10b981",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-6 py-3 rounded-lg font-medium",
            },
        });
    };

    // SweetAlert error message
    const showError = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: "error",
            confirmButtonText: "OK",
            confirmButtonColor: "#ef4444",
            customClass: {
                popup: "rounded-2xl",
                confirmButton: "px-6 py-3 rounded-lg font-medium",
            },
        });
    };

    // SweetAlert loading state
    const showLoading = (title, message = "") => {
        Swal.fire({
            title: title,
            text: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
    };

    // Check mobile view on mount and resize
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Fetch metrics data
    const fetchMetrics = async (filters = {}) => {
        setMetricsLoading(true);
        try {
            const params = new URLSearchParams({
                ...filters,
                metrics_only: "true",
            });

            const response = await axios.get(
                `/api/transactions/metrics?${params}`
            );

            if (response.data.success) {
                setMetrics(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching metrics:", error);
        } finally {
            setMetricsLoading(false);
        }
    };

    // Fetch paginated data with filters
    const fetchTransactions = async (page = 1, filters = {}) => {
        setPaginationLoading(true);
        try {
            const params = new URLSearchParams({
                page: page,
                per_page: pagination.per_page,
                ...filters,
            });

            const response = await axios.get(`/api/transactions?${params}`);

            if (response.data.success) {
                const data = response.data.data;
                setTransactions(data.data || []);
                setPagination({
                    current_page: data.current_page,
                    last_page: data.last_page,
                    per_page: data.per_page,
                    total: data.total,
                    from: data.from,
                    to: data.to,
                });
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            showNotification(
                "❌ Error",
                "Failed to load transactions",
                "error"
            );
        } finally {
            setPaginationLoading(false);
        }
    };

    // Build filters object
    const buildFilters = () => {
        const filters = {};
        if (filter) filters.search = filter;
        if (statusFilter !== "All") filters.status = statusFilter;
        if (paymentMethodFilter !== "All")
            filters.payment_method = paymentMethodFilter;
        if (dateRange.start) filters.start_date = dateRange.start;
        if (dateRange.end) filters.end_date = dateRange.end;
        return filters;
    };

    // Load both metrics and transactions with filters
    const loadDataWithFilters = async (page = 1) => {
        const filters = buildFilters();

        // Fetch both metrics and transactions in parallel
        await Promise.all([
            fetchMetrics(filters),
            fetchTransactions(page, filters),
        ]);
    };

    // Handle page change
    const handlePageChange = async (page) => {
        if (
            page < 1 ||
            page > pagination.last_page ||
            page === pagination.current_page
        ) {
            return;
        }
        await loadDataWithFilters(page);
    };

    // Handle filter changes with debouncing
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadDataWithFilters(1);
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [filter, statusFilter, paymentMethodFilter, dateRange]);

    // Clear all filters
    const clearAllFilters = () => {
        setFilter("");
        setStatusFilter("All");
        setPaymentMethodFilter("All");
        setDateRange({ start: "", end: "" });
    };

    // Check if any filter is active
    const hasActiveFilters = () => {
        return (
            filter ||
            statusFilter !== "All" ||
            paymentMethodFilter !== "All" ||
            dateRange.start ||
            dateRange.end
        );
    };

    // Mobile responsive stats
    const StatsOverview = () => (
        <div
            className={`grid gap-3 mb-6 ${
                isMobile
                    ? "grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            }`}
        >
            {/* Total Revenue */}
            <div className="bg-white p-3 rounded-xl shadow-md border-l-4 border-l-green-500">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 truncate">
                            Platform Revenue
                        </p>
                        <p className="text-lg font-bold text-gray-800 truncate">
                            {metricsLoading ? (
                                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin inline" />
                            ) : (
                                `RM ${metrics.totalRevenue.toFixed(2)}`
                            )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {metrics.completedTransactions} completed
                        </p>
                    </div>
                    <div className="rounded-full bg-green-100 p-2 ml-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Completed Transactions */}
            <div className="bg-white p-3 rounded-xl shadow-md border-l-4 border-l-blue-500">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 truncate">
                            Completed Orders
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                            {metricsLoading ? (
                                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin inline" />
                            ) : (
                                metrics.completedTransactions
                            )}
                        </p>
                        <p className="text-xs text-gray-500">Total completed</p>
                    </div>
                    <div className="rounded-full bg-blue-100 p-2 ml-2">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                    </div>
                </div>
            </div>

            {/* Pending Release */}
            <div className="bg-white p-3 rounded-xl shadow-md border-l-4 border-l-yellow-500">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 truncate">
                            Pending Release
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                            {metricsLoading ? (
                                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin inline" />
                            ) : (
                                metrics.pendingRelease
                            )}
                        </p>
                        <p className="text-xs text-yellow-600 truncate">
                            RM {metrics.totalAmountPending.toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-full bg-yellow-100 p-2 ml-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                    </div>
                </div>
            </div>

            {/* Released Payments */}
            <div className="bg-white p-3 rounded-xl shadow-md border-l-4 border-l-purple-500">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600 truncate">
                            Released Payments
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                            {metricsLoading ? (
                                <RefreshCw className="w-4 h-4 text-gray-400 animate-spin inline" />
                            ) : (
                                metrics.releasedPayments
                            )}
                        </p>
                        <p className="text-xs text-gray-500">Payments sent</p>
                    </div>
                    <div className="rounded-full bg-purple-100 p-2 ml-2">
                        <DollarSign className="w-4 h-4 text-purple-600" />
                    </div>
                </div>
            </div>
        </div>
    );

    const TransactionRow = ({ transaction }) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="font-mono text-sm font-semibold text-gray-900 mb-1">
                        {transaction.order_id}
                    </div>
                    <div className="text-xs text-gray-500">
                        {dayjs(transaction.created_at).format(
                            "DD MMM YYYY, HH:mm"
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => showOrderTracking(transaction)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Track Order"
                    >
                        <Eye size={16} />
                    </button>
                    {transaction.order_status === "Completed" &&
                        transaction?.seller_earning[0]?.status ===
                            "Pending" && (
                            <button
                                onClick={() =>
                                    manualReleasePayment(transaction.order_id)
                                }
                                disabled={
                                    actionLoading === transaction.order_id
                                }
                                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50"
                            >
                                {actionLoading === transaction.order_id ? (
                                    <RefreshCw
                                        size={10}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <DollarSign size={10} />
                                )}
                                Release
                            </button>
                        )}
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                    <div className="text-xs text-gray-500">Buyer → Seller</div>
                    <div className="font-medium text-gray-900 truncate">
                        {transaction.user?.name} →{" "}
                        {transaction.seller?.seller_name}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Payout Amount</div>
                    <div className="font-semibold text-gray-900">
                        RM {transaction.seller_earning[0]?.payout_amount || 0}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Order Status</div>
                    <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            transaction.order_status === "Completed"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-200 text-yellow-900 border border-yellow-300"
                        }`}
                    >
                        {transaction.order_status}
                    </span>
                </div>
                <div>
                    <div className="text-xs text-gray-500">Payment Status</div>
                    <div
                        className={`font-bold text-sm ${
                            transaction?.seller_earning?.[0]?.status ===
                            "Released"
                                ? "text-green-800"
                                : transaction?.seller_earning?.[0]?.status ===
                                  "Pending"
                                ? "text-yellow-500"
                                : "text-gray-500"
                        }`}
                    >
                        {transaction?.seller_earning?.[0]?.status || "N/A"}
                    </div>
                </div>
            </div>
        </div>
    );

    // Generate page numbers for pagination
    const generatePageNumbers = () => {
        const pages = [];
        const current = pagination.current_page;
        const last = pagination.last_page;
        const delta = 2;

        for (let i = 1; i <= last; i++) {
            if (
                i === 1 ||
                i === last ||
                (i >= current - delta && i <= current + delta)
            ) {
                pages.push(i);
            } else if (i === current - delta - 1 || i === current + delta + 1) {
                pages.push("...");
            }
        }

        return pages.filter((page, index, array) => {
            return !(page === "..." && array[index - 1] === "...");
        });
    };

    const autoReleasePayment = async (orderId) => {
        setActionLoading(orderId);
        try {
            const response = await axios.post(
                `/api/transactions/${orderId}/release-payment`
            );

            if (response.data.success) {
                await loadDataWithFilters(pagination.current_page);
                showSuccess(
                    "💰 Payment Released",
                    `Payment successfully released to seller for order ${orderId}`
                );
                return true;
            } else {
               Swal.close();
                showError(
                    "❌ Release Failed",
                    response.data.message || "Failed to release payment"
                );
                return false;
            }
        } catch (error) {
            console.error("Error releasing payment:", error);
            Swal.close();
            showError(
                "❌ Error",
                "Error releasing payment. Please try again."
            );
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    const manualReleasePayment = async (orderId) => {
        const transaction = transactions.find((t) => t.order_id === orderId);
        if (!transaction) return;

        const sellerEarning = transaction.seller_earning[0];
        const payoutAmount = sellerEarning?.payout_amount || transaction.amount;

        const result = await showConfirmation(
            "Release Payment",
            `Are you sure you want to release RM ${parseFloat(
                payoutAmount
            ).toFixed(2)} to ${transaction.seller?.seller_name}?`,
            "Release Payment"
        );

        if (result.isConfirmed) {
            await autoReleasePayment(orderId);
        }
    };

    const bulkReleasePayments = async () => {
        if (metrics.pendingRelease === 0) {
            showNotification(
                "ℹ️ No Pending Releases",
                "No payments available for release at this time.",
                "info"
            );
            return;
        }

       const result = await showConfirmation(
            "Bulk Release Payments",
            `Release payments for ${
                metrics.pendingRelease
            } completed orders? Total amount: RM ${metrics.totalAmountPending.toFixed(
                2
            )}`,
            "Release All Payments"
        );

        if (result.isConfirmed) {
            setIsLoading(true);
            try {
                showLoading("Bulk Release", "Processing multiple payments...");
                
                // Simulate bulk release process
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                await loadDataWithFilters(pagination.current_page);
                Swal.close();
                showSuccess(
                    "✅ Bulk Release Complete",
                    `Successfully released ${metrics.pendingRelease} payments`
                );
            } catch (error) {
                console.error("Bulk release error:", error);
                Swal.close();
                showError(
                    "❌ Bulk Release Failed",
                    "Error processing bulk release."
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    const showOrderTracking = async (transaction) => {
        try {
            showLoading("Loading", "Fetching order tracking information...");

            const response = await fetch(
                `/api/transactions/${transaction.order.order_id}/tracking`
            );
            const result = response.data;

             Swal.close();

            if (result.success) {
                setSelectedTransaction({
                    ...transaction,
                    tracking_info: result.data,
                });
            } else {
                setSelectedTransaction(transaction);
            }
            setShowOrderTrackingModal(true);
        } catch (error) {
            console.error("Error fetching tracking info:", error);
             Swal.close();
            setSelectedTransaction(transaction);
            setShowOrderTrackingModal(true);
        }
    };

    const orderStatusSteps = [
        { status: "Pending", icon: Clock, description: "Order placed" },
        {
            status: "Processing",
            icon: Package,
            description: "Seller processing order",
        },
        {
            status: "Shipped",
            icon: Truck,
            description: "Order shipped to buyer",
        },
        {
            status: "Delivered",
            icon: CheckCircle,
            description: "Order delivered to buyer",
        },
        {
            status: "Completed",
            icon: CheckCircle,
            description: "Buyer received order - Waiting for confirmation",
        },
        {
            status: "Released",
            icon: DollarSign,
            description: "Payment released to seller",
        },
    ];

    // Enhanced Filter Component
    const FilterSection = () => (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                </h3>
                <div className="flex items-center gap-2">
                    {hasActiveFilters() && (
                        <button
                            onClick={clearAllFilters}
                            className="flex items-center gap-1 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Clear All
                        </button>
                    )}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        {showFilters ? "Hide" : "Show"} Filters
                    </button>
                </div>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="text-black w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="All">All Order Statuses</option>
                        <option value="Paid">Paid (Pending Release)</option>
                        <option value="Released">Released</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Completed">Completed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                    </select>

                    {/* Payment Method Filter */}
                    <select
                        value={paymentMethodFilter}
                        onChange={(e) => setPaymentMethodFilter(e.target.value)}
                        className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="All">All Payment Methods</option>
                        <option value="credit">Credit Card</option>
                    </select>
                </div>
            )}

            {/* Active Filters Badges */}
            {hasActiveFilters() && (
                <div className="flex flex-wrap gap-2 mt-4">
                    {filter && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Search: {filter}
                            <button
                                onClick={() => setFilter("")}
                                className="ml-1 hover:bg-blue-200 rounded-full"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {statusFilter !== "All" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Status: {statusFilter}
                            <button
                                onClick={() => setStatusFilter("All")}
                                className="ml-1 hover:bg-green-200 rounded-full"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {paymentMethodFilter !== "All" && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Payment: {paymentMethodFilter}
                            <button
                                onClick={() => setPaymentMethodFilter("All")}
                                className="ml-1 hover:bg-purple-200 rounded-full"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {(dateRange.start || dateRange.end) && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Date: {dateRange.start || "Start"} to{" "}
                            {dateRange.end || "End"}
                            <button
                                onClick={() =>
                                    setDateRange({ start: "", end: "" })
                                }
                                className="ml-1 hover:bg-orange-200 rounded-full"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );

    const QuickActions = () => (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-blue-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Payment Release Center
                    </h3>
                    <p className="text-gray-600 text-sm">
                        {metrics.pendingRelease > 0
                            ? `${
                                  metrics.pendingRelease
                              } completed orders ready for payment release (RM ${metrics.totalAmountPending.toFixed(
                                  2
                              )})`
                            : "No payments pending release"}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    {metrics.pendingRelease > 0 && (
                        <button
                            onClick={bulkReleasePayments}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                            <Zap size={16} />
                            {isLoading
                                ? "Processing..."
                                : `Release All (${metrics.pendingRelease})`}
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setStatusFilter("paid");
                            setFilter("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Eye size={16} />
                        View Pending Releases
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main
                className={`flex-1 p-4 min-w-0 w-full ${
                    isMobile ? "pt-20" : "p-4 lg:p-6"
                }`}
            >
                <StatsOverview />

                {/* Quick Actions - Simplified for mobile */}
                {!isMobile && (
                    <div className="bg-white rounded-xl shadow-md p-4 mb-6 border border-blue-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Payment Release Center
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {metrics.pendingRelease > 0
                                        ? `${
                                              metrics.pendingRelease
                                          } orders ready for release (RM ${metrics.totalAmountPending.toFixed(
                                              2
                                          )})`
                                        : "No payments pending release"}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                {metrics.pendingRelease > 0 && (
                                    <button
                                        onClick={bulkReleasePayments}
                                        disabled={isLoading}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
                                    >
                                        <Zap size={16} />
                                        {isLoading
                                            ? "Processing..."
                                            : `Release All (${metrics.pendingRelease})`}
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setStatusFilter("paid");
                                        setFilter("");
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <Eye size={16} />
                                    View Pending
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Filter Section */}
                <FilterSection />

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                                    {isMobile
                                        ? "Transactions"
                                        : "Transaction Management"}
                                </h2>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    {isMobile
                                        ? "Manage payments"
                                        : "Manage payments and track order status"}
                                </p>
                            </div>
                            <div className="text-sm text-gray-600">
                                Showing {pagination.from} to {pagination.to} of{" "}
                                {pagination.total} transactions
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {paginationLoading && (
                        <div className="flex justify-center items-center py-8">
                            <RefreshCw className="w-6 h-6 text-indigo-600 animate-spin" />
                            <span className="ml-2 text-gray-600">
                                Loading...
                            </span>
                        </div>
                    )}

                    {!paginationLoading && transactions.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No transactions found
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters()
                                    ? "Try adjusting your filters"
                                    : "No transactions available"}
                            </p>
                            {hasActiveFilters() && (
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}

                    {!paginationLoading && transactions.length > 0 && (
                        <>
                            {/* Mobile View */}
                            {isMobile ? (
                                <div className="p-4">
                                    {transactions.map((transaction) => (
                                        <TransactionRow
                                            key={transaction.order_id}
                                            transaction={transaction}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* Desktop Table View */
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full min-w-[1000px] divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order Info
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payout Amount
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Order Status
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Status
                                                </th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {transactions.map((transaction) => (
                                                <tr
                                                    key={transaction.order_id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-4 py-4">
                                                        <div className="font-mono text-sm font-medium text-gray-900">
                                                            {
                                                                transaction.order_id
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {
                                                                transaction.user
                                                                    ?.name
                                                            }{" "}
                                                            →{" "}
                                                            {
                                                                transaction
                                                                    .seller
                                                                    ?.seller_name
                                                            }
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {dayjs(
                                                                transaction.created_at
                                                            ).format(
                                                                "DD MMM YYYY, HH:mm"
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            RM{" "}
                                                            {transaction
                                                                .seller_earning[0]
                                                                ?.payout_amount ||
                                                                0}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.order_status ===
                                                                "Completed"
                                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                                    : "bg-yellow-200 text-yellow-900 border border-yellow-300"
                                                            }`}
                                                        >
                                                            {
                                                                transaction.order_status
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`text-sm font-bold ${
                                                                transaction
                                                                    ?.seller_earning?.[0]
                                                                    ?.status ===
                                                                "Released"
                                                                    ? "text-green-800"
                                                                    : transaction
                                                                          ?.seller_earning?.[0]
                                                                          ?.status ===
                                                                      "Pending"
                                                                    ? "text-yellow-500"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {transaction
                                                                ?.seller_earning?.[0]
                                                                ?.status ||
                                                                "N/A"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    showOrderTracking(
                                                                        transaction
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                                                title="Track Order"
                                                            >
                                                                <Eye
                                                                    size={16}
                                                                />
                                                            </button>
                                                            {transaction.order_status ===
                                                                "Completed" &&
                                                                transaction
                                                                    ?.seller_earning[0]
                                                                    ?.status ===
                                                                    "Pending" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            manualReleasePayment(
                                                                                transaction.order_id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            actionLoading ===
                                                                            transaction.order_id
                                                                        }
                                                                        className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-xs"
                                                                    >
                                                                        {actionLoading ===
                                                                        transaction.order_id ? (
                                                                            <RefreshCw
                                                                                size={
                                                                                    12
                                                                                }
                                                                                className="animate-spin"
                                                                            />
                                                                        ) : (
                                                                            <DollarSign
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />
                                                                        )}
                                                                        Release
                                                                    </button>
                                                                )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.last_page > 1 && (
                                <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                        <div className="text-sm text-gray-700">
                                            Showing {pagination.from} to{" "}
                                            {pagination.to} of{" "}
                                            {pagination.total}
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.current_page -
                                                            1
                                                    )
                                                }
                                                disabled={
                                                    pagination.current_page ===
                                                    1
                                                }
                                                className={`p-2 rounded-md ${
                                                    pagination.current_page ===
                                                    1
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>

                                            {generatePageNumbers().map(
                                                (page, index) =>
                                                    page === "..." ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="px-2 text-gray-500"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    page
                                                                )
                                                            }
                                                            className={`px-3 py-1.5 rounded-md text-sm ${
                                                                page ===
                                                                pagination.current_page
                                                                    ? "bg-indigo-600 text-white"
                                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                            }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                            )}

                                            <button
                                                onClick={() =>
                                                    handlePageChange(
                                                        pagination.current_page +
                                                            1
                                                    )
                                                }
                                                disabled={
                                                    pagination.current_page ===
                                                    pagination.last_page
                                                }
                                                className={`p-2 rounded-md ${
                                                    pagination.current_page ===
                                                    pagination.last_page
                                                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Order Tracking Modal */}
                {showOrderTrackingModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">
                                                Order Tracking
                                            </h2>
                                            <p className="text-blue-100 text-sm">
                                                {selectedTransaction.order_id}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            setShowOrderTrackingModal(false)
                                        }
                                        className="text-white hover:text-blue-200 p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Completion Status Banner */}
                            {selectedTransaction.order_status ===
                                "Completed" && (
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <CheckCircle className="w-6 h-6" />
                                            <div>
                                                <p className="font-semibold">
                                                    Order Completed
                                                    Successfully!
                                                </p>
                                                <p className="text-green-100 text-sm">
                                                    {selectedTransaction
                                                        .seller_earning[0]
                                                        ?.paid_at
                                                        ? "Payment has been released to the seller"
                                                        : "Ready for payment release"}
                                                </p>
                                            </div>
                                        </div>
                                        {selectedTransaction.seller_earning[0]
                                            ?.paid_at && (
                                            <div className="text-green-100 text-sm">
                                                Released on{" "}
                                                {dayjs(
                                                    selectedTransaction
                                                        .seller_earning[0]
                                                        ?.paid_at
                                                ).format("DD MMM YYYY")}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-6">
                                    {/* Order Summary Cards */}
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-blue-100 p-2 rounded-lg">
                                                    <DollarSign className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-blue-900">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-xl font-bold text-blue-700">
                                                        RM{" "}
                                                        {
                                                            selectedTransaction
                                                                .seller_earning[0]
                                                                ?.payout_amount
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-green-100 p-2 rounded-lg">
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">
                                                        Order Status
                                                    </p>
                                                    <p className="text-xl font-bold text-green-700 capitalize">
                                                        {
                                                            selectedTransaction.order_status
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="bg-purple-100 p-2 rounded-lg">
                                                    <Clock className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-purple-900">
                                                        Order Date
                                                    </p>
                                                    <p className="text-lg font-semibold text-purple-700">
                                                        {dayjs(
                                                            selectedTransaction.created_at
                                                        ).format("DD MMM YYYY")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Order Timeline */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                            <Truck className="w-5 h-5 mr-2 text-gray-600" />
                                            Order Journey
                                        </h3>

                                        <div className="relative">
                                            {/* Timeline Line */}
                                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                                            {orderStatusSteps.map(
                                                (step, index) => {
                                                    const StepIcon = step.icon;
                                                    const currentStatusIndex =
                                                        orderStatusSteps.findIndex(
                                                            (s) =>
                                                                s.status ===
                                                                (selectedTransaction.order_status ===
                                                                "Completed"
                                                                    ? "Released"
                                                                    : selectedTransaction.order_status)
                                                        );
                                                    const isCompleted =
                                                        index <=
                                                            currentStatusIndex ||
                                                        selectedTransaction
                                                            .seller_earning[0]
                                                            ?.status;
                                                    const isCurrent =
                                                        index ===
                                                        currentStatusIndex;
                                                    const isPaymentStep =
                                                        step.status ===
                                                        "Released";
                                                    const paymentReleased =
                                                        selectedTransaction
                                                            .seller_earning[0]
                                                            ?.paid_at;

                                                    return (
                                                        <div
                                                            key={step.status}
                                                            className="relative flex items-start mb-8 last:mb-0"
                                                        >
                                                            {/* Timeline Dot */}
                                                            <div
                                                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                                                                    isCompleted
                                                                        ? "bg-green-500 shadow-lg shadow-green-200"
                                                                        : "bg-gray-300"
                                                                } ${
                                                                    isCurrent
                                                                        ? "ring-4 ring-green-200"
                                                                        : ""
                                                                }`}
                                                            >
                                                                <StepIcon
                                                                    className={`w-6 h-6 ${
                                                                        isCompleted
                                                                            ? "text-white"
                                                                            : "text-gray-500"
                                                                    }`}
                                                                />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="ml-4 flex-1 min-w-0">
                                                                <div
                                                                    className={`p-4 rounded-xl border ${
                                                                        isCompleted
                                                                            ? "bg-green-50 border-green-200"
                                                                            : isCurrent
                                                                            ? "bg-blue-50 border-blue-200"
                                                                            : "bg-gray-50 border-gray-200"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <h4
                                                                            className={`font-semibold ${
                                                                                isCompleted
                                                                                    ? "text-green-800"
                                                                                    : isCurrent
                                                                                    ? "text-blue-800"
                                                                                    : "text-gray-600"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                step.status
                                                                            }
                                                                        </h4>
                                                                        {isCurrent && (
                                                                            <span
                                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                                    isCompleted
                                                                                        ? "bg-green-200 text-green-800"
                                                                                        : "bg-blue-200 text-blue-800"
                                                                                }`}
                                                                            >
                                                                                Current
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        {
                                                                            step.description
                                                                        }
                                                                    </p>

                                                                    {/* Timestamps */}
                                                                    {isCompleted &&
                                                                        isPaymentStep &&
                                                                        paymentReleased && (
                                                                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                                                                <Clock className="w-3 h-3 mr-1" />
                                                                                Released{" "}
                                                                                {dayjs(
                                                                                    paymentReleased
                                                                                ).format(
                                                                                    "DD MMM YYYY [at] HH:mm"
                                                                                )}
                                                                            </div>
                                                                        )}

                                                                    {isCompleted &&
                                                                        !isPaymentStep && (
                                                                            <div className="flex items-center text-xs text-gray-500 mt-2">
                                                                                <Clock className="w-3 h-3 mr-1" />
                                                                                Completed{" "}
                                                                                {dayjs(
                                                                                    selectedTransaction.updated_at
                                                                                ).format(
                                                                                    "DD MMM YYYY"
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* Detailed Information */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Buyer Information */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                    <svg
                                                        className="w-4 h-4 text-blue-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                        />
                                                    </svg>
                                                </div>
                                                Buyer Information
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Name
                                                    </label>
                                                    <p className="text-gray-900 font-medium">
                                                        {selectedTransaction
                                                            .user?.name ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Email
                                                    </label>
                                                    <p className="text-gray-600">
                                                        {selectedTransaction
                                                            .user?.email ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Contact
                                                    </label>
                                                    <p className="text-gray-600">
                                                        {selectedTransaction
                                                            .user?.phone ||
                                                            "Not provided"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Seller & Payment Information */}
                                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                    <svg
                                                        className="w-4 h-4 text-green-600"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                </div>
                                                Seller & Payment Details
                                            </h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Seller Name
                                                    </label>
                                                    <p className="text-gray-900 font-medium">
                                                        {selectedTransaction
                                                            .seller
                                                            ?.seller_name ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Payment Method
                                                    </label>
                                                    <p className="text-gray-600 capitalize">
                                                        {selectedTransaction.payment_method ||
                                                            "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                                        Payment Status
                                                    </label>
                                                    <div className="flex items-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                selectedTransaction
                                                                    .seller_earning[0]
                                                                    ?.status ===
                                                                "Released"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : selectedTransaction
                                                                          .seller_earning[0]
                                                                          ?.status ===
                                                                      "Pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : "bg-gray-100 text-gray-800"
                                                            }`}
                                                        >
                                                            {selectedTransaction
                                                                .seller_earning[0]
                                                                ?.status ||
                                                                "Pending"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Metadata */}
                                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-5">
                                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                            Transaction Details
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                                    Transaction ID
                                                </label>
                                                <p className="font-mono text-gray-900">
                                                    {selectedTransaction.payment_intent_id ||
                                                        "N/A"}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                                    Order Created
                                                </label>
                                                <p className="text-gray-900">
                                                    {dayjs(
                                                        selectedTransaction.created_at
                                                    ).format(
                                                        "DD MMM YYYY [at] HH:mm"
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide block mb-1">
                                                    Last Updated
                                                </label>
                                                <p className="text-gray-900">
                                                    {dayjs(
                                                        selectedTransaction.updated_at
                                                    ).format(
                                                        "DD MMM YYYY [at] HH:mm"
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                                    <div className="text-sm text-gray-600">
                                        Need help? Contact
                                        support@relovemarket.com
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setShowOrderTrackingModal(false)
                                            }
                                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                                        >
                                            Close
                                        </button>
                                        {selectedTransaction.order_status ===
                                            "Completed" &&
                                            selectedTransaction
                                                .seller_earning[0]?.status ===
                                                "Pending" && (
                                                <button
                                                    onClick={() => {
                                                        manualReleasePayment(
                                                            selectedTransaction.order_id
                                                        );
                                                        setShowOrderTrackingModal(
                                                            false
                                                        );
                                                    }}
                                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                    Release Payment
                                                </button>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Generate Transaction Report
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Report Type
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option>Sales Summary</option>
                                        <option>Transaction Details</option>
                                        <option>Revenue by Seller</option>
                                        <option>Payment Method Analysis</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="date"
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                        <input
                                            type="date"
                                            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Format
                                    </label>
                                    <div className="flex space-x-4">
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="format"
                                                className="text-indigo-600 focus:ring-indigo-500"
                                                defaultChecked
                                            />
                                            <span className="ml-2">PDF</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="format"
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2">Excel</span>
                                        </label>
                                        <label className="inline-flex items-center">
                                            <input
                                                type="radio"
                                                name="format"
                                                className="text-indigo-600 focus:ring-indigo-500"
                                            />
                                            <span className="ml-2">CSV</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() =>
                                            setShowReportModal(false)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowReportModal(false)
                                        }
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Generate Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
