import React from "react";

const plans = [
    {
        name: "Free Plan",
        price: "RM 0",
        features: ["List up to 5 items", "Basic support", "Limited visibility"],
        buttonText: "Current Plan",
        disabled: true,
    },
    {
        name: "Basic Plan",
        price: "RM 29 / month",
        features: [
            "List up to 50 items",
            "Priority support",
            "Boosted visibility",
        ],
        buttonText: "Subscribe",
        disabled: false,
    },
    {
        name: "Pro Plan",
        price: "RM 59 / month",
        features: ["Unlimited items", "24/7 support", "Top-tier promotion"],
        buttonText: "Subscribe",
        disabled: false,
    },
];

export default function SellerSubscriptionPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
                    Choose a Seller Plan
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-xl rounded-lg p-6 flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-3xl font-bold text-indigo-600 mb-4">
                                    {plan.price}
                                </p>
                                <ul className="mb-6 space-y-2">
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className="text-gray-600 flex items-center"
                                        >
                                            ✅ {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                disabled={plan.disabled}
                                className={`mt-auto w-full py-2 px-4 rounded ${
                                    plan.disabled
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                                } font-semibold`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}