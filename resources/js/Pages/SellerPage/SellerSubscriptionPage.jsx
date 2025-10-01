import React, { useState } from "react";
import {
    Check,
    Crown,
    Zap,
    Building,
    CreditCard,
    Download,
    Receipt,
    Calendar,
    ArrowRight,
    Shield,
    BarChart3,
    Headphones,
    Settings,
    RefreshCw,
    AlertCircle,
    Info,
    Star,
    Rocket,
    Gem,
    Sparkles,
} from "lucide-react";
import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";

export default function SubscriptionPage() {
    const [selectedPlan, setSelectedPlan] = useState("pro");
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [activeTab, setActiveTab] = useState("plans");

    const plans = {
        free: {
            name: "Starter",
            price: 0,
            monthlyPrice: 0,
            yearlyPrice: 0,
            description: "Perfect for new sellers testing the platform",
            features: [
                "Up to 10 products",
                "Basic analytics dashboard",
                "Email support (48h response)",
                "Standard transaction fees",
                "1 staff account",
            ],
            limitations: [
                "No advanced analytics",
                "Limited customization",
                "Basic reporting only",
            ],
            popular: false,
            icon: <Sparkles size={24} className="text-gray-400" />,
        },
        pro: {
            name: "Professional",
            price: 29,
            monthlyPrice: 29,
            yearlyPrice: 24,
            description: "Ideal for growing businesses and serious sellers",
            features: [
                "Unlimited products",
                "Advanced analytics & insights",
                "Priority support (24h response)",
                "Reduced transaction fees (2.5%)",
                "5 staff accounts",
                "Custom branding",
                "Inventory management",
                "Sales reports",
            ],
            popular: true,
            icon: <Rocket size={24} className="text-blue-500" />,
        },
        enterprise: {
            name: "Enterprise",
            price: 99,
            monthlyPrice: 99,
            yearlyPrice: 79,
            description: "For high-volume sellers needing premium features",
            features: [
                "Everything in Professional",
                "Dedicated account manager",
                "24/7 phone support",
                "Custom transaction fees",
                "Unlimited staff accounts",
                "API access",
                "Custom integrations",
                "White-label solutions",
                "Advanced security features",
            ],
            popular: false,
            icon: <Gem size={24} className="text-purple-500" />,
        },
    };

    const [billingHistory] = useState([
        {
            id: "INV-001",
            date: "2025-07-15",
            plan: "Professional",
            amount: 29,
            status: "Paid",
            method: "Credit Card",
            receipt: "#REC-789012",
        },
        {
            id: "INV-002",
            date: "2025-06-15",
            plan: "Professional",
            amount: 29,
            status: "Paid",
            method: "PayPal",
            receipt: "#REC-789011",
        },
        {
            id: "INV-003",
            date: "2025-05-15",
            plan: "Professional",
            amount: 29,
            status: "Failed",
            method: "Credit Card",
            receipt: "#REC-789010",
        },
    ]);

    const currentPlan = plans.pro;
    const savings =
        billingCycle === "yearly"
            ? plans.pro.monthlyPrice * 12 - plans.pro.yearlyPrice * 12
            : 0;

    const handleUpgrade = () => {
        setShowPaymentModal(true);
    };

    const calculatePrice = (plan) => {
        return billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar shopName="Gemilang Berjaya" />

            <main className="flex-1 p-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Subscription Plan
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Choose the perfect plan for your business growth and
                        manage your billing
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab("plans")}
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === "plans"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Plans & Pricing
                    </button>
                    <button
                        onClick={() => setActiveTab("billing")}
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === "billing"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Billing History
                    </button>
                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`px-6 py-3 font-medium text-sm ${
                            activeTab === "payment"
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Payment Methods
                    </button>
                </div>

                {activeTab === "plans" && (
                    <>
                        {/* Current Plan Banner */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white mb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        Your Current Plan
                                    </h2>
                                    <p className="text-blue-100">
                                        Professional • $
                                        {currentPlan.monthlyPrice}/month
                                    </p>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Next billing date: August 15, 2025
                                    </p>
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-full">
                                    <span className="text-sm font-medium">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Billing Toggle */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white rounded-lg shadow-sm p-1 inline-flex">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                                        billingCycle === "monthly"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Monthly
                                </button>
                                <button
                                    onClick={() => setBillingCycle("yearly")}
                                    className={`px-6 py-2 rounded-md text-sm font-medium transition ${
                                        billingCycle === "yearly"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    Yearly
                                    {billingCycle === "yearly" && (
                                        <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                            Save 20%
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Plans Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                            {Object.entries(plans).map(([key, plan]) => {
                                const price = calculatePrice(plan);
                                const isCurrent = key === "pro";

                                return (
                                    <div
                                        key={key}
                                        className={`relative rounded-xl border-2 p-6 transition-all ${
                                            plan.popular
                                                ? "border-blue-500 shadow-xl transform scale-105"
                                                : "border-gray-200 hover:border-gray-300"
                                        } ${
                                            isCurrent
                                                ? "ring-2 ring-blue-500 ring-opacity-50"
                                                : ""
                                        }`}
                                    >
                                        {plan.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center">
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
                                                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
                                                    CURRENT PLAN
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-6">
                                            <div className="flex justify-center mb-4">
                                                {plan.icon}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {plan.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {plan.description}
                                            </p>

                                            <div className="mb-4">
                                                <span className="text-3xl font-bold text-gray-900">
                                                    ${price}
                                                </span>
                                                <span className="text-gray-600">
                                                    /
                                                    {billingCycle === "yearly"
                                                        ? "year"
                                                        : "month"}
                                                </span>
                                            </div>

                                            {billingCycle === "yearly" &&
                                                plan.monthlyPrice > 0 && (
                                                    <p className="text-sm text-gray-500">
                                                        Equivalent to $
                                                        {plan.yearlyPrice}/month
                                                    </p>
                                                )}
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {plan.features.map(
                                                (feature, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center"
                                                    >
                                                        <Check
                                                            size={16}
                                                            className="text-green-500 mr-3 flex-shrink-0"
                                                        />
                                                        <span className="text-sm text-gray-700">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {plan.limitations && (
                                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                                    Limitations
                                                </h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    {plan.limitations.map(
                                                        (limit, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-center"
                                                            >
                                                                <AlertCircle
                                                                    size={14}
                                                                    className="text-gray-400 mr-2"
                                                                />
                                                                {limit}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        <button
                                            onClick={
                                                isCurrent
                                                    ? undefined
                                                    : handleUpgrade
                                            }
                                            className={`w-full py-3 rounded-lg font-semibold transition ${
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
                                    </div>
                                );
                            })}
                        </div>

                        {/* Feature Comparison */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                                Plan Comparison
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left pb-4">
                                                Features
                                            </th>
                                            <th className="text-center pb-4">
                                                Starter
                                            </th>
                                            <th className="text-center pb-4">
                                                Professional
                                            </th>
                                            <th className="text-center pb-4">
                                                Enterprise
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            [
                                                "Products",
                                                "10",
                                                "Unlimited",
                                                "Unlimited",
                                            ],
                                            [
                                                "Staff Accounts",
                                                "1",
                                                "5",
                                                "Unlimited",
                                            ],
                                            [
                                                "Support",
                                                "Email",
                                                "Priority",
                                                "24/7 Dedicated",
                                            ],
                                            [
                                                "Transaction Fees",
                                                "3.5%",
                                                "2.5%",
                                                "Custom",
                                            ],
                                            [
                                                "Analytics",
                                                "Basic",
                                                "Advanced",
                                                "Advanced +",
                                            ],
                                            ["Custom Branding", "✗", "✓", "✓"],
                                            ["API Access", "✗", "✗", "✓"],
                                        ].map(([feature, ...values], index) => (
                                            <tr
                                                key={index}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 font-medium">
                                                    {feature}
                                                </td>
                                                {values.map((value, i) => (
                                                    <td
                                                        key={i}
                                                        className="py-3 text-center"
                                                    >
                                                        {value === "✓" ? (
                                                            <Check
                                                                size={16}
                                                                className="text-green-500 mx-auto"
                                                            />
                                                        ) : value === "✗" ? (
                                                            <span className="text-gray-400">
                                                                —
                                                            </span>
                                                        ) : (
                                                            value
                                                        )}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
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
                                        className="border-b pb-4 last:border-b-0"
                                    >
                                        <h4 className="font-medium text-gray-900 mb-2">
                                            {faq.question}
                                        </h4>
                                        <p className="text-gray-600 text-sm">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {activeTab === "billing" && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Billing History
                            </h2>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                                <Download size={16} />
                                Export Records
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Invoice ID
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Date
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Plan
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Amount
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Payment Method
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {billingHistory.map((bill) => (
                                        <tr
                                            key={bill.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {bill.id}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {bill.date}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {bill.plan}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                ${bill.amount}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {bill.method}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                        bill.status === "Paid"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {bill.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                    View Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "payment" && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Payment Methods
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Current Payment Method */}
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-medium text-gray-900">
                                        Primary Payment Method
                                    </h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                        Default
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CreditCard
                                        size={24}
                                        className="text-gray-400"
                                    />
                                    <div>
                                        <p className="font-medium">
                                            Visa ending in 4567
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Expires 12/2025
                                        </p>
                                    </div>
                                </div>
                                <button className="mt-4 text-blue-600 text-sm font-medium">
                                    Edit Details
                                </button>
                            </div>

                            {/* Add New Method */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 cursor-pointer">
                                <div className="text-center">
                                    <CreditCard
                                        size={32}
                                        className="text-gray-400 mx-auto mb-2"
                                    />
                                    <p className="text-sm font-medium text-gray-600">
                                        Add Payment Method
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="border-t pt-6">
                            <h3 className="font-medium text-gray-900 mb-4">
                                Billing Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">
                                        Business Name
                                    </p>
                                    <p className="font-medium">
                                        Gemilang Berjaya
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Tax ID</p>
                                    <p className="font-medium">123-456-789</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        Billing Address
                                    </p>
                                    <p className="font-medium">
                                        123 Business Street, Kuala Lumpur
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">
                                        Contact Email
                                    </p>
                                    <p className="font-medium">
                                        billing@gemilangberjaya.com
                                    </p>
                                </div>
                            </div>
                            <button className="mt-4 text-blue-600 text-sm font-medium">
                                Update Billing Information
                            </button>
                        </div>
                    </div>
                )}

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Upgrade to Professional
                            </h3>
                            <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">
                                        Total Due Today
                                    </span>
                                    <span className="text-2xl font-bold">
                                        ${calculatePrice(plans.pro)}
                                    </span>
                                </div>
                                {billingCycle === "yearly" && (
                                    <p className="text-sm text-blue-700">
                                        You'll save ${savings} annually compared
                                        to monthly billing
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Card Number
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Expiry Date
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
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
