import { useState, useEffect } from "react";
import { Shield, Loader2, X } from "lucide-react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export function CheckoutForm({
    total,
    setActiveStep,
    shippingInfo,
    paymentMethod, // "card" or "grabpay"
}) {
    const stripe = useStripe();
    const elements = useElements();

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState("");
    const [postalCode, setPostalCode] = useState("");

    // Create payment intent when total changes
    useEffect(() => {
        fetch("/create-payment-intent", {
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
            }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecret))
            .catch((error) => {
                console.error("Error creating payment intent:", error);
                setError("Failed to initialize payment. Please try again.");
            });
    }, [total]);

    // Handle card payment
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        if (!postalCode.trim()) {
            setError("Please enter your postal code");
            return;
        }

        setProcessing(true);
        setError(null);

        const { error: stripeError, paymentIntent } =
            await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
                        email: shippingInfo.email,
                        phone: shippingInfo.phone,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            postal_code: postalCode,
                            country: shippingInfo.countryCode,
                        },
                    },
                },
            });

        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
        } else {
            console.log("Payment successful:", paymentIntent);
            setActiveStep(3);
        }
    };

    // Handle GrabPay payment
    const handleGrabPay = async () => {
        if (!stripe) return;

        const response = await fetch("/create-payment-intent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]'
                ).content,
            },
            body: JSON.stringify({
                amount: total * 100, // amount in cents
                currency: "myr",
            }),
        });

        const { clientSecret } = await response.json();

        const { error } = await stripe.confirmGrabPayPayment(clientSecret, {
            return_url: "http://127.0.0.1:8000/relove-market",
        });

        if (error) {
            console.error(error.message);
        }
    };

    return (
        <>
            {paymentMethod === "credit" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Postal Code */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Billing Postal Code
                        </label>
                        <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your postal code"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Required for card verification
                        </p>
                    </div>

                    {/* Card Element */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#424770",
                                        "::placeholder": {
                                            color: "#aab7c4",
                                        },
                                    },
                                    invalid: { color: "#9e2146" },
                                },
                                hidePostalCode: true,
                            }}
                        />
                        {error && (
                            <div className="text-red-600 text-sm mt-2 flex items-center">
                                <X size={16} className="mr-1" />
                                {error}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!stripe || processing || !clientSecret}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-base font-medium flex items-center justify-center"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Shield className="mr-2" size={18} />
                                Pay RM{total.toFixed(2)}
                            </>
                        )}
                    </button>
                </form>
            )}

            {paymentMethod === "grabpay" && (
                <button
                    type="button"
                    onClick={handleGrabPay}
                    disabled={processing || !clientSecret}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg text-base font-medium flex items-center justify-center"
                >
                    {processing ? "Processing GrabPay..." : "Pay with GrabPay"}
                </button>
            )}
        </>
    );
}
