import { FaLock, FaTimes, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { PasswordRequirement } from "./PasswordRequirement";

export function PasswordRequirementsModal({
    setShowPasswordRequirements,
    passwordValidation,
    registerData,
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

    const completedCount = Object.values(passwordValidation.validations).filter(
        Boolean,
    ).length;
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
                            <FaTimes className="w-5 h-5" />
                        </button>

                        {/* ✅ 内容 */}
                        <div className="p-6 pt-8 sm:p-8 sm:pt-10">
                            {/* ✅ 图标 + 标题 */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                                    <FaShieldAlt className="w-7 h-7 text-white" />
                                </div>
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
                                        {completedCount}/{totalCount} met
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full rounded-full ${getStrengthColorClass()}`}
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${(completedCount / totalCount) * 100}%`,
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
                                    met={passwordValidation.validations.length}
                                    text="At least 8 characters long"
                                />
                                <PasswordRequirement
                                    met={
                                        passwordValidation.validations.uppercase
                                    }
                                    text="One uppercase letter (A-Z)"
                                />
                                <PasswordRequirement
                                    met={
                                        passwordValidation.validations.lowercase
                                    }
                                    text="One lowercase letter (a-z)"
                                />
                                <PasswordRequirement
                                    met={passwordValidation.validations.number}
                                    text="One number (0-9)"
                                />
                                <PasswordRequirement
                                    met={passwordValidation.validations.special}
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

                            {/* ✅ 按钮 */}
                            <div className="mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() =>
                                        setShowPasswordRequirements(false)
                                    }
                                    className="w-full bg-emerald-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-lg shadow-emerald-200/50"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FaCheckCircle className="w-4 h-4" />
                                        Got it, thanks!
                                    </span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
