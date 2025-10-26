import {
    Search,
    ChevronLeft,
    ChevronRight,
    Download,
    ShoppingBag,
    FileText,
    Printer,
    Filter,
    Calendar,
    Truck,
    Eye,
    ArrowUpDown,
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
    totalPages,
    paginate,
    viewReceipt,
    printReceipt,
    loading,
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [expandedOrder, setExpandedOrder] = useState(null);

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

    const toggleOrderExpand = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusBadge = (status) => {
        const baseClasses =
            "px-3 py-1.5 rounded-full text-xs font-medium flex items-center w-fit transition-all";
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

    // Helper function to get first product image
    const getFirstProductImage = (order) => {
        if (order.order_items && order.order_items.length > 0) {
            const firstItem = order.order_items[0];
            return (
                firstItem.product?.product_images?.[0]?.image_path ||
                firstItem.product_image?.image_path ||
                "/placeholder-product.png"
            );
        }
        return order.product_image?.image_path || "/placeholder-product.png";
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
            {/* Enhanced Header */}
            <div className="border-b border-gray-100 px-6 py-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="text-white" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Order History
                            </h2>
                            <p className="text-gray-600 mt-1 flex items-center gap-2">
                                <span>{orders.length} orders placed</span>
                                <span className="text-gray-300">•</span>
                                <span>
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
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Export Button */}
                        <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
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
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="refunded">Refunded</option>
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

                    {/* Sort */}
                    <div className="relative">
                        <ArrowUpDown
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] =
                                    e.target.value.split("-");
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 appearance-none"
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="total-desc">
                                Total: High to Low
                            </option>
                            <option value="total-asc">
                                Total: Low to High
                            </option>
                            <option value="status-asc">Status: A to Z</option>
                            <option value="status-desc">Status: Z to A</option>
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
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                                >
                                    {/* Order Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-gray-900">
                                                {order.order_id}
                                            </p>
                                            <p className="text-sm text-gray-500">
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

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                                        <button
                                            onClick={() => viewReceipt(order)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            <FileText size={16} />
                                            Receipt
                                        </button>
                                        <button
                                            onClick={() =>
                                                toggleOrderExpand(
                                                    order.order_id
                                                )
                                            }
                                            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                        >
                                            <Eye size={16} />
                                            Details
                                        </button>
                                    </div>

                                    {/* Expanded Details */}
                                    {expandedOrder === order.order_id && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-gray-500">
                                                        Tracking Number
                                                    </p>
                                                    <p className="font-medium">
                                                        {order.tracking_number ||
                                                            `TRK${order.order_id}`}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">
                                                        Payment
                                                    </p>
                                                    <p className="font-medium capitalize">
                                                        {order.payment_method ||
                                                            "Credit Card"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">
                                                        Carrier
                                                    </p>
                                                    <p className="font-medium">
                                                        {order.carrier ||
                                                            "Pos Laju"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">
                                                        Items
                                                    </p>
                                                    <p className="font-medium">
                                                        {getTotalItemsCount(
                                                            order
                                                        )}{" "}
                                                        items
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                                <div className="space-y-2">
                                                    <span
                                                        className={getStatusBadge(
                                                            order.order_status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            order.order_status
                                                        )}
                                                        <span className="ml-1 capitalize">
                                                            {order.order_status}
                                                        </span>
                                                    </span>
                                                </div>
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
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            viewReceipt(order)
                                                        }
                                                        className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                        title="View Receipt"
                                                    >
                                                        <FileText size={16} />
                                                        Receipt
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            printReceipt &&
                                                            printReceipt(order)
                                                        }
                                                        className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                                        title="Print Receipt"
                                                    >
                                                        <Printer size={16} />
                                                    </button>
                                                </div>
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
