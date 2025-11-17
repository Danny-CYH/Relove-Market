import { Footer } from "@/Components/BuyerPage/Footer";
import { Navbar } from "@/Components/BuyerPage/Navbar";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaArrowLeft,
    FaGoogle,
    FaFacebook,
    FaEye,
    FaEyeSlash,
    FaCheck,
    FaTimes,
    FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

// SweetAlert configuration
const showAlert = (icon, title, text, confirmButtonText = "OK") => {
    return Swal.fire({
        icon,
        title,
        text,
        confirmButtonText,
        confirmButtonColor: "#3085d6",
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

const showConfirmationAlert = (
    title,
    text,
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel"
) => {
    return Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText,
        cancelButtonText,
        customClass: {
            popup: "rounded-2xl",
            confirmButton: "px-4 py-2 rounded-lg font-medium",
            cancelButton: "px-4 py-2 rounded-lg font-medium",
        },
    });
};

// Password validation functions
const validatePassword = (password) => {
    const validations = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const isValid = Object.values(validations).every(Boolean);
    const strength = Object.values(validations).filter(Boolean).length;

    return { isValid, validations, strength };
};

const getPasswordStrengthText = (strength) => {
    if (strength === 0) return { text: "Very Weak", color: "text-red-600" };
    if (strength <= 2) return { text: "Weak", color: "text-red-500" };
    if (strength <= 3) return { text: "Fair", color: "text-yellow-500" };
    if (strength <= 4) return { text: "Good", color: "text-blue-500" };
    return { text: "Strong", color: "text-green-600" };
};

// Terms and Privacy Modal Component
const TermsPrivacyModal = ({ isOpen, onClose, modalType }) => {
    if (!isOpen) return null;

    const modalContent = {
        terms: {
            title: "Terms of Service",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Welcome to Relove Market. By accessing or using our
                        platform, you agree to be bound by these Terms of
                        Service.
                    </p>
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                            User Responsibilities
                        </h4>
                        <p className="text-gray-600">
                            You are responsible for maintaining the
                            confidentiality of your account and password and for
                            restricting access to your computer.
                        </p>
                        <h4 className="font-medium text-gray-900">
                            Service Modifications
                        </h4>
                        <p className="text-gray-600">
                            We reserve the right to modify or discontinue,
                            temporarily or permanently, the service with or
                            without notice.
                        </p>
                        <h4 className="font-medium text-gray-900">
                            User Conduct
                        </h4>
                        <p className="text-gray-600">
                            You agree not to use the service for any illegal
                            purpose or in any way that violates these terms.
                        </p>
                    </div>
                </div>
            ),
        },
        privacy: {
            title: "Privacy Policy",
            content: (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Your privacy is important to us. This Privacy Policy
                        explains how we collect, use, and protect your personal
                        information.
                    </p>
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">
                            Information We Collect
                        </h4>
                        <p className="text-gray-600">
                            We collect information you provide directly to us,
                            such as when you create an account, use our
                            services, or contact us for support.
                        </p>
                        <h4 className="font-medium text-gray-900">
                            How We Use Information
                        </h4>
                        <p className="text-gray-600">
                            We use the information we collect to provide,
                            maintain, and improve our services, and to develop
                            new ones.
                        </p>
                        <h4 className="font-medium text-gray-900">
                            Data Security
                        </h4>
                        <p className="text-gray-600">
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information against unauthorized access.
                        </p>
                    </div>
                </div>
            ),
        },
    };

    const currentModal = modalContent[modalType];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {currentModal.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {currentModal.content}

                    {/* Contact Information */}
                    <section className="bg-gray-50 p-4 rounded-lg mt-6">
                        <h4 className="font-medium text-gray-900 mb-2">
                            Questions?
                        </h4>
                        <p className="text-gray-600 text-sm">
                            If you have any questions about our{" "}
                            {modalType === "terms"
                                ? "Terms of Service"
                                : "Privacy Policy"}
                            , please contact us at{" "}
                            <a
                                href="mailto:support@relovemarket.com"
                                className="text-blue-600 hover:text-blue-500"
                            >
                                support@relovemarket.com
                            </a>
                        </p>
                    </section>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Register() {
    const { flash } = usePage().props;
    const [showEmailVerificationModal, setShowEmailVerificationModal] =
        useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] =
        useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [passwordValidation, setPasswordValidation] = useState({
        isValid: false,
        validations: {
            length: false,
            uppercase: false,
            lowercase: false,
            number: false,
            special: false,
        },
        strength: 0,
    });

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
            showAlert("success", "Success!", flash.successMessage);
        }

        if (flash?.errorMessage) {
            showAlert("error", "Error!", flash.errorMessage);
        }

        if (flash?.showVerificationModal) {
            setVerifyData("user_email", registerData.email);
            reset("name", "email", "password", "password_confirmation");
            setShowEmailVerificationModal(true);
        }
    }, [flash]);

    // Validate password on change
    useEffect(() => {
        if (registerData.password) {
            const validation = validatePassword(registerData.password);
            setPasswordValidation(validation);
        } else {
            setPasswordValidation({
                isValid: false,
                validations: {
                    length: false,
                    uppercase: false,
                    lowercase: false,
                    number: false,
                    special: false,
                },
                strength: 0,
            });
        }
    }, [registerData.password]);

    // Modal functions
    const openTermsModal = () => {
        setShowTermsModal(true);
    };

    const openPrivacyModal = () => {
        setShowPrivacyModal(true);
    };

    const closeTermsModal = () => {
        setShowTermsModal(false);
    };

    const closePrivacyModal = () => {
        setShowPrivacyModal(false);
    };

    const register_submit = async (e) => {
        e.preventDefault();

        // Validate form
        if (
            !registerData.name ||
            !registerData.email ||
            !registerData.password ||
            !registerData.password_confirmation
        ) {
            showAlert(
                "warning",
                "Missing Information",
                "Please fill in all required fields"
            );
            return;
        }

        // Validate password strength
        if (!passwordValidation.isValid) {
            showAlert(
                "warning",
                "Weak Password",
                "Please create a stronger password that meets all requirements."
            );
            return;
        }

        // Validate password confirmation
        if (registerData.password !== registerData.password_confirmation) {
            showAlert(
                "error",
                "Password Mismatch",
                "Passwords do not match. Please make sure both passwords are identical."
            );
            return;
        }

        const loadingAlert = showLoadingAlert(
            "Creating Account",
            "Please wait while we create your account..."
        );

        postRegister(route("register"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                loadingAlert.close();

                // Check if the server sent showVerificationModal in the response
                if (page.props.showVerificationModal) {
                    setVerifyData("user_email", registerData.email);
                    reset("name", "email", "password", "password_confirmation");
                    setShowEmailVerificationModal(true);
                }
            },
            onError: (errors) => {
                loadingAlert.close();

                let errorMessage =
                    "Failed to create account. Please try again.";

                if (errors.email) {
                    errorMessage = errors.email;
                } else if (errors.password) {
                    errorMessage = errors.password;
                } else if (errors.name) {
                    errorMessage = errors.name;
                }

                showAlert("error", "Registration Failed", errorMessage);
            },
        });
    };

    const resend_emailVerification = async (e) => {
        e.preventDefault();

        const loadingAlert = showLoadingAlert(
            "Sending Verification Email",
            "Please wait..."
        );

        postResendEmail(route("custom.verification.send"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                loadingAlert.close();
                setShowEmailVerificationModal(false);
                showAlert(
                    "success",
                    "Email Sent!",
                    "A new verification link has been sent to your email address."
                );
            },
            onError: (errors) => {
                loadingAlert.close();
                showAlert(
                    "error",
                    "Failed to Send",
                    "Failed to send verification email. Please try again."
                );
            },
        });
    };

    const handleCloseVerificationModal = async () => {
        const result = await showConfirmationAlert(
            "Close Verification?",
            "Are you sure you want to close this window? You can always resend the verification email later.",
            "Yes, Close",
            "Stay"
        );

        if (result.isConfirmed) {
            setShowEmailVerificationModal(false);
        }
    };

    const showPasswordRequirementsModal = () => {
        setShowPasswordRequirements(true);
    };

    const PasswordRequirement = ({ met, text }) => (
        <div
            className={`flex items-center text-sm ${
                met ? "text-green-600" : "text-gray-500"
            }`}
        >
            {met ? (
                <FaCheck className="w-4 h-4 mr-2" />
            ) : (
                <FaTimes className="w-4 h-4 mr-2" />
            )}
            {text}
        </div>
    );

    const { text: strengthText, color: strengthColor } =
        getPasswordStrengthText(passwordValidation.strength);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-16">
                <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Left Column - Register Form */}
                    <div className="py-10 px-8 sm:px-10">
                        <div className="mb-8">
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
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={showPasswordRequirementsModal}
                                        className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center"
                                    >
                                        <FaInfoCircle className="w-3 h-3 mr-1" />
                                        Requirements
                                    </button>
                                </div>
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

                                {/* Compact Password Strength Indicator */}
                                {registerData.password && (
                                    <div className="mt-2">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs text-gray-600">
                                                Password strength:
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${strengthColor}`}
                                            >
                                                {strengthText}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    passwordValidation.strength <=
                                                    2
                                                        ? "bg-red-500"
                                                        : passwordValidation.strength <=
                                                          3
                                                        ? "bg-yellow-500"
                                                        : passwordValidation.strength <=
                                                          4
                                                        ? "bg-blue-500"
                                                        : "bg-green-500"
                                                }`}
                                                style={{
                                                    width: `${
                                                        (passwordValidation.strength /
                                                            5) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
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
                                {registerData.password_confirmation &&
                                    registerData.password !==
                                        registerData.password_confirmation && (
                                        <p className="text-red-600 text-sm mt-1 flex items-center">
                                            <FaTimes className="w-3 h-3 mr-1" />
                                            Passwords do not match
                                        </p>
                                    )}
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
                                    <button
                                        type="button"
                                        onClick={openTermsModal}
                                        className="text-blue-600 hover:text-blue-500 underline cursor-pointer"
                                    >
                                        Terms of Service
                                    </button>{" "}
                                    and{" "}
                                    <button
                                        type="button"
                                        onClick={openPrivacyModal}
                                        className="text-blue-600 hover:text-blue-500 underline cursor-pointer"
                                    >
                                        Privacy Policy
                                    </button>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    processingRegister ||
                                    !passwordValidation.isValid ||
                                    registerData.password !==
                                        registerData.password_confirmation
                                }
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
                    <div className="hidden lg:block relative h-full">
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
                                    <FaCheck className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Access thousands of unique preloved
                                        items
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Join a community of eco-conscious
                                        shoppers
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Save money while reducing environmental
                                        impact
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
                                    <span>
                                        Secure transactions and buyer protection
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <FaCheck className="h-6 w-6 text-green-300 mr-3 mt-1 flex-shrink-0" />
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

            {/* Terms and Privacy Modals */}
            <TermsPrivacyModal
                isOpen={showTermsModal}
                onClose={closeTermsModal}
                modalType="terms"
            />
            <TermsPrivacyModal
                isOpen={showPrivacyModal}
                onClose={closePrivacyModal}
                modalType="privacy"
            />

            {/* Password Requirements Modal */}
            {showPasswordRequirements && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setShowPasswordRequirements(false)}
                        ></div>

                        <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={() =>
                                        setShowPasswordRequirements(false)
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
                                    <FaLock className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Password Requirements
                                    </h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 mb-4">
                                            For your security, please create a
                                            strong password that meets the
                                            following requirements:
                                        </p>
                                        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                            <PasswordRequirement
                                                met={
                                                    passwordValidation
                                                        .validations.length
                                                }
                                                text="At least 8 characters long"
                                            />
                                            <PasswordRequirement
                                                met={
                                                    passwordValidation
                                                        .validations.uppercase
                                                }
                                                text="One uppercase letter (A-Z)"
                                            />
                                            <PasswordRequirement
                                                met={
                                                    passwordValidation
                                                        .validations.lowercase
                                                }
                                                text="One lowercase letter (a-z)"
                                            />
                                            <PasswordRequirement
                                                met={
                                                    passwordValidation
                                                        .validations.number
                                                }
                                                text="One number (0-9)"
                                            />
                                            <PasswordRequirement
                                                met={
                                                    passwordValidation
                                                        .validations.special
                                                }
                                                text="One special character (!@#$%^&*)"
                                            />
                                        </div>
                                        {registerData.password && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-medium text-blue-900">
                                                        Current Strength:
                                                    </span>
                                                    <span
                                                        className={`text-sm font-semibold ${strengthColor}`}
                                                    >
                                                        {strengthText}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-blue-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            passwordValidation.strength <=
                                                            2
                                                                ? "bg-red-500"
                                                                : passwordValidation.strength <=
                                                                  3
                                                                ? "bg-yellow-500"
                                                                : passwordValidation.strength <=
                                                                  4
                                                                ? "bg-blue-500"
                                                                : "bg-green-500"
                                                        }`}
                                                        style={{
                                                            width: `${
                                                                (passwordValidation.strength /
                                                                    5) *
                                                                100
                                                            }%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 sm:mt-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPasswordRequirements(false)
                                    }
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Verification Modal */}
            {showEmailVerificationModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 text-center">
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={handleCloseVerificationModal}
                        ></div>

                        <div className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:max-w-md sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                    onClick={handleCloseVerificationModal}
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
