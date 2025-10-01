import React, { useState } from "react";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaDownload,
    FaQuestionCircle,
    FaShieldAlt,
    FaFileContract,
} from "react-icons/fa";
import { FiSend } from "react-icons/fi";

import { TermsConditions } from "./TermsConditions";

export function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [isTermsConditionOpen, setIsTermsConditionOpen] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            // Here you would typically send the email to your backend
            console.log("Subscribed with email:", email);
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <footer className="bg-gray-900 text-white">
            {/* Modal for displaying terms and condition */}
            <TermsConditions
                isOpen={isTermsConditionOpen}
                onClose={() => setIsTermsConditionOpen(false)}
                onAccept={() => console.log("Terms accepted")}
            />

            {/* Main Footer Content */}
            <div className="container mx-auto px-8 py-12 md:py-16 md:px-28">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Brand & Description */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                            <span className="text-green-500 mr-2">♻️</span>
                            Relove Market
                        </h2>
                        <p className="text-gray-400 mb-6 max-w-md">
                            A sustainable marketplace where quality preloved
                            items find new homes. Our SaaS platform connects
                            sellers and buyers in an eco-friendly community.
                        </p>

                        {/* Social Media */}
                        <div className="flex space-x-4 mb-6">
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={16} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300"
                                aria-label="Twitter"
                            >
                                <FaTwitter size={16} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={16} />
                            </a>
                            <a
                                href="#"
                                className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn size={16} />
                            </a>
                        </div>

                        {/* App Download Badges */}
                        <div>
                            <p className="font-medium mb-3">Download Our App</p>
                            <div className="flex flex-wrap gap-3">
                                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
                                    <FaDownload className="mr-2" />
                                    <span>App Store</span>
                                </button>
                                <button className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg flex items-center transition-colors">
                                    <FaDownload className="mr-2" />
                                    <span>Google Play</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-gray-700">
                            Marketplace
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Browse Items
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Sell an Item
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Categories
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Featured Sellers
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Seasonal Collections
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-gray-700">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                                >
                                    <FaQuestionCircle className="mr-2" /> Help
                                    Center
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                                >
                                    <FaShieldAlt className="mr-2" /> Safety
                                    Guidelines
                                </a>
                            </li>
                            <li>
                                <button
                                    onClick={() => {
                                        setIsTermsConditionOpen(true);
                                    }}
                                    className="text-gray-400 hover:text-green-400 transition-colors flex items-center"
                                >
                                    <FaFileContract className="mr-2" /> Terms of
                                    Service
                                </button>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Shipping Information
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-gray-400 hover:text-green-400 transition-colors"
                                >
                                    Returns & Refunds
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-5 pb-2 border-b border-gray-700">
                            Stay Updated
                        </h3>

                        {/* Newsletter Subscription */}
                        <div className="mb-6">
                            <p className="text-gray-400 mb-3">
                                Subscribe to our newsletter for updates
                            </p>
                            <form onSubmit={handleSubscribe} className="flex">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 flex-grow"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg transition-colors"
                                >
                                    <FiSend />
                                </button>
                            </form>
                            {subscribed && (
                                <p className="text-green-400 text-sm mt-2">
                                    Thank you for subscribing!
                                </p>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="text-green-500 mr-3" />
                                <span className="text-gray-400">
                                    Jalan Suka Menanti, Alor Setar, Kedah,
                                    Malaysia
                                </span>
                            </div>
                            <div className="flex items-center">
                                <FaEnvelope className="text-green-500 mr-3" />
                                <a
                                    href="mailto:relovemarket006@gmail.com"
                                    className="text-gray-400 hover:text-green-400"
                                >
                                    relovemarket006@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center">
                                <FaPhone className="text-green-500 mr-3" />
                                <a
                                    href="tel:+60126547653"
                                    className="text-gray-400 hover:text-green-400"
                                >
                                    +60 12 654 7653
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-3 md:mb-0">
                            © {new Date().getFullYear()} Relove Market. All
                            rights reserved.
                        </p>
                        <div className="flex space-x-6 text-sm text-gray-500">
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors"
                            >
                                Privacy Policy
                            </a>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors"
                            >
                                Terms of Service
                            </a>
                            <a
                                href="#"
                                className="hover:text-green-400 transition-colors"
                            >
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
