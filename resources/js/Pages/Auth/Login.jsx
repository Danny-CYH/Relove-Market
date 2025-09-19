import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaGoogle,
    FaFacebook,
    FaEnvelope,
    FaLock,
    FaArrowLeft,
    FaCheckCircle,
    FaExclamationTriangle,
} from "react-icons/fa";

export default function Login() {
    const { flash, token, email } = usePage().props;

    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);
    const [showResetModal, setShowResetModal] = useState(false);
    const [showForgetModal, setShowForgetModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // login account
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

    // forget password
    const {
        data: forgetData,
        setData: setForgetData,
        post: postForget,
        processing: processingForget,
    } = useForm({
        email: "",
    });

    // reset password
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
            setShowSuccessToast(true);
            const timer = setTimeout(() => setShowSuccessToast(false), 5000);
            return () => clearTimeout(timer);
        }

        if (flash?.errorMessage) {
            setShowErrorToast(true);
            const timer = setTimeout(() => setShowErrorToast(false), 5000);
            return () => clearTimeout(timer);
        }

        if (resetData.token && resetData.email) {
            setShowResetModal(true);
        }

        if (window.location.pathname.includes("/reset-password/")) {
            const pathSegments = window.location.pathname.split("/");
            const tokenFromPath = pathSegments[pathSegments.length - 1];
            const emailFromURL = new URL(window.location.href).searchParams.get(
                "email"
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
            setErrorMessage("Please fill in all fields");
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 5000);
        } else {
            postLogin(route("login"), {
                onSuccess: () => {
                    console.log("✅ Login successful");
                },
                onError: (errors) => {
                    console.log(errors);
                    reset("email", "password");
                    setErrorMessage(
                        "Invalid email or password. Please try again."
                    );
                    setShowErrorToast(true);
                    setTimeout(() => setShowErrorToast(false), 5000);
                },
            });
        }
    };

    const resetLink_submit = (e) => {
        e.preventDefault();

        postForget(route("password.email"), {
            email: forgetData.email,
            onSuccess: () => {
                setShowForgetModal(false);
            },
            onError: (errors) => {
                setErrorMessage(errors.email || "Error sending reset link");
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            },
        });
    };

    const updatePassword_submit = (e) => {
        e.preventDefault();

        postReset(route("password.store"), {
            onSuccess: () => {
                setShowResetModal(false);
            },
            onError: (errors) => {
                setErrorMessage(errors.password || "Error resetting password");
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            },
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-3">
                {showSuccessToast && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                        <FaCheckCircle className="mr-2 text-green-600" />
                        <span>{flash.successMessage}</span>
                    </div>
                )}

                {showErrorToast && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-fade-in">
                        <FaExclamationTriangle className="mr-2 text-red-600" />
                        <span>{flash.errorMessage || errorMessage}</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Left Column - Login Form */}
                    <div className="py-10 px-8 sm:px-10">
                        <div className="mb-8">
                            <Link
                                href={route("homepage")}
                                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Home
                            </Link>
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600">
                                Sign in to your Relove Market account
                            </p>
                        </div>

                        <form
                            onSubmit={loginAccount_submit}
                            className="space-y-6"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        autoComplete="off"
                                        value={loginData.email}
                                        onChange={(e) =>
                                            setLoginData(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 w-full"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={(e) =>
                                            setLoginData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 pr-10 w-full"
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
                                            <FaEyeSlash className="h-5 w-5" />
                                        ) : (
                                            <FaEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={loginData.remember}
                                        onChange={(e) =>
                                            setLoginData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => setShowForgetModal(true)}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processingLogin}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processingLogin ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    </span>
                                ) : (
                                    "Sign in"
                                )}
                            </button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <FaGoogle className="text-red-500 h-5 w-5" />
                                    <span className="ml-2">Google</span>
                                </button>

                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                                >
                                    <FaFacebook className="text-blue-600 h-5 w-5" />
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Image & Features */}
                    <div className="hidden lg:block relative">
                        <img
                            src="../image/login_bg.jpg"
                            alt="Shopping Woman"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
                        <div className="relative flex flex-col justify-center h-full p-12 text-white">
                            <h3 className="text-3xl font-bold mb-6">
                                Join Our Sustainable Community
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Access thousands of eco-conscious buyers
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>Sell your preloved items easily</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>Track your environmental impact</span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Secure transactions and fast payouts
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Forgot Password Modal */}
            {showForgetModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowForgetModal(false)}
                        ></div>

                        <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={() => setShowForgetModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaEnvelope className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Reset your password
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Enter your email address and we'll
                                            send you a link to reset your
                                            password.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={resetLink_submit} className="mt-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <div className="mt-1">
                                        <TextInput
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email"
                                            value={forgetData.email}
                                            onChange={(e) =>
                                                setForgetData(
                                                    "email",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="submit"
                                        disabled={processingForget}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processingForget
                                            ? "Sending..."
                                            : "Send reset link"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowResetModal(false)}
                        ></div>

                        <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={() => setShowResetModal(false)}
                                >
                                    <span className="sr-only">Close</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <FaLock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Set new password
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Enter your new password below.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={updatePassword_submit}
                                className="mt-5 space-y-4"
                            >
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <TextInput
                                        type="email"
                                        value={resetData.email}
                                        readOnly
                                        className="w-full bg-gray-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        name="password"
                                        placeholder="Enter new password"
                                        value={resetData.password}
                                        onChange={(e) =>
                                            setResetData(
                                                "password",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <TextInput
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Confirm new password"
                                        value={resetData.password_confirmation}
                                        onChange={(e) =>
                                            setResetData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="w-full"
                                        required
                                    />
                                </div>

                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="submit"
                                        disabled={processingReset}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processingReset
                                            ? "Updating..."
                                            : "Update password"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
