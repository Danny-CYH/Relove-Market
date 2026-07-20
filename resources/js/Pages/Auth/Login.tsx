import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    FaEye,
    FaEyeSlash,
    FaEnvelope,
    FaLock,
    FaLeaf,
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

import { ForgetPasswordModal } from "@/Components/Features/Login/ForgetPasswordModal";
import { ResetPasswordModal } from "@/Components/Features/Login/ResetPasswordModal";

import Footer from "@/Components/Ui/Footer";
import Navbar from "@/Components/Ui/Navbar";
import TextInput from "@/Components/Ui/TextInput";
import { Icon } from "@/Components/Ui/Icon";
import { useToast } from "@/Components/Ui/Toast";
import Button from "@/Components/Ui/Button";

import { useLogin } from "@/Features/Auth/Hooks/useLogin";
import { useResetPassword } from "@/Features/Auth/Hooks/useResetPassword";
import { useResetLink } from "@/Features/Auth/Hooks/useResetLink";
import { useFormValidation } from "@/Features/Auth/Hooks/useFormValidation";

export default function Login() {
    const { props } = usePage();

    // ✅ 从 props 获取 token 和 email（从 cookie 解密后传入）
    const {
        token: urlToken,
        email: urlEmail,
        showResetModal: showResetFromProps,
    } = props;

    const [showResetModal, setShowResetModal] = useState(false);
    const [showForgetModal, setShowForgetModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ✅ 登录表单的 email
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [remember, setRemember] = useState(false);

    // ✅ 重置密码的 email（从 cookie/props 获取）
    const [resetEmail, setResetEmail] = useState("");
    const [resetToken, setResetToken] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [showReq, setShowReq] = useState(false);

    // hooks
    const { showToast } = useToast();
    const { login, isLoading: isLogin } = useLogin();
    const { passValid } = useFormValidation(undefined, password);
    const { resetPass, isLoading: isResetting } = useResetPassword();
    const { resetLink } = useResetLink();

    const loginAccount = async (e) => {
        e.preventDefault();

        await login({ email, password });
    };

    const resetLink_submit = async (e) => {
        e.preventDefault();

        await resetLink({ email: resetEmail });

        setShowForgetModal(false);
        setResetEmail("");
    };

    // function for reseting new password
    const resetPassword = async (e) => {
        e.preventDefault();

        if (!passValid.status) {
            showToast(
                "Please create a password that meets all requirements.",
                "warning",
                5000,
            );
            setShowReq(true);
            return;
        }

        if (password !== passwordConfirmation) {
            showToast("Passwords do not match. Please try again.", "error");
            return;
        }

        await resetPass({
            token: resetToken,
            email: resetEmail,
            password: password,
            password_confirmation: passwordConfirmation,
        });

        setShowResetModal(false);
        setTimeout(() => {
            window.location.href = "/relove-market";
        }, 5000);
    };

    const handleCloseForgetModal = () => {
        setShowForgetModal(false);
    };

    const onClose = () => {
        setShowResetModal(false);
    };

    const handleSocialLogin = (provider) => {
        showToast(`${provider} login coming soon!`, "info");
    };

    useEffect(() => {
        // ✅ 从 props 获取 token 和 email（从 cookie 解密后传入）
        if (urlToken && urlEmail) {
            setResetToken(urlToken);
            setResetEmail(urlEmail);
            setShowResetModal(true);
        }

        // ✅ 如果 props 有 showResetModal 标志
        if (showResetFromProps) {
            setShowResetModal(true);
        }
    }, [urlToken, urlEmail, showResetFromProps]);

    return (
        <div className="min-h-screen flex flex-col bg-[#f6f8f7]">
            <Navbar />

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-12">
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left Side */}
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

                        {/* Stats */}
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

                        {/* Features */}
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

                        {/* Trust badges */}
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

                    {/* Right - Login Card */}
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
                                    <Icon
                                        icon={FaGoogle}
                                        className="w-4 h-4 text-red-500"
                                    />
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
                                    />
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
                            <form onSubmit={loginAccount} className="space-y-4">
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
                                            className="pl-9 pr-9 text-black"
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
                                            <Icon
                                                icon={FaLock}
                                                className="h-4 w-4 text-gray-400"
                                            />
                                        </div>
                                        <TextInput
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="pl-9 pr-9 text-black"
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
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={remember}
                                            onChange={(e) =>
                                                setRemember(e.target.checked)
                                            }
                                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowForgetModal(true)}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    buttonText="Sign In"
                                    fullWidth={true}
                                    isLoading={isLogin}
                                    loadingText="Signing In"
                                />
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

            {/* ✅ Modals */}
            {showForgetModal && (
                <ForgetPasswordModal
                    resetEmail={resetEmail}
                    setResetEmail={setResetEmail}
                    resetLink_submit={resetLink_submit}
                    handleCloseForgetModal={handleCloseForgetModal}
                    isLoading={isLoading}
                />
            )}

            {showResetModal && (
                <ResetPasswordModal
                    password={password}
                    passwordConfirmation={passwordConfirmation}
                    setPassword={setPassword}
                    setPasswordConfirmation={setPasswordConfirmation}
                    resetPassword={resetPassword}
                    isLoading={isResetting}
                    showReq={showReq}
                    setShowReq={setShowReq}
                    onClose={onClose}
                />
            )}

            <Footer />
        </div>
    );
}
