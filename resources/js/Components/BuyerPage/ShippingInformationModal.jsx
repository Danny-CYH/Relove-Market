// Components/ShippingInformationModal.jsx
import { X, Truck, Clock, MapPin, Package } from "lucide-react";

export function ShippingInformationModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const shippingOptions = [
        {
            method: "Standard Shipping",
            duration: "3-5 business days",
            cost: "RM 5.00",
            free: "Free on orders over RM100",
            icon: <Truck className="text-blue-600" size={20} />,
        },
        {
            method: "Express Shipping",
            duration: "1-2 business days",
            cost: "RM 12.00",
            free: "Not available for free shipping",
            icon: <Clock className="text-green-600" size={20} />,
        },
        {
            method: "Pickup Points",
            duration: "2-3 business days",
            cost: "RM 3.00",
            free: "Available nationwide",
            icon: <MapPin className="text-orange-600" size={20} />,
        },
    ];

    const coverageAreas = [
        "Peninsular Malaysia",
        "East Malaysia (Sabah & Sarawak)",
        "Free shipping zone: Klang Valley only",
        "International shipping available (contact for rates)",
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <Truck className="text-blue-600 mr-3" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Shipping Information
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
                    {/* Shipping Options */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Shipping Options
                        </h3>
                        <div className="space-y-4">
                            {shippingOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-center mb-3">
                                        {option.icon}
                                        <h4 className="font-semibold text-gray-900 ml-3">
                                            {option.method}
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">
                                                Duration:
                                            </span>
                                            <p className="font-medium text-black">
                                                {option.duration}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">
                                                Cost:
                                            </span>
                                            <p className="font-medium text-black">
                                                {option.cost}
                                            </p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-gray-500">
                                                Note:
                                            </span>
                                            <p className="text-green-600 font-medium">
                                                {option.free}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Coverage Areas */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Coverage Areas
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <ul className="space-y-2">
                                {coverageAreas.map((area, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <Package
                                            className="text-gray-400 mr-2"
                                            size={16}
                                        />
                                        <span className="text-gray-600">
                                            {area}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-900 mb-2">
                            Important Notes
                        </h4>
                        <ul className="text-yellow-800 text-sm space-y-1">
                            <li>
                                • Shipping times are estimates and may vary
                                during peak seasons
                            </li>
                            <li>
                                • Some remote areas may experience longer
                                delivery times
                            </li>
                            <li>
                                • Tracking information will be provided once
                                your order ships
                            </li>
                            <li>
                                • Contact us if your package hasn't arrived
                                within estimated timeframe
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
