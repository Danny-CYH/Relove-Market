import { Footer } from "@/Components/Buyer/Footer";
import { Navbar } from "@/Components/Buyer/Navbar";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaEnvelope,
    FaLock,
    FaUser,
    FaArrowLeft,
    FaGoogle,
    FaFacebook,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

export default function Register() {
    const { flash } = usePage().props;
    const [showEmailVerificationModal, setShowEmailVerificationModal] =
        useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(
        !!flash?.successMessage
    );
    const [showErrorToast, setShowErrorToast] = useState(!!flash?.errorMessage);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        data: registerData,
        setData: setRegisterData,
        post: postRegister,
        processing: processingRegister,
        reset,
    } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const {
        data: verifyData,
        setData: setVerifyData,
        post: postResendEmail,
        processing: processingResendEmail,
    } = useForm({
        user_email: "",
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
    }, [flash]);

    const register_submit = (e) => {
        e.preventDefault();

        postRegister(route("register"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setVerifyData("user_email", registerData.email);

                reset("name", "email", "password", "password_confirmation");
                setShowEmailVerificationModal(true);
            },
        });
    };

    const resend_emailVerification = (e) => {
        e.preventDefault();

        postResendEmail(route("custom.verification.send"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setShowEmailVerificationModal(false);
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 5000);
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
                        <span>{flash.errorMessage}</span>
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Left Column - Register Form */}
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
                                Join Relove Market
                            </h2>
                            <p className="text-gray-600">
                                Create your account and start your sustainable
                                shopping journey
                            </p>
                        </div>

                        <form onSubmit={register_submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        autoComplete="off"
                                        value={registerData.name}
                                        onChange={(e) =>
                                            setRegisterData(
                                                "name",
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
                                        value={registerData.email}
                                        onChange={(e) =>
                                            setRegisterData(
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
                                        placeholder="Create a password"
                                        value={registerData.password}
                                        onChange={(e) =>
                                            setRegisterData(
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
                                <p className="text-xs text-gray-500 mt-1">
                                    Use at least 8 characters with a mix of
                                    letters, numbers & symbols
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password_confirmation"
                                        placeholder="Confirm your password"
                                        value={
                                            registerData.password_confirmation
                                        }
                                        onChange={(e) =>
                                            setRegisterData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        className="pl-10 pr-10 w-full"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <FaEyeSlash className="h-5 w-5" />
                                        ) : (
                                            <FaEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    required
                                />
                                <label
                                    htmlFor="terms"
                                    className="ml-2 block text-sm text-gray-600"
                                >
                                    I agree to the{" "}
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="#"
                                        className="text-blue-600 hover:text-blue-500"
                                    >
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={processingRegister}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processingRegister ? (
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
                                        Creating account...
                                    </span>
                                ) : (
                                    "Create Account"
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
                                Already have an account?{" "}
                                <Link
                                    href={route("login")}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Image & Benefits */}
                    <div className="hidden lg:block relative">
                        <img
                            src="../image/register_bg.jpg"
                            alt="Shopping Woman"
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
                        <div className="relative flex flex-col justify-center h-full p-12 text-white">
                            <h3 className="text-3xl font-bold mb-6">
                                Why Join Relove Market?
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Access thousands of unique preloved
                                        items
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Join a community of eco-conscious
                                        shoppers
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Save money while reducing environmental
                                        impact
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Secure transactions and buyer protection
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheckCircle className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Personalized recommendations based on
                                        your preferences
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Email Verification Modal */}
            {showEmailVerificationModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowEmailVerificationModal(false)}
                        ></div>

                        <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={() =>
                                        setShowEmailVerificationModal(false)
                                    }
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
                                        Verify Your Email
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            Thanks for signing up! Before
                                            getting started, could you verify
                                            your email address by clicking on
                                            the link we just emailed to you? If
                                            you didn't receive the email, we
                                            will gladly send you another.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <form
                                onSubmit={resend_emailVerification}
                                method="POST"
                                className="mt-5"
                            >
                                <input
                                    type="hidden"
                                    name="user_email"
                                    value={verifyData.user_email}
                                />
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="submit"
                                        disabled={processingResendEmail}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {processingResendEmail
                                            ? "Sending..."
                                            : "Resend Verification Email"}
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
