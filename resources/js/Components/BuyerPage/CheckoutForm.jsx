import { useState, useEffect } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

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

// SweetAlert configuration
const showAlert = (icon, title, text, confirmButtonText = "OK") => {
    return Swal.fire({
        icon,
        title,
        text,
        confirmButtonText,
        confirmButtonColor: "#3085d6",
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};

const showLoadingAlert = (title, text = "") => {
    return Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

// Function to redirect to wishlist
const redirectToWishlist = () => {
    router.visit(route("wishlist"), {
        method: "get",
        preserveState: true,
        preserveScroll: true,
    });
};

export function CheckoutForm({
    total,
    setActiveStep,
    paymentMethod,
    onPaymentSuccess,
    onPaymentError,
    list_product,
    subtotal,
    shipping,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const options = useOptions();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [paymentIntentId, setPaymentIntentId] = useState("");
    const [orderId, setOrderId] = useState("");
    const [lastStockValidation, setLastStockValidation] = useState(null);

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
                selected_options: parseSelectedOptions(product),
            };
        });
    };

    const createPaymentIntent = async () => {
        try {
            const orderItems = prepareOrderItems();

            if (orderItems.length === 0) {
                const errorMsg = "No valid products in cart";
                setError(errorMsg);
                await showAlert(
                    "error",
                    "Cart Empty",
                    "There are no valid products in your cart. Please add items to proceed.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                return;
            }

            // Enhanced stock validation with timeout
            const stockValidation = await Promise.race([
                validateStock(orderItems),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error("Stock validation timeout")),
                        10000
                    )
                ),
            ]);

            if (!stockValidation.valid) {
                setError(stockValidation.error);
                await showAlert(
                    "error",
                    "Stock Issue",
                    stockValidation.error ||
                        "Some items in your cart are no longer available in the requested quantity. Please review your cart.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                if (onPaymentError) {
                    onPaymentError(stockValidation.error);
                }
                return;
            }

            setLastStockValidation(stockValidation);

            const firstProduct = list_product[0];
            const userId =
                firstProduct?.user?.user_id || firstProduct?.user_id || "";
            const sellerId =
                firstProduct?.seller_id ||
                firstProduct?.product?.seller_id ||
                "";

            if (!userId || !sellerId) {
                const errorMsg = "Missing user or seller information";
                setError(errorMsg);
                await showAlert(
                    "error",
                    "Information Missing",
                    "Required user or seller information is missing. Please try refreshing the page.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                if (onPaymentError) {
                    onPaymentError(errorMsg);
                }
                return;
            }

            const loadingAlert = showLoadingAlert(
                "Initializing Payment",
                "Setting up your payment session..."
            );

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
                    subtotal: subtotal,
                    shipping: shipping,
                    payment_method: paymentMethod,
                    stock_validation_id: lastStockValidation?.validation_id,
                }),
            });

            const data = await response.json();
            loadingAlert.close();

            if (data.clientSecret) {
                setClientSecret(data.clientSecret);
                setPaymentIntentId(data.id);
                setOrderId(data.orderId);
                await showAlert(
                    "success",
                    "Payment Ready",
                    "Your payment session has been initialized successfully. You can now proceed with the payment.",
                    "Continue"
                );
            } else {
                const errorMsg = data.error || "Failed to initialize payment";
                setError(errorMsg);
                await showAlert(
                    "error",
                    "Payment Error",
                    errorMsg,
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                if (onPaymentError) {
                    onPaymentError(errorMsg);
                }
            }
        } catch (err) {
            console.error("Create Payment Intent Error:", err);
            const errorMsg = err.message || "Network error occurred";
            setError(errorMsg);
            await showAlert(
                "error",
                "Connection Error",
                "Unable to connect to payment service. Please check your internet connection and try again.",
                "Back to Wishlist"
            ).then((result) => {
                if (result.isConfirmed) {
                    redirectToWishlist();
                }
            });
            if (onPaymentError) {
                onPaymentError(errorMsg);
            }
        }
    };

    // Validate stock before payment
    const validateStock = async (orderItems, retryCount = 0) => {
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
                    validation_timestamp: Date.now(),
                }),
            });

            const data = await response.json();

            if (!data.valid && retryCount < 2) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return validateStock(orderItems, retryCount + 1);
            }

            return data;
        } catch (error) {
            console.error("Stock validation error:", error);
            if (retryCount < 2) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return validateStock(orderItems, retryCount + 1);
            }
            return {
                valid: false,
                error: "Failed to validate stock availability",
            };
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
            subtotal: subtotal,
            shipping: shipping,
            payment_method: paymentMethod,
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            const errorMsg = "Payment system not ready. Please try again.";
            setError(errorMsg);
            await showAlert(
                "warning",
                "System Not Ready",
                "The payment system is still initializing. Please wait a moment and try again.",
                "Back to Wishlist"
            ).then((result) => {
                if (result.isConfirmed) {
                    redirectToWishlist();
                }
            });
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
            const loadingAlert = showLoadingAlert(
                "Processing Payment",
                "Please wait while we process your payment..."
            );

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

            loadingAlert.close();

            if (stripeError) {
                console.error("Stripe Error:", stripeError);
                setError(stripeError.message);

                let alertTitle = "Payment Failed";
                let alertText = stripeError.message;

                // Custom messages for common Stripe errors
                if (stripeError.code === "card_declined") {
                    alertTitle = "Card Declined";
                    alertText =
                        "Your card was declined. Please try a different card or contact your bank.";
                } else if (stripeError.code === "insufficient_funds") {
                    alertTitle = "Insufficient Funds";
                    alertText =
                        "Your card has insufficient funds. Please try a different payment method.";
                } else if (stripeError.code === "expired_card") {
                    alertTitle = "Expired Card";
                    alertText =
                        "Your card has expired. Please use a different card.";
                } else if (stripeError.code === "incorrect_cvc") {
                    alertTitle = "Invalid CVC";
                    alertText =
                        "The CVC number you entered is incorrect. Please check and try again.";
                }

                await showAlert(
                    "error",
                    alertTitle,
                    alertText,
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                setIsLoading(false);
            } else if (paymentIntent.status === "succeeded") {
                await handleSuccessfulPayment(paymentIntent.id, orderId);
            } else {
                console.log("Payment not succeeded:", paymentIntent);
                const errorMsg =
                    "Payment failed with status: " + paymentIntent.status;
                setError(errorMsg);
                await showAlert(
                    "error",
                    "Payment Issue",
                    "Your payment could not be completed. Please try again or contact support.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Payment Error:", err);
            const errorMsg = "Payment failed: " + err.message;
            setError(errorMsg);
            await showAlert(
                "error",
                "Payment Error",
                "An unexpected error occurred during payment processing. Please try again.",
                "Back to Wishlist"
            ).then((result) => {
                if (result.isConfirmed) {
                    redirectToWishlist();
                }
            });
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
                await showAlert(
                    "error",
                    "Stock Issue",
                    stockValidation.error ||
                        "Some items are no longer available. Please review your cart.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                setIsLoading(false);
                return;
            }

            // Map frontend payment methods to Stripe payment method types
            const getPaymentMethodTypes = () => {
                switch (paymentMethod) {
                    case "grabpay":
                        return ["grabpay"];
                    case "paypal":
                        return ["paypal"];
                    case "cod":
                        return ["cash_on_delivery"];
                    default:
                        return ["card"];
                }
            };

            const loadingAlert = showLoadingAlert(
                "Processing Order",
                `Setting up your ${paymentMethod.toUpperCase()} payment...`
            );

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
                    payment_method_types: getPaymentMethodTypes(),
                    ...orderData,
                }),
            });

            const data = await response.json();
            loadingAlert.close();
            console.log("Non-card Payment Intent:", data);

            if (data.orderId) {
                // For non-card payments, we need to handle the payment flow differently
                if (paymentMethod === "cod") {
                    // Handle Cash on Delivery - create order without payment intent
                    await handleSuccessfulPayment(
                        "cod_" + Date.now(),
                        data.orderId,
                        orderData
                    );
                } else {
                    // For other payment methods, redirect to their payment page
                    await handleSuccessfulPayment(
                        data.id,
                        data.orderId,
                        orderData
                    );
                }
            } else {
                const errorMsg =
                    data.error || "Failed to create order for non-card payment";
                setError(errorMsg);
                await showAlert(
                    "error",
                    "Order Failed",
                    errorMsg,
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Non-card Payment Error:", err);
            const errorMsg = "Payment processing failed: " + err.message;
            setError(errorMsg);
            await showAlert(
                "error",
                "Payment Error",
                "Failed to process your payment. Please try again.",
                "Back to Wishlist"
            ).then((result) => {
                if (result.isConfirmed) {
                    redirectToWishlist();
                }
            });
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
            const loadingAlert = showLoadingAlert(
                "Confirming Payment",
                "Finalizing your order..."
            );

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
                    subtotal: subtotal,
                    shipping: shipping,
                    payment_method: paymentMethod,
                }),
            });

            const data = await response.json();
            loadingAlert.close();

            if (data.success) {
                setActiveStep(3);

                // Show success message based on payment method
                let successMessage = `Your payment of RM ${total.toFixed(
                    2
                )} has been processed successfully!`;
                let orderMessage = `Order #${orderId} has been confirmed.`;

                if (paymentMethod === "cod") {
                    successMessage = `Your Cash on Delivery order has been placed successfully!`;
                    orderMessage = `Order #${orderId} will be delivered to your address. Please prepare RM ${total.toFixed(
                        2
                    )} for payment upon delivery.`;
                }

                await showAlert(
                    "success",
                    "Payment Successful!",
                    `${successMessage} ${orderMessage}`,
                    "View Order"
                );

                if (onPaymentSuccess) {
                    onPaymentSuccess({
                        orderId: orderId,
                        paymentIntentId: paymentIntentId,
                        amount: total,
                        orderData: data.order || data,
                        order_items: data.order_items || orderData.order_items,
                        payment_method: paymentMethod,
                    });
                }
            } else {
                const errorMsg =
                    data.error || data.message || "Unknown error occurred";
                console.error("Confirmation Failed:", errorMsg);
                setError("Payment confirmation failed: " + errorMsg);
                await showAlert(
                    "error",
                    "Confirmation Failed",
                    "Your payment was processed but we encountered an issue confirming your order. Please contact support.",
                    "Back to Wishlist"
                ).then((result) => {
                    if (result.isConfirmed) {
                        redirectToWishlist();
                    }
                });
            }
        } catch (err) {
            console.error("Confirmation Error:", err);
            const errorMsg = "Confirmation error: " + err.message;
            setError(errorMsg);
            await showAlert(
                "error",
                "Confirmation Error",
                "We encountered an issue while confirming your payment. Please check your email for order confirmation.",
                "Back to Wishlist"
            ).then((result) => {
                if (result.isConfirmed) {
                    redirectToWishlist();
                }
            });
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

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-black text-xl font-semibold mb-6">
                Payment Details
            </h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    <strong>Error:</strong> {error}
                    <button
                        onClick={redirectToWishlist}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                        Back to Wishlist
                    </button>
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

                {/* Price Breakdown */}
                <div className="border-t border-gray-200 mt-3 pt-3 space-y-2">
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Subtotal</p>
                        <p className="text-gray-600">
                            RM {subtotal.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-gray-600">Shipping</p>
                        <p className="text-gray-600">
                            RM {shipping.toFixed(2)}
                        </p>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-300 pt-2">
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

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={
                            !stripe ||
                            isLoading ||
                            (paymentMethod === "credit" && !clientSecret)
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
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
                </div>

                <p className="text-xs text-gray-500 text-center">
                    By clicking "Pay Now", you agree to our Terms of Service and
                    Privacy Policy. Your payment is secure and encrypted.
                </p>
            </form>
        </div>
    );
}
