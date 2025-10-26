// resources/js/Pages/OrderSuccess.jsx
import { useEffect, useState } from "react";
import { Check, Clock, Package } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function OrderSuccess({ order_id, payment_intent_id, amount }) {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to orders page or home
                    window.location.href = "/orders";
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
                <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Check className="text-green-600" size={40} />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Order Confirmed!
                </h1>

                <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been
                    successfully processed.
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Order ID:</span>
                        <span className="font-semibold">{order_id}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-semibold text-green-600">
                            RM {amount}
                        </span>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-4 text-sm">
                        <div className="flex items-center">
                            <Package className="text-blue-600 mr-2" size={16} />
                            <span>Preparing your order</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="text-blue-600 mr-2" size={16} />
                            <span>Delivery in 2-4 days</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link
                        href="/orders"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        View Your Orders
                    </Link>

                    <Link
                        href="/"
                        className="block w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Redirecting to orders page in {countdown} seconds...
                </p>
            </div>
        </div>
    );
}
