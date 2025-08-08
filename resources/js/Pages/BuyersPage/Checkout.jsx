import React, { useState } from "react";

export default function CheckoutPage() {
    const cartItems = [
        {
            id: 1,
            name: "Vintage Denim Jacket",
            image: "/images/products/jacket.jpg",
            price: 89.99,
            quantity: 1,
        },
        {
            id: 2,
            name: "Retro Sunglasses",
            image: "/images/products/sunglasses.jpg",
            price: 59.0,
            quantity: 2,
        },
    ];

    const [paymentMethod, setPaymentMethod] = useState("credit");

    const totalPrice = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-12 lg:px-24">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center md:text-left">
                🧾 Checkout
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            🛍️ Order Summary
                        </h2>

                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border-b py-4"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-cover rounded"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.name}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-gray-700">
                                    RM {(item.price * item.quantity).toFixed(2)}
                                </p>
                            </div>
                        ))}

                        <div className="text-right mt-6">
                            <p className="text-xl font-semibold text-gray-800">
                                Total: RM {totalPrice.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">
                            💳 Payment Method
                        </h2>
                        <div className="space-y-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="credit"
                                    checked={paymentMethod === "credit"}
                                    onChange={() => setPaymentMethod("credit")}
                                />
                                <span className="text-gray-700">
                                    Credit / Debit Card
                                </span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="tng"
                                    onChange={() => setPaymentMethod("tng")}
                                />
                                <span className="text-gray-700">
                                    Touch 'n Go eWallet
                                </span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cod"
                                    onChange={() => setPaymentMethod("cod")}
                                />
                                <span className="text-gray-700">
                                    Cash on Delivery
                                </span>
                            </label>
                        </div>

                        <div className="mt-6">
                            <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto">
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Billing Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">
                        🏠 Shipping Address
                    </h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="example@mail.com"
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                rows={3}
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                                placeholder="123, Jalan Gemilang..."
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="+60 12-345 6789"
                                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}