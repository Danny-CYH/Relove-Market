import { useState } from "react";
import { Sidebar } from "@/Components/Admin/Sidebar";

export default function Transactions() {
    const [transactions, setTransactions] = useState([
        {
            id: "TXN-001",
            customer: "John Doe",
            customerEmail: "john.doe@example.com",
            seller: "Fashion Store",
            amount: "$89.99",
            status: "Completed",
            paymentMethod: "Credit Card",
            date: "2023-10-15 14:30",
            items: [
                { name: "Summer T-Shirt", price: "$29.99", quantity: 2 },
                { name: "Shipping", price: "$5.00", quantity: 1 },
            ],
        },
        {
            id: "TXN-002",
            customer: "Jane Smith",
            customerEmail: "jane.smith@example.com",
            seller: "Electronics Hub",
            amount: "$249.99",
            status: "Completed",
            paymentMethod: "PayPal",
            date: "2023-10-14 11:15",
            items: [
                { name: "Wireless Earbuds", price: "$79.99", quantity: 1 },
                { name: "Phone Case", price: "$19.99", quantity: 1 },
                { name: "Shipping", price: "$10.00", quantity: 1 },
            ],
        },
        {
            id: "TXN-003",
            customer: "Robert Johnson",
            customerEmail: "robert.j@example.com",
            seller: "Book World",
            amount: "$45.50",
            status: "Refunded",
            paymentMethod: "Credit Card",
            date: "2023-10-13 16:45",
            items: [
                { name: "Programming Book", price: "$35.50", quantity: 1 },
                { name: "Shipping", price: "$5.00", quantity: 1 },
            ],
        },
        {
            id: "TXN-004",
            customer: "Sarah Wilson",
            customerEmail: "sarah.wilson@example.com",
            seller: "Home Decor",
            amount: "$120.00",
            status: "Pending",
            paymentMethod: "Bank Transfer",
            date: "2023-10-12 09:20",
            items: [
                { name: "Table Lamp", price: "$65.00", quantity: 1 },
                { name: "Decorative Vase", price: "$45.00", quantity: 1 },
                { name: "Shipping", price: "$10.00", quantity: 1 },
            ],
        },
        {
            id: "TXN-005",
            customer: "Michael Brown",
            customerEmail: "michael.b@example.com",
            seller: "Sports Gear",
            amount: "$199.99",
            status: "Failed",
            paymentMethod: "Credit Card",
            date: "2023-10-11 13:05",
            items: [
                { name: "Running Shoes", price: "$129.99", quantity: 1 },
                { name: "Sports Bag", price: "$49.99", quantity: 1 },
                { name: "Shipping", price: "$10.00", quantity: 1 },
            ],
        },
    ]);

    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("All");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter transactions based on search, status, payment method, and date range
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            filter === "" ||
            transaction.id.toLowerCase().includes(filter.toLowerCase()) ||
            transaction.customer.toLowerCase().includes(filter.toLowerCase()) ||
            transaction.seller.toLowerCase().includes(filter.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || transaction.status === statusFilter;

        const matchesPaymentMethod =
            paymentMethodFilter === "All" ||
            transaction.paymentMethod === paymentMethodFilter;

        const matchesDateRange =
            (!dateRange.start && !dateRange.end) ||
            (new Date(transaction.date) >= new Date(dateRange.start) &&
                new Date(transaction.date) <= new Date(dateRange.end));

        return (
            matchesSearch &&
            matchesStatus &&
            matchesPaymentMethod &&
            matchesDateRange
        );
    });

    // Calculate total metrics
    const totalRevenue = transactions
        .filter((t) => t.status === "Completed")
        .reduce((sum, transaction) => {
            const amount = parseFloat(transaction.amount.replace("$", ""));
            return sum + amount;
        }, 0);

    const completedTransactions = transactions.filter(
        (t) => t.status === "Completed"
    ).length;
    const pendingTransactions = transactions.filter(
        (t) => t.status === "Pending"
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

    // Export transactions to CSV
    const exportToCSV = () => {
        const headers = [
            "ID",
            "Customer",
            "Seller",
            "Amount",
            "Status",
            "Payment Method",
            "Date",
        ];
        const csvContent = [
            headers.join(","),
            ...filteredTransactions.map((t) =>
                [
                    t.id,
                    t.customer,
                    t.seller,
                    t.amount,
                    t.status,
                    t.paymentMethod,
                    t.date,
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions_report_${
            new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <Sidebar pendingCount={3} />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
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
                                    ${totalRevenue.toFixed(2)}
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
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Transaction Management
                                </h2>
                                <p className="text-gray-600">
                                    View and manage all transactions
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={generateReport}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Generate Report
                                </button>
                                <button
                                    onClick={exportToCSV}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                        />
                                    </svg>
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by ID, customer, or seller..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <svg
                                    className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Completed">Completed</option>
                                <option value="Pending">Pending</option>
                                <option value="Failed">Failed</option>
                                <option value="Refunded">Refunded</option>
                            </select>

                            <select
                                value={paymentMethodFilter}
                                onChange={(e) =>
                                    setPaymentMethodFilter(e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Methods</option>
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>
                            </select>

                            <div className="flex gap-2">
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
                                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Transaction ID
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Customer
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Seller
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Amount
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Payment Method
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Date
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {transaction.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {transaction.customer}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {
                                                            transaction.customerEmail
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.seller}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaction.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        transaction.status ===
                                                        "Completed"
                                                            ? "bg-green-100 text-green-800"
                                                            : transaction.status ===
                                                              "Pending"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : transaction.status ===
                                                              "Failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.paymentMethod}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaction.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() =>
                                                        generateReceipt(
                                                            transaction
                                                        )
                                                    }
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Receipt
                                                </button>
                                                <button className="text-gray-600 hover:text-gray-900">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
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
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span>{" "}
                                to <span className="font-medium">5</span> of{" "}
                                <span className="font-medium">5</span>{" "}
                                transactions
                            </div>
                            <div className="inline-flex items-center space-x-2">
                                <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">
                                    1
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Receipt Modal */}
                {showReceiptModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Transaction Receipt
                                </h3>
                                <button
                                    onClick={() => setShowReceiptModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
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
                                            <h4 className="text-xl font-bold">
                                                INVOICE
                                            </h4>
                                            <p className="text-gray-600">
                                                Transaction ID:{" "}
                                                {selectedTransaction.id}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold">
                                                {selectedTransaction.amount}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Status:{" "}
                                                {selectedTransaction.status}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h5 className="font-semibold text-gray-700 mb-2">
                                                Customer Information
                                            </h5>
                                            <p>
                                                {selectedTransaction.customer}
                                            </p>
                                            <p className="text-gray-600">
                                                {
                                                    selectedTransaction.customerEmail
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-700 mb-2">
                                                Seller Information
                                            </h5>
                                            <p>{selectedTransaction.seller}</p>
                                            <p className="text-gray-600">
                                                Payment Method:{" "}
                                                {
                                                    selectedTransaction.paymentMethod
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h5 className="font-semibold text-gray-700 mb-2">
                                            Transaction Details
                                        </h5>
                                        <p>Date: {selectedTransaction.date}</p>
                                    </div>

                                    <div className="border-t border-b border-gray-200 py-4">
                                        <h5 className="font-semibold text-gray-700 mb-2">
                                            Items
                                        </h5>
                                        <div className="space-y-2">
                                            {selectedTransaction.items.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex justify-between"
                                                    >
                                                        <span>
                                                            {item.quantity} x{" "}
                                                            {item.name}
                                                        </span>
                                                        <span>
                                                            {item.price}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-4 font-semibold">
                                        <span>Total Amount:</span>
                                        <span>
                                            {selectedTransaction.amount}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3">
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
