import { Check, X } from "lucide-react";

import { router } from "@inertiajs/react";

export function OrderSuccessModal({ orderData, isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-[-30px] bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-auto animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                            <Check className="text-green-600" size={24} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Payment Successful!
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase! Your order has been
                            confirmed.
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-semibold text-gray-900">
                                {orderData.orderId}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-500">Amount Paid</p>
                            <p className="font-semibold text-green-600 text-xl">
                                RM {orderData.amount?.toFixed(2)}
                            </p>
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
                <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
                    <button
                        onClick={() => {
                            onClose();
                            // Redirect to home or orders page
                            router.visit(route("shopping"));
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Continue Shopping
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-3">
                        Redirecting to order details in 7 seconds...
                    </p>
                </div>
            </div>
        </div>
    );
}
