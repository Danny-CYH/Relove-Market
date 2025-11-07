// Components/ReturnsRefundsModal.jsx
import { X, Undo2, Calendar, CreditCard, AlertCircle } from "lucide-react";

export function ReturnsRefundsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const returnPolicy = [
        {
            period: "30 Days",
            condition: "Items must be in original condition with tags attached",
            process:
                "Contact seller first, then initiate return through platform",
        },
    ];

    const refundTimeline = [
        { step: "Return Request Approved", duration: "1-2 business days" },
        { step: "Item Received & Inspected", duration: "3-5 business days" },
        { step: "Refund Processed", duration: "5-7 business days" },
        {
            step: "Refund in Your Account",
            duration: "Additional 3-5 business days",
        },
    ];

    const nonReturnableItems = [
        "Personal care items (for hygiene reasons)",
        "Customized or personalized items",
        "Digital products and downloads",
        "Items damaged by the buyer",
        "Final sale items (clearly marked)",
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Undo2 className="text-blue-600 mr-3" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Returns & Refunds Policy
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
                <div className="overflow-y-auto max-h-[70vh] p-6">
                    {/* Return Policy */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Return Policy
                        </h3>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center mb-3">
                                <Calendar
                                    className="text-blue-600 mr-2"
                                    size={20}
                                />
                                <span className="font-semibold text-blue-900">
                                    Return Period: {returnPolicy[0].period}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm text-blue-800">
                                <p>
                                    <strong>Condition:</strong>{" "}
                                    {returnPolicy[0].condition}
                                </p>
                                <p>
                                    <strong>Process:</strong>{" "}
                                    {returnPolicy[0].process}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Refund Timeline */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Refund Timeline
                        </h3>
                        <div className="space-y-3">
                            {refundTimeline.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b border-gray-200 pb-3"
                                >
                                    <div className="flex items-center">
                                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                            {index + 1}
                                        </div>
                                        <span className="text-gray-700">
                                            {step.step}
                                        </span>
                                    </div>
                                    <span className="text-blue-600 font-medium text-sm">
                                        {step.duration}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Non-Returnable Items */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Non-Returnable Items
                        </h3>
                        <div className="bg-red-50 rounded-lg p-4">
                            <ul className="space-y-2">
                                {nonReturnableItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <AlertCircle
                                            className="text-red-600 mr-2 mt-0.5 flex-shrink-0"
                                            size={16}
                                        />
                                        <span className="text-red-800 text-sm">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Refund Methods */}
                    <div className="bg-green-50 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                            <CreditCard className="mr-2" size={18} />
                            Refund Methods
                        </h3>
                        <div className="text-sm text-green-800 space-y-1">
                            <p>• Original payment method (credit/debit card)</p>
                            <p>• Platform wallet credit (instant)</p>
                            <p>• Bank transfer (for cash payments)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
