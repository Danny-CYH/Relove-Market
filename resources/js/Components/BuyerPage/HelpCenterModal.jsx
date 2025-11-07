// Components/HelpCenterModal.jsx
import { X, Search, MessageCircle, Phone, Mail } from "lucide-react";

export function HelpCenterModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const faqItems = [
        {
            question: "How do I create an account?",
            answer: "Click on 'Sign Up' in the top right corner and follow the registration process.",
        },
        {
            question: "How do I reset my password?",
            answer: "Go to the login page and click 'Forgot Password' to receive reset instructions via email.",
        },
        {
            question: "How do I contact a seller?",
            answer: "Navigate to the product page and use the 'Message Seller' button to start a conversation.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept credit/debit cards, GrabPay, and cash on delivery for certain items.",
        },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <MessageCircle
                            className="text-blue-600 mr-3"
                            size={24}
                        />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Help Center
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
                <div className="overflow-y-auto max-h-[60vh] p-6">
                    {/* FAQ Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {item.question}
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        {item.answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Methods */}
                    <div className="bg-gray-50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Need More Help?
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center">
                                <Phone
                                    className="mx-auto text-blue-600 mb-2"
                                    size={24}
                                />
                                <p className="font-medium text-gray-900">
                                    Call Us
                                </p>
                                <p className="text-gray-600 text-sm">
                                    +60 12 654 7653
                                </p>
                            </div>
                            <div className="text-center">
                                <Mail
                                    className="mx-auto text-blue-600 mb-2"
                                    size={24}
                                />
                                <p className="font-medium text-gray-900">
                                    Email Us
                                </p>
                                <p className="text-gray-600 text-sm">
                                    relovemarket006@gmail.com
                                </p>
                            </div>
                            <div className="text-center">
                                <MessageCircle
                                    className="mx-auto text-blue-600 mb-2"
                                    size={24}
                                />
                                <p className="font-medium text-gray-900">
                                    Live Chat
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Available 24/7
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
