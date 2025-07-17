import {
    FaHeart,
    FaShoppingCart,
    FaUser,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@inertiajs/react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

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
                        href="/relove-market"
                        preserveScroll
                        preserveState
                        className="text-black hover:text-gray-500 cursor-pointer"
                    >
                        Home
                    </Link>
                    <Link
                        href="/about-us"
                        preserveScroll
                        preserveState
                        className="text-black hover:text-gray-500 cursor-pointer"
                    >
                        About
                    </Link>
                    <Link
                        href="/shopping"
                        preserveScroll
                        preserveState
                        className="text-black hover:text-gray-500 cursor-pointer"
                    >
                        Shop
                    </Link>

                    <Link className="text-black hover:text-gray-500 cursor-pointer">
                        Sign Up
                    </Link>
                </div>

                <div className="hidden md:flex flex-none items-center space-x-4">
                    <div className="relative">
                        <FaHeart className="text-xl text-red-500" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                            4
                        </span>
                    </div>
                    <div className="relative">
                        <FaShoppingCart className="text-xl text-gray-800" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5">
                            2
                        </span>
                    </div>
                    <FaUser className="text-xl text-gray-500" />
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
                                    href="/relove-market"
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    🏠 Home
                                </Link>
                                <Link
                                    href="/about-us"
                                    onClick={() => setIsOpen(false)}
                                    className="hover:text-blue-500 transition duration-200"
                                >
                                    📄 About
                                </Link>
                                <Link
                                    href="/shopping"
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

export default Navbar;
