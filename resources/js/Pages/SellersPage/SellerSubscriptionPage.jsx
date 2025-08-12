import { Footer } from "@/Components/Buyer/Footer";
import React, { useState } from "react";

export default function SellerSubscriptionPage() {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const plans = [
        {
            id: 1,
            name: "Basic Seller",
            price: 19,
            duration: "per month",
            features: [
                "List up to 10 products",
                "Basic seller analytics",
                "Email support",
            ],
        },
        {
            id: 2,
            name: "Pro Seller",
            price: 49,
            duration: "per month",
            features: [
                "Unlimited product listings",
                "Advanced analytics",
                "Priority support",
                "Featured store badge",
            ],
        },
        {
            id: 3,
            name: "Enterprise Seller",
            price: 99,
            duration: "per month",
            features: [
                "Unlimited listings & analytics",
                "Dedicated account manager",
                "Custom promotions",
                "24/7 VIP support",
            ],
        },
    ];

    const handleSubscribe = (plan) => {
        setSelectedPlan(plan);
        // You can redirect to payment gateway here
        alert(`Redirecting to payment for: ${plan.name}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            {/* Header */}
            <div className="text-center max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900">
                    Choose Your Seller Subscription
                </h1>
                <p className="mt-3 text-gray-600">
                    Start selling with the plan that fits your business. Upgrade
                    anytime.
                </p>
            </div>

            {/* Pricing Plans */}
            <div className="mt-10 grid gap-8 md:grid-cols-3 max-w-6xl">
                {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`rounded-2xl shadow-lg p-6 border transition hover:scale-105 hover:shadow-xl bg-white ${
                            selectedPlan?.id === plan.id
                                ? "border-blue-500"
                                : "border-gray-200"
                        }`}
                    >
                        <h2 className="text-xl font-semibold text-gray-900">
                            {plan.name}
                        </h2>
                        <p className="mt-4 text-3xl font-bold text-gray-900">
                            ${plan.price}{" "}
                            <span className="text-base font-medium text-gray-500">
                                {plan.duration}
                            </span>
                        </p>
                        <ul className="mt-6 space-y-3">
                            {plan.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center text-gray-600"
                                >
                                    <svg
                                        className="w-5 h-5 text-green-500 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSubscribe(plan)}
                            className="mt-8 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                        >
                            {selectedPlan?.id === plan.id
                                ? "Selected"
                                : "Subscribe"}
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            <Footer />
        </div>
    );
}
