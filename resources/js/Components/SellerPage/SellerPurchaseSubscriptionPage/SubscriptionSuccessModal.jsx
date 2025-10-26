import { CheckCircle, Calendar, Star, ExternalLink } from "lucide-react";

export function SubscriptionSuccessModal({
    subscriptionData,
    isOpen,
    onClose,
}) {
    if (!isOpen) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-MY", {
            style: "currency",
            currency: "MYR",
            minimumFractionDigits: 2,
        }).format(price);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 transform transition-all">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>

                    {/* Success Message */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Subscription Activated!
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Your {subscriptionData.planName} subscription is now
                        active and ready to use.
                    </p>

                    {/* Subscription Details */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-900">
                                Plan:
                            </span>
                            <span className="font-semibold text-blue-600">
                                {subscriptionData.planName}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-medium text-gray-900">
                                Amount:
                            </span>
                            <span className="font-semibold text-green-600">
                                {formatPrice(subscriptionData.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-gray-900">
                                Duration:
                            </span>
                            <span className="font-semibold text-gray-900">
                                {subscriptionData.durationDays} days
                            </span>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                            <Star className="mr-2" size={16} />
                            What's Next?
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1 text-left">
                            <li>• Access all premium features immediately</li>
                            <li>
                                • Manage your subscription in Seller Dashboard
                            </li>
                            <li>• Get priority customer support</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                            Continue Browsing
                        </button>
                        <button
                            onClick={() =>
                                (window.location.href = "/seller/dashboard")
                            }
                            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                        >
                            Go to Dashboard
                            <ExternalLink size={16} className="ml-2" />
                        </button>
                    </div>

                    {/* Subscription ID */}
                    <p className="text-xs text-gray-500 mt-4">
                        Subscription ID: {subscriptionData.subscriptionId}
                    </p>
                </div>
            </div>
        </div>
    );
}
