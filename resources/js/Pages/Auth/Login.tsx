import { Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
    FaLeaf,
    FaArrowRight,
    FaGoogle,
    FaFacebook,
    FaHeart,
    FaStar,
    FaShieldAlt,
    FaRecycle,
    FaTree,
    FaUsers,
    FaShoppingBag,
    FaGlobe,
} from "react-icons/fa";
import { motion } from "framer-motion";

import Swal from "sweetalert2";

import { ForgetPasswordModal } from "@/Components/Auth/Login/ForgetPasswordModal";
import { ResetPasswordModal } from "@/Components/Auth/Login/ResetPasswordModal";
import Footer from "@/Components/Ui/Footer";
import Navbar from "@/Components/Ui/Navbar";
import TextInput from "@/Components/TextInput";

// SweetAlert configuration
const showAlert = (icon, title, text, confirmButtonText = "OK") => {
    return Swal.fire({
        icon,
        title,
        text,
        confirmButtonText,
        confirmButtonColor: "#059669",
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};

const showLoadingAlert = (title, text = "") => {
    return Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

export default function Login() {
    const { flash, token, email } = usePage().props;

    const [showResetModal, setShowResetModal] = useState(false);
    const [showForgetModal, setShowForgetModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        data: loginData,
        setData: setLoginData,
        post: postLogin,
        processing: processingLogin,
        reset,
    } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const {
        data: forgetData,
        setData: setForgetData,
        post: postForget,
        processing: processingForget,
    } = useForm({
        email: "",
    });

    const {
        data: resetData,
        setData: setResetData,
        post: postReset,
        processing: processingReset,
    } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (flash?.successMessage) {
            showAlert("success", "Success!", flash.successMessage);
        }

        if (flash?.errorMessage) {
            showAlert("error", "Error!", flash.errorMessage);
        }

        if (resetData.token && resetData.email) {
            setShowResetModal(true);
        }

        if (window.location.pathname.includes("/reset-password/")) {
            const pathSegments = window.location.pathname.split("/");
            const tokenFromPath = pathSegments[pathSegments.length - 1];
            const emailFromURL = new URL(window.location.href).searchParams.get(
                "email",
            );

            if (tokenFromPath && emailFromURL) {
                setResetData("token", tokenFromPath);
                setResetData("email", emailFromURL);
            }
        }

        if (flash.cleanUrl) {
            window.history.replaceState({}, "", "/reset-password");
        }
    }, [flash, resetData.token, resetData.email, flash?.cleanUrl]);

    const loginAccount_submit = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            showAlert(
                "warning",
                "Missing Information",
                "Please fill in all fields",
            );
            return;
        }

        const loadingAlert = showLoadingAlert(
            "Signing In",
            "Please wait while we sign you in...",
        );

        try {
            const response = await fetch(route("login"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    ).content,
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Inertia": "true",
                },
                credentials: "include",
                body: JSON.stringify(loginData),
            });

            const data = await response.json();
            loadingAlert.close();

            if (response.ok && data.success) {
                if (data.csrf_token) {
                    const metaTag = document.querySelector(
                        'meta[name="csrf-token"]',
                    );
                    if (metaTag) {
                        metaTag.content = data.csrf_token;
                    }
                    window.__csrfToken = data.csrf_token;
                    if (window.axios) {
                        window.axios.defaults.headers.common["X-CSRF-TOKEN"] =
                            data.csrf_token;
                    }
                }

                showAlert("success", "Login Successful!", "Redirecting...");

                setTimeout(() => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    } else {
                        window.location.href = "/";
                    }
                }, 1000);
            } else {
                throw new Error(data.message || "Login failed");
            }
        } catch (error) {
            loadingAlert.close();
            console.error("Login error:", error);

            let errorMessage =
                error.message || "Invalid email or password. Please try again.";

            if (error.errors) {
                if (error.errors.email) {
                    errorMessage = error.errors.email[0];
                } else if (error.errors.password) {
                    errorMessage = error.errors.password[0];
                }
            }

            showAlert("error", "Login Failed", errorMessage);
            reset("password");
        }
    };

    const resetLink_submit = async (e) => {
        e.preventDefault();

        if (!forgetData.email) {
            showAlert(
                "warning",
                "Email Required",
                "Please enter your email address",
            );
            return;
        }

        const loadingAlert = showLoadingAlert(
            "Sending Reset Link",
            "Please wait...",
        );

        postForget(route("password.email"), {
            email: forgetData.email,
            onSuccess: () => {
                loadingAlert.close();
                setShowForgetModal(false);
                setForgetData("email", "");
                showAlert(
                    "success",
                    "Reset Link Sent!",
                    "If your email exists in our system, you will receive a password reset link shortly.",
                );
            },
            onError: (errors) => {
                loadingAlert.close();
                let errorMessage =
                    errors.email ||
                    "Error sending reset link. Please try again.";
                showAlert("error", "Failed to Send", errorMessage);
            },
        });
    };

    const updatePassword_submit = async (e) => {
        e.preventDefault();

        if (!resetData.password || !resetData.password_confirmation) {
            showAlert(
                "warning",
                "Missing Information",
                "Please fill in all password fields",
            );
            return;
        }

        if (resetData.password !== resetData.password_confirmation) {
            showAlert(
                "error",
                "Password Mismatch",
                "Passwords do not match. Please try again.",
            );
            return;
        }

        const loadingAlert = showLoadingAlert(
            "Updating Password",
            "Please wait...",
        );

        postReset(route("password.store"), {
            onSuccess: () => {
                loadingAlert.close();
                setShowResetModal(false);
                setResetData({
                    token: "",
                    email: "",
                    password: "",
                    password_confirmation: "",
                });
                showAlert(
                    "success",
                    "Password Updated!",
                    "Your password has been updated successfully. You can now login with your new password.",
                ).then(() => {
                    window.location.href = "/login";
                });
            },
            onError: (errors) => {
                loadingAlert.close();
                let errorMessage =
                    "Error resetting password. Please try again.";

                if (errors.password) {
                    errorMessage = errors.password[0];
                } else if (errors.email) {
                    errorMessage = errors.email;
                } else if (errors.token) {
                    errorMessage =
                        "Invalid or expired reset token. Please request a new reset link.";
                }

                showAlert("error", "Reset Failed", errorMessage);
            },
        });
    };

    const handleForgetPasswordClick = () => {
        setShowForgetModal(true);
    };

    const handleCloseForgetModal = () => {
        setShowForgetModal(false);
        setForgetData("email", "");
    };

    const handleSocialLogin = (provider) => {
        showAlert(
            "info",
            `${provider} Login`,
            `${provider} login coming soon!`,
        );
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* ✅ Left Side - Reimagined Layout */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        {/* Logo */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3 mb-6"
                        >
                            <div className="p-2.5 bg-emerald-100 rounded-2xl">
                                <FaLeaf className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">
                                    Relove Market
                                </h1>
                                <p className="text-xs text-gray-500">
                                    Sustainable Preloved Marketplace
                                </p>
                            </div>
                        </motion.div>

                        {/* Main headline */}
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-3">
                            Shop{" "}
                            <span className="text-emerald-600">
                                Sustainably
                            </span>{" "}
                            Today
                        </h2>

                        <p className="text-gray-500 text-base mb-6 max-w-sm">
                            Join thousands of conscious shoppers embracing
                            circular preloved item.
                        </p>

                        {/* ✅ Stats - 4 columns instead of 3 */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                {
                                    number: "15K+",
                                    label: "Members",
                                    icon: FaUsers,
                                },
                                {
                                    number: "98%",
                                    label: "Satisfied",
                                    icon: FaStar,
                                },
                                {
                                    number: "5K+",
                                    label: "Items Sold",
                                    icon: FaShoppingBag,
                                },
                                {
                                    number: "50K+",
                                    label: "Trees Saved",
                                    icon: FaTree,
                                },
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -2 }}
                                    className="text-center bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                                >
                                    <stat.icon className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-gray-900">
                                        {stat.number}
                                    </p>
                                    <p className="text-[10px] text-gray-500">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {/* ✅ Two-column feature grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {[
                                {
                                    icon: FaHeart,
                                    text: "Pre-loved fashion",
                                    color: "text-rose-400",
                                },
                                {
                                    icon: FaShieldAlt,
                                    text: "Secure shopping",
                                    color: "text-emerald-400",
                                },
                                {
                                    icon: FaRecycle,
                                    text: "Zero waste",
                                    color: "text-teal-400",
                                },
                                {
                                    icon: FaGlobe,
                                    text: "Global community",
                                    color: "text-blue-400",
                                },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-2 text-gray-700 bg-white/50 rounded-xl px-3 py-2 border border-gray-100"
                                >
                                    <item.icon
                                        className={`w-4 h-4 ${item.color}`}
                                    />
                                    <span className="text-xs">{item.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* ✅ Trust badges - simplified */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">♻️</span>
                                <span className="text-xs text-gray-500">
                                    Eco-friendly
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">💚</span>
                                <span className="text-xs text-gray-500">
                                    Carbon offset
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">🌱</span>
                                <span className="text-xs text-gray-500">
                                    Sustainable
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ✅ Right - Login Card (unchanged) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center"
                    >
                        <div className="w-full bg-white rounded-3xl shadow-xl shadow-emerald-100/30 p-8 sm:p-10">
                            <div className="text-center mb-7">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Welcome back
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Sign in to your account
                                </p>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <button
                                    onClick={() => handleSocialLogin("Google")}
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                >
                                    <FaGoogle className="w-4 h-4 text-red-500" />
                                    Google
                                </button>
                                <button
                                    onClick={() =>
                                        handleSocialLogin("Facebook")
                                    }
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                >
                                    <FaFacebook className="w-4 h-4 text-blue-600" />
                                    Facebook
                                </button>
                            </div>

                            <div className="relative mb-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs">
                                    <span className="px-3 bg-white text-gray-400 uppercase tracking-wider">
                                        or continue with email
                                    </span>
                                </div>
                            </div>

                            {/* Login Form */}
                            <form
                                onSubmit={loginAccount_submit}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            type="email"
                                            placeholder="you@example.com"
                                            value={loginData.email}
                                            onChange={(e) =>
                                                setLoginData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            className="pl-9 w-full border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter password"
                                            value={loginData.password}
                                            onChange={(e) =>
                                                setLoginData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            className="pl-9 pr-9 w-full border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={loginData.remember}
                                            onChange={(e) =>
                                                setLoginData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handleForgetPasswordClick}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processingLogin}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {processingLogin ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v8H4z"
                                                ></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign in
                                            <FaArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Create one free
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
            {showForgetModal && (
                <ForgetPasswordModal
                    forgetData={forgetData}
                    handleCloseForgetModal={handleCloseForgetModal}
                    processingForget={processingForget}
                    resetLink_submit={resetLink_submit}
                    setForgetData={setForgetData}
                />
            )}

            {showResetModal && (
                <ResetPasswordModal
                    handleCloseResetModal={handleCloseForgetModal}
                    processingReset={processingReset}
                    resetData={resetData}
                    setResetData={setResetData}
                    updatePassword_submit={updatePassword_submit}
                />
            )}

            <Footer />
        </div>
    );
}
