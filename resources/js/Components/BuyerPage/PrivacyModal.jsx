import { useState } from "react";

export function PrivacyModal() {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {/* Your existing links - updated to open modal */}
            <div className="text-sm text-gray-600">
                By continuing, you agree to our{" "}
                <button
                    onClick={openModal}
                    className="text-blue-600 hover:text-blue-500 underline cursor-pointer"
                >
                    Terms of Service
                </button>{" "}
                and{" "}
                <button
                    onClick={openModal}
                    className="text-blue-600 hover:text-blue-500 underline cursor-pointer"
                >
                    Privacy Policy
                </button>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Container */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Terms of Service & Privacy Policy
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <div className="space-y-6">
                                {/* Terms of Service Section */}
                                <section>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Terms of Service
                                    </h3>
                                    <div className="text-gray-600 space-y-2">
                                        <p>
                                            Welcome to our service. By accessing
                                            or using our platform, you agree to
                                            be bound by these Terms of Service.
                                        </p>
                                        <h4 className="font-medium text-gray-900 mt-3">
                                            User Responsibilities
                                        </h4>
                                        <p>
                                            You are responsible for maintaining
                                            the confidentiality of your account
                                            and password and for restricting
                                            access to your computer.
                                        </p>
                                        <h4 className="font-medium text-gray-900 mt-3">
                                            Service Modifications
                                        </h4>
                                        <p>
                                            We reserve the right to modify or
                                            discontinue, temporarily or
                                            permanently, the service with or
                                            without notice.
                                        </p>
                                    </div>
                                </section>

                                {/* Privacy Policy Section */}
                                <section>
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">
                                        Privacy Policy
                                    </h3>
                                    <div className="text-gray-600 space-y-2">
                                        <p>
                                            Your privacy is important to us.
                                            This Privacy Policy explains how we
                                            collect, use, and protect your
                                            personal information.
                                        </p>
                                        <h4 className="font-medium text-gray-900 mt-3">
                                            Information We Collect
                                        </h4>
                                        <p>
                                            We collect information you provide
                                            directly to us, such as when you
                                            create an account, use our services,
                                            or contact us for support.
                                        </p>
                                        <h4 className="font-medium text-gray-900 mt-3">
                                            How We Use Information
                                        </h4>
                                        <p>
                                            We use the information we collect to
                                            provide, maintain, and improve our
                                            services, and to develop new ones.
                                        </p>
                                        <h4 className="font-medium text-gray-900 mt-3">
                                            Data Security
                                        </h4>
                                        <p>
                                            We implement appropriate technical
                                            and organizational measures to
                                            protect your personal information
                                            against unauthorized access.
                                        </p>
                                    </div>
                                </section>

                                {/* Contact Information */}
                                <section className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        Questions?
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        If you have any questions about our
                                        Terms of Service or Privacy Policy,
                                        please contact us at{" "}
                                        <a
                                            href="mailto:privacy@yourapp.com"
                                            className="text-blue-600 hover:text-blue-500"
                                        >
                                            privacy@yourapp.com
                                        </a>
                                    </p>
                                </section>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end p-6 border-t bg-gray-50">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
