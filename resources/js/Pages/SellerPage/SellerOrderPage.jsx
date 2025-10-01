import React, { useState } from "react";
import {
    Search,
    Eye,
    Truck,
    CheckCircle,
    XCircle,
    Filter,
    Download,
    Printer,
    Calendar,
    ArrowUpDown,
    MoreVertical,
    Package,
    Clock,
    User,
    MapPin,
    Phone,
    Mail,
    CreditCard,
    ChevronDown,
    ChevronUp,
    RefreshCw,
    BarChart3,
} from "lucide-react";
import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";

export default function SellerOrderPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFilter, setDateFilter] = useState("All");
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

    const [orders, setOrders] = useState([
        {
            id: "ORD-1001",
            customer: {
                name: "John Doe",
                email: "john@example.com",
                phone: "+6012-345-6789",
                address: "123 Main St, Kuala Lumpur",
            },
            date: "2025-08-12",
            items: [
                {
                    name: "Wireless Headphones",
                    price: 99,
                    quantity: 1,
                    image: "/headphones.jpg",
                },
                {
                    name: "Phone Case",
                    price: 25,
                    quantity: 2,
                    image: "/case.jpg",
                },
            ],
            total: 149,
            subtotal: 149,
            shipping: 0,
            tax: 0,
            status: "Processing",
            payment: {
                method: "Credit Card",
                status: "Paid",
                transactionId: "TXN-789012",
            },
            shipping: {
                method: "Standard",
                trackingNumber: "TRK-123456",
                carrier: "Pos Laju",
            },
            notes: "Please handle with care",
        },
        {
            id: "ORD-1002",
            customer: {
                name: "Sarah Lee",
                email: "sarah@example.com",
                phone: "+6016-789-0123",
                address: "456 Oak Ave, Penang",
            },
            date: "2025-08-11",
            items: [
                {
                    name: "Smart Watch",
                    price: 299,
                    quantity: 1,
                    image: "/watch.jpg",
                },
                {
                    name: "Screen Protector",
                    price: 15,
                    quantity: 1,
                    image: "/protector.jpg",
                },
            ],
            total: 314,
            subtotal: 314,
            shipping: 0,
            tax: 0,
            status: "Shipped",
            payment: {
                method: "Online Banking",
                status: "Paid",
                transactionId: "TXN-789013",
            },
            shipping: {
                method: "Express",
                trackingNumber: "TRK-123457",
                carrier: "DHL",
            },
        },
        {
            id: "ORD-1003",
            customer: {
                name: "Michael Chan",
                email: "michael@example.com",
                phone: "+6019-456-7890",
                address: "789 Pine Rd, Johor Bahru",
            },
            date: "2025-08-10",
            items: [
                {
                    name: "Laptop Bag",
                    price: 89,
                    quantity: 1,
                    image: "/bag.jpg",
                },
            ],
            total: 89,
            subtotal: 89,
            shipping: 0,
            tax: 0,
            status: "Delivered",
            payment: {
                method: "Touch 'n Go",
                status: "Paid",
                transactionId: "TXN-1234567",
            },
            shipping: {
                method: "Standard",
                trackingNumber: "TRK-123458",
                carrier: "Pos Laju",
            },
        },
        {
            id: "ORD-1004",
            customer: {
                name: "Emily Tan",
                email: "emily@example.com",
                phone: "+6011-234-5678",
                address: "321 Cedar Ln, Selangor",
            },
            date: "2025-08-09",
            items: [
                {
                    name: "Wireless Earbuds",
                    price: 129,
                    quantity: 1,
                    image: "/earbuds.jpg",
                },
                {
                    name: "Charging Cable",
                    price: 19,
                    quantity: 3,
                    image: "/cable.jpg",
                },
            ],
            total: 186,
            subtotal: 186,
            shipping: 0,
            tax: 0,
            status: "Cancelled",
            payment: {
                method: "Credit Card",
                status: "Refunded",
                transactionId: "TXN-789015",
            },
        },
    ]);

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        acc.All = (acc.All || 0) + 1;
        return acc;
    }, {});

    const filteredOrders = orders
        .filter((order) => {
            const matchesSearch =
                order.customer.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "All" || order.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortBy === "date") {
                return sortOrder === "asc"
                    ? new Date(a.date) - new Date(b.date)
                    : new Date(b.date) - new Date(a.date);
            } else if (sortBy === "total") {
                return sortOrder === "asc"
                    ? a.total - b.total
                    : b.total - a.total;
            }
            return 0;
        });

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const exportOrders = () => {
        // Simulate export functionality
        alert("Exporting orders data...");
    };

    const printOrder = (order) => {
        // Simulate print functionality
        alert(`Printing order ${order.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar shopName={"Gemilang Berjaya"} />

            <main className="flex-1 p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Order Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage and track your customer orders
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                        <button
                            onClick={exportOrders}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            <Download size={16} />
                            Export
                        </button>

                        <div className="flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setViewMode("table")}
                                className={`px-3 py-2 ${
                                    viewMode === "table"
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600"
                                }`}
                            >
                                Table
                            </button>
                            <button
                                onClick={() => setViewMode("card")}
                                className={`px-3 py-2 ${
                                    viewMode === "card"
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-600"
                                }`}
                            >
                                Cards
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    {[
                        { status: "All", label: "Total Orders", color: "gray" },
                        {
                            status: "Processing",
                            label: "Processing",
                            color: "yellow",
                        },
                        { status: "Shipped", label: "Shipped", color: "blue" },
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
                            className="bg-white p-4 rounded-lg shadow-sm border"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {statusCounts[stat.status] || 0}
                                    </p>
                                </div>
                                <div
                                    className={`p-2 rounded-full bg-${stat.color}-100`}
                                >
                                    <BarChart3
                                        className={`h-5 w-5 text-${stat.color}-600`}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                            <Search className="h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer, or Email"
                                className="ml-2 flex-1 outline-none text-sm text-gray-700 bg-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            className="px-4 py-2 border rounded-lg text-sm text-gray-700 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>

                        {/* Date Filter */}
                        <select
                            className="px-4 py-2 border rounded-lg text-sm text-gray-700 bg-white"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        >
                            <option value="All">All Dates</option>
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                        </select>

                        {/* Sort */}
                        <button
                            onClick={() => {
                                if (sortBy === "date") {
                                    setSortOrder(
                                        sortOrder === "asc" ? "desc" : "asc"
                                    );
                                } else {
                                    setSortBy("date");
                                    setSortOrder("desc");
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm text-gray-700 bg-white"
                        >
                            <Calendar size={16} />
                            Date{" "}
                            {sortBy === "date" &&
                                (sortOrder === "asc" ? (
                                    <ChevronUp size={16} />
                                ) : (
                                    <ChevronDown size={16} />
                                ))}
                        </button>
                    </div>

                    {/* Advanced Filters Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 mt-4 text-sm text-gray-600 hover:text-gray-800"
                    >
                        <Filter size={16} />
                        Advanced Filters
                        {isFilterOpen ? (
                            <ChevronUp size={16} />
                        ) : (
                            <ChevronDown size={16} />
                        )}
                    </button>

                    {/* Advanced Filters */}
                    {isFilterOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Payment Method
                                </label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="">All Methods</option>
                                    <option value="credit_card">
                                        Credit Card
                                    </option>
                                    <option value="online_banking">
                                        Online Banking
                                    </option>
                                    <option value="touch_n_go">
                                        Touch 'n Go
                                    </option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Shipping Method
                                </label>
                                <select className="w-full px-3 py-2 border rounded-lg text-sm">
                                    <option value="">All Methods</option>
                                    <option value="standard">Standard</option>
                                    <option value="express">Express</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Orders Content */}
                {viewMode === "table" ? (
                    /* Table View */
                    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-gray-700 text-left">
                                    <th className="px-6 py-3 font-medium">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Items
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Total (RM)
                                    </th>
                                    <th className="px-6 py-3 font-medium">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 font-medium text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {order.id}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {order.customer.name}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    {order.customer.email}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.date}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {order.items.length} items
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            RM {order.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    order.status ===
                                                    "Processing"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : order.status ===
                                                          "Shipped"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : order.status ===
                                                          "Delivered"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        setSelectedOrder(order)
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                {order.status ===
                                                    "Processing" && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    "Shipped"
                                                                )
                                                            }
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                            title="Mark as Shipped"
                                                        >
                                                            <Truck size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    "Cancelled"
                                                                )
                                                            }
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                            title="Cancel Order"
                                                        >
                                                            <XCircle
                                                                size={16}
                                                            />
                                                        </button>
                                                    </>
                                                )}

                                                {order.status === "Shipped" && (
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                "Delivered"
                                                            )
                                                        }
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                                        title="Mark as Delivered"
                                                    >
                                                        <CheckCircle
                                                            size={16}
                                                        />
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() =>
                                                        printOrder(order)
                                                    }
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                                                    title="Print Order"
                                                >
                                                    <Printer size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredOrders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="7"
                                            className="text-center py-8 text-gray-500"
                                        >
                                            <Package
                                                size={48}
                                                className="mx-auto mb-4 text-gray-300"
                                            />
                                            <p>No orders found</p>
                                            <p className="text-sm">
                                                Try adjusting your search or
                                                filters
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* Card View */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-lg shadow-sm border p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {order.id}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {order.date}
                                        </p>
                                    </div>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            order.status === "Processing"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : order.status === "Shipped"
                                                ? "bg-blue-100 text-blue-800"
                                                : order.status === "Delivered"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <User
                                            size={14}
                                            className="text-gray-400"
                                        />
                                        <span className="font-medium text-gray-900">
                                            {order.customer.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Mail size={14} />
                                        {order.customer.email}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-gray-600 mb-1">
                                        {order.items.length} items
                                    </p>
                                    <p className="font-semibold text-gray-900">
                                        RM {order.total.toFixed(2)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                                    >
                                        View Details
                                    </button>

                                    {order.status === "Processing" && (
                                        <button
                                            onClick={() =>
                                                updateOrderStatus(
                                                    order.id,
                                                    "Shipped"
                                                )
                                            }
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                                            title="Mark as Shipped"
                                        >
                                            <Truck size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredOrders.length === 0 && (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <Package
                                    size={64}
                                    className="mx-auto mb-4 text-gray-300"
                                />
                                <p className="text-lg font-medium">
                                    No orders found
                                </p>
                                <p className="text-sm">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b p-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Order Details - {selectedOrder.id}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle size={24} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mt-2">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            selectedOrder.status ===
                                            "Processing"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : selectedOrder.status ===
                                                  "Shipped"
                                                ? "bg-blue-100 text-blue-800"
                                                : selectedOrder.status ===
                                                  "Delivered"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {selectedOrder.status}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {selectedOrder.date}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                    {/* Customer Information */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            Customer Information
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <User
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-700">
                                                    {
                                                        selectedOrder.customer
                                                            .name
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-700">
                                                    {
                                                        selectedOrder.customer
                                                            .email
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="text-gray-700">
                                                    {
                                                        selectedOrder.customer
                                                            .phone
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <MapPin
                                                    size={16}
                                                    className="text-gray-400 mt-0.5"
                                                />
                                                <span className="text-gray-700">
                                                    {
                                                        selectedOrder.customer
                                                            .address
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            Order Summary
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Subtotal
                                                </span>
                                                <span className="text-gray-900">
                                                    RM{" "}
                                                    {selectedOrder.subtotal.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Shipping
                                                </span>
                                                <span className="text-gray-900">
                                                    RM{" "}
                                                    {selectedOrder.shipping.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Tax
                                                </span>
                                                <span className="text-gray-900">
                                                    RM{" "}
                                                    {selectedOrder.tax.toFixed(
                                                        2
                                                    )}
                                                </span>
                                            </div>
                                            <div className="border-t pt-2 mt-2">
                                                <div className="flex justify-between font-semibold">
                                                    <span className="text-gray-900">
                                                        Total
                                                    </span>
                                                    <span className="text-gray-900">
                                                        RM{" "}
                                                        {selectedOrder.total.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-6">
                                    <h3 className="font-medium text-gray-900 mb-3">
                                        Order Items
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map(
                                            (item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                                                >
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                                        <Package
                                                            size={20}
                                                            className="text-gray-400"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            Quantity:{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-medium text-gray-900">
                                                        RM{" "}
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Payment & Shipping */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Payment Information */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            Payment Information
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CreditCard
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                <span className="font-medium">
                                                    {
                                                        selectedOrder.payment
                                                            .method
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Status
                                                </span>
                                                <span
                                                    className={`font-medium ${
                                                        selectedOrder.payment
                                                            .status === "Paid"
                                                            ? "text-green-600"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {
                                                        selectedOrder.payment
                                                            .status
                                                    }
                                                </span>
                                            </div>
                                            {selectedOrder.payment
                                                .transactionId && (
                                                <div className="flex justify-between text-sm mt-1">
                                                    <span className="text-gray-600">
                                                        Transaction ID
                                                    </span>
                                                    <span className="text-gray-600">
                                                        {
                                                            selectedOrder
                                                                .payment
                                                                .transactionId
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Shipping Information */}
                                    <div>
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            Shipping Information
                                        </h3>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            {selectedOrder.shipping ? (
                                                <>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Truck
                                                            size={16}
                                                            className="text-gray-400"
                                                        />
                                                        <span className="font-medium">
                                                            {
                                                                selectedOrder
                                                                    .shipping
                                                                    .method
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-gray-600">
                                                            Carrier
                                                        </span>
                                                        <span className="text-gray-600">
                                                            {
                                                                selectedOrder
                                                                    .shipping
                                                                    .carrier
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm mt-1">
                                                        <span className="text-gray-600">
                                                            Tracking Number
                                                        </span>
                                                        <span className="text-blue-600">
                                                            {
                                                                selectedOrder
                                                                    .shipping
                                                                    .trackingNumber
                                                            }
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <p className="text-gray-600">
                                                    Shipping information not
                                                    available
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedOrder.notes && (
                                    <div className="mt-6">
                                        <h3 className="font-medium text-gray-900 mb-3">
                                            Customer Notes
                                        </h3>
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                            <p className="text-sm text-yellow-800">
                                                {selectedOrder.notes}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                                    <button
                                        onClick={() =>
                                            printOrder(selectedOrder)
                                        }
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                                    >
                                        <Printer size={16} />
                                        Print Invoice
                                    </button>

                                    {selectedOrder.status === "Processing" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    updateOrderStatus(
                                                        selectedOrder.id,
                                                        "Shipped"
                                                    );
                                                    setSelectedOrder(null);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                                            >
                                                <Truck size={16} />
                                                Mark as Shipped
                                            </button>
                                            <button
                                                onClick={() => {
                                                    updateOrderStatus(
                                                        selectedOrder.id,
                                                        "Cancelled"
                                                    );
                                                    setSelectedOrder(null);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                            >
                                                <XCircle size={16} />
                                                Cancel Order
                                            </button>
                                        </>
                                    )}

                                    {selectedOrder.status === "Shipped" && (
                                        <button
                                            onClick={() => {
                                                updateOrderStatus(
                                                    selectedOrder.id,
                                                    "Delivered"
                                                );
                                                setSelectedOrder(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                        >
                                            <CheckCircle size={16} />
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
