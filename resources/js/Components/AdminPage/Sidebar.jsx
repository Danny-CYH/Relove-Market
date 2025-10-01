import { useState, useEffect } from "react";
import { usePage, Link } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaBars,
    FaTimes,
    FaHome,
    FaFileInvoiceDollar,
    FaUserCheck,
    FaCreditCard,
    FaUsers,
    FaSignOutAlt,
    FaBell,
} from "react-icons/fa";

export function Sidebar({ pendingCount }) {
    const { url } = usePage();
    const { auth } = usePage().props;
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Check screen size on mount and resize
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile && sidebarOpen) {
            setSidebarOpen(false);
        }
    }, [url]);

    // Check if current route matches
    const isActive = (routeName) => {
        return url.startsWith(route(routeName, {}, false));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const sidebarVariants = {
        hidden: { x: "-100%", opacity: 0 },
        visible: { x: 0, opacity: 1 },
        exit: { x: "-100%", opacity: 0 },
    };

    const sidebarContent = (
        <>
            <div className="p-5 border-b border-indigo-700 flex items-center justify-between">
                {/* Left side: title + description */}
                <div>
                    <h1 className="text-xl font-bold">Admin Panel</h1>
                    <p className="text-indigo-300 text-sm mt-1">
                        Administrator Dashboard
                    </p>
                </div>

                {/* Right side: close button */}
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-white hover:bg-indigo-700 rounded-lg"
                >
                    <FaTimes className="text-xl md:hidden" />
                </button>
            </div>

            <nav className="p-4">
                <ul className="space-y-1">
                    <li>
                        <Link
                            href={route("admin-dashboard")}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                                isActive("admin-dashboard")
                                    ? "bg-white text-indigo-800 shadow-md"
                                    : "text-indigo-100 hover:bg-indigo-700"
                            }`}
                        >
                            <FaHome className="w-5 h-5 mr-3" />
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("list-transaction")}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                                isActive("list-transaction")
                                    ? "bg-white text-indigo-800 shadow-md"
                                    : "text-indigo-100 hover:bg-indigo-700"
                            }`}
                        >
                            <FaFileInvoiceDollar className="w-5 h-5 mr-3" />
                            Transactions
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("pending-seller-list")}
                            className={`flex items-center p-3 rounded-lg transition-all relative ${
                                isActive("pending-seller-list")
                                    ? "bg-white text-indigo-800 shadow-md"
                                    : "text-indigo-100 hover:bg-indigo-700"
                            }`}
                        >
                            <FaUserCheck className="w-5 h-5 mr-3" />
                            Seller Registrations
                            {pendingCount > 0 && (
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {pendingCount > 99 ? "99+" : pendingCount}
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("subscription-management")}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                                isActive("subscription-management")
                                    ? "bg-white text-indigo-800 shadow-md"
                                    : "text-indigo-100 hover:bg-indigo-700"
                            }`}
                        >
                            <FaCreditCard className="w-5 h-5 mr-3" />
                            Manage Subscriptions
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route("user-management")}
                            className={`flex items-center p-3 rounded-lg transition-all ${
                                isActive("user-management")
                                    ? "bg-white text-indigo-800 shadow-md"
                                    : "text-indigo-100 hover:bg-indigo-700"
                            }`}
                        >
                            <FaUsers className="w-5 h-5 mr-3" />
                            User Management
                        </Link>
                    </li>
                </ul>

                {/* Notification summary */}
                {pendingCount > 0 &&
                    !url.startsWith(route("pending-seller-list")) && (
                        <Link href={route("pending-seller-list")}>
                            <div className="mt-6 p-3 bg-indigo-700 rounded-lg border border-indigo-600">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <span className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {pendingCount > 99
                                                ? "99+"
                                                : pendingCount}
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-white">
                                            Pending approvals
                                        </p>
                                        <p className="text-xs text-indigo-200">
                                            {pendingCount} seller registration
                                            {pendingCount !== 1 ? "s" : ""}{" "}
                                            awaiting review
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
            </nav>

            {/* User section and Logout */}
            <div className="p-4 border-t border-indigo-700 mt-auto max-h-full">
                {auth?.user && (
                    <div className="mb-4 flex items-center space-x-3">
                        <img
                            src="../image/shania_yan.png"
                            alt={auth.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-200"
                        />
                        <div>
                            <p className="text-sm font-medium text-white">
                                {auth.user.name}
                            </p>
                            <p className="text-xs text-indigo-300">
                                Administrator
                            </p>
                        </div>
                    </div>
                )}

                <div className="p-4 border-t border-indigo-700 md:mt-auto mt-5">
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center text-indigo-200 hover:text-white"
                    >
                        <FaSignOutAlt className="w-5 h-5 mr-2" />
                        Logout
                    </Link>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Navigation Bar */}
            {isMobile && (
                <nav className="fixed top-0 left-0 right-0 bg-indigo-800 shadow-md z-60 flex items-center justify-between p-3 md:hidden">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg text-white hover:bg-indigo-700"
                    >
                        {sidebarOpen ? (
                            <FaTimes className="text-xl" />
                        ) : (
                            <FaBars className="text-xl" />
                        )}
                    </button>

                    <div className="flex items-center">
                        <h1 className="text-lg font-bold text-white">
                            Admin Panel
                        </h1>
                    </div>

                    {/* Notification indicator on mobile navbar */}
                    {pendingCount > 0 && (
                        <Link
                            href={route("pending-seller-list")}
                            className="p-2 rounded-lg text-white hover:bg-indigo-700 relative"
                        >
                            <FaBell className="text-xl" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {pendingCount > 9 ? "9+" : pendingCount}
                            </span>
                        </Link>
                    )}
                </nav>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <div className="h-full bg-gradient-to-b from-indigo-800 to-indigo-900 text-white hidden md:flex md:flex-col">
                    {sidebarContent}
                </div>
            )}

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobile && sidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-70 md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            variants={sidebarVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white z-70 md:hidden overflow-y-auto flex flex-col"
                        >
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add padding for mobile navbar */}
            {isMobile && <div className="h-14 md:hidden"></div>}
        </>
    );
}
