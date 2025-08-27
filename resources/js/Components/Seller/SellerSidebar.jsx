import React, { useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faCartShopping,
    faCircleInfo,
    faGaugeHigh,
    faSackDollar,
    faCreditCard,
    faUserCircle,
    faChevronDown,
    faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "@inertiajs/react";

export function SellerSidebar({ shopName }) {
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <motion.aside
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 bg-white border-r border-gray-100 shadow-sm hidden md:flex md:flex-col"
        >
            {/* Shop Info */}
            <div className="p-6 border-b border-gray-100">
                <div className="text-lg font-bold text-gray-800">
                    {shopName}
                </div>
                <div className="text-xs text-gray-500">Seller Center</div>
            </div>

            {/* Navigation */}
            <nav className="p-3 flex-1 space-y-1">
                <Link
                    href={route("seller-dashboard")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-dashboard")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faGaugeHigh} className="w-4" />
                    <span className="text-sm">Dashboard</span>
                </Link>

                <Link
                    href={route("seller-manage-product")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-manage-product")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faBoxOpen} className="w-4" />
                    <span className="text-sm">Products</span>
                </Link>

                <Link
                    href={route("seller-manage-order")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-manage-order")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faCartShopping} className="w-4" />
                    <span className="text-sm">Orders</span>
                </Link>

                <Link
                    href={route("seller-manage-earning")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-manage-earning")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faSackDollar} className="w-4" />
                    <span className="text-sm">Earnings</span>
                </Link>

                <Link
                    href={route("seller-manage-promotion")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-manage-promotion")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faBoxOpen} className="w-4" />
                    <span className="text-sm">Promotions</span>
                </Link>

                <Link
                    href={route("seller-manage-subscription")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-manage-subscription")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faCreditCard} className="w-4" />
                    <span className="text-sm">Subscription</span>
                </Link>

                <Link
                    href={route("seller-help-support")}
                    className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        route().current("seller-help-support")
                            ? "text-indigo-600 font-bold bg-indigo-50"
                            : "text-black hover:text-blue-600"
                    }`}
                >
                    <FontAwesomeIcon icon={faCircleInfo} className="w-4" />
                    <span className="text-sm">Help & Support</span>
                </Link>
            </nav>

            {/* User Profile */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition"
                >
                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">My Account</span>
                    </div>
                    <FontAwesomeIcon
                        icon={profileOpen ? faChevronUp : faChevronDown}
                        className="w-3 h-3"
                    />
                </button>
                {profileOpen && (
                    <ul className="mt-2 space-y-1">
                        <Link
                            href="#"
                            className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                                route().current("seller-help-support")
                                    ? "text-indigo-600 font-bold bg-indigo-50"
                                    : "text-black hover:text-blue-600"
                            }`}
                        >
                            <span className="text-sm">Profile</span>
                        </Link>
                        <Link
                            href="#"
                            className={`cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                                route().current("seller-help-support")
                                    ? "text-indigo-600 font-bold bg-indigo-50"
                                    : "text-black hover:text-blue-600"
                            }`}
                        >
                            <span className="text-sm">Settings</span>
                        </Link>
                        <Link
                            href={route("homepage")}
                            className="cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg transition"
                        >
                            <span className="text-red-500 text-sm font-bold hover:text-red-600">
                                Logout
                            </span>
                        </Link>
                    </ul>
                )}
            </div>
        </motion.aside>
    );
}
