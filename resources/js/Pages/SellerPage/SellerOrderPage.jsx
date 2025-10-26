import React, { useEffect, useState } from "react";
import {
    Search,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Download,
    Printer,
    Package,
    ChevronDown,
    ChevronUp,
    BarChart3,
    RefreshCw,
    X,
} from "lucide-react";
import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import axios from "axios";
import dayjs from "dayjs";
import { usePage } from "@inertiajs/react";
import { OrderDetails } from "@/Components/SellerPage/SellerOrderPage/OrderDetails";

export default function SellerOrderPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showStatusDropdown, setShowStatusDropdown] = useState(null);

    const [viewOrder, setViewOrder] = useState(false);

    const [isSearchMode, setIsSearchMode] = useState(false);
    const [allSearchResults, setAllSearchResults] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const [orders, setOrders] = useState([]);
    const [newOrders, setNewOrders] = useState(new Set());
    const [statusCounts, setStatusCounts] = useState({
        All: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
    });

    const [totalAmounts, setTotalAmounts] = useState({
        All: 0,
        Processing: 0,
        Shipped: 0,
        Delivered: 0,
        Cancelled: 0,
    });

    const { auth } = usePage().props;

    // Real-time updates
    useEffect(() => {
        if (!auth?.user?.seller_id || !window.Echo) return;

        const channel = window.Echo.private(
            `seller.orders.${auth.user.seller_id}`
        );

        channel.listen(".new.order.created", (e) => {
            console.log(e.order);
            const orderId = e.order.order_id;
            setNewOrders((prev) => {
                const newSet = new Set(prev);
                newSet.add(orderId);
                return newSet;
            });

            if (currentPage === 1) {
                fetchOrders(1, searchTerm, statusFilter, sortBy, sortOrder);
            } else {
                showNotification(
                    `🆕 New order received! Check page 1 to view it.`
                );
            }
            showNotification("🆕 New order received! Check it out!");
        });

        return () => {
            channel.stopListening(".new.order.created");
            window.Echo.leaveChannel(`seller.orders.${auth.user.seller_id}`);
        };
    }, [
        auth?.user?.seller_id,
        currentPage,
        searchTerm,
        statusFilter,
        sortBy,
        sortOrder,
    ]);

    // Remove new order badges after 30 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setNewOrders((prev) => {
                if (prev.size === 0) return prev;
                const newSet = new Set(prev);
                newSet.clear();
                return newSet;
            });
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    const showNotification = (message) => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("New Order Received", {
                body: message,
                icon: "/icon.png",
            });
        }
        console.log("Notification:", message);
    };

    const fetchOrders = async (
        page = currentPage,
        search = searchTerm,
        status = statusFilter,
        sort = sortBy,
        order = sortOrder
    ) => {
        try {
            setIsLoading(true);
            const response = await axios.get("/api/get-list-order", {
                params: {
                    page: page,
                    search: search,
                    status: status !== "All" ? status : "",
                    sort: sort,
                    order: order,
                },
                headers: {
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
            });

            const responseData = response.data;

            if (!responseData.success) {
                throw new Error(
                    responseData.message || "Failed to fetch orders"
                );
            }

            // If it's a search with all results, store them and do client-side pagination
            if (responseData.is_search && responseData.last_page === 1) {
                setAllSearchResults(responseData.data || []);
                setIsSearchMode(true);

                // Calculate paginated results client-side
                const startIndex = (currentPage - 1) * 5;
                const endIndex = startIndex + 5;
                const paginatedResults = responseData.data.slice(
                    startIndex,
                    endIndex
                );

                setOrders(paginatedResults);

                setPagination({
                    from: startIndex + 1,
                    to: Math.min(endIndex, responseData.data.length),
                    total: responseData.data.length,
                    current_page: currentPage,
                    last_page: Math.ceil(responseData.data.length / 5),
                });
            } else {
                // Normal paginated response
                setAllSearchResults([]);
                setIsSearchMode(false);
                setOrders(responseData.data || []);

                setPagination({
                    from: responseData.from || 1,
                    to: responseData.to || 0,
                    total: responseData.total || 0,
                    current_page: responseData.current_page || 1,
                    last_page: responseData.last_page || 1,
                });
            }

            setLastPage(responseData.last_page || 1);
            calculateStatusStats(responseData.data || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Update your search effect to handle search mode
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            fetchOrders(1, searchTerm, statusFilter, sortBy, sortOrder);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const calculateStatusStats = (ordersData) => {
        const counts = {
            All: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0,
        };

        const amounts = {
            All: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0,
        };

        ordersData.forEach((order) => {
            const status = order.order_status || "Processing";
            const amount = parseFloat(order.total_amount || order.amount || 0);

            counts.All++;
            counts[status] = (counts[status] || 0) + 1;

            amounts.All += amount;
            amounts[status] = (amounts[status] || 0) + amount;
        });

        setStatusCounts(counts);
        setTotalAmounts(amounts);
    };

    // Initial fetch and search effects
    useEffect(() => {
        fetchOrders(1);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setCurrentPage(1);
            fetchOrders(1, searchTerm, statusFilter, sortBy, sortOrder);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    useEffect(() => {
        setCurrentPage(1);
        fetchOrders(1, searchTerm, statusFilter, sortBy, sortOrder);
    }, [statusFilter, sortBy, sortOrder]);

    // Pagination controls
    const nextPage = () => {
        if (currentPage < pagination.last_page) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);

            if (isSearchMode && allSearchResults.length > 0) {
                // Client-side pagination for search results
                const startIndex = (nextPage - 1) * 5;
                const endIndex = startIndex + 5;
                const paginatedResults = allSearchResults.slice(
                    startIndex,
                    endIndex
                );

                setOrders(paginatedResults);

                setPagination((prev) => ({
                    ...prev,
                    from: startIndex + 1,
                    to: Math.min(endIndex, allSearchResults.length),
                    current_page: nextPage,
                }));
            } else {
                // Server-side pagination
                fetchOrders(
                    nextPage,
                    searchTerm,
                    statusFilter,
                    sortBy,
                    sortOrder
                );
            }
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const prevPage = currentPage - 1;
            setCurrentPage(prevPage);

            if (isSearchMode && allSearchResults.length > 0) {
                // Client-side pagination for search results
                const startIndex = (prevPage - 1) * 5;
                const endIndex = startIndex + 5;
                const paginatedResults = allSearchResults.slice(
                    startIndex,
                    endIndex
                );

                setOrders(paginatedResults);

                setPagination((prev) => ({
                    ...prev,
                    from: startIndex + 1,
                    to: Math.min(endIndex, allSearchResults.length),
                    current_page: prevPage,
                }));
            } else {
                // Server-side pagination
                fetchOrders(
                    prevPage,
                    searchTerm,
                    statusFilter,
                    sortBy,
                    sortOrder
                );
            }
        }
    };

    const goToPage = (page) => {
        if (page !== "...") {
            setCurrentPage(page);
            fetchOrders(page, searchTerm, statusFilter, sortBy, sortOrder);
        }
    };

    // Enhanced Status Dropdown with Database Update
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            setShowStatusDropdown(null);

            // Remove new order badge when status is updated
            setNewOrders((prev) => {
                const newSet = new Set(prev);
                newSet.delete(orderId);
                return newSet;
            });

            // Optimistic update - immediately update the UI
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.order_id === orderId
                        ? { ...order, order_status: newStatus }
                        : order
                )
            );

            // Update status counts optimistically
            setStatusCounts((prev) => {
                const oldStatus = orders.find(
                    (order) => order.order_id === orderId
                )?.order_status;
                const newCounts = { ...prev };

                if (oldStatus && oldStatus !== "All") {
                    newCounts[oldStatus] = Math.max(
                        0,
                        (newCounts[oldStatus] || 0) - 1
                    );
                }
                if (newStatus !== "All") {
                    newCounts[newStatus] = (newCounts[newStatus] || 0) + 1;
                }
                return newCounts;
            });

            // API call to update database
            const response = await axios.put(
                `/api/update-order/${orderId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            console.log(response);

            if (!response.data.success) {
                // Revert if failed
                fetchOrders(
                    currentPage,
                    searchTerm,
                    statusFilter,
                    sortBy,
                    sortOrder
                );
                console.error("Failed to update order status");
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            // Revert on error
            fetchOrders(
                currentPage,
                searchTerm,
                statusFilter,
                sortBy,
                sortOrder
            );
        }
    };

    // Enhanced Status Dropdown Component
    const StatusDropdown = ({ order, onStatusUpdate }) => {
        const statusOptions = [
            {
                value: "Pending",
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
            },
            {
                value: "Processing",
                label: "Processing",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: RefreshCw,
            },
            {
                value: "Shipped",
                label: "Shipped",
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: Truck,
            },
            {
                value: "Delivered",
                label: "Delivered",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            },
            {
                value: "Cancelled",
                label: "Cancelled",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            },
        ];

        const currentStatus = statusOptions.find(
            (s) => s.value === order.order_status
        );

        return (
            <div className="relative">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowStatusDropdown(
                            showStatusDropdown === order.order_id
                                ? null
                                : order.order_id
                        );
                    }}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:shadow-sm ${
                        currentStatus?.color ||
                        "bg-gray-100 text-gray-800 border-gray-200"
                    } min-w-[100px] justify-between`}
                >
                    <span className="truncate">{order.order_status}</span>
                    <ChevronDown
                        size={14}
                        className={`ml-1 transition-transform duration-200 ${
                            showStatusDropdown === order.order_id
                                ? "rotate-180"
                                : ""
                        }`}
                    />
                </button>

                {showStatusDropdown === order.order_id && (
                    <div
                        className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px] max-w-[200px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {statusOptions.map((status) => {
                            const IconComponent = status.icon;
                            return (
                                <button
                                    key={status.value}
                                    onClick={() =>
                                        onStatusUpdate(
                                            order.order_id,
                                            status.value
                                        )
                                    }
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 flex items-center gap-2 ${
                                        order.order_status === status.value
                                            ? "bg-gray-100 font-medium text-gray-900"
                                            : "text-gray-700"
                                    } first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0`}
                                    disabled={
                                        order.order_status === status.value
                                    }
                                >
                                    <IconComponent size={14} />
                                    <span className="truncate">
                                        {status.label}
                                    </span>
                                    {order.order_status === status.value && (
                                        <CheckCircle
                                            size={14}
                                            className="ml-auto text-green-500"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    // Simple Clock icon component for Pending status
    const Clock = (props) => (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );

    const printOrder = (order) => {
        console.log(order);
        const printContent = `
        <html>
            <head>
                <title>Order Invoice - ${order.order_id}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f5f5f5; }
                    .total { font-weight: bold; font-size: 1.1em; }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ORDER INVOICE</h1>
                    <h2>Order ID: ${order.order_id}</h2>
                </div>
                
                <div class="section">
                    <div class="section-title">Order Information</div>
                    <p><strong>Order Date:</strong> ${dayjs(
                        order.created_at
                    ).format("DD MMM YYYY, hh:mm A")}</p>
                    <p><strong>Status:</strong> ${order.order_status}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">Customer Information</div>
                    <p><strong>Name:</strong> ${order.user?.name || "N/A"}</p>
                    <p><strong>Email:</strong> ${order.user?.email || "N/A"}</p>
                </div>
                
                <div class="section">
                    <div class="section-title">Order Items</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price (RM)</th>
                                <th>Quantity</th>
                                <th>Total (RM)</th>
                            </tr>
                        </thead>
                        <tbody>
                        ${order.order_items
                            .map(
                                (product) => `
                        <tr>
                            <td>${product.product?.product_name || "N/A"}</td>
                            <td>${parseFloat(product.price || 0).toFixed(
                                2
                            )}</td>
                            <td>${product.quantity || 1}</td>
                            <td>${order.amount}</td>
                        </tr>
                    `
                            )
                            .join("")}
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <div class="section-title">Order Summary</div>
                    <table>
                        <tr>
                            <td><strong>Subtotal:</strong></td>
                            <td>RM ${parseFloat(
                                order.total_amount || order.amount || 0
                            ).toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Shipping:</strong></td>
                            <td>RM 0.00</td>
                        </tr>
                        <tr class="total">
                            <td><strong>Total:</strong></td>
                            <td>RM ${parseFloat(
                                order.total_amount || order.amount || 0
                            ).toFixed(2)}</td>
                        </tr>
                    </table>
                </div>
                
                <div class="no-print" style="margin-top: 30px; text-align: center;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Print Invoice
                    </button>
                    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                        Close
                    </button>
                </div>
                
                <script>
                    window.onload = function() {
                        window.print();
                    };
                </script>
            </body>
        </html>
    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        setNewOrders(new Set());
        fetchOrders();
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const current = pagination.current_page || currentPage;
        const last = pagination.last_page || lastPage;

        if (last <= 1) return [1];
        if (last <= maxVisiblePages) {
            for (let i = 1; i <= last; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, current - 2);
            const endPage = Math.min(last, current + 2);

            if (startPage > 1) pages.push(1);
            if (startPage > 2) pages.push("...");

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < last - 1) pages.push("...");
            if (endPage < last) pages.push(last);
        }

        return pages;
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setShowStatusDropdown(null);
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar />
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-3 sm:p-4 lg:p-6 lg:ml-0 min-w-0">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 sm:mb-6">
                    <div className="flex items-center gap-3 mb-3 lg:mb-0">
                        <div className="min-w-0 flex-1">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                Order Management
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                Manage and track your customer orders
                            </p>
                        </div>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing || isLoading}
                            className="flex-shrink-0 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                        >
                            <RefreshCw
                                size={16}
                                className={isRefreshing ? "animate-spin" : ""}
                            />
                            <span className="hidden xs:inline">
                                {isRefreshing ? "Refreshing..." : "Refresh"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Cards - Enhanced Responsive Grid */}
                <div className="mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                        {[
                            { status: "All", label: "Total", color: "gray" },
                            {
                                status: "Processing",
                                label: "Processing",
                                color: "blue",
                            },
                            {
                                status: "Shipped",
                                label: "Shipped",
                                color: "purple",
                            },
                            {
                                status: "Delivered",
                                label: "Delivered",
                                color: "green",
                            },
                            {
                                status: "Cancelled",
                                label: "Cancelled",
                                color: "red",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.status}
                                className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">
                                            {stat.label}
                                        </p>
                                        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                                            {statusCounts[stat.status] || 0}
                                        </p>
                                        <p className="text-xs sm:text-sm text-green-600 font-medium truncate">
                                            RM{" "}
                                            {totalAmounts[stat.status]?.toFixed(
                                                2
                                            ) || "0.00"}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-2 rounded-full bg-${stat.color}-100 flex-shrink-0 ml-2`}
                                    >
                                        <BarChart3
                                            className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}-600`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Filters - Made Responsive */}
                <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap lg:items-center gap-2 sm:gap-3">
                        {/* Enhanced Search */}
                        <div className="flex-1 flex items-center bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                            <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="ml-2 flex-1 outline-none border-none focus-within:border-none text-sm text-gray-700 bg-transparent placeholder-gray-400 min-w-0"
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => handleSearch("")}
                                    className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <select
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white w-full sm:w-[48%] md:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Enhanced Sort Options */}
                        <select
                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white w-full sm:w-[48%] md:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="created_at">Sort by Date</option>
                            <option value="total_amount">Sort by Amount</option>
                            <option value="order_status">Sort by Status</option>
                        </select>

                        {/* Sort Order Toggle */}
                        <button
                            onClick={() => {
                                const newSortOrder =
                                    sortOrder === "asc" ? "desc" : "asc";
                                setSortOrder(newSortOrder);
                            }}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white w-full sm:w-auto justify-center hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === "asc" ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )}
                            <span className="hidden xs:inline">
                                {sortOrder === "asc" ? "Asc" : "Desc"}
                            </span>
                        </button>
                    </div>

                    {/* Search Tips */}
                    <div className="mt-2 text-xs text-gray-500">
                        <p className="truncate">
                            💡 Search tips: Use order ID, customer name, email,
                            product name, or amount
                        </p>
                    </div>
                </div>

                {/* Orders Table with Enhanced Mobile Scroll */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] sm:min-w-0">
                            {" "}
                            {/* Force horizontal scroll on mobile */}
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="text-gray-700 text-left">
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap">
                                            Order ID
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap hidden sm:table-cell">
                                            Customer
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap hidden md:table-cell">
                                            Date
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap">
                                            Total (RM)
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap">
                                            Status
                                        </th>
                                        <th className="px-3 sm:px-4 py-3 font-medium text-xs lg:text-sm whitespace-nowrap text-center">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-8"
                                            >
                                                <div className="flex justify-center">
                                                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                                                </div>
                                                <p className="text-gray-500 mt-2 text-sm">
                                                    Loading orders...
                                                </p>
                                            </td>
                                        </tr>
                                    ) : orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr
                                                key={order.order_id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-3 sm:px-4 py-3 font-medium text-gray-900 text-xs lg:text-sm">
                                                    <div className="font-mono flex items-center gap-2 min-w-0">
                                                        <span className="truncate">
                                                            {order.order_id}
                                                        </span>
                                                        {newOrders.has(
                                                            order.order_id
                                                        ) && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200 animate-pulse flex-shrink-0">
                                                                NEW
                                                            </span>
                                                        )}
                                                        <div className="sm:hidden text-xs text-gray-500 truncate ml-2">
                                                            {order.user?.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 hidden sm:table-cell">
                                                    <div className="min-w-0">
                                                        <p className="font-medium text-gray-900 text-xs lg:text-sm truncate">
                                                            {order.user?.name}
                                                        </p>
                                                        <p className="text-gray-500 text-xs truncate">
                                                            {order.user?.email}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs lg:text-sm hidden md:table-cell whitespace-nowrap">
                                                    {dayjs(
                                                        order.created_at
                                                    ).format(
                                                        "DD MMM YYYY, h:mm A"
                                                    )}
                                                </td>
                                                <td className="px-3 sm:px-4 py-3 font-medium text-gray-900 text-xs lg:text-sm whitespace-nowrap">
                                                    {parseFloat(
                                                        order.total_amount ||
                                                            order.amount ||
                                                            0
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="px-3 sm:px-4 py-3">
                                                    <StatusDropdown
                                                        order={order}
                                                        onStatusUpdate={
                                                            updateOrderStatus
                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 sm:px-4 py-3">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedOrder(
                                                                    order
                                                                );
                                                                setViewOrder(
                                                                    true
                                                                );
                                                            }}
                                                            className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                printOrder(
                                                                    order
                                                                )
                                                            }
                                                            className="p-1 sm:p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hidden sm:block"
                                                            title="Print Order"
                                                        >
                                                            <Printer
                                                                size={14}
                                                            />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-8 text-gray-500"
                                            >
                                                <Package
                                                    size={48}
                                                    className="mx-auto mb-4 text-gray-300"
                                                />
                                                <p className="text-sm sm:text-base">
                                                    No orders found
                                                </p>
                                                <p className="text-xs sm:text-sm">
                                                    Try adjusting your search or
                                                    filters
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="px-3 sm:px-4 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row xs:flex-row items-center justify-between space-y-3 xs:space-y-0">
                            <div className="text-xs sm:text-sm text-gray-700 text-center xs:text-left">
                                {isSearchMode ? (
                                    <>
                                        <span className="font-medium bg-yellow-100 px-2 py-1 rounded">
                                            🔍 Search Mode
                                        </span>
                                        {" - Showing "}
                                        <span className="font-medium">
                                            {orders.length}
                                        </span>
                                        {' results for "'}
                                        <span className="font-medium text-blue-600">
                                            {searchTerm}
                                        </span>
                                        {'"'}
                                    </>
                                ) : pagination.total > 0 ? (
                                    <>
                                        Showing{" "}
                                        <span className="font-medium">
                                            {pagination.from || 1}
                                        </span>{" "}
                                        to{" "}
                                        <span className="font-medium">
                                            {pagination.to || orders.length}
                                        </span>{" "}
                                        of{" "}
                                        <span className="font-medium">
                                            {pagination.total}
                                        </span>{" "}
                                        results
                                        <span className="hidden sm:inline">
                                            {" (Page "}
                                            <span className="text-blue-600 font-bold">
                                                {currentPage}
                                            </span>
                                            {" of "}
                                            <span className="font-medium">
                                                {pagination.last_page ||
                                                    lastPage}
                                            </span>
                                            {")"}
                                        </span>
                                    </>
                                ) : (
                                    "No results found"
                                )}
                            </div>

                            {/* Only show pagination controls when not in search mode */}
                            {!isSearchMode && (
                                <div className="flex items-center space-x-1 flex-wrap justify-center">
                                    <button
                                        className="px-2 sm:px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>

                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`px-2 sm:px-3 py-1.5 rounded-md border transition-colors text-xs sm:text-sm ${
                                                page === currentPage
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                            } ${
                                                page === "..."
                                                    ? "cursor-default"
                                                    : ""
                                            }`}
                                            onClick={() => goToPage(page)}
                                            disabled={page === "..."}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        className="px-2 sm:px-3 py-1.5 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                                        onClick={nextPage}
                                        disabled={
                                            currentPage >=
                                            (pagination.last_page || lastPage)
                                        }
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Details Modal */}
                {viewOrder && selectedOrder && (
                    <OrderDetails
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        setViewOrder={setViewOrder}
                        printOrder={printOrder}
                        updateOrderStatus={updateOrderStatus}
                    />
                )}
            </main>
        </div>
    );
}
