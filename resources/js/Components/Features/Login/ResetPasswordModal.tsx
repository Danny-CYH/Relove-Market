import { FaEye, FaEyeSlash, FaInfoCircle, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";

import TextInput from "../../Ui/TextInput";
import { Button } from "@/Components/Ui/Button";

import { PasswordRequirementsModal } from "../Register/PasswordRequirementsModal";

export function ResetPasswordModal({
    handleCloseResetModal,
    email,
    password,
    passwordConfirmation,
    setPassword,
    setPasswordConfirmation,
    updatePassword_submit,
    isLoading,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] =
        useState(false);
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

    useEffect(() => {
        if (password) {
            const validation = validatePassword(password);
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
    }, [password]);

    const { text: strengthText, color: strengthColor } =
        getPasswordStrengthText(passwordValidation.strength);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(e)

        if (!passwordValidation.isValid) {
            setShowPasswordRequirements(true);
            return;
        }

        if (password !== passwordConfirmation) {
            // 使用 Toast 替代 alert
            showToast(
                "Passwords do not match. Please make sure both passwords are identical.",
                "error",
            );
            return;
        }

        updatePassword_submit(e);
    };

    return (
        <>
            {/* ✅ 背景遮罩 + Modal */}
            <AnimatePresence>
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-full p-4 sm:p-6">
                        {/* 背景遮罩 */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={handleCloseResetModal}
                        />

                        {/* Modal 卡片 */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* ✅ 顶部装饰条 */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />

                            {/* ✅ 关闭按钮 */}
                            <button
                                onClick={handleCloseResetModal}
                                className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>

                            {/* ✅ 内容 */}
                            <div className="p-6 pt-8 sm:p-8 sm:pt-10">
                                {/* ✅ 图标 + 标题 */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Set New Password
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Create a strong password for your
                                            account security.
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >
                                    {/* ✅ 新密码 */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-sm font-medium text-gray-700">
                                                New Password
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
                                            <TextInput
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                placeholder="Create a strong password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                className="w-full pr-10 text-gray-900 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <FaEyeSlash className="h-5 w-5" />
                                                ) : (
                                                    <FaEye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>

                                        {/* ✅ 密码强度指示器 */}
                                        {password && (
                                            <div className="mt-2">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-xs text-gray-500">
                                                        Password strength:
                                                    </span>
                                                    <span
                                                        className={`text-xs font-semibold ${strengthColor}`}
                                                    >
                                                        {strengthText}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <motion.div
                                                        className={`h-1.5 rounded-full ${
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
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${
                                                                (passwordValidation.strength /
                                                                    5) *
                                                                100
                                                            }%`,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                            ease: "easeOut",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* ✅ 确认密码 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <TextInput
                                                type={
                                                    showConfirmPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                placeholder="Confirm your password"
                                                value={passwordConfirmation}
                                                onChange={(e) =>
                                                    setPasswordConfirmation(
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full pr-10 text-gray-900 border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
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
                                                    <FaEyeSlash className="h-5 w-5" />
                                                ) : (
                                                    <FaEye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {passwordConfirmation &&
                                            password !==
                                                passwordConfirmation && (
                                                <motion.p
                                                    initial={{
                                                        opacity: 0,
                                                        y: -5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    className="text-red-600 text-xs mt-1 flex items-center gap-1"
                                                >
                                                    <FaTimes className="w-3 h-3" />
                                                    Passwords do not match
                                                </motion.p>
                                            )}
                                    </div>

                                    {/* ✅ 提交按钮 */}
                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            buttonText="Update Password"
                                            isLoading={isLoading}
                                            fullWidth={true}
                                            loadingText="Updating..."
                                            variant="primary"
                                            disabled={
                                                !password ||
                                                !passwordConfirmation ||
                                                password !==
                                                    passwordConfirmation
                                            }
                                        />
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </AnimatePresence>

            {/* ✅ Password Requirements Modal */}
            {showPasswordRequirements && (
                <PasswordRequirementsModal
                    setShowPasswordRequirements={setShowPasswordRequirements}
                    strengthText={strengthText}
                    passwordValidation={passwordValidation}
                    strengthColor={strengthColor}
                    password={password}
                />
            )}
        </>
    );
}
