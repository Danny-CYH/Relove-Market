import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";
import React from "react";
import {
    FaStore,
    FaChartLine,
    FaUsers,
    FaBoxOpen,
    FaCheckCircle,
} from "react-icons/fa";

export default function BecomeSeller() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 text-center">
                <h1 className="text-4xl font-bold mb-4">
                    Become a Seller on Our Platform
                </h1>
                <p className="text-lg max-w-2xl mx-auto">
                    Grow your business, reach more customers, and manage sales
                    with ease.
                </p>
            </section>

            {/* Benefits Section */}
            <section className="py-16 max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Why Become a Seller?
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <BenefitCard
                        icon={<FaStore />}
                        title="Expand Your Store"
                        desc="Showcase your products to thousands of buyers."
                    />
                    <BenefitCard
                        icon={<FaChartLine />}
                        title="Boost Your Sales"
                        desc="Leverage our marketing tools to increase revenue."
                    />
                    <BenefitCard
                        icon={<FaUsers />}
                        title="Reach More Customers"
                        desc="Access a large, growing marketplace community."
                    />
                </div>
            </section>

            {/* Subscription Plans */}
            <section className="py-16 bg-white">
                <h2 className="text-3xl font-bold text-center mb-10">
                    Choose Your Subscription
                </h2>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                    <PlanCard
                        name="Basic"
                        price="RM29/month"
                        features={[
                            "5 Product Listings",
                            "Basic Support",
                            "Marketplace Access",
                        ]}
                    />
                    <PlanCard
                        name="Pro"
                        price="RM59/month"
                        features={[
                            "Unlimited Listings",
                            "Priority Support",
                            "Marketing Tools",
                        ]}
                        highlight
                    />
                    <PlanCard
                        name="Enterprise"
                        price="RM99/month"
                        features={[
                            "Custom Solutions",
                            "Dedicated Manager",
                            "Advanced Analytics",
                        ]}
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}

function BenefitCard({ icon, title, desc }) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <div className="text-indigo-600 text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    );
}

function PlanCard({ name, price, features, highlight }) {
    return (
        <div
            className={`p-6 rounded-lg shadow-md border ${
                highlight ? "border-indigo-500 bg-indigo-50" : "border-gray-200"
            } hover:shadow-lg transition`}
        >
            <h3 className="text-2xl font-bold mb-2">{name}</h3>
            <p className="text-indigo-600 text-xl mb-4">{price}</p>
            <ul className="mb-6 space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                        <FaCheckCircle className="text-green-500 mr-2" />{" "}
                        {feature}
                    </li>
                ))}
            </ul>
            <button
                className={`w-full py-2 rounded-lg font-semibold ${
                    highlight
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-200 hover:bg-gray-300"
                }`}
            >
                Purchase
            </button>
        </div>
    );
}
