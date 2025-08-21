import React, { useState } from "react";
import { Search, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { SellerSidebar } from "@/Components/Seller/SellerSidebar";

export default function SellerOrderPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [orders, setOrders] = useState([
        {
            id: "ORD-1001",
            customer: "John Doe",
            date: "2025-08-12",
            total: 199,
            status: "Processing",
        },
        {
            id: "ORD-1002",
            customer: "Sarah Lee",
            date: "2025-08-11",
            total: 499,
            status: "Shipped",
        },
        {
            id: "ORD-1003",
            customer: "Michael Chan",
            date: "2025-08-10",
            total: 99,
            status: "Delivered",
        },
        {
            id: "ORD-1004",
            customer: "Emily Tan",
            date: "2025-08-09",
            total: 299,
            status: "Cancelled",
        },
    ]);

    const [selectedOrder, setSelectedOrder] = useState(null);

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((order) =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar shopName={"Gemilang Berjaya"} />

            <main className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Orders
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage and track your customer orders here.
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    {/* Search */}
                    <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm w-full md:w-1/3">
                        <Search className="h-5 w-5 text-black" />
                        <input
                            type="text"
                            placeholder="Search by Order ID or Customer"
                            className="ml-2 flex-1 outline-none text-sm text-black border-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        className="px-4 py-2 border-none rounded-lg shadow-sm text-sm text-black bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-left">
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Total (RM)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className="border-b text-black hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-3">{order.id}</td>
                                    <td className="px-6 py-3">
                                        {order.customer}
                                    </td>
                                    <td className="px-6 py-3">{order.date}</td>
                                    <td className="px-6 py-3">
                                        RM {order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                order.status === "Processing"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : order.status === "Shipped"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : order.status ===
                                                      "Delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 flex justify-center gap-3">
                                        {/* View Details */}
                                        <button
                                            title="View Details"
                                            onClick={() =>
                                                setSelectedOrder(order)
                                            }
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>

                                        {/* Mark as Shipped */}
                                        {order.status === "Processing" && (
                                            <button
                                                title="Mark as Shipped"
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        order.id,
                                                        "Shipped"
                                                    )
                                                }
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <Truck className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* Mark as Delivered */}
                                        {order.status === "Shipped" && (
                                            <button
                                                title="Mark as Delivered"
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        order.id,
                                                        "Delivered"
                                                    )
                                                }
                                                className="text-green-600 hover:text-green-800"
                                            >
                                                <CheckCircle className="h-5 w-5" />
                                            </button>
                                        )}

                                        {/* Cancel Order */}
                                        {order.status === "Processing" && (
                                            <button
                                                title="Cancel Order"
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        order.id,
                                                        "Cancelled"
                                                    )
                                                }
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <XCircle className="h-5 w-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredOrders.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h2 className="text-lg text-black font-bold mb-4">
                            Order Details
                        </h2>
                        <p className="text-black">
                            <strong>Order ID:</strong> {selectedOrder.id}
                        </p>
                        <p className="text-black">
                            <strong>Customer:</strong> {selectedOrder.customer}
                        </p>
                        <p className="text-black">
                            <strong>Date:</strong> {selectedOrder.date}
                        </p>
                        <p className="text-black">
                            <strong>Total:</strong> RM{" "}
                            {selectedOrder.total.toFixed(2)}
                        </p>
                        <p className="text-black">
                            <strong>Status:</strong> {selectedOrder.status}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}