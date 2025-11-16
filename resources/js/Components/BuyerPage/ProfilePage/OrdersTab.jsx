import {
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    XCircle,
    ShoppingBag,
    FileText,
    Filter,
    Calendar,
    ArrowUpDown,
    Package,
    CheckCircle,
    Truck,
    ThumbsUp,
    ShieldCheck,
} from "lucide-react";

import { useState } from "react";

import { EmptyState } from "./EmptyState";

import dayjs from "dayjs";

export function OrdersTab({
    orderHistory,
    getStatusColor,
    getStatusIcon,
    currentPage,
    itemsPerPage,
    paginate,
    viewReceipt,
    loading,
    confirmOrderDelivery,
    confirmingOrderId,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    // Use orderHistory directly without transformation
    const orders = orderHistory || [];

    // Filter and sort orders
    const filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                order.order_id
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.order_items?.some((item) =>
                    item.product?.product_name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
                ) ||
                order.tracking_number
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" || order.order_status === statusFilter;

            const matchesDate =
                dateFilter === "all" ||
                (dateFilter === "last30" &&
                    new Date(order.created_at) >
                        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                (dateFilter === "last90" &&
                    new Date(order.created_at) >
                        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));

            return matchesSearch && matchesStatus && matchesDate;
        })
        .sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case "date":
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                case "total":
                    aValue = parseFloat(a.amount) || 0;
                    bValue = parseFloat(b.amount) || 0;
                    break;
                case "status":
                    aValue = a.order_status;
                    bValue = b.order_status;
                    break;
                default:
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
            }

            if (sortOrder === "asc") {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const currentFilteredOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalFilteredPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const toggleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getStatusBadge = (status) => {
        const baseClasses =
            "px-3 py-1.5 mt-1 md:mt-0 rounded-full text-xs font-medium flex items-center w-fit transition-all";
        return `${baseClasses} ${getStatusColor(status)}`;
    };

    // Helper function to get order total
    const getOrderTotal = (order) => {
        return parseFloat(order.amount) || 0;
    };

    // Helper function to get total items count
    const getTotalItemsCount = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            return order.order_items.reduce(
                (total, item) => total + (item.quantity || 1),
                0
            );
        }
        return order.quantity || 1;
    };

    // Helper function to format product name
    const getProductName = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            const firstItem = order.order_items[0];
            return firstItem.product?.product_name || "Product";
        }
        return order.product?.product_name || "Product";
    };

    // Helper function to get product price
    const getProductPrice = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            const firstItem = order.order_items[0];
            return (
                parseFloat(firstItem.price) ||
                parseFloat(firstItem.product?.product_price) ||
                0
            );
        }
        return parseFloat(order.product?.product_price) || 0;
    };

    // Helper function to get product quantity
    const getProductQuantity = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            const firstItem = order.order_items[0];
            return firstItem.quantity || 1;
        }
        return order.quantity || 1;
    };

    // Helper function to get selected options
    const getSelectedOptions = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            const firstItem = order.order_items[0];
            return firstItem.selected_options || order.selected_options;
        }
        return order.selected_options;
    };

    // NEW: Enhanced order confirmation handler with modal
    const handleOrderConfirmation = async (order) => {
        if (confirmOrderDelivery) {
            const success = await confirmOrderDelivery(order.order_id);
            if (success) {
                setConfirmedOrder(order);
                setShowSuccessModal(true);
            }
        }
    };

    // NEW: Success Confirmation Modal
    const SuccessConfirmationModal = () => {
        if (!showSuccessModal || !confirmedOrder) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                    <div className="text-center">
                        {/* Success Icon */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <ThumbsUp className="h-8 w-8 text-green-600" />
                        </div>

                        {/* Success Message */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Order Confirmed!
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Thank you for confirming your order #
                            {confirmedOrder.order_id}. Your feedback helps us
                            maintain quality service.
                        </p>

                        {/* Additional Info */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-700">
                                <strong>Payment Status:</strong> Released to
                                seller
                            </p>
                            {confirmedOrder.commission_amount && (
                                <p className="text-sm text-gray-700 mt-1">
                                    <strong>Platform Commission:</strong> RM{" "}
                                    {parseFloat(
                                        confirmedOrder.commission_amount
                                    ).toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => {
                                setShowSuccessModal(false);
                                setConfirmedOrder(null);
                            }}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // NEW: Enhanced status badge with delivery tracking
    const renderEnhancedStatus = (order) => {
        const statusConfig = {
            Pending: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Package,
                message: "Awaiting seller confirmation",
            },
            Processing: {
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Clock,
                message: "Order is being processed",
            },
            Cancelled: {
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
                message: "Order has been cancelled",
            },
            Delivered: {
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Package,
                message: "Ready for confirmation",
            },
            Completed: {
                color: order.buyer_confirmed
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-green-100 text-green-800 border-green-200",
                icon: order.buyer_confirmed ? ThumbsUp : CheckCircle,
                message: order.buyer_confirmed
                    ? "Order confirmed by buyer"
                    : "Awaiting buyer confirmation",
            },
            Shipped: {
                color: "bg-purple-100 text-purple-800 border-purple-200",
                icon: Truck,
                message: "On the way",
            },
        };

        const config = statusConfig[order.order_status];
        if (!config) return null;

        const IconComponent = config.icon;

        return (
            <div className="space-y-2">
                <span className={getStatusBadge(order.order_status)}>
                    <IconComponent size={14} />
                    <span className="ml-1 capitalize">
                        {order.order_status}
                    </span>
                </span>
                {config.message && (
                    <p className="text-xs text-gray-500">{config.message}</p>
                )}
            </div>
        );
    };

    // NEW: Render action buttons for desktop view
    const renderActionButtons = (order) => {
        return (
            <div className="flex flex-col gap-2">
                {/* Receipt Button - Always visible */}
                <button
                    onClick={() => viewReceipt(order)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    title="View Receipt"
                >
                    <FileText size={16} />
                    Receipt
                </button>

                {/* Order Completion Confirmation Button */}
                {order.order_status === "Delivered" && (
                    <button
                        onClick={() => handleOrderConfirmation(order)}
                        disabled={confirmingOrderId === order.order_id}
                        className="w-36 flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        title="Confirm Order Completion"
                    >
                        {confirmingOrderId === order.order_id ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Confirming...
                            </>
                        ) : (
                            <>
                                <ThumbsUp size={16} />
                                Confirm Order
                            </>
                        )}
                    </button>
                )}

                {/* Confirmed Status Badge */}
                {order.order_status === "Completed" && (
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-lg text-sm font-medium border border-emerald-200">
                        <ThumbsUp size={16} />
                        Confirmed
                    </span>
                )}
            </div>
        );
    };

    // NEW: Render action buttons for mobile view
    const renderMobileActionButtons = (order) => {
        return (
            <div className="flex flex-col md:flex-row gap-2 pt-3 border-t border-gray-100">
                {/* Receipt Button */}
                <button
                    onClick={() => viewReceipt(order)}
                    className="w-full flex flex-row items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                    <FileText size={16} />
                    View Receipt
                </button>

                {/* Delivery Confirmation Button */}
                {order.order_status === "Delivered" && (
                    <button
                        onClick={() => confirmOrderDelivery(order.order_id)}
                        disabled={confirmingOrderId === order.order_id}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                        {confirmingOrderId === order.order_id ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Confirming...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={16} />
                                Confirm
                            </>
                        )}
                    </button>
                )}

                {/* Confirmed Status Badge */}
                {order.order_status === "Completed" && (
                    <span className="flex-1 flex items-center justify-center gap-1 bg-emerald-100 text-emerald-800 py-2 px-3 rounded-lg text-sm font-medium border border-emerald-200">
                        <ThumbsUp size={16} />
                        Confirmed
                    </span>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Success Modal */}
            <SuccessConfirmationModal />

            {/* Enhanced Header */}
            <div className="border-b border-gray-100 px-6 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                        {/* Icon - Same size on all devices */}
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="text-white w-5 h-5 lg:w-6 lg:h-6" />
                        </div>

                        {/* Content - Responsive layout */}
                        <div className="flex flex-col md:flex-row md:gap-20 min-w-0">
                            {/* Title - Responsive sizing */}
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 truncate">
                                Order History
                            </h2>

                            {/* Stats - Stack on mobile, row on desktop */}
                            <div className="flex flex-col md:flex-row xs:flex-row xs:items-center gap-1 xs:gap-2 md:gap-10 mt-1">
                                <span className="text-sm lg:text-base text-gray-600 whitespace-nowrap">
                                    {orders.length} orders placed
                                </span>

                                {/* Separator - Hidden on mobile, visible on small tablets and up */}
                                <span className="hidden xs:inline text-gray-300">
                                    •
                                </span>

                                <span className="text-sm lg:text-base text-gray-600 whitespace-nowrap">
                                    RM{" "}
                                    {orders
                                        .reduce(
                                            (sum, order) =>
                                                sum + getOrderTotal(order),
                                            0
                                        )
                                        .toFixed(2)}{" "}
                                    total spent
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search orders, products, tracking..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Refunded">Refunded</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
                        >
                            <option value="all">All Time</option>
                            <option value="last30">Last 30 Days</option>
                            <option value="last90">Last 90 Days</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {orders.length === 0 ? (
                    <EmptyState
                        icon={ShoppingBag}
                        title="No orders yet"
                        description="Your order history will appear here once you make your first purchase"
                        actionText="Start Shopping"
                        actionLink="/shopping"
                    />
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4">
                            {currentFilteredOrders.map((order) => (
                                <div
                                    key={order.order_id}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white"
                                >
                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {order.order_id}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1 md:mt-0">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={getStatusBadge(
                                                order.order_status
                                            )}
                                        >
                                            {getStatusIcon(order.order_status)}
                                            <span className="ml-1 capitalize">
                                                {order.order_status}
                                            </span>
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div className="mb-3">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                                    {getProductName(order)}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Qty:{" "}
                                                    {getProductQuantity(order)}{" "}
                                                    • RM{" "}
                                                    {getProductPrice(
                                                        order
                                                    ).toFixed(2)}
                                                </p>
                                                {getSelectedOptions(order) && (
                                                    <div className="mt-1">
                                                        {Object.entries(
                                                            getSelectedOptions(
                                                                order
                                                            )
                                                        ).map(
                                                            ([
                                                                optionType,
                                                                optionData,
                                                            ]) => (
                                                                <div
                                                                    key={
                                                                        optionType
                                                                    }
                                                                    className="text-xs text-gray-600"
                                                                >
                                                                    <span className="capitalize font-medium">
                                                                        {
                                                                            optionType
                                                                        }
                                                                        :
                                                                    </span>
                                                                    <span className="ml-1">
                                                                        {
                                                                            optionData.value_name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {order.order_items &&
                                            order.order_items.length > 1 && (
                                                <p className="text-sm text-gray-500 text-center">
                                                    +
                                                    {order.order_items.length -
                                                        1}{" "}
                                                    more items
                                                </p>
                                            )}
                                    </div>

                                    {/* Order Total */}
                                    <div className="flex justify-between items-center mb-3 pt-3 border-t border-gray-100">
                                        <span className="font-semibold text-gray-900">
                                            Total
                                        </span>
                                        <span className="font-bold text-lg text-gray-900">
                                            RM {getOrderTotal(order).toFixed(2)}
                                        </span>
                                    </div>

                                    {/* Mobile Action Buttons */}
                                    {renderMobileActionButtons(order)}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleSort("date")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Order
                                                <ArrowUpDown
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Product Details
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleSort("status")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Status
                                                <ArrowUpDown
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleSort("total")}
                                        >
                                            <div className="flex items-center gap-2">
                                                Total
                                                <ArrowUpDown
                                                    size={14}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentFilteredOrders.map((order) => (
                                        <tr
                                            key={order.order_id}
                                            className="hover:bg-gray-50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-xs">
                                                        {order.order_id}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {dayjs(
                                                            order.created_at
                                                        ).format(
                                                            "DD MMM YYYY, hh:mm A"
                                                        )}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                                            {getProductName(
                                                                order
                                                            )}
                                                        </p>
                                                        <p className="text-gray-600 text-xs mt-1">
                                                            Qty:{" "}
                                                            {getProductQuantity(
                                                                order
                                                            )}{" "}
                                                            • RM{" "}
                                                            {getProductPrice(
                                                                order
                                                            ).toFixed(2)}
                                                        </p>
                                                        {getSelectedOptions(
                                                            order
                                                        ) && (
                                                            <p className="text-red-500 font-bold text-xs mt-1">
                                                                {Object.values(
                                                                    getSelectedOptions(
                                                                        order
                                                                    )
                                                                )
                                                                    .map(
                                                                        (opt) =>
                                                                            opt.value_name
                                                                    )
                                                                    .join(", ")}
                                                            </p>
                                                        )}
                                                        {order.order_items &&
                                                            order.order_items
                                                                .length > 1 && (
                                                                <p className="text-blue-600 text-xs mt-1 font-medium">
                                                                    +
                                                                    {order
                                                                        .order_items
                                                                        .length -
                                                                        1}{" "}
                                                                    more items
                                                                </p>
                                                            )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {/* Enhanced Status */}
                                                {renderEnhancedStatus(order)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-bold text-gray-900 text-xs">
                                                        RM{" "}
                                                        {getOrderTotal(
                                                            order
                                                        ).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {getTotalItemsCount(
                                                            order
                                                        )}{" "}
                                                        items
                                                    </p>
                                                    <p className="text-xs text-green-600 font-medium mt-1 capitalize">
                                                        {order.payment_status ||
                                                            "paid"}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {/* Action Buttons */}
                                                {renderActionButtons(order)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Enhanced Pagination */}
                        {totalFilteredPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-2">
                                <div className="text-sm text-gray-600">
                                    Showing{" "}
                                    <span className="font-semibold text-gray-900">
                                        {(currentPage - 1) * itemsPerPage + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-semibold text-gray-900">
                                        {Math.min(
                                            currentPage * itemsPerPage,
                                            filteredOrders.length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-gray-900">
                                        {filteredOrders.length}
                                    </span>{" "}
                                    orders
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            paginate &&
                                            paginate(
                                                Math.max(1, currentPage - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                                    >
                                        <ChevronLeft size={18} />
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from(
                                            {
                                                length: Math.min(
                                                    5,
                                                    totalFilteredPages
                                                ),
                                            },
                                            (_, i) => {
                                                let pageNum;
                                                if (totalFilteredPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (
                                                    currentPage >=
                                                    totalFilteredPages - 2
                                                ) {
                                                    pageNum =
                                                        totalFilteredPages -
                                                        4 +
                                                        i;
                                                } else {
                                                    pageNum =
                                                        currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() =>
                                                            paginate &&
                                                            paginate(pageNum)
                                                        }
                                                        className={`w-10 h-10 rounded-xl border transition-all font-medium text-sm ${
                                                            currentPage ===
                                                            pageNum
                                                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                                                : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>

                                    <button
                                        onClick={() =>
                                            paginate &&
                                            paginate(
                                                Math.min(
                                                    totalFilteredPages,
                                                    currentPage + 1
                                                )
                                            )
                                        }
                                        disabled={
                                            currentPage === totalFilteredPages
                                        }
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                                    >
                                        Next
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
