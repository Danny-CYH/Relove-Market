import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";
import React from "react";

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Main Layout */}
            <main className="container mx-auto px-20 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT - Checkout Details */}
                <section className="lg:col-span-2 space-y-6">
                    {/* Delivery Address */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Delivery Address
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="address"
                                    className="text-orange-600"
                                    defaultChecked
                                />
                                <div>
                                    <p className="font-medium">John Doe</p>
                                    <p className="text-sm text-gray-500">
                                        123 Main Street, City, Malaysia
                                    </p>
                                </div>
                            </label>
                            <button className="mt-3 px-4 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50">
                                + Add New Address
                            </button>
                        </div>
                    </div>

                    {/* Delivery Options */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Delivery Options
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center justify-between border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        className="text-orange-600"
                                        defaultChecked
                                    />
                                    <span>Standard Delivery (3-5 days)</span>
                                </div>
                                <span className="font-medium">RM 5.00</span>
                            </label>
                            <label className="flex items-center justify-between border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="radio"
                                        name="delivery"
                                        className="text-orange-600"
                                    />
                                    <span>Express Delivery (1-2 days)</span>
                                </div>
                                <span className="font-medium">RM 12.00</span>
                            </label>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Payment Method
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="text-orange-600"
                                    defaultChecked
                                />
                                <span>Credit / Debit Card</span>
                            </label>
                            <label className="flex items-center space-x-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="text-orange-600"
                                />
                                <span>Online Banking</span>
                            </label>
                            <label className="flex items-center space-x-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="text-orange-600"
                                />
                                <span>E-Wallet</span>
                            </label>
                            <label className="flex items-center space-x-3 border p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="payment"
                                    className="text-orange-600"
                                />
                                <span>Cash on Delivery</span>
                            </label>
                        </div>
                    </div>

                    {/* Order Notes */}
                    <div className="bg-white p-6 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Order Notes
                        </h2>
                        <textarea
                            rows="3"
                            placeholder="Leave a note for delivery (optional)"
                            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-orange-400 focus:outline-none"
                        ></textarea>
                    </div>
                </section>

                {/* RIGHT - Order Summary */}
                <aside className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow sticky top-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Order Summary
                        </h2>

                        {/* Product List */}
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {[1, 2].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center space-x-4 border-b pb-3"
                                >
                                    <img
                                        src={`https://via.placeholder.com/60`}
                                        alt="Product"
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">
                                            Product Name {item}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Qty: 1
                                        </p>
                                    </div>
                                    <span className="font-medium">
                                        RM 49.90
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price Breakdown */}
                        <div className="mt-6 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>RM 99.80</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping Fee</span>
                                <span>RM 5.00</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t pt-3">
                                <span>Total</span>
                                <span className="text-orange-600">
                                    RM 104.80
                                </span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <button className="mt-6 w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition">
                            Proceed to Payment
                        </button>
                    </div>
                </aside>
            </main>
            <Footer />
        </div>
    );
}
