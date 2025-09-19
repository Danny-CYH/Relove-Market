import { CheckCircle } from "lucide-react";

export function OrderSuccessModal() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Order Confirmed!
            </h2>
            <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed and
                is being processed.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-semibold text-gray-900">#ORD-123456</p>
            </div>
            <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md hover:shadow-lg mr-3">
                    Continue Shopping
                </button>
                <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors">
                    View Order Details
                </button>
            </div>
        </div>
    );
}
