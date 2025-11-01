import { useState } from "react";

import { Search, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";

import { Sidebar } from "@/Components/AdminPage/Sidebar";

import dayjs from "dayjs";

export default function Transactions({ list_transactions }) {
    const [transactions, setTransactions] = useState(
        list_transactions.data || []
    );

    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Filter transactions based on search, status, payment method, and date range
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            filter === "" ||
            transaction.payment_intent_id
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
            transaction.user?.name
                ?.toLowerCase()
                .includes(filter.toLowerCase()) ||
            transaction.seller?.seller_name
                ?.toLowerCase()
                .includes(filter.toLowerCase());

        const matchesStatus =
            statusFilter === "All" ||
            transaction.payment_status === statusFilter;

        const matchesPaymentMethod =
            paymentMethodFilter === "All" ||
            transaction.payment_method === paymentMethodFilter;

        const matchesDateRange =
            (!dateRange.start && !dateRange.end) ||
            (new Date(transaction.created_at) >= new Date(dateRange.start) &&
                new Date(transaction.created_at) <= new Date(dateRange.end));

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPaymentMethod &&
            matchesDateRange
        );
    });

    // Calculate total metrics
    const totalRevenue = transactions
        .filter((t) => t.order_status === "Delivered")
        .reduce((total, transaction) => {
            const amount = parseFloat(transaction.tax_amount) || 0;
            return total + amount;
        }, 0); // ✅ start from 0 so empty array won’t break

    const completedTransactions = transactions.filter(
        (t) => t.payment_status === "paid" && t.order_status === "Delivered"
    ).length;

    const pendingTransactions = transactions.filter(
        (t) => t.payment_status === "pending"
    ).length;

    // Generate receipt for a transaction
    const generateReceipt = (transaction) => {
        setSelectedTransaction(transaction);
        setShowReceiptModal(true);
    };

    // Generate report
    const generateReport = () => {
        setShowReportModal(true);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 min-w-0 w-full">
                {/* Mobile Header with Menu Button */}
                <div className="lg:hidden mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                        Transactions
                    </h1>
                    <div className="w-10"></div> {/* Spacer for balance */}
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Revenue
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    RM {totalRevenue.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed Transactions
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {completedTransactions}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-yellow-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-yellow-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Pending Transactions
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {pendingTransactions}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header with title and actions */}
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                                    Transaction Management
                                </h2>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    View and manage all transactions
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <button
                                    onClick={generateReport}
                                    className="px-3 py-2 lg:px-4 lg:py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center text-sm lg:text-base"
                                >
                                    <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="text-black w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm lg:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="text-black border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="paid">Completed</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>

                            <select
                                value={paymentMethodFilter}
                                onChange={(e) =>
                                    setPaymentMethodFilter(e.target.value)
                                }
                                className="text-black border border-gray-300 rounded-md px-3 py-2 text-sm lg:text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Methods</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>
                            </select>

                            <div className="flex flex-col md:flex-row gap-2">
                                <input
                                    type="date"
                                    placeholder="Start Date"
                                    value={dateRange.start}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            start: e.target.value,
                                        })
                                    }
                                    className="text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <input
                                    type="date"
                                    placeholder="End Date"
                                    value={dateRange.end}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            end: e.target.value,
                                        })
                                    }
                                    className="text-black flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table - FIXED: Proper horizontal scrolling */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[900px] divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Transaction ID
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Customer
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Seller
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Amount
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Payment Method
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Date
                                    </th>
                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.payment_intent_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div
                                                    className="max-w-[120px] truncate"
                                                    title={
                                                        transaction.payment_intent_id
                                                    }
                                                >
                                                    {
                                                        transaction.payment_intent_id
                                                    }
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <div className="max-w-[120px]">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {transaction.user?.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate">
                                                        {
                                                            transaction.user
                                                                ?.email
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 max-w-[100px] truncate">
                                                {
                                                    transaction.seller
                                                        ?.seller_name
                                                }
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                                                RM {transaction.amount}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        transaction.payment_status ===
                                                        "paid"
                                                            ? "bg-green-100 text-green-800"
                                                            : transaction.payment_status ===
                                                              "pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : transaction.payment_status ===
                                                              "failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {transaction.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.payment_method}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {dayjs(
                                                    transaction.created_at
                                                ).format("DD MMM YYYY")}
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex flex-col sm:flex-row gap-1 justify-end">
                                                    <button
                                                        onClick={() =>
                                                            generateReceipt(
                                                                transaction
                                                            )
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900 text-xs sm:text-sm px-2 py-1 rounded hover:bg-indigo-50 whitespace-nowrap"
                                                    >
                                                        Receipt
                                                    </button>
                                                    <button className="text-gray-600 hover:text-gray-900 text-xs sm:text-sm px-2 py-1 rounded hover:bg-gray-50 whitespace-nowrap">
                                                        Details
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-3 py-8 text-center text-sm text-gray-500"
                                        >
                                            No transactions found matching your
                                            criteria.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-gray-700 text-center sm:text-left">
                                Showing{" "}
                                <span className="font-medium">
                                    {filteredTransactions.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium">
                                    {transactions.length}
                                </span>{" "}
                                transactions
                            </div>
                            <div className="flex items-center space-x-1">
                                <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white text-sm">
                                    1
                                </button>
                                <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Modal */}
                {showReceiptModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Transaction Receipt
                                </h3>
                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="text-gray-500 hover:text-gray-700 p-1"
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
                            <div className="p-6">
                                <div className="mb-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl text-black font-bold">
                                                INVOICE
                                            </h4>
                                            <p className="text-gray-600">
                                                Transaction ID:{" "}
                                                {
                                                    selectedTransaction.payment_intent_id
                                                }
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg text-blue-600 font-semibold">
                                                RM {selectedTransaction.amount}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Payment Status:{" "}
                                                {
                                                    selectedTransaction.payment_status
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h5 className="font-semibold text-gray-700 mb-2">
                                                Customer Information
                                            </h5>
                                            <p className="text-black">
                                                {selectedTransaction.user?.name}
                                            </p>
                                            <p className="text-gray-600">
                                                {
                                                    selectedTransaction.user
                                                        ?.email
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-700 mb-2">
                                                Seller Information
                                            </h5>
                                            <p className="text-black">
                                                {
                                                    selectedTransaction.seller
                                                        ?.seller_name
                                                }
                                            </p>
                                            <p className="text-gray-600">
                                                Payment Method:{" "}
                                                {
                                                    selectedTransaction.payment_method
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h5 className="font-semibold text-gray-700 mb-2">
                                            Transaction Details
                                        </h5>
                                        <p className="text-gray-500">
                                            Date:{" "}
                                            {dayjs(
                                                selectedTransaction.created_at
                                            ).format("DD MMM YYYY HH:mm")}
                                        </p>
                                    </div>

                                    <div className="border-t border-b border-gray-200 py-4">
                                        <h5 className="font-semibold text-gray-700 mb-2">
                                            Items
                                        </h5>
                                        <div className="space-y-2">
                                            {selectedTransaction.order_items?.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between"
                                                    >
                                                        <span className="text-black">
                                                            {item.quantity} x{" "}
                                                            {
                                                                item.product
                                                                    ?.product_name
                                                            }
                                                        </span>
                                                        <span className="text-green-600 font-bold">
                                                            RM {item.price}
                                                        </span>
                                                    </div>
                                                )
                                            ) || (
                                                <p className="text-gray-500">
                                                    No items found
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 font-semibold">
                                        <span className="text-black">
                                            Total Amount:
                                        </span>
                                        <span className="text-blue-600">
                                            RM {selectedTransaction.amount}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                                    <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                                        Print Receipt
                                    </button>
                                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                        Download PDF
                                    </button>
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
