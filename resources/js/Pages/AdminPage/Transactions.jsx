import { useState, useEffect } from "react";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Package,
    Truck,
    CheckCircle,
    DollarSign,
    Clock,
    Zap,
    Eye,
    RefreshCw,
} from "lucide-react";
import { Sidebar } from "@/Components/AdminPage/Sidebar";
import dayjs from "dayjs";
import axios from "axios";

export default function Transactions({ list_transactions }) {
    const [transactions, setTransactions] = useState(
        list_transactions.data || []
    );
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

    const [metrics, setMetrics] = useState({
        totalRevenue: 0,
        completedTransactions: 0,
        pendingRelease: 0,
        releasedPayments: 0,
        totalAmountPending: 0,
    });

    const autoReleasePayment = async (orderId) => {
        setActionLoading(orderId);
        try {
            const response = await axios.post(
                `/api/transactions/${orderId}/release-payment`
            );

            console.log("Release payment response:", response);

            if (response.data.success) {
                // Update the transactions state immediately
                setTransactions((prev) =>
                    prev.map((tx) =>
                        tx.order_id === orderId
                            ? {
                                  ...tx,
                                  payment_status: "released",
                                  payment_released_at: new Date().toISOString(),
                                  order_status: "Payment Released",
                                  seller_earning:
                                      tx.seller_earning?.map((earning) => ({
                                          ...earning,
                                          status: "Released",
                                          released_at: new Date().toISOString(),
                                      })) || [],
                              }
                            : tx
                    )
                );

                showNotification(
                    "💰 Payment Released",
                    `Payment successfully released to seller for order ${orderId}`,
                    "success"
                );
                return true;
            } else {
                showNotification(
                    "❌ Release Failed",
                    response.data.message || "Failed to release payment",
                    "error"
                );
                return false;
            }
        } catch (error) {
            console.error("Error releasing payment:", error);
            showNotification(
                "❌ Error",
                "Error releasing payment. Please try again.",
                "error"
            );
            return false;
        } finally {
            setActionLoading(null);
        }
    };

    // Fix the manualReleasePayment function
    const manualReleasePayment = async (orderId) => {
        const transaction = transactions.find((t) => t.order_id === orderId);
        if (!transaction) return;

        const sellerEarning = transaction.seller_earning?.[0];
        const payoutAmount = sellerEarning?.payout_amount || transaction.amount;

        if (
            window.confirm(
                `Are you sure you want to release RM ${parseFloat(
                    payoutAmount
                ).toFixed(2)} to ${transaction.seller?.seller_name}?`
            )
        ) {
            await autoReleasePayment(orderId);
        }
    };

    // Fix the bulk release logic
    const bulkReleasePayments = async () => {
        const pendingReleases = transactions.filter(
            (transaction) =>
                transaction.order_status === "Completed" &&
                transaction.seller_earning?.[0]?.status === "Pending"
        );

        if (pendingReleases.length === 0) {
            showNotification(
                "ℹ️ No Pending Releases",
                "No payments available for release at this time.",
                "info"
            );
            return;
        }

        const totalAmount = pendingReleases.reduce((sum, t) => {
            const earning = t.seller_earning?.[0];
            return sum + parseFloat(earning?.payout_amount || t.amount || 0);
        }, 0);

        if (
            window.confirm(
                `Release payments for ${
                    pendingReleases.length
                } completed orders? Total amount: RM ${totalAmount.toFixed(2)}`
            )
        ) {
            setIsLoading(true);
            try {
                const results = await Promise.allSettled(
                    pendingReleases.map((transaction) =>
                        autoReleasePayment(transaction.order_id)
                    )
                );

                const successful = results.filter(
                    (r) => r.status === "fulfilled" && r.value
                ).length;
                const failed = results.filter(
                    (r) => r.status === "rejected" || !r.value
                ).length;

                showNotification(
                    "📦 Bulk Release Complete",
                    `Successfully released ${successful} payments. ${
                        failed > 0 ? `${failed} failed.` : ""
                    }`,
                    successful > 0 ? "success" : "warning"
                );
            } catch (error) {
                console.error("Bulk release error:", error);
                showNotification(
                    "❌ Bulk Release Failed",
                    "Error processing bulk release.",
                    "error"
                );
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Enhanced order tracking function
    const showOrderTracking = async (transaction) => {
        try {
            const response = await fetch(
                `/api/transactions/${transaction.id}/tracking`
            );
            const result = response.data;

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
            setSelectedTransaction(transaction);
            setShowOrderTrackingModal(true);
        }
    };

    // Generate report
    const generateReport = () => {
        setShowReportModal(true);
    };

    const calculateMetrics = () => {
        console.log("Calculating metrics from transactions:", transactions);

        const completedTransactions = transactions.filter(
            (t) =>
                t.order_status === "Completed" ||
                t.order_status === "Payment Released"
        );

        const pendingRelease = transactions.filter(
            (t) =>
                t.order_status === "Completed" &&
                t.seller_earning?.[0]?.status === "Pending"
        );

        const releasedPayments = transactions.filter(
            (t) =>
                t.payment_status === "released" ||
                t.seller_earning?.[0]?.status === "Released"
        );

        // Calculate total revenue from ALL completed transactions (including released ones)
        const totalRevenue = completedTransactions.reduce(
            (total, transaction) => {
                const commission =
                    parseFloat(
                        transaction.seller_earning?.[0]?.commission_deducted
                    ) || 0;
                console.log(
                    `Transaction ${transaction.order_id} commission:`,
                    commission
                );
                return total + commission;
            },
            0
        );

        // Calculate pending amount only from pending releases
        const totalAmountPending = pendingRelease.reduce((sum, t) => {
            const payout =
                parseFloat(t.seller_earning?.[0]?.payout_amount) || 0;
            return sum + payout;
        }, 0);

        return {
            totalRevenue,
            completedTransactions: completedTransactions.length,
            pendingRelease: pendingRelease.length,
            releasedPayments: releasedPayments.length,
            totalAmountPending,
        };
    };

    // Monitor for orders that need payment release
    useEffect(() => {
        const checkAndReleasePayments = () => {
            transactions.forEach((transaction) => {
                if (
                    transaction.order_status === "Confirmed" &&
                    transaction.payment_status === "paid" &&
                    !transaction.payment_released
                ) {
                    // Auto-release payment when order is confirmed
                    autoReleasePayment(transaction.id);
                }
            });
        };

        checkAndReleasePayments();
    }, [transactions]);

    useEffect(() => {
        const newMetrics = calculateMetrics();
        setMetrics(newMetrics);
        console.log("Updated metrics:", newMetrics);
    }, [transactions]);

    // Update order status
    const updateOrderStatus = async (transactionId, newStatus) => {
        setActionLoading(transactionId);
        try {
            const response = await fetch(
                `/api/transactions/${transactionId}/status`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                setTransactions((prev) =>
                    prev.map((tx) =>
                        tx.id === transactionId
                            ? {
                                  ...tx,
                                  order_status: newStatus,
                                  status_updated_at: new Date().toISOString(),
                              }
                            : tx
                    )
                );

                if (newStatus === "Confirmed") {
                    autoReleasePayment(transactionId);
                }

                showNotification(
                    "✅ Status Updated",
                    `Order status updated to ${newStatus}`,
                    "success"
                );
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            showNotification(
                "❌ Update Failed",
                "Failed to update order status",
                "error"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // Notification system
    const showNotification = (title, message, type = "info") => {
        // You can replace this with your preferred notification system
        console.log(`[${type}] ${title}: ${message}`);
        // For now, using alert as fallback
        alert(`${title}: ${message}`);
    };

    // Filter transactions
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
            (statusFilter === "paid" &&
                transaction.order_status === "Completed" &&
                transaction.seller_earning?.[0]?.status === "Pending") ||
            (statusFilter === "released" &&
                transaction.seller_earning?.[0]?.status === "Released");

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

    // Order status steps for tracking
    const orderStatusSteps = [
        { status: "Pending", icon: Clock, description: "Order placed" },
        {
            status: "Confirmed",
            icon: CheckCircle,
            description: "Buyer confirmed - Ready for payment release",
        },
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
            status: "Payment Released",
            icon: DollarSign,
            description: "Payment released to seller",
        },
    ];

    // Quick actions for payment release
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
                    <button
                        onClick={() => {
                            setStatusFilter("All");
                            setFilter("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw size={16} />
                        Show All
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <main className="flex-1 p-4 lg:p-6 min-w-0 w-full">
                {/* Mobile Header */}
                <div className="lg:hidden mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                        Payment Management
                    </h1>
                </div>

                {/* Enhanced Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Total Revenue */}
                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Platform Revenue
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    RM {metrics.totalRevenue.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    From {metrics.completedTransactions}{" "}
                                    completed orders
                                </p>
                            </div>
                            <div className="rounded-full bg-green-100 p-3">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Completed Transactions */}
                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Completed Orders
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {metrics.completedTransactions}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Total orders completed
                                </p>
                            </div>
                            <div className="rounded-full bg-blue-100 p-3">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Release */}
                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-l-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Pending Release
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {metrics.pendingRelease}
                                </p>
                                <p className="text-xs text-yellow-600">
                                    RM {metrics.totalAmountPending.toFixed(2)}
                                </p>
                            </div>
                            <div className="rounded-full bg-yellow-100 p-3">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    {/* Released Payments */}
                    <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-l-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Released Payments
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {metrics.releasedPayments}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Payments sent to sellers
                                </p>
                            </div>
                            <div className="rounded-full bg-purple-100 p-3">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <QuickActions />

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header */}
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold text-gray-800">
                                    Transaction Management
                                </h2>
                                <p className="text-gray-600 text-sm lg:text-base">
                                    Manage payments and track order status
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <button
                                    onClick={generateReport}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    <BarChart3 size={16} />
                                    Generate Report
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
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

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="paid">
                                    Paid (Pending Release)
                                </option>
                                <option value="released">Released</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>

                            <select
                                value={paymentMethodFilter}
                                onChange={(e) =>
                                    setPaymentMethodFilter(e.target.value)
                                }
                                className="text-black border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                    value={dateRange.start}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            start: e.target.value,
                                        })
                                    }
                                    className="text-black flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) =>
                                        setDateRange({
                                            ...dateRange,
                                            end: e.target.value,
                                        })
                                    }
                                    className="text-black flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Transactions Table */}
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[1000px] divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order Info
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.payment_intent_id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-4">
                                            <div className="max-w-[200px]">
                                                <div className="font-mono text-sm font-medium text-gray-900 truncate">
                                                    {
                                                        transaction.payment_intent_id
                                                    }
                                                </div>
                                                <div className="text-xs text-gray-500 truncate">
                                                    {transaction.user?.name} →{" "}
                                                    {
                                                        transaction.seller
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
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="text-sm font-semibold text-gray-900">
                                                RM {transaction.amount}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    transaction.order_status ===
                                                    "Completed"
                                                        ? "bg-green-100 text-green-800 border border-green-200"
                                                        : "bg-green-200 text-green-900 border border-green-300"
                                                }`}
                                            >
                                                {transaction.order_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span
                                                    className={`items-center rounded-full text-sm font-bold ${
                                                        transaction
                                                            ?.seller_earning[0]
                                                            ?.status ===
                                                        "Released"
                                                            ? "text-green-800"
                                                            : transaction
                                                                  ?.seller_earning[0]
                                                                  ?.status ===
                                                              "Pending"
                                                            ? " text-yellow-500"
                                                            : " text-red-800"
                                                    }`}
                                                >
                                                    {
                                                        transaction
                                                            ?.seller_earning[0]
                                                            ?.status
                                                    }
                                                </span>
                                                <span className="text-xs text-gray-800">
                                                    {transaction.payment_method}
                                                </span>
                                            </div>
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
                                                    <Eye size={16} />
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
                                                                    size={12}
                                                                    className="animate-spin"
                                                                />
                                                            ) : (
                                                                <DollarSign
                                                                    size={12}
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

                    {/* Pagination */}
                    <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="text-sm text-gray-700">
                                Showing {filteredTransactions.length} of{" "}
                                {transactions.length} transactions
                            </div>
                            <div className="flex items-center space-x-1">
                                <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
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

                {/* Order Tracking Modal */}
                {showOrderTrackingModal && selectedTransaction && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Order Tracking
                                    </h3>
                                    {/* Completion Status Banner */}
                                    {selectedTransaction.tracking_info
                                        ?.is_order_complete && (
                                        <div className="mt-2 bg-green-50 border border-green-200 rounded-md p-3">
                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                                <span className="text-green-800 font-medium">
                                                    {selectedTransaction
                                                        .tracking_info
                                                        ?.completion_message ||
                                                        "This order has been completed successfully!"}
                                                </span>
                                            </div>
                                            {selectedTransaction.tracking_info
                                                ?.is_payment_complete && (
                                                <p className="text-green-600 text-sm mt-1">
                                                    Payment has been released to
                                                    the seller.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        setShowOrderTrackingModal(false)
                                    }
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
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                                        Order #{" "}
                                        {selectedTransaction.payment_intent_id}
                                    </h4>

                                    {/* Enhanced Order Status Timeline */}
                                    <div className="relative">
                                        {(
                                            selectedTransaction.tracking_info
                                                ?.tracking_steps ||
                                            orderStatusSteps
                                        ).map((step, index) => {
                                            const StepIcon =
                                                step.icon || Package;
                                            const isCompleted =
                                                step.completed ||
                                                orderStatusSteps.findIndex(
                                                    (s) =>
                                                        s.status ===
                                                        selectedTransaction.order_status
                                                ) >= index;
                                            const isCurrent =
                                                step.current ||
                                                selectedTransaction.order_status ===
                                                    step.status;

                                            return (
                                                <div
                                                    key={step.status}
                                                    className="flex items-center mb-6"
                                                >
                                                    <div
                                                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                            isCompleted
                                                                ? "bg-green-500"
                                                                : "bg-gray-300"
                                                        } ${
                                                            isCurrent &&
                                                            !isCompleted
                                                                ? "ring-2 ring-blue-500 ring-offset-2"
                                                                : ""
                                                        }`}
                                                    >
                                                        <StepIcon
                                                            className={`w-5 h-5 ${
                                                                isCompleted
                                                                    ? "text-white"
                                                                    : "text-gray-500"
                                                            }`}
                                                        />
                                                    </div>
                                                    <div className="ml-4 flex-1">
                                                        <p
                                                            className={`font-medium ${
                                                                isCompleted
                                                                    ? "text-green-600"
                                                                    : isCurrent
                                                                    ? "text-blue-600 font-semibold"
                                                                    : "text-gray-500"
                                                            }`}
                                                        >
                                                            {step.status}
                                                            {isCurrent &&
                                                                !selectedTransaction
                                                                    .tracking_info
                                                                    ?.is_order_complete && (
                                                                    <span className="ml-2 text-sm text-blue-600">
                                                                        (Current)
                                                                    </span>
                                                                )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {step.description}
                                                        </p>
                                                        {/* Show timestamps for completed steps */}
                                                        {isCompleted &&
                                                            step.status ===
                                                                "Payment Released" &&
                                                            selectedTransaction.payment_released_at && (
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    Released:{" "}
                                                                    {dayjs(
                                                                        selectedTransaction.payment_released_at
                                                                    ).format(
                                                                        "DD MMM YYYY HH:mm"
                                                                    )}
                                                                </p>
                                                            )}
                                                    </div>
                                                    {index <
                                                        (selectedTransaction
                                                            .tracking_info
                                                            ?.tracking_steps
                                                            ?.length ||
                                                            orderStatusSteps.length) -
                                                            1 && (
                                                        <div
                                                            className={`absolute left-5 top-10 w-0.5 h-12 ${
                                                                isCompleted
                                                                    ? "bg-green-500"
                                                                    : "bg-gray-300"
                                                            }`}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h5 className="font-semibold text-gray-700 mb-2">
                                                Buyer Information
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
                                        <div className="bg-gray-50 p-4 rounded-lg">
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
                                                Amount: RM{" "}
                                                {selectedTransaction.amount}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status Update Controls (Admin) - Only show if order is not complete */}
                                    {!selectedTransaction.tracking_info
                                        ?.is_order_complete && (
                                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                            <h5 className="font-semibold text-gray-700 mb-3">
                                                Update Order Status
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {orderStatusSteps.map(
                                                    (step) => (
                                                        <button
                                                            key={step.status}
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    selectedTransaction.id,
                                                                    step.status
                                                                )
                                                            }
                                                            disabled={
                                                                selectedTransaction.order_status ===
                                                                step.status
                                                            }
                                                            className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                                                selectedTransaction.order_status ===
                                                                step.status
                                                                    ? "bg-indigo-600 text-white cursor-not-allowed"
                                                                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-indigo-300"
                                                            }`}
                                                        >
                                                            {step.status}
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
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
