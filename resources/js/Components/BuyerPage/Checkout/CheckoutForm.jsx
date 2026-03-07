import { useState, useEffect } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

export function CheckoutForm({
    total,
    setActiveStep,
    paymentMethod,
    onPaymentSuccess,
    onPaymentError,
    list_product,
    subtotal,
    shipping,
    validationId,
    userId,
    sellerId,
}) {
    // Only use Stripe hooks if payment method is card
    const stripe = paymentMethod === "card" ? useStripe() : null;
    const elements = paymentMethod === "card" ? useElements() : null;

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const isCardPayment = paymentMethod === "card";

    // Show loading alert function
    const showLoadingAlert = (title, text) => {
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

    const handleCardPayment = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        // Show loading alert
        showLoadingAlert(
            "Processing your order...",
            "Please wait while we process your payment",
        );

        try {
            const { error: submitError } = await elements.submit();
            if (submitError) {
                Swal.close();
                throw submitError;
            }

            const { error: confirmError, paymentIntent } =
                await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url:
                            window.location.origin + "/payment/complete",
                    },
                    redirect: "if_required",
                });

            if (confirmError) {
                Swal.close();
                throw confirmError;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                Swal.close();
                await confirmOrder(paymentIntent.id);
            }
        } catch (error) {
            console.error("Payment error:", error);
            Swal.close();
            setPaymentError(error.message || "Payment failed");
            onPaymentError?.(error.message || "Payment failed");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCodPayment = async (event) => {
        event.preventDefault();
        setIsProcessing(true);
        setPaymentError(null);

        // Show loading alert for COD
        showLoadingAlert(
            "Processing your order...",
            "Please wait while we confirm your order",
        );

        try {
            // Generate a mock payment intent ID for COD
            const mockPaymentIntentId =
                "cod_" +
                Date.now() +
                "_" +
                Math.random().toString(36).substr(2, 9);

            Swal.close();
            await confirmOrder(mockPaymentIntentId, "cod");
        } catch (error) {
            console.error("COD order error:", error);
            Swal.close();
            setPaymentError(error.message || "Failed to create order");
            onPaymentError?.(error.message || "Failed to create order");
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmOrder = async (paymentIntentId, method = "card") => {
        try {
            // Prepare order items
            const orderItems = list_product.map((item) => {
                const selectedVariant = item.selected_variant
                    ? typeof item.selected_variant === "string"
                        ? JSON.parse(item.selected_variant)
                        : item.selected_variant
                    : null;

                return {
                    product_id: item.product_id || item.product?.product_id,
                    quantity: item.selected_quantity || item.quantity || 1,
                    price:
                        selectedVariant?.price ||
                        item.product_price ||
                        item.product?.product_price ||
                        0,
                    selected_variant: selectedVariant,
                };
            });

            const orderId =
                "ORD-" +
                new Date().toISOString().slice(0, 10).replace(/-/g, "") +
                "-" +
                Math.random().toString(36).substr(2, 9).toUpperCase();

            const response = await axios.post(route("confirm-payment"), {
                payment_intent_id: paymentIntentId,
                order_id: orderId,
                user_id: userId,
                seller_id: sellerId,
                amount: Math.round(total * 100),
                currency: "myr",
                order_items: orderItems,
                subtotal: subtotal,
                shipping: shipping,
                payment_method: method,
                payment_status: method === "cod" ? "pending" : "paid",
            });

            if (response.data.success) {
                setPaymentSuccess(true);

                // Show success message
                Swal.fire({
                    icon: "success",
                    title: "Order Placed Successfully!",
                    text: "Your order has been confirmed.",
                    timer: 2000,
                    showConfirmButton: false,
                });

                onPaymentSuccess?.({
                    order_id: response.data.order.order_id,
                    payment_intent_id: paymentIntentId,
                    amount: total,
                });
            }
        } catch (error) {
            console.error("Order confirmation error:", error);
            throw new Error(
                error.response?.data?.error || "Failed to confirm order",
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isCardPayment) {
            await handleCardPayment(event);
        } else {
            await handleCodPayment(event);
        }
    };

    // Cleanup loading alert on unmount
    useEffect(() => {
        return () => {
            Swal.close();
        };
    }, []);

    if (paymentSuccess) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Successful!
                </h3>
                <p className="text-gray-600 mb-6">
                    Your order has been placed successfully.
                </p>
                <div className="animate-pulse text-sm text-gray-500">
                    Redirecting...
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg border border-gray-200 p-6"
        >
            <h2 className="text-black text-xl font-semibold mb-6">
                {isCardPayment ? "Card Details" : "Confirm Order"}
            </h2>

            {paymentError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{paymentError}</p>
                </div>
            )}

            {isCardPayment ? (
                <div className="space-y-4">
                    <PaymentElement />

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={!stripe || isProcessing}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `Pay RM ${total.toFixed(2)}`
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">
                            You've selected Cash on Delivery (COD). Please
                            confirm your order to proceed.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            `Confirm Order - RM ${total.toFixed(2)}`
                        )}
                    </button>
                </div>
            )}

            <p className="text-xs text-gray-500 text-center mt-4">
                By confirming your order, you agree to our Terms of Service and
                Privacy Policy.
            </p>
        </form>
    );
}
