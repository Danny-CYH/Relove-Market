import { useState, useEffect } from "react";
import {
    CreditCard,
    Lock,
    Shield,
    ArrowLeft,
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

export default function CheckoutPage({ list_product, errors: initialErrors }) {
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [activeStep, setActiveStep] = useState(1);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const [isPageLoaded, setIsPageLoaded] = useState(false);
    const [hasProducts, setHasProducts] = useState(false);

    const [hasValidData, setHasValidData] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [checkoutErrors, setCheckoutErrors] = useState(initialErrors || []);

    // Enhanced product validation
    useEffect(() => {
        const validateProducts = () => {
            const productsArray = getProductsArray();

            if (productsArray.length === 0) {
                console.warn(
                    "No checkout data found, redirecting to wishlist..."
                );
                router.visit(route("wishlist"), {
                    data: {
                        error: "Checkout session expired. Please select items again.",
                    },
                });
                return false;
            }

            // Validate each product structure
            const invalidProducts = productsArray.filter((product) => {
                const productId =
                    product.product_id || product.product?.product_id;
                const quantity =
                    product.selected_quantity || product.quantity || 1;

                if (!productId || quantity < 1) {
                    return true;
                }

                // Validate variant data if present
                if (product.selected_variant) {
                    try {
                        const variant = parseSelectedVariant(product);
                        if (!variant || !variant.variant_id) {
                            return true;
                        }
                    } catch (error) {
                        return true;
                    }
                }

                return false;
            });

            if (invalidProducts.length > 0) {
                setCheckoutErrors([
                    "Some products in your cart are invalid. Please review your selection.",
                ]);
                return false;
            }

            setHasValidData(true);
            return true;
        };

        const isValid = validateProducts();
        setIsLoading(false);

        return () => {
            // Cleanup if needed
        };
    }, []);

    // Redirect if no products
    useEffect(() => {
        if (isPageLoaded && !hasProducts) {
            console.warn("No products found, redirecting to cart...");
            router.visit(route("wishlist")); // or your cart page route
        }
    }, [isPageLoaded, hasProducts]);

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

    const handlePaymentSuccess = (orderInfo) => {
        setOrderData(orderInfo);
        setShowSuccessModal(true);

        setCheckoutErrors([]);

        // Remove the beforeunload listener after successful payment
        window.removeEventListener("beforeunload", () => {});

        // Optional: Redirect to success page after a delay
        setTimeout(() => {
            router.visit(route("profile"));
        }, 7000);
    };

    const handlePaymentError = (error) => {
        setCheckoutErrors([error]);
        // Scroll to top to show error
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Parse selected variant from the product data
    const parseSelectedVariant = (product) => {
        if (!product.selected_variant) return null;

        try {
            const variant =
                typeof product.selected_variant === "string"
                    ? JSON.parse(product.selected_variant)
                    : product.selected_variant;

            // Validate variant structure
            if (!variant || typeof variant !== "object") {
                console.warn("Invalid variant structure:", variant);
                return null;
            }

            return variant;
        } catch (error) {
            console.error(
                "Error parsing selected variant:",
                error,
                product.selected_variant
            );
            return null;
        }
    };

    // Get variant display text - FIXED VERSION
    const getVariantDisplayText = (variant) => {
        if (!variant) return null;

        // Helper function to process combination object/string
        const processCombination = (combination) => {
            if (!combination) return null;

            // If it's already an object
            if (typeof combination === "object") {
                return Object.entries(combination)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ");
            }

            // If it's a string
            if (typeof combination === "string") {
                // Try to parse as JSON first
                try {
                    const parsed = JSON.parse(combination);
                    if (typeof parsed === "object") {
                        return Object.entries(parsed)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(", ");
                    }
                    return combination; // Return as-is if not JSON object
                } catch (error) {
                    // If not JSON, check if it's a simple key-value string
                    if (combination.includes(":")) {
                        return combination; // Return as-is if it already contains colons
                    }
                    // If it's just a single value, format it nicely
                    return combination;
                }
            }

            return null;
        };

        // Check different possible fields in order of priority
        let displayText = null;

        // 1. Check variant_combination first
        if (variant.variant_combination) {
            displayText = processCombination(variant.variant_combination);
        }

        // 2. Check combination field
        if (!displayText && variant.combination) {
            displayText = processCombination(variant.combination);
        }

        // 3. Check if there are individual variant attributes
        if (!displayText) {
            const variantAttributes = [];

            // Look for common variant attribute fields
            const variantFields = [
                "color",
                "size",
                "material",
                "style",
                "type",
                "weight",
                "length",
                "width",
                "height",
            ];

            variantFields.forEach((field) => {
                if (variant[field]) {
                    variantAttributes.push(`${field}: ${variant[field]}`);
                }
            });

            if (variantAttributes.length > 0) {
                displayText = variantAttributes.join(", ");
            }
        }

        // 4. Check if variant itself has properties that could be displayed
        if (!displayText && typeof variant === "object") {
            // Exclude common non-variant fields
            const excludeFields = [
                "id",
                "variant_id",
                "price",
                "variant_price",
                "quantity",
                "stock_quantity",
                "sku",
                "image",
                "created_at",
                "updated_at",
            ];

            const variantProps = Object.entries(variant)
                .filter(
                    ([key, value]) =>
                        !excludeFields.includes(key) &&
                        value &&
                        typeof value !== "object" &&
                        key !== "variant_combination" &&
                        key !== "combination"
                )
                .map(([key, value]) => `${key}: ${value}`);

            if (variantProps.length > 0) {
                displayText = variantProps.join(", ");
            }
        }

        // 5. Final fallback - check if variant has a name or title
        if (!displayText) {
            if (variant.name) return variant.name;
            if (variant.title) return variant.title;
            if (variant.variant_name) return variant.variant_name;
        }

        return displayText || "Variant";
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
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    };

    const { subtotal, shipping, total } = calculateTotals();
    const productsArray = getProductsArray();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
        );
    }

    // Show error state if no valid data
    if (!hasValidData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        No Items to Checkout
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your checkout session has expired or no items were
                        selected.
                    </p>
                    <button
                        onClick={() => router.visit(route("wishlist"))}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Return to Wishlist
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Navbar />

            {/* Error Display */}
            {checkoutErrors.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center">
                            <svg
                                className="w-5 h-5 text-red-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <h3 className="text-red-800 font-medium">
                                Checkout Issues
                            </h3>
                        </div>
                        <ul className="mt-2 text-red-700 text-sm">
                            {checkoutErrors.map((error, index) => (
                                <li key={index}>• {error}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

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
                            </div>
                        </div>

                        {/* Stripe Payment Form */}
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                total={total}
                                setActiveStep={setActiveStep}
                                paymentMethod={paymentMethod}
                                onPaymentSuccess={handlePaymentSuccess}
                                onPaymentError={handlePaymentError}
                                list_product={productsArray}
                                subtotal={subtotal}
                                shipping={shipping}
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
                            {productsArray.map((product, index) => {
                                const normalizedProduct =
                                    normalizeProductData(product);
                                const selectedVariant =
                                    parseSelectedVariant(normalizedProduct);
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
                                                <div className="mt-1">
                                                    <div className="flex flex-wrap gap-1">
                                                        <span className="inline-flex items-center px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            {variantText}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Debug info - remove in production */}
                                            {!variantText &&
                                                selectedVariant && (
                                                    <div className="mt-1">
                                                        <p className="text-xs text-gray-500">
                                                            Variant data:{" "}
                                                            {JSON.stringify(
                                                                selectedVariant
                                                            )}
                                                        </p>
                                                    </div>
                                                )}

                                            <p className="text-xs text-gray-500 mt-1">
                                                Price: RM {displayPrice} each
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
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
