import React, { useState } from "react";
import { FaTimes, FaCheckSquare, FaSquare, FaDownload } from "react-icons/fa";

export function TermsConditions({ isOpen, onClose, onAccept }) {
    const [accepted, setAccepted] = useState(false);
    const [activeTab, setActiveTab] = useState("terms"); // 'terms' or 'privacy'

    if (!isOpen) return null;

    const handleAccept = () => {
        if (accepted) {
            onAccept();
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Terms & Policies
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-6 py-4 font-medium text-lg ${
                            activeTab === "terms"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("terms")}
                    >
                        Terms of Service
                    </button>
                    <button
                        className={`px-6 py-4 font-medium text-lg ${
                            activeTab === "privacy"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab("privacy")}
                    >
                        Privacy Policy
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6 flex-grow">
                    {activeTab === "terms" ? (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Terms of Service
                            </h3>
                            <p className="text-gray-600">
                                Last Updated: {new Date().toLocaleDateString()}
                            </p>

                            <div className="space-y-4 text-gray-700">
                                <h4 className="font-semibold text-lg mt-6">
                                    1. Account Registration
                                </h4>
                                <p>
                                    To access our e-preloved exchange platform,
                                    you must register for an account providing
                                    accurate and complete information. You are
                                    responsible for maintaining the
                                    confidentiality of your account credentials.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    2. Listing Items
                                </h4>
                                <p>
                                    You may list preloved items for exchange on
                                    our platform, provided that:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>
                                        Items are accurately described with
                                        clear images
                                    </li>
                                    <li>
                                        Items are not prohibited by our
                                        guidelines
                                    </li>
                                    <li>
                                        You have the legal right to exchange the
                                        items
                                    </li>
                                    <li>
                                        Items are in good condition as described
                                    </li>
                                </ul>

                                <h4 className="font-semibold text-lg mt-6">
                                    3. Exchange Process
                                </h4>
                                <p>
                                    Our platform facilitates connections between
                                    users for item exchanges. We are not
                                    directly involved in transactions but
                                    provide tools to make exchanges easier and
                                    more secure.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    4. Prohibited Items
                                </h4>
                                <p>
                                    You may not list items that are illegal,
                                    hazardous, stolen, or otherwise violate our
                                    community guidelines including but not
                                    limited to:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>Weapons or ammunition</li>
                                    <li>Illegal substances or drugs</li>
                                    <li>Counterfeit or stolen goods</li>
                                    <li>Live animals</li>
                                    <li>Adult content or explicit material</li>
                                </ul>

                                <h4 className="font-semibold text-lg mt-6">
                                    5. User Conduct
                                </h4>
                                <p>
                                    You agree to interact with other users
                                    respectfully and in accordance with our
                                    community guidelines. Harassment, fraud, or
                                    abusive behavior will result in account
                                    suspension.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    6. Service Modifications
                                </h4>
                                <p>
                                    We reserve the right to modify or
                                    discontinue our service at any time. We will
                                    provide notice of significant changes that
                                    affect your use of the platform.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Privacy Policy
                            </h3>
                            <p className="text-gray-600">
                                Last Updated: {new Date().toLocaleDateString()}
                            </p>

                            <div className="space-y-4 text-gray-700">
                                <h4 className="font-semibold text-lg mt-6">
                                    1. Information We Collect
                                </h4>
                                <p>
                                    We collect information you provide during
                                    registration, item listings, and exchanges.
                                    This may include:
                                </p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>
                                        Personal identification information
                                        (name, email, etc.)
                                    </li>
                                    <li>Item descriptions and images</li>
                                    <li>Exchange history and preferences</li>
                                    <li>Communication with other users</li>
                                </ul>

                                <h4 className="font-semibold text-lg mt-6">
                                    2. How We Use Your Information
                                </h4>
                                <p>We use your information to:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2">
                                    <li>Facilitate exchanges between users</li>
                                    <li>Personalize your experience</li>
                                    <li>Improve our platform and services</li>
                                    <li>
                                        Communicate important updates and
                                        notifications
                                    </li>
                                    <li>
                                        Ensure platform security and prevent
                                        fraud
                                    </li>
                                </ul>

                                <h4 className="font-semibold text-lg mt-6">
                                    3. Data Sharing
                                </h4>
                                <p>
                                    We do not sell your personal information. We
                                    may share limited information with other
                                    users to facilitate exchanges, and with
                                    service providers who assist in platform
                                    operation.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    4. Data Security
                                </h4>
                                <p>
                                    We implement industry-standard security
                                    measures to protect your information.
                                    However, no method of electronic
                                    transmission or storage is 100% secure.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    5. Your Rights
                                </h4>
                                <p>
                                    You may access, correct, or delete your
                                    personal information through your account
                                    settings. You may also contact us directly
                                    for assistance with data-related requests.
                                </p>

                                <h4 className="font-semibold text-lg mt-6">
                                    6. Cookies and Tracking
                                </h4>
                                <p>
                                    We use cookies and similar technologies to
                                    enhance your experience, analyze platform
                                    usage, and deliver personalized content.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Download options */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <button className="flex items-center text-green-600 hover:text-green-700 font-medium">
                        <FaDownload className="mr-2" />
                        Download{" "}
                        {activeTab === "terms"
                            ? "Terms of Service"
                            : "Privacy Policy"}{" "}
                        as PDF
                    </button>
                </div>

                {/* Acceptance section */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-start">
                        <button
                            onClick={() => setAccepted(!accepted)}
                            className="mt-1 mr-3 text-green-600"
                        >
                            {accepted ? (
                                <FaCheckSquare size={20} />
                            ) : (
                                <FaSquare size={20} />
                            )}
                        </button>
                        <label className="text-gray-700">
                            I have read and agree to the{" "}
                            {activeTab === "terms"
                                ? "Terms of Service"
                                : "Privacy Policy"}
                        </label>
                    </div>

                    <div className="flex justify-end space-x-4 mt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={!accepted}
                            className={`px-6 py-2 rounded-md text-white transition-colors ${
                                accepted
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-gray-400 cursor-not-allowed"
                            }`}
                        >
                            Accept & Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
