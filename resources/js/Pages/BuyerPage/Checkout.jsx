import { useState } from "react";
import {
    CreditCard,
    Lock,
    Shield,
    ArrowLeft,
    Gift,
    Clock,
    HelpCircle,
} from "lucide-react";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";
import { CheckoutForm } from "@/Components/BuyerPage/CheckoutForm";
import { OrderSuccessModal } from "@/Components/BuyerPage/OrderSuccessModal";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Link, router } from "@inertiajs/react";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

export default function CheckoutPage({ list_product, platform_tax }) {
    console.log("Checkout products:", list_product);

    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [activeStep, setActiveStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

    const [showSuccessModal, setShowSuccessModal] = useState(true);
    const [orderData, setOrderData] = useState(null);

    // Get products array for rendering
    const getProductsArray = () => {
        if (Array.isArray(list_product)) {
            return list_product;
        } else if (list_product && list_product.product_id) {
            return [list_product];
        }
        return [];
    };

    const handlePaymentSuccess = (orderInfo) => {
        setOrderData(orderInfo);
        setShowSuccessModal(true);

        // Optional: Redirect to success page after a delay
        setTimeout(() => {
            router.visit(route("profile"));
        }, 7000);
    };

    // Parse selected variant from the product data
    const parseSelectedVariant = (product) => {
        if (!product.selected_variant) return null;

        try {
            return typeof product.selected_variant === "string"
                ? JSON.parse(product.selected_variant)
                : product.selected_variant;
        } catch (error) {
            console.error("Error parsing selected variant:", error);
            return null;
        }
    };

    // Parse selected options from the product data (for backward compatibility)
    const parseSelectedOptions = (product) => {
        if (!product.selected_options) return null;

        try {
            return typeof product.selected_options === "string"
                ? JSON.parse(product.selected_options)
                : product.selected_options;
        } catch (error) {
            console.error("Error parsing selected options:", error);
            return null;
        }
    };

    // Get variant display text
    const getVariantDisplayText = (variant) => {
        if (
            !variant ||
            !variant.combination ||
            Object.keys(variant.combination).length === 0
        ) {
            return null;
        }

        let combination = variant.combination;

        // ✅ Handle JSON string case safely
        if (typeof combination === "string") {
            try {
                combination = JSON.parse(combination);
            } catch (error) {
                console.error("Invalid combination JSON:", combination);
                return null;
            }
        }

        // ✅ Build readable text
        return Object.entries(combination)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ");
    };

    // Get options display text (for backward compatibility)
    const getOptionsDisplayText = (options) => {
        if (!options || Object.keys(options).length === 0) {
            return null;
        }

        return Object.entries(options)
            .map(
                ([optionType, optionData]) =>
                    `${optionType}: ${optionData.value_name}`
            )
            .join(", ");
    };

    // Normalize product data structure to handle both single and multiple items
    const normalizeProductData = (product) => {
        // If it's a single product (from direct purchase)
        if (product.product_id && !product.product) {
            return {
                product: {
                    product_id: product.product_id,
                    product_name: product.product_name,
                    product_price: product.product_price,
                    product_image:
                        product.product_image || product.productImage,
                },
                selected_quantity:
                    product.quantity || product.selected_quantity || 1,
                selected_variant: product.selected_variant || null,
                selected_options: product.selected_options || null,
                product_image: product.product_image || product.productImage,
            };
        }
        // If it's already in the correct structure (from cart)
        return product;
    };

    // Calculate totals - handle both single item and multiple items
    const calculateTotals = () => {
        let subtotal = 0;

        const productsArray = getProductsArray();

        subtotal = productsArray.reduce((sum, product) => {
            const normalizedProduct = normalizeProductData(product);
            const quantity = normalizedProduct.selected_quantity || 1;

            // Get price from variant if available, otherwise from product
            const selectedVariant = parseSelectedVariant(normalizedProduct);
            const price =
                selectedVariant?.price ||
                normalizedProduct.product?.product_price ||
                normalizedProduct.product_price ||
                0;

            return sum + price * quantity;
        }, 0);

        const shipping = 5.0;
        const tax = subtotal * platform_tax;
        const total = subtotal + shipping + tax;

        return { subtotal, shipping, tax, total };
    };

    const { subtotal, shipping, tax, total } = calculateTotals();
    const productsArray = getProductsArray();

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
                                paymentMethod={paymentMethod}
                                onPaymentSuccess={handlePaymentSuccess}
                                list_product={productsArray}
                            />
                        </Elements>

                        {/* Success Modal */}
                        {showSuccessModal && orderData && (
                            <OrderSuccessModal
                                orderData={orderData}
                                isOpen={showSuccessModal}
                                onClose={() => setShowSuccessModal(false)}
                            />
                        )}
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
                            {productsArray.map((product) => {
                                const normalizedProduct =
                                    normalizeProductData(product);
                                const selectedVariant =
                                    parseSelectedVariant(normalizedProduct);
                                const selectedOptions =
                                    parseSelectedOptions(normalizedProduct);
                                const quantity =
                                    normalizedProduct.selected_quantity || 1;
                                const productData =
                                    normalizedProduct.product ||
                                    normalizedProduct;
                                const productImage =
                                    normalizedProduct.product_image ||
                                    productData.product_image;

                                // Get price from variant if available
                                const displayPrice =
                                    selectedVariant?.price ||
                                    productData.product_price;

                                // Get variant or options display text
                                const variantText =
                                    getVariantDisplayText(selectedVariant);
                                const optionsText =
                                    getOptionsDisplayText(selectedOptions);

                                return (
                                    <div
                                        key={productData.product_id}
                                        className="flex items-start gap-4 pb-4 border-b border-gray-100"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${
                                                    import.meta.env
                                                        .VITE_BASE_URL
                                                }${
                                                    productImage?.image_path ||
                                                    productImage?.[0]
                                                        ?.image_path ||
                                                    "/default-image.jpg"
                                                }`}
                                                alt={productData.product_name}
                                                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <span className="absolute -top-1 -right-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                Qty: {quantity}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {productData.product_name}
                                            </p>

                                            {/* Display Selected Variant */}
                                            {variantText && (
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <span>
                                                            {variantText}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Display Selected Options (backward compatibility) */}
                                            {!variantText && optionsText && (
                                                <div className="mt-1 space-y-1">
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <span className="font-medium">
                                                            Options:
                                                        </span>
                                                        <span className="ml-1">
                                                            {optionsText}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-500 mt-1">
                                                Price: RM {displayPrice} each
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            RM{" "}
                                            {(displayPrice * quantity).toFixed(
                                                2
                                            )}
                                        </p>
                                    </div>
                                );
                            })}
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
