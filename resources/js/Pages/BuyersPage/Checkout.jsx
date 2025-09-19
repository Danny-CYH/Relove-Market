import { useState } from "react";
import {
    CreditCard,
    Lock,
    Shield,
    ArrowLeft,
    Gift,
    CheckCircle,
    Clock,
    HelpCircle,
} from "lucide-react";

import { Navbar } from "@/Components/Buyer/Navbar";
import { Footer } from "@/Components/Buyer/Footer";
import { CheckoutForm } from "@/Components/Buyer/CheckoutForm";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Link } from "@inertiajs/react";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function CheckoutPage({ list_product }) {
    console.log(list_product);

    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
    const [saveShippingInfo, setSaveShippingInfo] = useState(true);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        country: "Malaysia", // Display name
        countryCode: "MY", // ISO code for Stripe
    });

    const subtotal = list_product.reduce(
        (sum, product) =>
            sum +
            product.product.product_price * product.product.product_quantity,
        0
    );
    const shipping = 5.0;
    const discount = 10.0;
    const tax = subtotal * 0.06;
    const total = subtotal + shipping + tax - discount;

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Main Container */}
            <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 my-16">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Back to cart */}
                    <Link href={route("wishlist")}>
                        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to cart
                        </button>
                    </Link>

                    <>
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

                                <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === "paypal"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onClick={() => setPaymentMethod("paypal")}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "paypal"}
                                            onChange={() =>
                                                setPaymentMethod("paypal")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-black font-medium">
                                                PayPal
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Pay securely with your PayPal
                                                account
                                            </p>
                                        </div>
                                    </label>
                                </div>

                                <div
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        paymentMethod === "cod"
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                    onClick={() => setPaymentMethod("cod")}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={paymentMethod === "cod"}
                                            onChange={() =>
                                                setPaymentMethod("cod")
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="ml-3">
                                            <span className="text-black font-medium">
                                                Cash on Delivery
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Pay when you receive your order
                                            </p>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Voucher */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-black text-xl font-semibold mb-4 flex items-center">
                                <Gift
                                    className="text-blue-600 mr-2"
                                    size={20}
                                />
                                Voucher & Promo Code
                            </h2>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Enter voucher code"
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-lg font-medium transition-colors">
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Stripe Payment Form */}
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                total={total}
                                setActiveStep={setActiveStep}
                                shippingInfo={shippingInfo}
                                paymentMethod={paymentMethod}
                            />
                        </Elements>
                    </>
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 top-6">
                        <h2 className="text-black text-xl font-semibold mb-6">
                            Order Summary
                        </h2>

                        {/* Cart Items */}
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-6">
                            {list_product.map((product) => (
                                <div
                                    key={product.product.product_id}
                                    className="flex items-start gap-4 pb-4 border-b border-gray-100"
                                >
                                    <div className="relative">
                                        <img
                                            src={`${
                                                import.meta.env.VITE_BASE_URL
                                            }${
                                                product.product_image.image_path
                                            }`}
                                            alt={product.product.product_name}
                                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <span className="absolute -top-1 -right-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                            {product.product.product_quantity}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900">
                                            {product.product.product_name}
                                        </p>
                                        {/* <p className="text-xs text-gray-500 mt-1 flex items-center">
                                            <Truck size={12} className="mr-1" />
                                            {item.delivery}
                                        </p>
                                        <p className="text-xs text-green-600 mt-1">
                                            In stock ({item.stock} left)
                                        </p> */}
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        RM
                                        {(
                                            product.product.product_price *
                                            product.product.product_quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Delivery Estimate */}
                        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
                            <Clock
                                size={18}
                                className="text-blue-600 mr-2 mt-0.5 flex-shrink-0"
                            />
                            <div>
                                <p className="text-sm font-medium text-blue-900">
                                    Estimated Delivery
                                </p>
                                <p className="text-xs text-blue-700">
                                    2-4 business days
                                </p>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-3 border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">
                                    RM {subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Shipping</span>
                                <span className="text-gray-900">
                                    RM {shipping.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Tax</span>
                                <span className="text-gray-900">
                                    RM {tax.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-RM {discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                                <span className="text-black">Total</span>
                                <span className="text-blue-600">
                                    RM {total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* Security Assurance */}
                        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                            <Lock size={12} className="mr-1" />
                            <span>Your payment is secure and encrypted</span>
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
                                <span className="text-black text-xs">SSL</span>
                            </div>
                            <div className="bg-gray-100 rounded-lg p-2 flex items-center">
                                <CreditCard
                                    size={16}
                                    className="text-gray-600 mr-1"
                                />
                                <span className="text-black text-xs">PCI</span>
                            </div>
                        </div>
                    </div>

                    {/* Support Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6 relative">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <HelpCircle
                                size={18}
                                className="text-gray-500 mr-2"
                            />
                            Need help with your order?
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Our customer service team is available 24/7 to
                            assist you.
                        </p>
                        <div className="text-sm">
                            <p className="text-blue-500 font-medium">
                                relovemarket006@gmail.com
                            </p>
                            <p className="text-gray-600">+60126547653</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
