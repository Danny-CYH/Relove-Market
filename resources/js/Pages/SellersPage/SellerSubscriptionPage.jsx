import React, { useState } from "react";
import { SellerSidebar } from "@/Components/Seller/SellerSidebar";

export default function SubscriptionPage() {
    const [plans, setPlans] = useState([
        {
            id: 1,
            name: "Free",
            price: 0,
            features: ["Up to 10 products", "Basic analytics", "Email support"],
            current: false,
        },
        {
            id: 2,
            name: "Pro Seller",
            price: 29,
            features: [
                "Unlimited products",
                "Advanced analytics",
                "Priority support",
            ],
            current: true,
        },
        {
            id: 3,
            name: "Enterprise",
            price: 99,
            features: [
                "Unlimited products",
                "Custom integrations",
                "Dedicated account manager",
            ],
            current: false,
        },
    ]);

    const [billingHistory] = useState([
        { date: "2025-07-15", plan: "Pro Seller", amount: 29, status: "Paid" },
        { date: "2025-06-15", plan: "Pro Seller", amount: 29, status: "Paid" },
        { date: "2025-05-15", plan: "Pro Seller", amount: 29, status: "Paid" },
    ]);

    const handleChangePlan = (planId) => {
        setPlans((prev) =>
            prev.map((plan) => ({
                ...plan,
                current: plan.id === planId,
            }))
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SellerSidebar shopName="Gemilang Berjaya" />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Subscription
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Manage your current plan, upgrade, or view your billing
                        history.
                    </p>
                </div>

                {/* Plan Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`p-6 rounded-lg shadow ${
                                plan.current
                                    ? "border-2 border-indigo-600 bg-white"
                                    : "bg-white"
                            }`}
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {plan.name}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                ${plan.price} / month
                            </p>
                            <ul className="mb-4 text-gray-700 space-y-1 text-sm">
                                {plan.features.map((f, idx) => (
                                    <li key={idx}>• {f}</li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleChangePlan(plan.id)}
                                className={`w-full py-2 rounded font-semibold transition ${
                                    plan.current
                                        ? "bg-indigo-600 text-white cursor-not-allowed"
                                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                }`}
                                disabled={plan.current}
                            >
                                {plan.current ? "Current Plan" : "Choose Plan"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Billing History */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        Billing History
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Plan</th>
                                    <th className="p-3">Amount</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billingHistory.map((bill, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3">{bill.date}</td>
                                        <td className="p-3">{bill.plan}</td>
                                        <td className="p-3">${bill.amount}</td>
                                        <td
                                            className={`p-3 font-semibold ${
                                                bill.status === "Paid"
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {bill.status}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}