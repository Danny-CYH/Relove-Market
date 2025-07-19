import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePage, Link } from "@inertiajs/react";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { auth } = usePage().props;

    const sidebarVariants = {
        hidden: { x: "-100%" },
        visible: { x: 0 },
        exit: { x: "-100%" },
    };

    const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

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
                        className="text-black hover:text-gray-500 cursor-pointer"
                    >
                        Home
                    </Link>
                    <Link
                        href={route("about-us")}
                        preserveScroll
                        preserveState
                        className="text-black hover:text-gray-500 cursor-pointer"
                    >
                        About
                    </Link>
                    <Link
                        href={route("shopping")}
                        preserveScroll
                        preserveState
                        className="text-black hover:text-gray-500 cursor-pointer"
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
                                <div
                                    className={`w-10 rounded-full cursor-pointer
                    ${
                        showUserMenu
                            ? "ring-primary ring-2 ring-offset-2"
                            : "hover:ring-primary hover:ring-2 hover:ring-offset-2"
                    }`}
                                >
                                    <img
                                        src="../image/shania_yan.png"
                                        onClick={toggleUserMenu}
                                    />
                                </div>
                            </div>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                                    <Link
                                        href={route("profile.edit")}
                                        className="block px-4 py-2 hover:bg-gray-100 text-black"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 text-black"
                                    >
                                        Logout
                                    </Link>
                                </div>
                            )}
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

export default Navbar;
