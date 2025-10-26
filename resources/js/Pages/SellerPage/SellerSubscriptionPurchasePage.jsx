import { useState } from "react";
import {
    CreditCard,
    Lock,
    Shield,
    ArrowLeft,
    Gift,
    Clock,
    HelpCircle,
    CheckCircle,
    Calendar,
    Star,
} from "lucide-react";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { SubscriptionCheckoutForm } from "@/Components/SellerPage/SellerPurchaseSubscriptionPage/SubscriptionCheckoutForm";
import { SubscriptionSuccessModal } from "@/Components/SellerPage/SellerPurchaseSubscriptionPage/SubscriptionSuccessModal";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Link, router, usePage } from "@inertiajs/react";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function SubscriptionCheckoutPage({ subscription_plan }) {
    const { auth } = usePage().props;

    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState(null);

    const handleSubscriptionSuccess = (subscriptionInfo) => {
        setSubscriptionData(subscriptionInfo);
        setShowSuccessModal(true);

        // Optional: Redirect to success page after a delay
        setTimeout(() => {
            router.visit("/seller-dashboard");
        }, 3000); // Redirect after 3 seconds
    };

    const plan = subscription_plan;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(price);
    };

    // Calculate savings if there's a comparison price
    const calculateSavings = () => {
        if (plan.original_price && plan.original_price > plan.price) {
            return plan.original_price - plan.price;
        }
        return 0;
    };

    const savings = calculateSavings();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar
                shopName={auth.user?.seller_store_name || "Seller Dashboard"}
            />

            {/* Main Container */}
            <div className="flex-1 lg:ml-0">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Back to plans */}
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                        >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Plans
                        </button>

                        {/* Store Header */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Complete Your Subscription
                                    </h1>
                                    <p className="text-gray-600 mt-1">
                                        Secure payment powered by Stripe
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                    <Shield size={16} />
                                    <span>Secure Checkout</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-black text-xl font-semibold mb-6 flex items-center">
                                <CreditCard
                                    className="text-blue-600 mr-2"
                                    size={20}
                                />
                                Payment Method
                            </h2>
                            <div className="space-y-4">
                                <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === "credit"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onClick={() => setPaymentMethod("credit")}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "credit"}
                                            onChange={() =>
                                                setPaymentMethod("credit")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-black font-medium">
                                                Credit / Debit Card
                                            </span>
                                            <div className="flex mt-1">
                                                {[
                                                    "Visa",
                                                    "Mastercard",
                                                    "Amex",
                                                ].map((card, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-100 px-2 py-1 rounded text-xs text-black mr-2"
                                                    >
                                                        {card}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === "grabpay"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onClick={() => setPaymentMethod("grabpay")}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={
                                                paymentMethod === "grabpay"
                                            }
                                            onChange={() =>
                                                setPaymentMethod("grabpay")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-black font-medium">
                                                GrabPay
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Pay with your GrabPay wallet
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Billing Information */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-black text-xl font-semibold mb-6 flex items-center">
                                <CreditCard
                                    className="text-blue-600 mr-2"
                                    size={20}
                                />
                                Billing Information
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Your billing information will be used for
                                payment processing and subscription management.
                            </p>

                            <Elements stripe={stripePromise}>
                                <SubscriptionCheckoutForm
                                    plan={plan}
                                    paymentMethod={paymentMethod}
                                    onSubscriptionSuccess={
                                        handleSubscriptionSuccess
                                    }
                                    user={auth.user}
                                />
                            </Elements>
                        </div>

                        {/* Success Modal */}
                        {showSuccessModal && subscriptionData && (
                            <SubscriptionSuccessModal
                                subscriptionData={subscriptionData}
                                isOpen={showSuccessModal}
                                onClose={() => setShowSuccessModal(false)}
                            />
                        )}
                    </div>

                    {/* Right Column - Subscription Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
                            <h2 className="text-black text-xl font-semibold mb-6">
                                Subscription Summary
                            </h2>

                            {/* Plan Details */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-1">
                                            {plan.description}
                                        </p>

                                        {/* Price Display */}
                                        <div className="mt-3 flex items-baseline">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatPrice(plan.price)}
                                            </span>
                                            {savings > 0 && (
                                                <>
                                                    <span className="ml-2 text-sm text-gray-500 line-through">
                                                        {formatPrice(
                                                            plan.original_price
                                                        )}
                                                    </span>
                                                    <span className="ml-2 text-sm text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                        Save{" "}
                                                        {formatPrice(savings)}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {/* Duration */}
                                        <div className="flex items-center mt-2 text-sm text-gray-600">
                                            <Calendar
                                                size={14}
                                                className="mr-1"
                                            />
                                            <span>
                                                {plan.duration} days access
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Savings Banner */}
                                {savings > 0 && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center">
                                            <Star
                                                className="text-green-600 mr-2"
                                                size={16}
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-green-800">
                                                    Great Deal!
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    You're saving{" "}
                                                    {formatPrice(savings)} with
                                                    this plan
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Features Included */}
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <CheckCircle
                                        size={16}
                                        className="text-green-500 mr-2"
                                    />
                                    What's Included:
                                </h4>
                                <ul className="space-y-2">
                                    {plan.subscription_features?.map(
                                        (feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-sm text-gray-600"
                                            >
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500 mr-2 flex-shrink-0"
                                                />
                                                {feature.feature_text}
                                            </li>
                                        )
                                    ) ||
                                        plan.features?.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center text-sm text-gray-600"
                                            >
                                                <CheckCircle
                                                    size={14}
                                                    className="text-green-500 mr-2 flex-shrink-0"
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                </ul>
                            </div>

                            {/* Plan Limits */}
                            {plan.limits && (
                                <div className="border-t border-gray-200 pt-4 mb-6">
                                    <h4 className="font-medium text-gray-900 mb-3">
                                        Plan Limits:
                                    </h4>
                                    <div className="grid grid-cols-1 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Max Products:
                                            </span>
                                            <span className="font-medium text-black">
                                                {plan.limits.max_products}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Max Conversations:
                                            </span>
                                            <span className="font-medium text-black">
                                                {plan.limits.max_conversations}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Featured Listing:
                                            </span>
                                            <span className="font-medium text-black">
                                                {plan.limits.featured_listing
                                                    ? "Yes"
                                                    : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Activation Timeline */}
                            <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
                                <Clock
                                    size={18}
                                    className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                                />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">
                                        Instant Activation
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Your subscription will be activated
                                        immediately after payment
                                    </p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 border-t border-gray-200 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        Plan Price
                                    </span>
                                    <span className="text-gray-900">
                                        {formatPrice(plan.price)}
                                    </span>
                                </div>

                                {savings > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatPrice(savings)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="text-gray-900">
                                        Included
                                    </span>
                                </div>

                                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                                    <span className="text-black">Total</span>
                                    <span className="text-blue-600">
                                        {formatPrice(plan.price)}
                                    </span>
                                </div>

                                <div className="text-xs text-gray-500 text-center">
                                    One-time payment • {plan.duration} days
                                    access
                                </div>
                            </div>

                            {/* Security Assurance */}
                            <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                                <Lock size={12} className="mr-1" />
                                <span>
                                    Your payment is secure and encrypted
                                </span>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-6 flex justify-center space-x-6">
                                <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                                    <Shield
                                        size={16}
                                        className="text-gray-600 mr-1"
                                    />
                                    <span className="text-black text-xs">
                                        Secure
                                    </span>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                                    <Lock
                                        size={16}
                                        className="text-gray-600 mr-1"
                                    />
                                    <span className="text-black text-xs">
                                        SSL
                                    </span>
                                </div>
                                <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                                    <CreditCard
                                        size={16}
                                        className="text-gray-600 mr-1"
                                    />
                                    <span className="text-black text-xs">
                                        PCI
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Support Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                                <HelpCircle
                                    size={18}
                                    className="text-gray-500 mr-2"
                                />
                                Need help with your subscription?
                            </h3>
                            <p className="text-sm text-gray-600 mb-3">
                                Our support team is here to help you with any
                                questions about your subscription.
                            </p>
                            <div className="text-sm">
                                <p className="text-blue-500 font-medium">
                                    support@relovemarket.com
                                </p>
                                <p className="text-gray-600">+60 3-1234 5678</p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Mon-Fri, 9AM-6PM
                                </p>
                            </div>
                        </div>

                        {/* Refund Policy */}
                        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mt-6">
                            <div className="flex items-start">
                                <CheckCircle
                                    size={18}
                                    className="text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                                />
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        Refund Policy
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Full refunds are available within 14
                                        days of purchase if you haven't used any
                                        premium features. Contact support for
                                        assistance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
