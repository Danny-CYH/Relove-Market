import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { Icon } from "@/Components/Ui/Icon";

import { PasswordRequirement } from "./PasswordRequirement";

export function PasswordRequirementsModal({
    setShowPasswordRequirements,
    passwordValidation,
    password,
    strengthText,
    strengthColor,
}) {
    const getStrengthColorClass = () => {
        if (passwordValidation.strength <= 2) return "bg-red-500";
        if (passwordValidation.strength <= 3) return "bg-yellow-500";
        if (passwordValidation.strength <= 4) return "bg-blue-500";
        return "bg-green-500";
    };

    const getStrengthEmoji = () => {
        if (passwordValidation.strength <= 2) return "🔴";
        if (passwordValidation.strength <= 3) return "🟡";
        if (passwordValidation.strength <= 4) return "🔵";
        return "🟢";
    };

    const checks = passwordValidation.checks;
    const completedCount = Object.values(checks).filter(Boolean);
    const totalCount = 5;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 sm:p-6">
                    {/* 背景遮罩 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowPasswordRequirements(false)}
                    />

                    {/* Modal 卡片 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* ✅ 顶部装饰 */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400" />

                        {/* ✅ 关闭按钮 */}
                        <button
                            onClick={() => setShowPasswordRequirements(false)}
                            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors z-10"
                        >
                            <Icon icon={FaTimes} className="w-5 h-5" />
                        </button>

                        {/* ✅ 内容 */}
                        <div className="p-6 pt-8 sm:p-8 sm:pt-10">
                            {/* ✅ 图标 + 标题 */}
                            <div className="flex items-start gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Password Requirements
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Create a strong password to keep your
                                        account secure.
                                    </p>
                                </div>
                            </div>

                            {/* ✅ 进度指示器 */}
                            <div className="mb-5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-500">
                                        Security Score
                                    </span>
                                    <span className="text-xs font-semibold text-gray-700">
                                        {completedCount.length}/{totalCount} met
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${getStrengthColorClass()}`}
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(completedCount.length / totalCount) * 100}%`,
                                        }}
                                        transition={{
                                            duration: 0.6,
                                            ease: "easeOut",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ✅ 需求列表 */}
                            <div className="space-y-2.5 mb-6">
                                <PasswordRequirement
                                    met={checks.length}
                                    text="At least 8 characters long"
                                />
                                <PasswordRequirement
                                    met={checks.uppercase}
                                    text="One uppercase letter (A-Z)"
                                />
                                <PasswordRequirement
                                    met={checks.lowercase}
                                    text="One lowercase letter (a-z)"
                                />
                                <PasswordRequirement
                                    met={checks.number}
                                    text="One number (0-9)"
                                />
                                <PasswordRequirement
                                    met={checks.special}
                                    text="One special character (!@#$%^&*)"
                                />
                            </div>

                            {/* ✅ 当前密码强度 */}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">
                                                {getStrengthEmoji()}
                                            </span>
                                            <span className="text-sm font-medium text-gray-700">
                                                Current Strength:
                                            </span>
                                        </div>
                                        <span
                                            className={`text-sm font-bold ${strengthColor}`}
                                        >
                                            {strengthText}
                                        </span>
                                    </div>
                                    <div className="mt-2 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${getStrengthColorClass()}`}
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${
                                                    (passwordValidation.strength /
                                                        5) *
                                                    100
                                                }%`,
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                ease: "easeOut",
                                            }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
