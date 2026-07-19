import { Link } from "@inertiajs/react";

import { useState } from "react";
import { motion } from "framer-motion";

import Footer from "@/Components/Ui/Footer";
import Navbar from "@/Components/Ui/Navbar";
import TextInput from "@/Components/Ui/TextInput";
import { Icon } from "@/Components/Ui/Icon";

import { PasswordRequirementsModal } from "@/Components/Features/Register/PasswordRequirementsModal";
import { EmailVerificationModal } from "@/Components/Features/Register/EmailVerificationModal";

import { modalConfig } from "@/Constants/modalContent";

import { validatePassStrength } from "@/Features/Auth/Utils/passwordValidation";

import { useFormValidation } from "@/Features/Auth/Hooks/useFormValidation";
import { useRegister } from "@/Features/Auth/Hooks/useRegister";
import { useResendVefication } from "@/Features/Auth/Hooks/useResendVerification";

import { useToast } from "@/Components/Ui/Toast";
import Button from "@/Components/Ui/Button";
import { Modal } from "@/Components/Ui/Modal";

import {
    fadeInLeft,
    fadeInRight,
    fadeInUp,
    staggerContainer,
} from "@/Animations/animations";

import {
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaTimes,
    FaInfoCircle,
    FaLeaf,
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

/* 
Note for me in the future works

Fix: Resend Email is not working (419 page expired)
Fix: Simplify the UI dummy data (benefit, stories, etc)

Done: Refactoring functions by changing it into hooks, utils and helpers
Done: Flow and validations are works as expected
*/

export default function Register() {
    // hooks
    const { showToast } = useToast();
    const { loading, showVerifyModal, verifyEmail, register } = useRegister();
    const { resendEmail, closeVerifyModal } = useResendVefication();

    // Modal type
    const [modalType, setModalType] = useState(null);
    const config = modalType ? modalConfig[modalType] : null;

    // ✅ Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const [passConfirm, setPassConfirm] = useState("");

    // ✅ UI states
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showReq, setShowReq] = useState(false);

    // validation form
    const { nameValid, passValid } = useFormValidation(name, pass);
    const { strengthText, strengthColor } = validatePassStrength(
        passValid.strength,
    );

    // ✅ Register submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nameValid.status) {
            showToast(nameValid.msg, "error", 4000);
            return;
        }

        if (!passValid.status) {
            showToast(
                "Please create a password that meets all requirements.",
                "warning",
                5000,
            );
            setShowReq(true);
            return;
        }

        if (pass !== passConfirm) {
            showToast("Passwords not match.", "error", 4000);
            return;
        }

        await register({
            name,
            email,
            password: pass,
            password_confirmation: passConfirm,
        });

        setName("");
        setEmail("");
        setPass("");
        setPassConfirm("");
    };

    const handleSocialLogin = (provider) => {
        showToast(`${provider} login coming soon!`, "info", 3000);
    };

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

    const stories = [
        { name: "Sarah", savings: "50kg CO₂ saved", icon: FaLeaf },
        { name: "Michael", savings: "30 items rescued", icon: FaHandHolding },
        { name: "Emma", savings: "₹12,000 saved", icon: FaShoppingBag },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
            <Navbar />

            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side */}
                    <motion.div
                        variants={fadeInLeft}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col justify-between h-full"
                    >
                        <div>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 mb-5"
                            >
                                <div className="p-2.5 bg-emerald-100 rounded-2xl">
                                    <Icon
                                        icon={FaLeaf}
                                        className="w-7 h-7 text-emerald-600"
                                    />
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

                            <div className="bg-emerald-50/50 rounded-xl p-4 mb-4 border border-emerald-100">
                                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
                                    🌟 Real Impact Stories
                                </p>
                                <div className="grid grid-cols-3 gap-3">
                                    {stories.map((story, idx) => (
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

                    {/* Right Side - Register Card */}
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

                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <button
                                    onClick={() => handleSocialLogin("Google")}
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                >
                                    <Icon
                                        icon={FaGoogle}
                                        className="w-4 h-4 text-red-500"
                                    />{" "}
                                    Google
                                </button>
                                <button
                                    onClick={() =>
                                        handleSocialLogin("Facebook")
                                    }
                                    className="flex items-center justify-center gap-2 py-2.5 px-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                                >
                                    <Icon
                                        icon={FaFacebook}
                                        className="w-4 h-4 text-blue-600"
                                    />{" "}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icon
                                                icon={FaUser}
                                                className="h-4 w-4 text-gray-400"
                                            />
                                        </div>
                                        <TextInput
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className={`pl-9 w-full text-black border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5 ${name && !nameValid.status ? "border-red-300 focus:border-red-300 focus:ring-red-300" : ""}`}
                                            required
                                        />
                                    </div>
                                    {name && !nameValid.status && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <Icon
                                                icon={FaTimes}
                                                className="w-3 h-3"
                                            />{" "}
                                            {nameValid.msg}
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
                                            <Icon
                                                icon={FaEnvelope}
                                                className="h-4 w-4 text-gray-400"
                                            />
                                        </div>
                                        <TextInput
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="pl-9 w-full text-black border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowReq(true)}
                                            className="text-emerald-600 hover:text-emerald-700 text-xs font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <Icon
                                                icon={FaInfoCircle}
                                                className="w-3 h-3"
                                            />{" "}
                                            Requirements
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Icon
                                                icon={FaLock}
                                                className="h-4 w-4 text-gray-400"
                                            />
                                        </div>
                                        <TextInput
                                            type={
                                                showPass ? "text" : "password"
                                            }
                                            placeholder="Create a password"
                                            value={pass}
                                            onChange={(e) =>
                                                setPass(e.target.value)
                                            }
                                            className="pl-9 pr-9 w-full text-black border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPass(!showPass)
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPass ? (
                                                <Icon
                                                    icon={FaEyeSlash}
                                                    className="h-4 w-4"
                                                />
                                            ) : (
                                                <Icon
                                                    icon={FaEye}
                                                    className="h-4 w-4"
                                                />
                                            )}
                                        </button>
                                    </div>

                                    {pass && (
                                        <div className="mt-2">
                                            <div className="flex justify-start items-center mb-1 gap-0.5">
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
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${passValid.strength <= 2 ? "bg-red-500" : passValid.strength <= 3 ? "bg-yellow-500" : passValid.strength <= 4 ? "bg-blue-500" : "bg-green-500"}`}
                                                    style={{
                                                        width: `${(passValid.strength / 5) * 100}%`,
                                                    }}
                                                />
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
                                            <Icon
                                                icon={FaLock}
                                                className="h-4 w-4 text-gray-400"
                                            />
                                        </div>
                                        <TextInput
                                            type={
                                                showConfirm
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Confirm your password"
                                            value={passConfirm}
                                            onChange={(e) =>
                                                setPassConfirm(e.target.value)
                                            }
                                            className="pl-9 pr-9 w-full text-black border-gray-200 focus:border-emerald-400 focus:ring-emerald-400 rounded-xl py-2.5"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirm(!showConfirm)
                                            }
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirm ? (
                                                <Icon
                                                    icon={FaEyeSlash}
                                                    className="h-4 w-4"
                                                />
                                            ) : (
                                                <Icon
                                                    icon={FaEye}
                                                    className="h-4 w-4"
                                                />
                                            )}
                                        </button>
                                    </div>
                                    {passConfirm && pass !== passConfirm && (
                                        <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                                            <Icon
                                                icon={FaTimes}
                                                className="w-3 h-3"
                                            />{" "}
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
                                                setModalType("terms")
                                            }
                                            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                        >
                                            Terms of Service
                                        </button>{" "}
                                        and{" "}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setModalType("privacy")
                                            }
                                            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                        >
                                            Privacy Policy
                                        </button>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    buttonText="Create Account"
                                    isLoading={loading}
                                    fullWidth={true}
                                    loadingText="Creating"
                                    variant="primary"
                                    type="submit"
                                />
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
            {config && (
                <Modal
                    isOpen={true}
                    onClose={() => setModalType(null)}
                    title={config.title}
                    description={config.description}
                />
            )}

            {showReq && (
                <PasswordRequirementsModal
                    password={pass}
                    passwordValidation={passValid}
                    setShowPasswordRequirements={setShowReq}
                    strengthColor={strengthColor}
                    strengthText={strengthText}
                />
            )}

            {showVerifyModal && (
                <EmailVerificationModal
                    isLoading={loading}
                    onClose={closeVerifyModal}
                    email={verifyEmail}
                    resendEmail={resendEmail}
                />
            )}

            <Footer />
        </div>
    );
}
