import { useState } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import { usePage } from "@inertiajs/react";
import axios from "axios";

export function CheckoutForm({
    total,
    paymentMethod,
    onPaymentSuccess,
    onPaymentError,
    list_product,
    subtotal,
    shipping,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const { auth } = usePage().props;

    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState(null);

    const parseSelectedVariant = (item) => {
        if (!item?.selected_variant) return null;
        try {
            return typeof item.selected_variant === "string"
                ? JSON.parse(item.selected_variant)
                : item.selected_variant;
        } catch (error) {
            return null;
        }
    };

    const normalizeItem = (item) => {
        if (item?.product) {
            return item;
        }
        return {
            product: {
                product_id: item.product_id,
                product_name: item.product_name,
                product_price: item.product_price,
                seller_id: item.seller_id,
                product_image: item.product_image || item.productImage,
            },
            selected_quantity: item.quantity || item.selected_quantity || 1,
            selected_variant: item.selected_variant || null,
        };
    };

    const buildOrderItems = (items) => {
        return items.map((raw) => {
            const item = normalizeItem(raw);
            const product = item.product || raw;
            const selectedVariant = parseSelectedVariant(item);
            return {
                product_id: product.product_id || item.product_id,
                quantity: item.selected_quantity || item.quantity || 1,
                price:
                    selectedVariant?.price ||
                    product.product_price ||
                    item.product_price ||
                    0,
                selected_variant: selectedVariant || null,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setCardError(null);

        try {
            const items = Array.isArray(list_product) ? list_product : [];
            const orderItems = buildOrderItems(items);

            if (orderItems.length === 0) {
                onPaymentError?.("No items to checkout.");
                setProcessing(false);
                return;
            }

            const sellerId =
                items[0]?.product?.seller_id ||
                items[0]?.seller_id ||
                items[0]?.product?.seller?.seller_id;

            const amount = Math.round((total || 0) * 100);

            // Validate stock
            const stockRes = await axios.post("/validate-stock", {
                order_items: orderItems,
            });

            if (!stockRes.data?.valid) {
                onPaymentError?.(
                    stockRes.data?.error || "Stock validation failed."
                );
                setProcessing(false);
                return;
            }

            // Create payment intent
            const intentRes = await axios.post("/create-payment-intent", {
                amount,
                currency: "myr",
                payment_method_types: ["card"],
                user_id: auth?.user?.user_id,
                seller_id: sellerId,
                order_items: orderItems,
                subtotal,
                shipping,
                payment_method: paymentMethod,
                stock_validation_id: stockRes.data?.validation_id,
            });

            const clientSecret = intentRes.data?.clientSecret;
            const orderId = intentRes.data?.orderId;

            if (!clientSecret || !orderId) {
                onPaymentError?.("Failed to create payment intent.");
                setProcessing(false);
                return;
            }

            const cardElement = elements.getElement(CardNumberElement);

            const { paymentIntent, error } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                    },
                });

            if (error) {
                setCardError(error.message);
                onPaymentError?.(error.message);
                setProcessing(false);
                return;
            }

            // Confirm payment with backend
            const confirmRes = await axios.post("/confirm-payment", {
                payment_intent_id: paymentIntent.id,
                order_id: orderId,
                user_id: auth?.user?.user_id,
                seller_id: sellerId,
                amount,
                currency: "myr",
                order_items: orderItems,
                subtotal,
                shipping,
                payment_method: paymentMethod,
            });

            if (confirmRes.data?.success) {
                onPaymentSuccess?.(confirmRes.data?.order);
            } else {
                onPaymentError?.(
                    confirmRes.data?.error || "Payment confirmation failed."
                );
            }
        } catch (error) {
            const message =
                error?.response?.data?.error ||
                error?.message ||
                "Payment failed. Please try again.";
            onPaymentError?.(message);
            setCardError(message);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                    </label>
                    <div className="rounded-lg border border-gray-300 px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <CardNumberElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#111827",
                                        fontFamily: "inherit",
                                        "::placeholder": {
                                            color: "#9CA3AF",
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                        </label>
                        <div className="rounded-lg border border-gray-300 px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <CardExpiryElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#111827",
                                            fontFamily: "inherit",
                                            "::placeholder": {
                                                color: "#9CA3AF",
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                        </label>
                        <div className="rounded-lg border border-gray-300 px-3 py-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                            <CardCvcElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#111827",
                                            fontFamily: "inherit",
                                            "::placeholder": {
                                                color: "#9CA3AF",
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {cardError && (
                    <p className="text-sm text-red-600">{cardError}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
                {processing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
}
