import { useState, useEffect } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";

import { router } from "@inertiajs/react";

const useOptions = () => {
    const options = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                letterSpacing: "0.025em",
                fontFamily: "Source Code Pro, monospace",
                "::placeholder": {
                    color: "#aab7c4",
                },
                padding: "10px 14px",
                backgroundColor: "white",
            },
            invalid: {
                color: "#9e2146",
            },
        },
    };

    return options;
};

export function CheckoutForm({
    total,
    setActiveStep,
    paymentMethod,
    onPaymentSuccess,
    list_product,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        if (paymentMethod === "credit" && total > 0) {
            createPaymentIntent();
        }
    }, [total, paymentMethod]);

    // Helper function to parse selected variant
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

    // Helper function to parse selected options (for backward compatibility)
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

    // Prepare order items data with variant support
    const prepareOrderItems = () => {
        return list_product.map((product) => {
            const productId = product.product_id || product.product?.product_id;
            const quantity = product.selected_quantity || product.quantity || 1;

            // Get price from variant if available, otherwise from product
            const selectedVariant = parseSelectedVariant(product);
            const price =
                selectedVariant?.price ||
                product.product?.product_price ||
                product.price ||
                product?.product_price ||
                0;

            // Prepare variant data for backend
            const variantData = selectedVariant
                ? {
                      variant_id: selectedVariant.variant_id,
                      variant_key: selectedVariant.variant_key,
                      combination: selectedVariant.combination,
                      quantity: selectedVariant.quantity,
                      price: selectedVariant.price,
                  }
                : null;

            return {
                product_id: productId,
                quantity: quantity,
                price: price,
                selected_variant: variantData,
                selected_options: parseSelectedOptions(product), // Keep for backward compatibility
            };
        });
    };

    const createPaymentIntent = async () => {
        try {
            const orderItems = prepareOrderItems();

            // Validate that we have at least one product
            if (orderItems.length === 0) {
                setError("No products in cart");
                return;
            }

            // Validate stock for all items before creating payment intent
            const stockValidation = await validateStock(orderItems);
            if (!stockValidation.valid) {
                setError(stockValidation.error);
                return;
            }

            // Get common user and seller info (assuming all products are from same seller)
            const firstProduct = list_product[0];
            const userId =
                firstProduct?.user?.user_id || firstProduct?.user_id || "";
            const sellerId =
                firstProduct?.seller_id ||
                firstProduct?.product?.seller_id ||
                "";

            // Validate required fields
            if (!userId || !sellerId) {
                setError("Missing user or seller information");
                return;
            }

            const response = await fetch("/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                    currency: "myr",
                    payment_method_types: ["card"],
                    user_id: userId,
                    seller_id: sellerId,
                    order_items: orderItems,
                }),
            });

            const data = await response.json();
            console.log("Payment Intent Response:", data);

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                setPaymentIntentId(data.id);
                setOrderId(data.orderId);
            } else {
                setError(data.error || "Failed to initialize payment");
            }
        } catch (err) {
            console.error("Create Payment Intent Error:", err);
            setError("Network error: " + err.message);
        }
    };

    // Validate stock before payment
    const validateStock = async (orderItems) => {
        try {
            const response = await fetch("/validate-stock", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    order_items: orderItems,
                }),
            });

            const data = await response.json();

            console.log(data);
            return data;
        } catch (error) {
            console.error("Stock validation error:", error);
            return { valid: false, error: "Failed to validate stock" };
        }
    };

    const prepareOrderData = () => {
        const orderItems = prepareOrderItems();
        const firstProduct = list_product[0];
        const userId =
            firstProduct?.user?.user_id || firstProduct?.user_id || "";
        const sellerId =
            firstProduct?.seller_id || firstProduct?.product?.seller_id || "";

        return {
            user_id: userId,
            seller_id: sellerId,
            amount: Math.round(total * 100),
            currency: "myr",
            order_items: orderItems,
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError("Payment system not ready. Please try again.");
            return;
        }

        if (paymentMethod !== "credit") {
            handleNonCardPayment();
            return;
        }

        setIsLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardNumberElement);

        try {
            console.log("Confirming payment with:", {
                clientSecret,
                orderId,
                paymentIntentId,
            });

            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: list_product[0]?.user?.name || "",
                            email: list_product[0]?.user?.email || "",
                        },
                    },
                });

            if (stripeError) {
                console.error("Stripe Error:", stripeError);
                setError(stripeError.message);
                setIsLoading(false);
            } else if (paymentIntent.status === "succeeded") {
                console.log("Payment succeeded:", paymentIntent);
                await handleSuccessfulPayment(paymentIntent.id, orderId);
            } else {
                console.log("Payment not succeeded:", paymentIntent);
                setError("Payment failed with status: " + paymentIntent.status);
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Payment Error:", err);
            setError("Payment failed: " + err.message);
            setIsLoading(false);
        }
    };

    const handleNonCardPayment = async () => {
        setIsLoading(true);
        try {
            const orderData = prepareOrderData();

            // Validate stock before proceeding with non-card payment
            const stockValidation = await validateStock(orderData.order_items);
            if (!stockValidation.valid) {
                setError(stockValidation.error);
                setIsLoading(false);
                return;
            }

            const response = await fetch("/create-payment-intent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    amount: Math.round(total * 100),
                    currency: "myr",
                    payment_method_types: [
                        paymentMethod === "grabpay" ? "grabpay" : "fpx",
                    ],
                    ...orderData,
                }),
            });

            const data = await response.json();
            console.log("Non-card Payment Intent:", data);

            if (data.orderId) {
                await handleSuccessfulPayment(data.id, data.orderId, orderData);
            } else {
                setError(
                    data.error || "Failed to create order for non-card payment"
                );
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Non-card Payment Error:", err);
            setError("Payment processing failed: " + err.message);
            setIsLoading(false);
        }
    };

    const handleSuccessfulPayment = async (
        paymentIntentId,
        orderId,
        customOrderData = null
    ) => {
        try {
            const orderData = customOrderData || prepareOrderData();

            console.log("Sending confirmation with:", {
                paymentIntentId,
                orderId,
                orderData,
            });

            const response = await fetch("/confirm-payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({
                    payment_intent_id: paymentIntentId,
                    order_id: orderId,
                    amount: Math.round(total * 100),
                    currency: "myr",
                    user_id: orderData.user_id,
                    seller_id: orderData.seller_id,
                    order_items: orderData.order_items,
                }),
            });

            const data = await response.json();
            console.log("Confirmation Response:", data);

            if (data.success) {
                setActiveStep(3);

                if (onPaymentSuccess) {
                    onPaymentSuccess({
                        orderId: orderId,
                        paymentIntentId: paymentIntentId,
                        amount: total,
                        orderData: data.order || data,
                        order_items: data.order_items || orderData.order_items,
                    });
                } else {
                    // Fallback: redirect to success page
                    router.visit("/order-success", {
                        data: {
                            order_id: orderId,
                            payment_intent_id: paymentIntentId,
                            amount: total,
                            order_items: JSON.stringify(orderData.order_items),
                        },
                    });
                }
            } else {
                const errorMsg =
                    data.error || data.message || "Unknown error occurred";
                console.error("Confirmation Failed:", errorMsg);
                setError("Payment confirmation failed: " + errorMsg);
            }
        } catch (err) {
            console.error("Confirmation Error:", err);
            setError("Confirmation error: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Render selected variant for display
    const renderSelectedVariant = (product) => {
        const selectedVariant = parseSelectedVariant(product);

        if (
            !selectedVariant ||
            !selectedVariant.combination ||
            Object.keys(selectedVariant.combination).length === 0
        ) {
            return null;
        }

        let combination = selectedVariant.combination;

        // Handle both object and string cases safely
        if (typeof combination === "string") {
            try {
                combination = JSON.parse(combination);
            } catch {
                console.error("Invalid combination JSON:", combination);
                return null;
            }
        }

        return (
            <div className="mt-1">
                <p className="text-sm text-gray-700">
                    <strong>Variant:</strong>
                    {Object.entries(combination).map(([key, value]) => (
                        <span key={key} className="ml-2">
                            {key}: {value}
                        </span>
                    ))}
                </p>
            </div>
        );
    };

    // Render selected options for display (backward compatibility)
    const renderSelectedOptions = (product) => {
        const selectedOptions = parseSelectedOptions(product);
        if (!selectedOptions || Object.keys(selectedOptions).length === 0) {
            return null;
        }

        return (
            <div className="mt-1">
                {Object.entries(selectedOptions).map(
                    ([optionType, optionData]) => (
                        <div key={optionType} className="text-xs text-gray-600">
                            <span className="capitalize font-medium">
                                {optionType}:
                            </span>
                            <span className="ml-1">
                                {optionData.value_name}
                            </span>
                        </div>
                    )
                )}
            </div>
        );
    };

    // Calculate total quantity for display
    const totalQuantity = list_product.reduce((total, product) => {
        return total + (product.selected_quantity || product.quantity || 1);
    }, 0);

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-black text-xl font-semibold mb-6">
                Payment Details
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {/* Display Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                    Order Summary ({list_product.length}{" "}
                    {list_product.length === 1 ? "item" : "items"})
                </h3>
                {list_product.map((item, index) => {
                    const product = item.product || item;
                    const quantity =
                        item.selected_quantity || item.quantity || 1;
                    const selectedVariant = parseSelectedVariant(item);
                    const price =
                        product.product_price ||
                        selectedVariant?.price ||
                        item.price ||
                        0;
                    const productName = product.product_name || "Product";

                    return (
                        <div
                            key={index}
                            className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0"
                        >
                            <div className="flex-1">
                                <p className="text-gray-900 font-medium">
                                    {productName}
                                </p>
                                {renderSelectedVariant(item) ||
                                    renderSelectedOptions(item)}
                                <p className="text-gray-600 text-sm mt-1">
                                    Quantity: {quantity} × RM{" "}
                                    {price.toFixed(2) || 0}
                                </p>
                            </div>
                            <p className="text-gray-900 font-medium">
                                RM {(price * quantity).toFixed(2)}
                            </p>
                        </div>
                    );
                })}
                <div className="border-t border-gray-200 mt-3 pt-3">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-gray-600">Total Items</p>
                        <p className="text-gray-600">{totalQuantity}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-900 font-semibold">
                            Total Amount
                        </p>
                        <p className="text-gray-900 font-bold">
                            RM {total.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {paymentMethod === "credit" && clientSecret ? (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Card Number
                            </label>
                            <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                <CardNumberElement options={options} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date
                                </label>
                                <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    <CardExpiryElement options={options} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    CVC
                                </label>
                                <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    <CardCvcElement options={options} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4">
                            <p className="text-sm text-blue-700 flex items-center">
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Your payment details are secure and encrypted
                            </p>
                        </div>
                    </>
                ) : paymentMethod === "credit" ? (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-600 mt-2">
                            Initializing payment...
                        </p>
                    </div>
                ) : (
                    <div className="bg-yellow-50 rounded-lg p-4">
                        <p className="text-yellow-700 text-sm">
                            You will be redirected to {paymentMethod} to
                            complete your payment after clicking "Pay Now".
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        !stripe ||
                        isLoading ||
                        (paymentMethod === "credit" && !clientSecret)
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing...
                        </>
                    ) : (
                        `Pay RM ${total.toFixed(2)}`
                    )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                    By clicking "Pay Now", you agree to our Terms of Service and
                    Privacy Policy. Your payment is secure and encrypted.
                </p>
            </form>
        </div>
    );
}
