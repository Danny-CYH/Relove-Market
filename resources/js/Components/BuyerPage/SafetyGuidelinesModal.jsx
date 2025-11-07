// Components/SafetyGuidelinesModal.jsx
import { X, Shield, AlertTriangle, CheckCircle, Users } from "lucide-react";

export function SafetyGuidelinesModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const guidelines = [
        {
            icon: <Shield className="text-green-600" size={20} />,
            title: "Buyer Protection",
            items: [
                "Always communicate through our secure messaging system",
                "Verify item condition before purchase",
                "Use secure payment methods only",
                "Check seller ratings and reviews",
            ],
        },
        {
            icon: <AlertTriangle className="text-orange-600" size={20} />,
            title: "Red Flags to Watch For",
            items: [
                "Sellers asking for payment outside the platform",
                "Prices that seem too good to be true",
                "Vague or incomplete item descriptions",
                "Pressure to complete transaction quickly",
            ],
        },
        {
            icon: <CheckCircle className="text-blue-600" size={20} />,
            title: "Safe Transaction Tips",
            items: [
                "Meet in public places for local exchanges",
                "Inspect items thoroughly before payment",
                "Keep all communication records",
                "Report suspicious activity immediately",
            ],
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Shield className="text-green-600 mr-3" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Safety Guidelines
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
                    <div className="mb-6">
                        <p className="text-gray-600 mb-4">
                            Your safety is our top priority. Follow these
                            guidelines to ensure a secure and positive
                            experience on Relove Market.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {guidelines.map((section, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex items-center mb-4">
                                    {section.icon}
                                    <h3 className="text-lg font-semibold text-gray-900 ml-3">
                                        {section.title}
                                    </h3>
                                </div>
                                <ul className="space-y-2">
                                    {section.items.map((item, itemIndex) => (
                                        <li
                                            key={itemIndex}
                                            className="flex items-start"
                                        >
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                            <span className="text-gray-600">
                                                {item}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
                        <div className="flex items-center mb-3">
                            <AlertTriangle
                                className="text-red-600 mr-2"
                                size={20}
                            />
                            <h3 className="text-lg font-semibold text-red-900">
                                Emergency Contact
                            </h3>
                        </div>
                        <p className="text-red-800 text-sm mb-3">
                            If you feel unsafe or encounter an emergency
                            situation during a transaction:
                        </p>
                        <div className="space-y-2 text-sm text-red-800">
                            <p>
                                <strong>Local Authorities:</strong> 999
                                (Emergency)
                            </p>
                            <p>
                                <strong>Relove Market Safety Team:</strong> +60
                                12 654 7653
                            </p>
                            <p>
                                <strong>Email:</strong> safety@relovemarket.com
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
