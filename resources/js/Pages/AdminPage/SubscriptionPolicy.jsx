import React, { useState } from "react";
import { Sidebar } from "@/Components/AdminPage/Sidebar";
import { FaEdit } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function SubscriptionPolicy() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [policyContent, setPolicyContent] = useState(`
        <h2>1. Subscription Plans</h2>
        <p>We offer multiple subscription tiers to cater to different needs. Each plan has its own features, pricing, and duration. Details of available plans are displayed on the subscription management page.</p>

        <h2>2. Payment & Billing</h2>
        <p>All payments are processed securely through our approved payment gateways. Subscriptions will be automatically renewed unless cancelled before the renewal date.</p>

        <h2>3. Cancellations & Refunds</h2>
        <p>You can cancel your subscription anytime via your account settings. Refunds are only provided in accordance with our refund policy and are subject to eligibility.</p>

        <h2>4. Plan Changes</h2>
        <p>You may upgrade or downgrade your subscription at any time. Changes will take effect immediately or at the start of the next billing cycle, depending on the plan rules.</p>

        <h2>5. Policy Updates</h2>
        <p>We may update this subscription policy from time to time to reflect changes in our services or legal requirements. Users will be notified of significant updates.</p>
    `);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="p-6 font-bold text-lg text-indigo-700">
                    Admin Panel
                </div>
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Subscription Policy
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Outlines the terms, conditions, and guidelines for
                            using our subscription plans.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition"
                    >
                        <FaEdit className="mr-2" /> Edit Policy
                    </button>
                </div>

                {/* Policy Content */}
                <div className="p-6 bg-white rounded-xl shadow-md">
                    <div
                        className="prose prose-indigo max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: policyContent }}
                    />
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-5xl overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Edit Subscription Policy
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-800 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Editor */}
                        <div className="p-4">
                            <ReactQuill
                                theme="snow"
                                value={policyContent}
                                onChange={setPolicyContent}
                                className="h-64 mb-4"
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
