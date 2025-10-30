import React, { useEffect, useState, useRef } from "react";
import {
    Check,
    CreditCard,
    Download,
    AlertCircle,
    Star,
    Rocket,
    Gem,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Printer,
    FileText,
} from "lucide-react";

import dayjs from "dayjs";

import { Link, usePage } from "@inertiajs/react";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";

export default function SubscriptionPage({
    list_subscription,
    billing_records,
}) {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("plans");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    // Use actual billing records data instead of empty array
    const [billingHistory, setBillingHistory] = useState(
        billing_records?.data || []
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Ref for printable receipt
    const receiptRef = useRef();

    const { auth } = usePage().props;

    // Transform the actual subscription data to match your existing structure
    const transformSubscriptionData = (subscriptions) => {
        return subscriptions.reduce((acc, subscription) => {
            const limits =
                typeof subscription.limits === "string"
                    ? JSON.parse(subscription.limits)
                    : subscription.limits || {};

            const planKey =
                subscription.subscription_plan_id
                    ?.toLowerCase()
                    ?.replace("plan-", "") || subscription.subscription_plan_id;

            acc[planKey] = {
                name: subscription.plan_name,
                price: parseFloat(subscription.price) || 0,
                monthlyPrice: parseFloat(subscription.price) || 0,
                yearlyPrice: (parseFloat(subscription.price) || 0) * 0.8, // 20% discount for yearly
                description: subscription.description,
                features:
                    subscription.subscription_features?.map(
                        (f) => f.feature_text
                    ) || [],
                limitations: getLimitations(subscription.plan_name, limits),
                popular:
                    subscription.plan_name?.toLowerCase().includes("pro") ||
                    subscription.plan_name
                        ?.toLowerCase()
                        .includes("professional"),
                icon: getPlanIcon(subscription.plan_name),
                limits: limits,
                subscription_plan_id: subscription.subscription_plan_id,
                status: subscription.status,
                duration: subscription.duration,
                // Add subscription dates for next billing calculation
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                last_billing_date: subscription.last_billing_date,
            };
            return acc;
        }, {});
    };

    const getPlanIcon = (planName) => {
        const name = planName?.toLowerCase() || "";
        if (
            name.includes("starter") ||
            name.includes("free") ||
            name.includes("trial")
        ) {
            return <Sparkles size={24} className="text-gray-400" />;
        } else if (name.includes("pro") || name.includes("professional")) {
            return <Rocket size={24} className="text-blue-500" />;
        } else if (name.includes("enterprise") || name.includes("business")) {
            return <Gem size={24} className="text-purple-500" />;
        }
        return <Sparkles size={24} className="text-gray-400" />;
    };

    const getLimitations = (planName, limits) => {
        const name = planName?.toLowerCase() || "";
        const limitations = [];

        if (limits?.max_products > 0 && limits.max_products < 999) {
            limitations.push(`Limited to ${limits.max_products} products`);
        }

        if (limits?.max_conversations > 0 && limits.max_conversations < 999) {
            limitations.push(
                `Limited to ${limits.max_conversations} active conversations`
            );
        }

        if (!limits?.featured_listing) {
            limitations.push("No featured listing priority");
        }

        if (name.includes("starter") || name.includes("free")) {
            limitations.push("No advanced analytics", "Limited customization");
        }

        return limitations.length > 0 ? limitations : ["No limitations"];
    };

    // Calculate next billing date based on subscription data
    const calculateNextBillingDate = (currentPlan) => {
        if (!currentPlan) return "August 15, 2025"; // Fallback date

        // Use the end_date if available
        if (currentPlan.end_date) {
            const endDate = new Date(currentPlan.end_date);
            return endDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        // Use last_billing_date + duration if available
        if (currentPlan.last_billing_date && currentPlan.duration) {
            const lastBillingDate = new Date(currentPlan.last_billing_date);
            const nextBillingDate = new Date(lastBillingDate);
            nextBillingDate.setDate(
                nextBillingDate.getDate() + parseInt(currentPlan.duration)
            );

            return nextBillingDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        // Use start_date + duration if available
        if (currentPlan.start_date && currentPlan.duration) {
            const startDate = new Date(currentPlan.start_date);
            const nextBillingDate = new Date(startDate);
            nextBillingDate.setDate(
                nextBillingDate.getDate() + parseInt(currentPlan.duration)
            );

            return nextBillingDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        }

        // Fallback to current date + 30 days
        const nextDate = new Date();
        nextDate.setDate(nextDate.getDate() + 30);
        return nextDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Extract subscription data from the paginated response
    const subscriptionData = list_subscription?.data || [];

    // Use actual data if available, otherwise fallback to demo data
    const plans =
        subscriptionData.length > 0
            ? transformSubscriptionData(subscriptionData)
            : "No subscriptions data";

    // Pagination calculations for billing history
    const totalPages = Math.ceil(billingHistory.length / itemsPerPage);
    const currentBillingItems = billingHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Safely get current plan - use the first available plan or a default
    const getCurrentPlan = () => {
        const planValues = Object.values(plans);
        if (planValues.length === 0) {
            // Return a default plan if no plans exist
            return {
                name: "Starter",
                monthlyPrice: 0,
                yearlyPrice: 0,
            };
        }

        // Try to find a pro plan, otherwise use the first plan
        return (
            plans.pro ||
            plans.professional ||
            planValues.find((p) => p.popular) ||
            planValues[0]
        );
    };

    const currentPlan = getCurrentPlan();
    const nextBillingDate = calculateNextBillingDate(currentPlan);

    const savings =
        billingCycle === "yearly" && currentPlan?.monthlyPrice > 0
            ? currentPlan.monthlyPrice * 12 - currentPlan.yearlyPrice * 12
            : 0;

    const handleUpgrade = (planKey) => {
        console.log("Upgrading to plan:", planKey);
        setSelectedPlan(plans[planKey]);
        setShowPaymentModal(true);
    };

    const calculatePrice = (plan) => {
        if (!plan) return 0;
        return billingCycle === "yearly"
            ? plan.yearlyPrice || 0
            : plan.monthlyPrice || 0;
    };

    // Format billing record data for display
    const formatBillingRecord = (record) => {
        return {
            id: record.invoice_id || record.id || `INV-${record.id}`,
            date: record.created_at
                ? new Date(record.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                  })
                : "N/A",
            plan:
                record.plan_name ||
                record.subscription_plan?.plan_name ||
                "Unknown Plan",
            amount: record.amount
                ? `RM ${parseFloat(record.amount).toFixed(2)}`
                : "RM 0.00",
            method: record.payment_method || "Credit Card",
            status: record.status || "Pending",
            receipt_url: record.receipt_url || null,
            // Additional fields for receipt
            originalRecord: record,
        };
    };

    // Handle view receipt
    const handleViewReceipt = (bill) => {
        setSelectedReceipt(bill);
        setShowReceiptModal(true);
    };

    // Handle print receipt
    const handlePrintReceipt = () => {
        const printContent = receiptRef.current.innerHTML;
        const originalContent = document.body.innerHTML;

        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore React functionality
    };

    // Generate receipt number
    const generateReceiptNumber = (bill) => {
        const date = new Date(bill.originalRecord?.created_at || new Date());
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const id = bill.originalRecord?.id || "0000";
        return `RCP-${year}${month}${day}-${String(id).padStart(4, "0")}`;
    };

    // Pagination component
    const Pagination = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing{" "}
                            <span className="font-medium">
                                {(currentPage - 1) * itemsPerPage + 1}
                            </span>{" "}
                            to{" "}
                            <span className="font-medium">
                                {Math.min(
                                    currentPage * itemsPerPage,
                                    billingHistory.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium">
                                {billingHistory.length}
                            </span>{" "}
                            results
                        </p>
                    </div>
                    <div>
                        <nav
                            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                            aria-label="Pagination"
                        >
                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(prev - 1, 1)
                                    )
                                }
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeft
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>

                            {pageNumbers.map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => setCurrentPage(pageNumber)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === pageNumber
                                            ? "bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                            : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            ))}

                            <button
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(prev + 1, totalPages)
                                    )
                                }
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRight
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    // Receipt Modal Component
    const ReceiptModal = () => {
        if (!selectedReceipt) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Payment Receipt
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrintReceipt}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                                <Printer size={16} />
                                Print Receipt
                            </button>
                            <button
                                onClick={() => {
                                    setShowReceiptModal(false);
                                    setSelectedReceipt(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                    </div>

                    {/* Printable Receipt */}
                    <div
                        ref={receiptRef}
                        className="bg-white p-6 border border-gray-200 rounded-lg"
                    >
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {auth.seller.seller_store.store_name}
                            </h1>
                            <p className="text-gray-600">Business Platform</p>
                            <p className="text-gray-600 text-sm mt-1">
                                {auth.seller.seller_store.store_address}
                            </p>
                            <p className="text-gray-600 text-sm">
                                Tel: +603-1234 5678 | Email:
                                info@gemilangberjaya.com
                            </p>
                        </div>

                        <div className="border-t border-b border-gray-300 py-4 mb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        PAYMENT RECEIPT
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Receipt No:{" "}
                                        {generateReceiptNumber(selectedReceipt)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-600">
                                        Date: {selectedReceipt.date}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        Status:{" "}
                                        <span className="font-semibold text-green-600">
                                            {selectedReceipt.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-900 mb-2">
                                Bill To:
                            </h3>
                            <p className="text-gray-600">
                                {auth.seller.seller_store.store_name}
                            </p>
                        </div>

                        <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden text-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                                            Description
                                        </th>
                                        <th className="px-6 py-3 text-right font-semibold text-gray-700 border-b border-gray-200">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 align-top">
                                            <div className="space-y-1">
                                                <p className="font-medium text-gray-900">
                                                    {selectedReceipt
                                                        ?.subscription
                                                        ?.plan_name
                                                        ? `${selectedReceipt.subscription.plan_name} - Plan Subscription`
                                                        : "Plan Subscription"}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Payment Date:{" "}
                                                    {selectedReceipt?.created_at
                                                        ? dayjs(
                                                              selectedReceipt.created_at
                                                          ).format("MMMM YYYY")
                                                        : "N/A"}
                                                </p>
                                                <p className="text-gray-600 text-sm">
                                                    Duration:{" "}
                                                    {selectedReceipt
                                                        ?.subscription
                                                        .duration || "N/A"}{" "}
                                                    days
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900 align-top">
                                            {selectedReceipt?.amount
                                                ? `RM ${parseFloat(
                                                      selectedReceipt.amount
                                                  ).toFixed(2)}`
                                                : "RM 0.00"}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-gray-100 border-t border-gray-200">
                                    <tr>
                                        <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                            Total Amount:
                                        </td>
                                        <td className="px-6 py-3 text-right font-semibold text-gray-900">
                                            {selectedReceipt?.amount
                                                ? `RM ${parseFloat(
                                                      selectedReceipt.amount
                                                  ).toFixed(2)}`
                                                : "RM 0.00"}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="border-t border-gray-300 pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                <div>
                                    <p className="font-semibold">
                                        Payment Details:
                                    </p>
                                    <p>Method: {selectedReceipt.method}</p>
                                    <p>
                                        Status: {selectedReceipt.payment_status}
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        Thank you for your business!
                                    </p>
                                    <p>
                                        This receipt is computer generated and
                                        does not require a signature.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-300 text-center">
                            <p className="text-gray-500 text-xs">
                                For any inquiries, please contact our support
                                team at support@gemilangberjaya.com or call
                                +603-1234 5678 during business hours (9:00 AM -
                                6:00 PM, Mon-Fri)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar shopName="Gemilang Berjaya" />

            <main className="flex-1 p-4 md:p-6">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Subscription Plan
                    </h1>
                    <p className="text-gray-600 mt-2 text-sm md:text-base">
                        Choose the perfect plan for your business growth and
                        manage your billing
                    </p>
                    {/* Debug info */}
                    {subscriptionData.length > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                            Loaded {subscriptionData.length} subscription
                            plan(s) from server
                        </p>
                    )}
                    {billingHistory.length > 0 && (
                        <p className="text-sm text-blue-600 mt-1">
                            Loaded {billingHistory.length} billing record(s)
                            from server
                        </p>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6 md:mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab("plans")}
                        className={`px-4 md:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                            activeTab === "plans"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Plans & Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab("billing")}
                        className={`px-4 md:px-6 py-3 font-medium text-sm whitespace-nowrap ${
                            activeTab === "billing"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Billing History
                    </button>
                </div>

                {activeTab === "plans" && (
                    <>
                        {/* Current Plan Banner */}
                        {currentPlan && (
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 md:p-6 text-white mb-6 md:mb-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <h2 className="text-lg md:text-xl font-semibold mb-2">
                                            Your Current Plan
                                        </h2>
                                        <p className="text-blue-100 text-sm md:text-base">
                                            {currentPlan.name} • RM
                                            {currentPlan.monthlyPrice}/month
                                        </p>
                                        <p className="text-blue-100 text-xs md:text-sm mt-1">
                                            Next billing date: {nextBillingDate}
                                        </p>
                                        {currentPlan.duration && (
                                            <p className="text-blue-100 text-xs md:text-sm mt-1">
                                                Duration: {currentPlan.duration}{" "}
                                                days
                                            </p>
                                        )}
                                    </div>
                                    <div className="bg-white/20 px-3 md:px-4 py-1 md:py-2 rounded-full self-start md:self-auto">
                                        <span className="text-xs md:text-sm font-medium">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Billing Toggle */}
                        <div className="flex justify-center mb-6 md:mb-8">
                            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition ${
                                        billingCycle === "monthly"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle("yearly")}
                                    className={`px-4 md:px-6 py-2 rounded-md text-sm font-medium transition ${
                                        billingCycle === "yearly"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Yearly
                                    {billingCycle === "yearly" &&
                                        currentPlan?.monthlyPrice > 0 && (
                                            <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                                Save 20%
                                            </span>
                                        )}
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                            {Object.entries(plans).map(([key, plan]) => {
                                const price = calculatePrice(plan);
                                const isCurrent =
                                    plan.name === currentPlan?.name;

                                return (
                                    <div
                                        key={key}
                                        className={`relative rounded-xl border-2 p-4 md:p-6 transition-all ${
                                            plan.popular
                                                ? "border-blue-500 shadow-lg md:shadow-xl md:transform md:scale-105"
                                                : "border-gray-200 hover:border-gray-300"
                                        } ${
                                            isCurrent
                                                ? "ring-2 ring-blue-500 ring-opacity-50"
                                                : ""
                                        }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-blue-500 text-white px-3 md:px-4 py-1 rounded-full text-xs font-semibold flex items-center">
                                                    <Star
                                                        size={12}
                                                        className="mr-1"
                                                    />
                                                    MOST POPULAR
                                                </span>
                                            </div>
                                        )}

                                        {isCurrent && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-green-500 text-white px-3 md:px-4 py-1 rounded-full text-xs font-semibold">
                                                    CURRENT PLAN
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-4 md:mb-6">
                                            <div className="flex justify-center mb-3 md:mb-4">
                                                {plan.icon}
                                            </div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-gray-600 text-xs md:text-sm mb-3 md:mb-4">
                                                {plan.description}
                                            </p>

                                            <div className="mb-3 md:mb-4">
                                                <span className="text-2xl md:text-3xl font-bold text-gray-900">
                                                    RM {price}
                                                </span>
                                                <span className="text-gray-600 text-sm md:text-base">
                                                    /
                                                    {billingCycle === "yearly"
                                                        ? " year"
                                                        : " month"}
                                                </span>
                                            </div>

                                            {billingCycle === "yearly" &&
                                                plan.monthlyPrice > 0 && (
                                                    <p className="text-xs md:text-sm text-gray-500">
                                                        Equivalent to RM
                                                        {plan.yearlyPrice}/month
                                                    </p>
                                                )}
                                        </div>

                                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                                            {plan.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center"
                                                    >
                                                        <Check
                                                            size={14}
                                                            className="text-green-500 mr-2 md:mr-3 flex-shrink-0"
                                                        />
                                                        <span className="text-xs md:text-sm text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {plan.limitations &&
                                            plan.limitations.length > 0 && (
                                                <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
                                                    <h4 className="text-xs md:text-sm font-semibold text-gray-900 mb-2">
                                                        Limitations
                                                    </h4>
                                                    <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                                                        {plan.limitations.map(
                                                            (limit, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="flex items-center"
                                                                >
                                                                    <AlertCircle
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-gray-400 mr-2"
                                                                    />
                                                                    {limit}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                        <Link
                                            href={route(
                                                "seller-purchase-subscription",
                                                plan.subscription_plan_id
                                            )}
                                        >
                                            <button
                                                className={`w-full py-2 md:py-3 rounded-lg font-semibold text-sm transition ${
                                                    isCurrent
                                                        ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                                                        : plan.popular
                                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                                        : "bg-gray-900 text-white hover:bg-gray-800"
                                                }`}
                                                disabled={isCurrent}
                                            >
                                                {isCurrent
                                                    ? "Current Plan"
                                                    : "Choose Plan"}
                                            </button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature Comparison */}
                        {Object.keys(plans).length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
                                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6 text-center">
                                    Plan Comparison
                                </h3>
                                <div className="overflow-x-auto -mx-4 md:mx-0">
                                    <div className="min-w-full inline-block align-middle">
                                        <div className="overflow-hidden">
                                            <table className="min-w-full text-sm text-black">
                                                <thead>
                                                    <tr className="border-b">
                                                        <th className="text-left pb-3 md:pb-4 px-2 md:px-0">
                                                            Features
                                                        </th>
                                                        {Object.values(
                                                            plans
                                                        ).map((plan, index) => (
                                                            <th
                                                                key={index}
                                                                className="text-center pb-3 md:pb-4 px-2 md:px-0"
                                                            >
                                                                <span className="text-xs md:text-sm">
                                                                    {plan.name}
                                                                </span>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        [
                                                            "Max Products",
                                                            ...Object.values(
                                                                plans
                                                            ).map(
                                                                (p) =>
                                                                    p.limits
                                                                        ?.max_products ||
                                                                    "Unlimited"
                                                            ),
                                                        ],
                                                        [
                                                            "Max Conversations",
                                                            ...Object.values(
                                                                plans
                                                            ).map(
                                                                (p) =>
                                                                    p.limits
                                                                        ?.max_conversations ||
                                                                    "Unlimited"
                                                            ),
                                                        ],
                                                        [
                                                            "Featured Listing",
                                                            ...Object.values(
                                                                plans
                                                            ).map((p) =>
                                                                p.limits
                                                                    ?.featured_listing
                                                                    ? "✓"
                                                                    : "✗"
                                                            ),
                                                        ],
                                                        [
                                                            "Support",
                                                            ...Object.values(
                                                                plans
                                                            ).map((p) =>
                                                                p.name.includes(
                                                                    "Enterprise"
                                                                )
                                                                    ? "24/7"
                                                                    : p.name.includes(
                                                                          "Pro"
                                                                      ) ||
                                                                      p.name.includes(
                                                                          "Professional"
                                                                      )
                                                                    ? "Priority"
                                                                    : "Email"
                                                            ),
                                                        ],
                                                    ].map(
                                                        (
                                                            [
                                                                feature,
                                                                ...values
                                                            ],
                                                            index
                                                        ) => (
                                                            <tr
                                                                key={index}
                                                                className="border-b hover:bg-gray-50"
                                                            >
                                                                <td className="py-2 md:py-3 font-medium px-2 md:px-0 text-xs md:text-sm">
                                                                    {feature}
                                                                </td>
                                                                {values.map(
                                                                    (
                                                                        value,
                                                                        i
                                                                    ) => (
                                                                        <td
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="py-2 md:py-3 text-center px-2 md:px-0"
                                                                        >
                                                                            {value ===
                                                                            "✓" ? (
                                                                                <Check
                                                                                    size={
                                                                                        14
                                                                                    }
                                                                                    className="text-green-500 mx-auto"
                                                                                />
                                                                            ) : value ===
                                                                              "✗" ? (
                                                                                <span className="text-gray-400">
                                                                                    —
                                                                                </span>
                                                                            ) : (
                                                                                <span className="text-xs md:text-sm">
                                                                                    {
                                                                                        value
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* FAQ Section */}
                        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4 md:mb-6">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-3 md:space-y-4">
                                {[
                                    {
                                        question:
                                            "Can I change my plan anytime?",
                                        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
                                    },
                                    {
                                        question:
                                            "What payment methods do you accept?",
                                        answer: "We accept credit cards, PayPal, and bank transfers for monthly subscriptions.",
                                    },
                                    {
                                        question: "Is there a setup fee?",
                                        answer: "No, there are no setup fees for any of our plans. You only pay the monthly subscription fee.",
                                    },
                                    {
                                        question:
                                            "Can I cancel my subscription?",
                                        answer: "Yes, you can cancel your subscription at any time. You'll have access until the end of your billing period.",
                                    },
                                ].map((faq, index) => (
                                    <div
                                        key={index}
                                        className="border-b pb-3 md:pb-4 last:border-b-0"
                                    >
                                        <h4 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">
                                            {faq.question}
                                        </h4>
                                        <p className="text-gray-600 text-xs md:text-sm">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "billing" && (
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 md:p-6">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h2 className="text-base md:text-lg font-semibold text-gray-900">
                                    Billing History
                                </h2>
                            </div>

                            <div className="overflow-x-auto -mx-4 md:mx-0">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="overflow-hidden">
                                        <table className="min-w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Receipt ID
                                                    </th>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Date
                                                    </th>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Plan
                                                    </th>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Amount
                                                    </th>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Status
                                                    </th>
                                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left font-medium text-gray-600 text-xs md:text-sm">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {currentBillingItems.length >
                                                0 ? (
                                                    currentBillingItems.map(
                                                        (bill, index) => {
                                                            return (
                                                                <tr
                                                                    key={
                                                                        bill.receipt_id ||
                                                                        index
                                                                    }
                                                                    className="hover:bg-gray-50"
                                                                >
                                                                    <td className="px-3 md:px-4 py-2 md:py-3 font-medium text-gray-900 text-xs md:text-sm">
                                                                        {
                                                                            bill.receipt_id
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm">
                                                                        {dayjs(
                                                                            bill.created_at
                                                                        ).format(
                                                                            "MMM YYYY"
                                                                        )}
                                                                    </td>
                                                                    <td className="px-3 md:px-4 py-2 md:py-3 text-gray-600 text-xs md:text-sm">
                                                                        {
                                                                            bill.subscription_plan_id
                                                                        }
                                                                    </td>
                                                                    <td className="px-3 md:px-4 py-2 md:py-3 font-medium text-gray-900 text-xs md:text-sm">
                                                                        RM{" "}
                                                                        {
                                                                            bill.amount
                                                                        }
                                                                    </td>

                                                                    <td className="px-3 md:px-4 py-2 md:py-3">
                                                                        <span
                                                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                                bill.payment_status ===
                                                                                    "paid" ||
                                                                                bill.payment_status ===
                                                                                    "completed"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : bill.payment_status ===
                                                                                      "pending"
                                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                                    : "bg-red-100 text-red-800"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                bill.payment_status
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-3 md:px-4 py-2 md:py-3">
                                                                        <div className="flex gap-1 md:gap-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleViewReceipt(
                                                                                        bill
                                                                                    )
                                                                                }
                                                                                className="flex items-center gap-1 px-2 md:px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"
                                                                            >
                                                                                <FileText
                                                                                    size={
                                                                                        10
                                                                                    }
                                                                                />
                                                                                <span className="hidden xs:inline">
                                                                                    Receipt
                                                                                </span>
                                                                            </button>
                                                                            {bill.receipt_url && (
                                                                                <a
                                                                                    href={
                                                                                        bill.receipt_url
                                                                                    }
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="flex items-center gap-1 px-2 md:px-3 py-1 border border-gray-300 text-gray-700 rounded text-xs font-medium hover:bg-gray-50"
                                                                                >
                                                                                    <Download
                                                                                        size={
                                                                                            10
                                                                                        }
                                                                                    />
                                                                                    <span className="hidden xs:inline">
                                                                                        Download
                                                                                    </span>
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="px-3 md:px-4 py-2 md:py-3 text-center text-gray-500 italic text-xs md:text-sm"
                                                        >
                                                            No billing records
                                                            found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagination */}
                        {billingHistory.length > 0 && <Pagination />}
                    </div>
                )}

                {/* Receipt Modal */}
                {showReceiptModal && <ReceiptModal />}

                {/* Payment Modal */}
                {showPaymentModal && selectedPlan && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-4 md:p-6 w-full max-w-md">
                            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                                Upgrade to {selectedPlan.name}
                            </h3>
                            <div className="bg-blue-50 rounded-lg p-3 md:p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-sm md:text-base">
                                        Total Due Today
                                    </span>
                                    <span className="text-xl md:text-2xl font-bold">
                                        RM {calculatePrice(selectedPlan)}
                                    </span>
                                </div>
                                {billingCycle === "yearly" &&
                                    selectedPlan.monthlyPrice > 0 && (
                                        <p className="text-xs md:text-sm text-blue-700">
                                            You'll save RM
                                            {selectedPlan.monthlyPrice * 12 -
                                                selectedPlan.yearlyPrice *
                                                    12}{" "}
                                            annually compared to monthly billing
                                        </p>
                                    )}
                            </div>

                            <div className="space-y-3 md:space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 md:gap-3 mt-4 md:mt-6">
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="flex-1 py-2 md:py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm md:text-base"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setSelectedPlan(null);
                                    }}
                                    className="flex-1 py-2 md:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm md:text-base"
                                >
                                    Confirm Payment
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
