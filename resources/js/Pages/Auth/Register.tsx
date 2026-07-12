import Footer from "@/Components/Ui/Footer";
import Navbar from "@/Components/Ui/Navbar";
import { TermsPrivacyModal } from "@/Components/Auth/Register/TermsPrivacyModal";
import { PasswordRequirementsModal } from "@/Components/Auth/Register/PasswordRequirementsModal";
import { EmailVerificationModal } from "@/Components/Auth/Register/EmailVerificationModal";

import TextInput from "@/Components/Ui/TextInput";

import { Link, useForm, usePage } from "@inertiajs/react";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaCheck,
    FaTimes,
    FaInfoCircle,
    FaLeaf,
    FaArrowRight,
    FaGoogle,
    FaFacebook,
    FaHeart,
    FaStar,
    FaShieldAlt,
    FaRecycle,
    FaUsers,
    FaShoppingBag,
    FaTree,
    FaAward,
    FaGlobe,
    FaHandHolding,
    FaClock,
} from "react-icons/fa";

import Swal from "sweetalert2";

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

const showConfirmationAlert = (
    title,
    text,
    confirmButtonText = "Yes",
    cancelButtonText = "Cancel",
) => {
    return Swal.fire({
        title,
        text,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#059669",
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
    const [nameValidation, setNameValidation] = useState({
        isValid: true,
        message: "",
    });
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
        errors: registerErrors,
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
        if (flash?.errorMessage) {
            showAlert("error", "Error!", flash.errorMessage);
        }

        if (flash?.successMessage) {
            setVerifyData("user_email", registerData.email);
            setShowEmailVerificationModal(true);
            reset("password", "password_confirmation", "name");
        }
    }, [flash]);

    useEffect(() => {
        if (registerData.name) {
            const nameRegex = /^[a-zA-Z\s]*$/;
            const isValid = nameRegex.test(registerData.name);

            if (!isValid) {
                setNameValidation({
                    isValid: false,
                    message: "Name should only contain letters and spaces",
                });
            } else if (registerData.name.trim().length < 2) {
                setNameValidation({
                    isValid: false,
                    message: "Name should be at least 2 characters long",
                });
            } else {
                setNameValidation({
                    isValid: true,
                    message: "",
                });
            }
        } else {
            setNameValidation({
                isValid: true,
                message: "",
            });
        }
    }, [registerData.name]);

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

    const closeTermsModal = () => {
        setShowTermsModal(false);
    };

    const closePrivacyModal = () => {
        setShowPrivacyModal(false);
    };

    const register_submit = async (e) => {
        e.preventDefault();

        if (
            !registerData.name ||
            !registerData.email ||
            !registerData.password ||
            !registerData.password_confirmation
        ) {
            showAlert(
                "warning",
                "Missing Information",
                "Please fill in all required fields",
            );
            return;
        }

        const nameRegex = /^[a-zA-Z\s]*$/;
        if (!nameRegex.test(registerData.name)) {
            showAlert(
                "warning",
                "Invalid Name",
                "Name should only contain letters and spaces.",
            );
            return;
        }

        if (registerData.name.trim().length < 2) {
            showAlert(
                "warning",
                "Invalid Name",
                "Name should be at least 2 characters long.",
            );
            return;
        }

        if (registerData.name.trim() === "") {
            showAlert("warning", "Invalid Name", "Please enter a valid name.");
            return;
        }

        if (!passwordValidation.isValid) {
            showAlert(
                "warning",
                "Password Requirements Not Met",
                "Please create a password that meets all the requirements.",
            );
            return;
        }

        if (registerData.password !== registerData.password_confirmation) {
            showAlert("error", "Password Mismatch", "Passwords do not match.");
            return;
        }

        const loadingAlert = showLoadingAlert(
            "Creating Account",
            "Please wait while we create your account...",
        );

        postRegister(route("register"), {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                loadingAlert.close();

                if (page.props.flash?.successMessage) {
                    setVerifyData("user_email", registerData.email);
                    setShowEmailVerificationModal(true);
                    setRegisterData({
                        ...registerData,
                        password: "",
                        password_confirmation: "",
                        name: "",
                    });
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
            "Please wait...",
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
                    "A new verification link has been sent to your email address.",
                );
            },
            onError: (errors) => {
                loadingAlert.close();
                showAlert(
                    "error",
                    "Failed to Send",
                    "Failed to send verification email. Please try again.",
                );
            },
        });
    };

    const handleCloseVerificationModal = async () => {
        const result = await showConfirmationAlert(
            "Close Verification?",
            "Are you sure you want to close this window? You can always resend the verification email later.",
            "Yes, Close",
            "Stay",
        );

        if (result.isConfirmed) {
            setShowEmailVerificationModal(false);
        }
    };

    const { text: strengthText, color: strengthColor } =
        getPasswordStrengthText(passwordValidation.strength);

    const handleSocialLogin = (provider) => {
        showAlert(
            "info",
            `${provider} Login`,
            `${provider} login coming soon!`,
        );
    };

    // Animation variants
    const fadeInLeft = {
        hidden: { opacity: 0, x: -40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 40 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    // Expanded benefits data
    const benefits = [
        {
            icon: FaHeart,
            text: "Discover unique pre-loved fashion",
            color: "text-rose-400",
        },
        {
            icon: FaShieldAlt,
            text: "100% secure & insured shopping",
            color: "text-emerald-400",
        },
        {
            icon: FaRecycle,
            text: "Reduce waste & carbon footprint",
            color: "text-teal-400",
        },
        {
            icon: FaAward,
            text: "Earn rewards for sustainable choices",
            color: "text-amber-400",
        },
        {
            icon: FaGlobe,
            text: "Join a global eco-conscious community",
            color: "text-blue-400",
        },
        {
            icon: FaClock,
            text: "24/7 customer support & assistance",
            color: "text-indigo-400",
        },
    ];

    // Success stories
    const successStories = [
        { name: "Sarah", savings: "50kg CO₂ saved", icon: FaLeaf },
        { name: "Michael", savings: "30 items rescued", icon: FaHandHolding },
        { name: "Emma", savings: "₹12,000 saved", icon: FaShoppingBag },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* ✅ Left Side - Enhanced with more content */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full"
                    >
                        {/* Top section */}
                        <div>
                            {/* Logo */}
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 mb-5"
                            >
                                <div className="p-2.5 bg-emerald-100 rounded-2xl">
                                    <FaLeaf className="w-7 h-7 text-emerald-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">
                                        Relove Market
                                    </h1>
                                    <p className="text-xs text-gray-500">
                                        Sustainable Fashion Marketplace
                                    </p>
                                </div>
                            </motion.div>

                            {/* Main headline */}
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-3">
                                Join the{" "}
                                <span className="text-emerald-600">
                                    Movement
                                </span>
                            </h2>

                            <p className="text-gray-500 text-base mb-4 max-w-sm">
                                Create your account and start your sustainable
                                fashion journey today.
                            </p>

                            {/* ✅ Stats - 4 columns with icons */}
                            <div className="grid grid-cols-4 gap-3 mb-5">
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

                            {/* ✅ Success Stories - New */}
                            <div className="bg-emerald-50/50 rounded-xl p-4 mb-4 border border-emerald-100">
                                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                                    🌟 Real Impact Stories
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {successStories.map((story, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="text-center bg-white rounded-lg p-2 shadow-sm"
                                        >
                                            <story.icon className="w-4 h-4 text-emerald-500 mx-auto mb-0.5" />
                                            <p className="text-xs font-medium text-gray-800">
                                                {story.name}
                                            </p>
                                            <p className="text-[10px] text-gray-500">
                                                {story.savings}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* ✅ Benefits grid - 3 columns for better fit */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-3 gap-2"
                            >
                                {benefits.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={fadeInUp}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center gap-1.5 text-gray-700 bg-white/50 rounded-lg px-2.5 py-1.5 border border-gray-100"
                                    >
                                        <item.icon
                                            className={`w-3.5 h-3.5 ${item.color}`}
                                        />
                                        <span className="text-[11px] leading-tight">
                                            {item.text}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        {/* Bottom section - Trust badges */}
                        <div className="flex items-center gap-4 pt-4 mt-4 border-t border-gray-200">
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
                            <div className="w-px h-4 bg-gray-200"></div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-sm">🛡️</span>
                                <span className="text-xs text-gray-500">
                                    Safe
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ✅ Right Side - Register Card (unchanged) */}
                    <motion.div
                        variants={fadeInRight}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center"
                    >
                        <div className="w-full bg-white rounded-3xl shadow-xl shadow-emerald-100/30 p-8 sm:p-10">
                            <div className="text-center mb-7">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Create Account
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Start your sustainable journey today
                                </p>
                            </div>

                            {/* Social Register Buttons */}
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
                                        or sign up with email
                                    </span>
                                </div>
                            </div>

                            {/* Register Form */}
                            <form
                                onSubmit={register_submit}
                                className="space-y-4"
                            >
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="h-4 w-4 text-gray-400" />
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
                                                    e.target.value,
                                                )
                                            }
                                            className={`pl-9 w-full border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5 ${
                                                registerData.name &&
                                                !nameValidation.isValid
                                                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                    : ""
                                            }`}
                                            required
                                        />
                                    </div>
                                    {registerData.name &&
                                        !nameValidation.isValid && (
                                            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                                <FaTimes className="w-3 h-3" />
                                                {nameValidation.message}
                                            </p>
                                        )}
                                    {registerErrors.name && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {registerErrors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            autoComplete="off"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            className="pl-9 w-full border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                    </div>
                                    {registerErrors.email && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {registerErrors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPasswordRequirements(
                                                    true,
                                                )
                                            }
                                            className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <FaInfoCircle className="w-3 h-3" />
                                            Requirements
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            placeholder="Create a password"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData(
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
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {registerErrors.password && (
                                        <p className="text-red-600 text-xs mt-1">
                                            {registerErrors.password}
                                        </p>
                                    )}

                                    {/* Password strength indicator */}
                                    {registerData.password && (
                                        <div className="mt-2">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-500">
                                                    Password strength:
                                                </span>
                                                <span
                                                    className={`text-xs font-medium ${strengthColor}`}
                                                >
                                                    {strengthText}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
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
                                                        width: `${(passwordValidation.strength / 5) * 100}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-4 w-4 text-gray-400" />
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
                                                    e.target.value,
                                                )
                                            }
                                            className="pl-9 pr-9 w-full border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="h-4 w-4" />
                                            ) : (
                                                <FaEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {registerData.password_confirmation &&
                                        registerData.password !==
                                            registerData.password_confirmation && (
                                            <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                                <FaTimes className="w-3 h-3" />
                                                Passwords do not match
                                            </p>
                                        )}
                                </div>

                                {/* Terms */}
                                <div className="flex items-start gap-2">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-0.5"
                                        required
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-xs text-gray-600 leading-relaxed"
                                    >
                                        I agree to the{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowTermsModal(true)
                                            }
                                            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                        >
                                            Terms of Service
                                        </button>{" "}
                                        and{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPrivacyModal(true)
                                            }
                                            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                        >
                                            Privacy Policy
                                        </button>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={processingRegister}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    {processingRegister ? (
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
                                            Creating account...
                                        </>
                                    ) : (
                                        <>
                                            Create Account
                                            <FaArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <Link
                                        href={route("login")}
                                        className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Modals */}
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

            {showPasswordRequirements && (
                <PasswordRequirementsModal
                    passwordValidation={passwordValidation}
                    registerData={registerData}
                    setShowPasswordRequirements={setShowPasswordRequirements}
                    strengthColor={strengthColor}
                    strengthText={strengthText}
                />
            )}

            {showEmailVerificationModal && (
                <EmailVerificationModal
                    handleCloseVerificationModal={handleCloseVerificationModal}
                    processingResendEmail={processingResendEmail}
                    resend_emailVerification={resend_emailVerification}
                    verifyData={verifyData}
                />
            )}

            <Footer />
        </div>
    );
}
