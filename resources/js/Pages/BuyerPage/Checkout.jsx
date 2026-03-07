import { useState, useEffect } from "react";
import {
    CreditCard,
    Lock,
    Shield,
    ArrowLeft,
    Clock,
    HelpCircle,
    AlertCircle,
} from "lucide-react";
import axios from "axios";

import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";
import { CheckoutForm } from "@/Components/BuyerPage/Checkout/CheckoutForm";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { Link, router, usePage } from "@inertiajs/react";

export default function Checkout({
    list_product,
    errors: initialErrors = [],
}) {
    const [clientSecret, setClientSecret] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [activeStep, setActiveStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checkoutErrors, setCheckoutErrors] = useState(initialErrors || []);
    const [validationId, setValidationId] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [isCreatingIntent, setIsCreatingIntent] = useState(false);

    const { auth } = usePage().props;

    // Initialize Stripe with your publishable key
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

    // Parse selected variant from the product data
    const parseSelectedVariant = (product) => {
        if (!product.selected_variant) return null;

        try {
            const variant =
                typeof product.selected_variant === "string"
                    ? JSON.parse(product.selected_variant)
                    : product.selected_variant;

            if (!variant || typeof variant !== "object") {
                console.warn("Invalid variant structure:", variant);
                return null;
            }

            return variant;
        } catch (error) {
            console.error(
                "Error parsing selected variant:",
                error,
                product.selected_variant,
            );
            return null;
        }
    };

    // Get products array for rendering
    const getProductsArray = () => {
        if (!list_product) return [];

        try {
            if (Array.isArray(list_product)) {
                return list_product.filter((item) => {
                    if (!item) return false;
                    const productId =
                        item.product_id || item.product?.product_id;
                    const quantity =
                        item.selected_quantity || item.quantity || 1;
                    return productId && quantity > 0;
                });
            } else if (
                list_product &&
                (list_product.product_id || list_product.product?.product_id)
            ) {
                return [list_product];
            }
            return [];
        } catch (error) {
            console.error("Error processing product array:", error);
            return [];
        }
    };

    const productsArray = getProductsArray();
    const hasProducts = productsArray.length > 0;

    // Calculate totals
    const calculateTotals = () => {
        let subtotal = 0;

        subtotal = productsArray.reduce((sum, product) => {
            const quantity = product.selected_quantity || product.quantity || 1;
            const selectedVariant = parseSelectedVariant(product);
            const price =
                selectedVariant?.price ||
                product.product_price ||
                product.product?.product_price ||
                0;

            return sum + parseFloat(price) * quantity;
        }, 0);

        const shipping = 5.0;
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    };

    const { subtotal, shipping, total } = calculateTotals();

    // Get seller ID from first product
    const getSellerId = () => {
        if (productsArray.length > 0) {
            return (
                productsArray[0].seller_id ||
                productsArray[0].product?.seller_id
            );
        }
        return null;
    };

    // Validate stock on component mount
    useEffect(() => {
        const validateStock = async () => {
            if (!hasProducts) {
                setIsLoading(false);
                return;
            }

            setIsValidating(true);
            try {
                const orderItems = productsArray.map((item) => {
                    const selectedVariant = parseSelectedVariant(item);
                    return {
                        product_id: item.product_id || item.product?.product_id,
                        quantity: item.selected_quantity || item.quantity || 1,
                        selected_variant: selectedVariant || undefined,
                    };
                });

                const response = await axios.post(route("validate-stock"), {
                    order_items: orderItems,
                    validation_timestamp: Date.now(),
                });

                if (response.data.valid) {
                    setValidationId(response.data.validation_id);
                    setCheckoutErrors([]);
                }
            } catch (error) {
                if (error.response?.data?.error) {
                    setCheckoutErrors([error.response.data.error]);
                } else {
                    setCheckoutErrors([
                        "Unable to validate stock. Please try again.",
                    ]);
                }
                console.error("Stock validation error:", error);
            } finally {
                setIsValidating(false);
                setIsLoading(false);
            }
        };

        validateStock();
    }, []);

    // Create payment intent when validation is complete and payment method is card
    useEffect(() => {
        const createPaymentIntent = async () => {
            if (
                paymentMethod === "card" &&
                validationId &&
                !clientSecret &&
                !isCreatingIntent &&
                productsArray.length > 0
            ) {
                setIsCreatingIntent(true);
                try {
                    const orderItems = productsArray.map((item) => {
                        const selectedVariant = parseSelectedVariant(item);
                        return {
                            product_id:
                                item.product_id || item.product?.product_id,
                            quantity:
                                item.selected_quantity || item.quantity || 1,
                            price:
                                selectedVariant?.price ||
                                item.product_price ||
                                item.product?.product_price ||
                                0,
                            selected_variant: selectedVariant,
                        };
                    });

                    const response = await axios.post(
                        route("create-payment-intent"),
                        {
                            amount: Math.round(total * 100), // Convert to cents
                            currency: "myr",
                            user_id: auth?.user?.user_id,
                            seller_id: getSellerId(),
                            order_items: orderItems,
                            subtotal: subtotal,
                            shipping: shipping,
                            payment_method: paymentMethod,
                            stock_validation_id: validationId,
                        },
                    );

                    if (response.data.clientSecret) {
                        setClientSecret(response.data.clientSecret);
                    }
                } catch (error) {
                    console.error("Error creating payment intent:", error);
                    setCheckoutErrors([
                        error.response?.data?.error ||
                            "Failed to initialize payment",
                    ]);
                } finally {
                    setIsCreatingIntent(false);
                }
            }
        };

        createPaymentIntent();
    }, [validationId, paymentMethod, total]);

    // Redirect if no products
    useEffect(() => {
        if (!isLoading && !hasProducts) {
            router.visit(route("cart"), {
                data: {
                    error: "Checkout session expired. Please select items again.",
                },
            });
        }
    }, [isLoading, hasProducts]);

    const handlePaymentSuccess = (orderInfo) => {
        setOrderData(orderInfo);
        setShowSuccessModal(true);
        setCheckoutErrors([]);

        // Redirect to order success page
        router.visit(
            route("order-success"),
        );
    };

    const handlePaymentError = (error) => {
        setCheckoutErrors([error]);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Get variant display text
    const getVariantDisplayText = (variant) => {
        if (!variant) return null;

        const processCombination = (combination) => {
            if (!combination) return null;

            if (typeof combination === "object") {
                return Object.entries(combination).map(([key, value]) => ({
                    key: key.charAt(0).toUpperCase() + key.slice(1),
                    value: value,
                }));
            } else if (typeof combination === "string") {
                try {
                    const parsed = JSON.parse(combination);
                    if (typeof parsed === "object") {
                        return Object.entries(parsed).map(([key, value]) => ({
                            key: key.charAt(0).toUpperCase() + key.slice(1),
                            value: value,
                        }));
                    }
                } catch (error) {
                    return [{ key: "Variant", value: combination }];
                }
            }
            return null;
        };

        if (variant.variant_combination) {
            return processCombination(variant.variant_combination);
        }
        if (variant.combination) {
            return processCombination(variant.combination);
        }
        return null;
    };

    // Loading state
    if (isLoading || isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                        {isValidating
                            ? "Validating stock..."
                            : "Loading checkout..."}
                    </p>
                </div>
            </div>
        );
    }

    // Error state
    if (checkoutErrors.length > 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Checkout Error
                    </h2>
                    <p className="text-gray-600 mb-6">{checkoutErrors[0]}</p>
                    <button
                        onClick={() => router.visit(route("cart"))}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Main Container */}
            <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 my-16">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Back to cart */}
                    <Link href={route("cart")}>
                        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to cart
                        </button>
                    </Link>

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
                                    paymentMethod === "card"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-300 hover:border-gray-400"
                                }`}
                                onClick={() => setPaymentMethod("card")}
                            >
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "card"}
                                        onChange={() =>
                                            setPaymentMethod("card")
                                        }
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                        <span className="text-black font-medium">
                                            Credit / Debit Card
                                        </span>
                                        <div className="flex mt-1">
                                            {["Visa", "Mastercard", "Amex"].map(
                                                (card, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-gray-100 px-2 py-1 rounded text-xs text-black mr-2"
                                                    >
                                                        {card}
                                                    </div>
                                                ),
                                            )}
                                        </div>
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
                                        onChange={() => setPaymentMethod("cod")}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                        <span className="text-black font-medium">
                                            Cash on Delivery (COD)
                                        </span>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Pay when you receive your order
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    {paymentMethod === "card" ? (
                        clientSecret ? (
                            <Elements
                                stripe={stripePromise}
                                options={{ clientSecret }}
                            >
                                <CheckoutForm
                                    total={total}
                                    setActiveStep={setActiveStep}
                                    paymentMethod={paymentMethod}
                                    onPaymentSuccess={handlePaymentSuccess}
                                    onPaymentError={handlePaymentError}
                                    list_product={productsArray}
                                    subtotal={subtotal}
                                    shipping={shipping}
                                    validationId={validationId}
                                    userId={auth?.user?.user_id}
                                    sellerId={getSellerId()}
                                />
                            </Elements>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">
                                    Initializing payment...
                                </p>
                            </div>
                        )
                    ) : (
                        <CheckoutForm
                            total={total}
                            setActiveStep={setActiveStep}
                            paymentMethod={paymentMethod}
                            onPaymentSuccess={handlePaymentSuccess}
                            onPaymentError={handlePaymentError}
                            list_product={productsArray}
                            subtotal={subtotal}
                            shipping={shipping}
                            validationId={validationId}
                            userId={auth?.user?.user_id}
                            sellerId={getSellerId()}
                        />
                    )}
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
                                const selectedVariant =
                                    parseSelectedVariant(product);
                                const quantity =
                                    product.selected_quantity ||
                                    product.quantity ||
                                    1;
                                const productData = product.product || product;
                                const productImage =
                                    product.product_image ||
                                    productData.product_image;
                                const displayPrice =
                                    selectedVariant?.price ||
                                    productData.product_price;
                                const variantEntries =
                                    getVariantDisplayText(selectedVariant);

                                return (
                                    <div
                                        key={productData.product_id}
                                        className="flex items-start gap-4 pb-4 border-b border-gray-100"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}${
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

                                            {variantEntries?.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {variantEntries.map(
                                                        (entry, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"
                                                            >
                                                                <span className="text-xs text-gray-600">
                                                                    {entry.key}:
                                                                </span>
                                                                <span className="text-xs font-medium text-gray-900">
                                                                    {
                                                                        entry.value
                                                                    }
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-xs text-gray-500 mt-2">
                                                Price: RM{" "}
                                                {parseFloat(
                                                    displayPrice,
                                                ).toFixed(2)}{" "}
                                                each
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                            RM{" "}
                                            {(
                                                parseFloat(displayPrice) *
                                                quantity
                                            ).toFixed(2)}
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
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
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
