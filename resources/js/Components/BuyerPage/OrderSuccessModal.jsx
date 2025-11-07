import { Check, X, ArrowLeft, ExternalLink } from "lucide-react";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export function OrderSuccessModal({ orderData, isOpen, onClose }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!isOpen) return null;

    // Mobile Bottom Sheet Version
    if (isMobile) {
        return (
            <div className="fixed inset-0 flex items-end justify-center z-50">
                {/* Backdrop */}
                <div className="absolute inset-0" onClick={onClose} />

                {/* Bottom Sheet */}
                <div className="bg-white rounded-t-3xl w-full max-w-md mx-auto animate-slide-up shadow-xl max-h-[85vh] overflow-hidden flex flex-col relative">
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-2">
                        <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                                <Check className="text-green-600 w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Order Confirmed!
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="text-center mb-4">
                            <p className="text-gray-600 mb-4 text-sm">
                                Thank you for your purchase!
                            </p>

                            <div className="space-y-3">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Order ID
                                    </p>
                                    <p className="font-semibold text-gray-900 text-sm break-all">
                                        {orderData.orderId}
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                        Total Paid
                                    </p>
                                    <p className="font-semibold text-green-600 text-lg">
                                        RM {orderData.amount?.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-blue-700 text-center">
                                📧 Confirmation email sent
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-gray-200 bg-white space-y-3">
                        <button
                            onClick={() => {
                                onClose();
                                router.visit(route("shopping"));
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm"
                        >
                            Continue Shopping
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    onClose();
                                    router.visit(route("profile"));
                                }}
                                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-xs transition-colors hover:bg-gray-50"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View Orders
                            </button>
                            <button
                                onClick={() => {
                                    onClose();
                                    router.visit(route("wishlist"));
                                }}
                                className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium text-xs transition-colors hover:bg-gray-50"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back to Cart
                            </button>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <p className="text-xs text-gray-500">
                                    Auto redirect in 7s
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Version (original with improvements)
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full mx-auto animate-fade-in shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Check className="text-green-600 w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Payment Successful!
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase! Your order has been
                            confirmed.
                        </p>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Order ID
                                </p>
                                <p className="font-semibold text-gray-900">
                                    {orderData.orderId}
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-500">
                                    Amount Paid
                                </p>
                                <p className="font-semibold text-green-600 text-xl">
                                    RM {orderData.amount?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-gray-600 text-center">
                            A confirmation email has been sent to your email
                            address.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
                    <button
                        onClick={() => {
                            onClose();
                            router.visit(route("shopping"));
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Continue Shopping
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Redirecting to shopping page in 7 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
