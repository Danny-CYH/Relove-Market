import {
    Check,
    X,
    ExternalLink,
    ShoppingBag,
    Mail,
    Download,
    Share2,
    Clock,
    Truck,
    Package,
} from "lucide-react";
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";

export function OrderSuccessModal({ orderData, isOpen, onClose }) {
    const [isMobile, setIsMobile] = useState(false);
    const [timeLeft, setTimeLeft] = useState(7);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    router.visit(route("profile"));
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleShareOrder = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My Order Confirmation",
                    text: `I just placed an order #${orderData.orderId} on Relove Market!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log("Error sharing:", error);
            }
        } else {
            navigator.clipboard.writeText(
                `Order #${orderData.orderId} - RM ${orderData.amount?.toFixed(
                    2
                )}`
            );
        }
    };

    const handleDownloadReceipt = () => {
        console.log("Download receipt for order:", orderData.orderId);
    };

    // Mobile Version - Compact Bottom Sheet
    if (isMobile) {
        return (
            <div className="fixed inset-0 flex items-end justify-center z-50">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={onClose}
                />

                {/* Compact Bottom Sheet */}
                <div className="bg-white rounded-t-2xl w-full max-w-sm mx-auto animate-slide-up shadow-xl max-h-[70vh] overflow-hidden flex flex-col relative z-10">
                    {/* Drag Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                    </div>

                    {/* Header - Compact */}
                    <div className="px-4 pt-2 pb-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="text-white w-4 h-4" />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Order Confirmed
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Order Info - Horizontal Layout */}
                        <div className="flex justify-between items-center bg-green-50 rounded-lg p-3">
                            <div>
                                <p className="text-xs text-green-800 font-medium">
                                    ORDER #
                                </p>
                                <p className="text-sm font-bold text-gray-900">
                                    {orderData.orderId}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-green-800 font-medium">
                                    TOTAL
                                </p>
                                <p className="text-lg font-bold text-green-600">
                                    RM {orderData.amount?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Horizontal */}
                    <div className="px-4 pb-3">
                        <div className="flex justify-between gap-2">
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Download className="w-3 h-3" />
                                Receipt
                            </button>
                            <button
                                onClick={handleShareOrder}
                                className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Share2 className="w-3 h-3" />
                                Share
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-2 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                <Mail className="w-3 h-3" />
                                Email
                            </button>
                        </div>
                    </div>

                    {/* Progress Steps - Horizontal */}
                    <div className="px-4 pb-4">
                        <div className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Package className="w-3 h-3 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-800">
                                        Processing
                                    </span>
                                </div>
                                <Clock className="w-3 h-3 text-blue-600" />
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div
                                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: "33%" }}
                                ></div>
                            </div>
                            <p className="text-xs text-blue-700 mt-1">
                                2-4 business days delivery
                            </p>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-gray-200 bg-gray-50 p-4">
                        <div className="space-y-2">
                            <button
                                onClick={() => {
                                    onClose();
                                    router.visit(route("shopping"));
                                }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        onClose();
                                        router.visit(route("profile"));
                                    }}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50 flex items-center justify-center gap-1"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                    Orders
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>

                            <div className="flex items-center justify-center pt-1">
                                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-full border">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-gray-600">
                                        Redirect in {timeLeft}s
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Version - Compact Horizontal Layout
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl max-w-md w-full mx-auto animate-scale-in shadow-xl overflow-hidden">
                {/* Header - Compact */}
                <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-white hover:text-green-100 transition-colors p-1 rounded-full hover:bg-white hover:bg-opacity-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30">
                                <Check className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">
                                    Order Confirmed!
                                </h2>
                                <p className="text-green-100 text-sm opacity-90">
                                    Thank you for your purchase
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Horizontal Layout */}
                <div className="p-4">
                    {/* Order Summary - Horizontal */}
                    <div className="flex justify-between items-center bg-gray-50 rounded-lg p-4 mb-4">
                        <div>
                            <p className="text-xs font-medium text-gray-600 mb-1">
                                ORDER NUMBER
                            </p>
                            <p className="font-mono font-bold text-gray-900 text-sm">
                                #{orderData.orderId}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-gray-600 mb-1">
                                TOTAL AMOUNT
                            </p>
                            <p className="font-bold text-green-600 text-xl">
                                RM {orderData.amount?.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Progress Timeline - Horizontal */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-700">
                                Order Status
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                                Step 1 of 3
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {["Confirmed", "Processing", "Delivered"].map(
                                (step, index) => (
                                    <div
                                        key={step}
                                        className="flex-1 flex flex-col items-center"
                                    >
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                index === 0
                                                    ? "bg-green-500"
                                                    : index === 1
                                                    ? "bg-blue-500"
                                                    : "bg-gray-300"
                                            }`}
                                        ></div>
                                        {index < 2 && (
                                            <div
                                                className={`flex-1 h-0.5 ${
                                                    index === 0
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                }`}
                                            ></div>
                                        )}
                                    </div>
                                )
                            )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                            <span>Confirmed</span>
                            <span>Processing</span>
                            <span>Delivered</span>
                        </div>
                    </div>

                    {/* Quick Actions - Horizontal */}
                    <div className="mb-4">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                            Quick Actions
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            <button
                                onClick={handleDownloadReceipt}
                                className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border"
                            >
                                <Download className="w-4 h-4 text-gray-600 mb-1 group-hover:text-green-600" />
                                <span className="text-xs text-gray-700">
                                    Receipt
                                </span>
                            </button>
                            <button
                                onClick={handleShareOrder}
                                className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border"
                            >
                                <Share2 className="w-4 h-4 text-gray-600 mb-1 group-hover:text-green-600" />
                                <span className="text-xs text-gray-700">
                                    Share
                                </span>
                            </button>
                            <button className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border">
                                <Mail className="w-4 h-4 text-gray-600 mb-1 group-hover:text-green-600" />
                                <span className="text-xs text-gray-700">
                                    Email
                                </span>
                            </button>
                            <button className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border">
                                <Truck className="w-4 h-4 text-gray-600 mb-1 group-hover:text-green-600" />
                                <span className="text-xs text-gray-700">
                                    Track
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Delivery Info - Compact */}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <Truck className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-medium text-blue-800">
                                Delivery Estimate
                            </span>
                        </div>
                        <p className="text-xs text-blue-700">
                            Your order will be delivered within 2-4 business
                            days
                        </p>
                    </div>
                </div>

                {/* Footer - Compact */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => {
                                onClose();
                                router.visit(route("shopping"));
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => {
                                onClose();
                                router.visit(route("profile"));
                            }}
                            className="px-4 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors hover:bg-gray-50 flex items-center justify-center gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            Orders
                        </button>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-gray-600">
                                Auto redirect in {timeLeft}s
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Stay here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
