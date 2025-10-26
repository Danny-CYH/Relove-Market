import { useState, useEffect } from "react";
import {
    useStripe,
    useElements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
} from "@stripe/react-stripe-js";
import { CreditCard, Calendar, Lock, User, Mail, MapPin } from "lucide-react";

import axios from "axios";

export function SubscriptionCheckoutForm({
    plan,
    paymentMethod,
    onSubscriptionSuccess,
    user,
}) {
    const stripe = useStripe();
    const elements = useElements();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState("");
    const [billingDetails, setBillingDetails] = useState({
        email: user?.email || "",
        name: user?.name || "",
        address: "",
        city: "",
        zipCode: "",
    });

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                    color: "#aab7c4",
                },
            },
        },
    };

    useEffect(() => {
        if (user) {
            setBillingDetails((prev) => ({
                ...prev,
                email: user.email || "",
                name: user.name || "",
                address: user.address || "",
                city: user.city || "",
                state: user.state || "",
                postalCode: user.postal_code || "",
            }));
        }
    }, [user]);

    const handleBillingChange = (field, value) => {
        setBillingDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError("");

        try {
            // Create payment intent
            const paymentIntentResponse = await axios.post(
                "/api/subscriptions/create-payment-intent",
                {
                    subscription_plan_id: plan.subscription_plan_id,
                    amount: plan.price * 100,
                    currency: "myr",
                    user_id: user.user_id,
                    seller_id: user.seller_id,
                    payment_method_types:
                        paymentMethod === "grabpay" ? ["grabpay"] : ["card"],
                }
            );

            const {
                clientSecret,
                receipt_id,
                subscription_plan_id,
                id: paymentIntentId,
            } = paymentIntentResponse.data;

            let result;

            if (paymentMethod === "grabpay") {
                // Handle GrabPay payment
                result = await stripe.confirmGrabPayPayment(clientSecret, {
                    payment_method: {
                        billing_details: {
                            name: billingDetails.name,
                            email: billingDetails.email,
                            address: {
                                line1: billingDetails.address,
                                city: billingDetails.city,
                                state: billingDetails.state,
                                postal_code: billingDetails.postalCode,
                            },
                        },
                    },
                    return_url: `${window.location.origin}/seller/subscription-success`,
                });
            } else {
                // Handle card payment
                const cardElement = elements.getElement(CardNumberElement);

                result = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: billingDetails.name,
                            email: billingDetails.email,
                            address: {
                                line1: billingDetails.address,
                                city: billingDetails.city,
                                state: billingDetails.state,
                                postal_code: billingDetails.postalCode,
                                country: billingDetails.country,
                            },
                        },
                    },
                });
            }

            if (result.error) {
                setError(result.error.message);
                setIsProcessing(false);
                return;
            }

            // Confirm payment with backend
            const confirmResponse = await axios.post(
                "/api/subscriptions/confirm-payment",
                {
                    receipt_id: receipt_id,
                    payment_intent_id: paymentIntentId,
                    subscription_plan_id: subscription_plan_id,
                    user_id: user.user_id,
                    seller_id: user.seller_id,
                    amount: plan.price * 100,
                    currency: "myr",
                }
            );

            if (confirmResponse.data.success) {
                onSubscriptionSuccess({
                    subscription_plan_id,
                    paymentIntentId,
                    amount: plan.price,
                    planName: plan.name,
                    durationDays: plan.duration,
                });
            } else {
                setError(
                    confirmResponse.data.error || "Payment confirmation failed"
                );
            }
        } catch (err) {
            console.error("Payment error:", err);
            setError(
                err.response?.data?.error || "Payment failed. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(price);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Details */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="email"
                                value={billingDetails.email}
                                onChange={(e) =>
                                    handleBillingChange("email", e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                value={billingDetails.name}
                                onChange={(e) =>
                                    handleBillingChange("name", e.target.value)
                                }
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                    </label>
                    <div className="relative">
                        <MapPin
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={18}
                        />
                        <input
                            type="text"
                            value={billingDetails.address}
                            onChange={(e) =>
                                handleBillingChange("address", e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                        </label>
                        <input
                            type="text"
                            value={billingDetails.city}
                            onChange={(e) =>
                                handleBillingChange("city", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            value={billingDetails.zipCode}
                            onChange={(e) =>
                                handleBillingChange("zipCode", e.target.value)
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Card Payment Form */}
            {paymentMethod === "credit" && (
                <div className="space-y-4 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Card Details
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Card Number
                        </label>
                        <div className="relative">
                            <CreditCard
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <div className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                <CardNumberElement
                                    options={cardElementOptions}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                            </label>
                            <div className="relative">
                                <Calendar
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <div className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    <CardExpiryElement
                                        options={cardElementOptions}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVC
                            </label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={18}
                                />
                                <div className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                                    <CardCvcElement
                                        options={cardElementOptions}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
                {isProcessing ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                    </>
                ) : (
                    <>
                        <Lock size={20} className="mr-2" />
                        Subscribe Now - {formatPrice(plan.price)}
                    </>
                )}
            </button>

            {/* Security Note */}
            <p className="text-xs text-gray-500 text-center">
                Your payment information is secure and encrypted. We never store
                your card details.
            </p>
        </form>
    );
}
