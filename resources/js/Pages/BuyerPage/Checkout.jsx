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
import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import { Footer } from "@/Components/BuyerPage/Footer";
import { CheckoutForm } from "@/Components/BuyerPage/Checkout/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export default function Checkout({ list_product, errors: initialErrors = [] }) {
    const [state, setState] = useState({
        clientSecret: null,
        paymentMethod: "card",
        activeStep: 1,
        showSuccessModal: false,
        orderData: null,
        checkoutErrors: initialErrors,
        validationId: null,
        isValidating: true,
        isCreatingIntent: false,
    });

    const { auth } = usePage().props;
    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

    // Helper functions
    const parseVariant = (product) => {
        if (!product?.product?.selected_variant) return null;
        try {
            const variant =
                typeof product.product.selected_variant === "string"
                    ? JSON.parse(product.product.selected_variant)
                    : product.product.selected_variant;
            return variant?.variant_id ? variant : null;
        } catch {
            return null;
        }
    };

    const products = (() => {
        if (!list_product) return [];
        const arr = Array.isArray(list_product) ? list_product : [list_product];
        return arr.filter(
            (p) =>
                p?.product?.product_id &&
                (p.product?.selected_quantity || 1) > 0,
        );
    })();

    const totals = products.reduce(
        (acc, p) => {
            const variant = parseVariant(p);
            const qty = p.product?.selected_quantity || 1;
            const price = parseFloat(
                variant?.price || p.product?.product_price || 0,
            );
            acc.subtotal += price * qty;
            return acc;
        },
        { subtotal: 0 },
    );

    totals.shipping = 5.0;
    totals.total = totals.subtotal + totals.shipping;

    const getVariantDisplay = (variant) => {
        if (!variant) return null;
        const combo = variant.variant_combination || variant.combination;
        if (!combo) return null;

        try {
            const obj = typeof combo === "string" ? JSON.parse(combo) : combo;
            return Object.entries(obj).map(([k, v]) => ({
                key: k.charAt(0).toUpperCase() + k.slice(1),
                value: v,
            }));
        } catch {
            return [{ key: "Variant", value: combo }];
        }
    };

    // Effects
    useEffect(() => {
        const validate = async () => {
            if (!products.length) {
                setState((s) => ({ ...s, isValidating: false }));
                return;
            }

            try {
                const { data } = await axios.post(route("validate-stock"), {
                    order_items: products.map((p) => ({
                        product_id: p.product.product_id,
                        quantity: p.product.selected_quantity || 1,
                        selected_variant: parseVariant(p) || undefined,
                    })),
                    validation_timestamp: Date.now(),
                });

                setState((s) => ({
                    ...s,
                    validationId: data.valid ? data.validation_id : null,
                    checkoutErrors: data.valid
                        ? []
                        : [data.error || "Stock validation failed"],
                    isValidating: false,
                }));
            } catch (error) {
                setState((s) => ({
                    ...s,
                    checkoutErrors: [
                        error.response?.data?.error ||
                            "Stock validation failed",
                    ],
                    isValidating: false,
                }));
            }
        };
        validate();
    }, []);

    useEffect(() => {
        const createIntent = async () => {
            if (
                state.paymentMethod !== "card" ||
                !state.validationId ||
                state.clientSecret ||
                state.isCreatingIntent
            )
                return;

            setState((s) => ({ ...s, isCreatingIntent: true }));
            try {
                const { data } = await axios.post(
                    route("create-payment-intent"),
                    {
                        amount: Math.round(totals.total * 100),
                        currency: "myr",
                        user_id: auth?.user?.user_id,
                        seller_id:
                            products[0]?.seller_id ||
                            products[0]?.seller?.seller_id,
                        order_items: products.map((p) => ({
                            product_id: p.product.product_id,
                            quantity: p.product.selected_quantity || 1,
                            price:
                                parseVariant(p)?.price ||
                                p.product.product_price ||
                                0,
                            selected_variant: parseVariant(p),
                        })),
                        subtotal: totals.subtotal,
                        shipping: totals.shipping,
                        payment_method: state.paymentMethod,
                        stock_validation_id: state.validationId,
                    },
                );
                setState((s) => ({ ...s, clientSecret: data.clientSecret }));
            } catch (error) {
                setState((s) => ({
                    ...s,
                    checkoutErrors: [
                        error.response?.data?.error ||
                            "Payment initialization failed",
                    ],
                }));
            } finally {
                setState((s) => ({ ...s, isCreatingIntent: false }));
            }
        };
        createIntent();
    }, [state.validationId, state.paymentMethod]);

    useEffect(() => {
        if (!state.isValidating && !products.length) {
            router.visit(route("cart"), {
                data: { error: "Checkout session expired" },
            });
        }
    }, [state.isValidating, products.length]);

    const updateState = (updates) => setState((s) => ({ ...s, ...updates }));

    // Loading/Error states
    if (state.isValidating)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Validating stock...</p>
                </div>
            </div>
        );

    if (state.checkoutErrors.length)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Checkout Error
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {state.checkoutErrors[0]}
                    </p>
                    <button
                        onClick={() => router.visit(route("cart"))}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Return to Cart
                    </button>
                </div>
            </div>
        );

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 my-16">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Link
                        href={route("cart")}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Back to cart
                    </Link>

                    {/* Payment Method */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="text-black text-xl font-semibold mb-6 flex items-center">
                            <CreditCard
                                className="text-blue-600 mr-2"
                                size={20}
                            />{" "}
                            Payment Method
                        </h2>
                        <div className="space-y-4">
                            {["card", "cod"].map((method) => (
                                <div
                                    key={method}
                                    onClick={() =>
                                        updateState({ paymentMethod: method })
                                    }
                                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                        state.paymentMethod === method
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 hover:border-gray-400"
                                    }`}
                                >
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={
                                                state.paymentMethod === method
                                            }
                                            onChange={() => {}}
                                            className="text-blue-600"
                                        />
                                        <div className="ml-3">
                                            <span className="text-black font-medium capitalize">
                                                {method === "card"
                                                    ? "Credit / Debit Card"
                                                    : "Cash on Delivery (COD)"}
                                            </span>
                                            {method === "card" && (
                                                <div className="flex mt-1">
                                                    {[
                                                        "Visa",
                                                        "Mastercard",
                                                        "Amex",
                                                    ].map((card) => (
                                                        <div
                                                            key={card}
                                                            className="bg-gray-100 px-2 py-1 rounded text-xs text-black mr-2"
                                                        >
                                                            {card}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {method === "cod" && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Pay when you receive your
                                                    order
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Form */}
                    {state.paymentMethod === "card" ? (
                        state.clientSecret ? (
                            <Elements
                                stripe={stripePromise}
                                options={{ clientSecret: state.clientSecret }}
                            >
                                <CheckoutForm
                                    total={totals.total}
                                    setActiveStep={(step) =>
                                        updateState({ activeStep: step })
                                    }
                                    paymentMethod={state.paymentMethod}
                                    onPaymentSuccess={(order) => {
                                        updateState({
                                            orderData: order,
                                            showSuccessModal: true,
                                        });
                                        router.visit(route("order-success"));
                                    }}
                                    onPaymentError={(error) =>
                                        updateState({ checkoutErrors: [error] })
                                    }
                                    list_product={products}
                                    subtotal={totals.subtotal}
                                    shipping={totals.shipping}
                                    validationId={state.validationId}
                                    userId={auth?.user?.user_id}
                                    sellerId={
                                        products[0]?.seller_id ||
                                        products[0]?.seller?.seller_id
                                    }
                                />
                            </Elements>
                        ) : (
                            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    Initializing payment...
                                </p>
                            </div>
                        )
                    ) : (
                        <CheckoutForm
                            total={totals.total}
                            setActiveStep={(step) =>
                                updateState({ activeStep: step })
                            }
                            paymentMethod={state.paymentMethod}
                            onPaymentSuccess={(order) => {
                                updateState({
                                    orderData: order,
                                    showSuccessModal: true,
                                });
                                router.visit(route("order-success"));
                            }}
                            onPaymentError={(error) =>
                                updateState({ checkoutErrors: [error] })
                            }
                            list_product={products}
                            subtotal={totals.subtotal}
                            shipping={totals.shipping}
                            validationId={state.validationId}
                            userId={auth?.user?.user_id}
                            sellerId={
                                products[0]?.seller_id ||
                                products[0]?.seller?.seller_id
                            }
                        />
                    )}
                </div>

                {/* Right Column - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 top-6">
                        <h2 className="text-black text-xl font-semibold mb-6">
                            Order Summary
                        </h2>

                        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 mb-6">
                            {products.map((p) => {
                                const pd = p.product;
                                const variant = parseVariant(p);
                                const qty = p.product?.selected_quantity || 1;
                                const img =
                                    pd.product_image?.image_path ||
                                    pd.product_image?.[0]?.image_path;
                                const display = getVariantDisplay(variant);

                                return (
                                    <div
                                        key={pd.product_id}
                                        className="flex items-start gap-4 pb-4 border-b border-gray-100"
                                    >
                                        <div className="relative">
                                            <img
                                                src={`${import.meta.env.VITE_BASE_URL}${img || "/default-image.jpg"}`}
                                                alt={pd.product_name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <span className="absolute -top-1 -right-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                                Qty: {qty}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                {pd.product_name}
                                            </p>
                                            {display?.map((d, i) => (
                                                <div
                                                    key={i}
                                                    className="mt-2 bg-gray-100 px-2 py-1 rounded-md inline-block mr-1"
                                                >
                                                    <span className="text-xs text-gray-600">
                                                        {d.key}:{" "}
                                                    </span>
                                                    <span className="text-xs font-medium text-gray-900">
                                                        {d.value}
                                                    </span>
                                                </div>
                                            ))}
                                            <p className="text-xs text-gray-500 mt-2">
                                                Price: RM{" "}
                                                {parseFloat(
                                                    variant?.price ||
                                                        pd.product_price,
                                                ).toFixed(2)}{" "}
                                                each
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                                            RM{" "}
                                            {(
                                                parseFloat(
                                                    variant?.price ||
                                                        pd.product_price,
                                                ) * qty
                                            ).toFixed(2)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 mb-6 flex items-start">
                            <Clock
                                size={18}
                                className="text-blue-600 mr-2 mt-0.5"
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

                        <div className="space-y-3 border-t border-gray-200 pt-4">
                            {[
                                { label: "Subtotal", value: totals.subtotal },
                                { label: "Shipping", value: totals.shipping },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-gray-600">
                                        {item.label}
                                    </span>
                                    <span className="text-gray-900">
                                        RM {item.value.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                                <span className="text-black">Total</span>
                                <span className="text-blue-600">
                                    RM {totals.total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-center justify-center text-xs text-gray-500">
                            <Lock size={12} className="mr-1" /> Your payment is
                            secure and encrypted
                        </div>

                        <div className="mt-6 flex justify-center space-x-6">
                            {[
                                { icon: Shield, label: "Secure" },
                                { icon: Lock, label: "SSL" },
                                { icon: CreditCard, label: "PCI" },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-gray-100 rounded-lg p-2 flex items-center"
                                >
                                    <item.icon
                                        size={16}
                                        className="text-gray-600 mr-1"
                                    />
                                    <span className="text-black text-xs">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                            <HelpCircle
                                size={18}
                                className="text-gray-500 mr-2"
                            />{" "}
                            Need help?
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            24/7 customer service
                        </p>
                        <p className="text-blue-500 text-sm">
                            relovemarket006@gmail.com
                        </p>
                        <p className="text-gray-600 text-sm">+60126547653</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
