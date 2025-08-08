import {
    FaBars,
    FaTimes,
    FaHeartbeat,
    FaUserCircle,
    FaDoorOpen,
} from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage, Link } from "@inertiajs/react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const { auth } = usePage().props;
    const { url } = usePage(); // Gets the current URL path

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0 },
        exit: { x: "-100%" },
    };

    return (
        <>
            {/* Navbar */}
            <div className="navbar bg-white shadow-sm justify-between px-6 flex items-center md:h-16">
                <div className="flex-none">
                    <a className="text-xl text-black font-bold">
                        Relove Market
                    </a>
                </div>

                <div className="hidden md:flex flex-1 justify-center space-x-8">
                    <Link
                        href={route("homepage")}
                        preserveScroll
                        preserveState
                        className={`cursor-pointer ${
                            url === "/relove-market"
                                ? "text-blue-600 font-bold"
                                : "text-black hover:text-blue-600"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href={route("about-us")}
                        preserveScroll
                        preserveState
                        className={`cursor-pointer ${
                            url.startsWith("/about-us")
                                ? "text-blue-600 font-bold"
                                : "text-black hover:text-blue-600"
                        }`}
                    >
                        About
                    </Link>
                    <Link
                        href={route("shopping")}
                        preserveScroll
                        preserveState
                        className={`cursor-pointer ${
                            url.startsWith("/shopping")
                                ? "text-blue-600 font-bold"
                                : "text-black hover:text-blue-600"
                        }`}
                    >
                        Shop
                    </Link>
                </div>

                <div className="hidden md:flex flex-none items-center space-x-4">
                    {/* Auth Section */}
                    {!auth?.user ? (
                        <Link
                            href={route("register")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                            Get Started
                        </Link>
                    ) : (
                        <div className="relative">
                            <div className="avatar avatar-online">
                                {/* Avatar Button */}
                                <div
                                    onClick={() =>
                                        setShowUserMenu(!showUserMenu)
                                    }
                                    className={`w-10 rounded-full cursor-pointer transition duration-150 ease-in-out
      ${
          showUserMenu
              ? "ring-2 ring-primary ring-offset-2"
              : "hover:ring-2 hover:ring-primary hover:ring-offset-2"
      }
    `}
                                >
                                    <picture>
                                        <img
                                            src="../image/shania_yan.png"
                                            alt="User Avatar"
                                            className="w-full h-full rounded-full"
                                        />
                                    </picture>
                                </div>

                                {/* Dropdown Menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 z-20 mt-12 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-700">
                                        <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                            <div className="font-medium">
                                                {auth.user.name}
                                            </div>
                                            <div className="truncate text-sm text-gray-500 dark:text-gray-300">
                                                {auth.user.email}
                                            </div>
                                        </div>
                                        <div className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                            <Link
                                                href={route("profile.edit")}
                                                className="block px-4 py-2 hover:text-blue-300 text-white"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <FaUserCircle className="text-lg" />
                                                    <span>Profile</span>
                                                </div>
                                            </Link>
                                            <Link
                                                href={route("wishlist")}
                                                className="block px-4 py-2 hover:text-blue-300 text-white"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <FaHeartbeat className="text-lg" />
                                                    <span>Favourite</span>
                                                </div>
                                            </Link>
                                        </div>
                                        <div className="py-1 border-t border-gray-200 dark:border-gray-600">
                                            <Link
                                                href={route("logout")}
                                                method="POST"
                                                className="block px-4 py-2 text-sm text-red-200 hover:bg-red-10 hover:font-bold hover:text-red-400"
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <FaDoorOpen className="text-lg" />
                                                    <span>Sign out</span>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Hamburger Icon */}
                {!isOpen && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden text-xl text-gray-800 z-50"
                    >
                        <FaBars />
                    </button>
                )}
            </div>

            {/* Sidebar and Overlay with AnimatePresence */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="fixed top-0 left-0 w-64 min-h-full bg-white z-50 shadow-lg flex flex-col"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={sidebarVariants}
                            transition={{ type: "tween", duration: 0.3 }}
                        >
                            <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-lg font-bold p-4">
                                Relove Market
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white text-xl"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <nav className="flex flex-col p-6 space-y-4 text-gray-700 font-medium">
                                <Link
                                    href={route("homepage")}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    🏠 Home
                                </Link>
                                <Link
                                    href={route("about-us")}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    📄 About
                                </Link>
                                <Link
                                    href={route("shopping")}
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    🛒 Shop
                                </Link>
                                <Link
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    ✍️ Sign Up
                                </Link>
                            </nav>

                            <div className="mt-auto p-4 text-sm text-gray-400">
                                © 2025 Relove Market
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
