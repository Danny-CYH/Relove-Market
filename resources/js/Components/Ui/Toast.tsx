import {
    createContext,
    useContext,
    useCallback,
    useState,
    useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaCheckCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaExclamationTriangle,
    FaTimes,
} from "react-icons/fa";

import { Icon } from "./Icon";

const toastTypes = {
    success: {
        icon: FaCheckCircle,
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        textColor: "text-emerald-700",
        iconColor: "text-emerald-500",
        progressColor: "bg-emerald-400",
        dotColor: "bg-emerald-500",
    },
    error: {
        icon: FaExclamationCircle,
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        textColor: "text-rose-700",
        iconColor: "text-rose-500",
        progressColor: "bg-rose-400",
        dotColor: "bg-rose-500",
    },
    warning: {
        icon: FaExclamationTriangle,
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        textColor: "text-amber-700",
        iconColor: "text-amber-500",
        progressColor: "bg-amber-400",
        dotColor: "bg-amber-500",
    },
    info: {
        icon: FaInfoCircle,
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        textColor: "text-sky-700",
        iconColor: "text-sky-500",
        progressColor: "bg-sky-400",
        dotColor: "bg-sky-500",
    },
};

export const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(100);

    const config = toastTypes[type] || toastTypes.info;
    const Icon = config.icon;

    // ✅ Progress bar animation
    useEffect(() => {
        if (duration === 0) return;

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);

            if (remaining <= 0) {
                clearInterval(interval);
                handleClose();
            }
        }, 16);

        return () => clearInterval(interval);
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose?.();
        }, 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`
                        relative w-full max-w-sm overflow-hidden 
                        rounded-2xl border ${config.borderColor} 
                        ${config.bgColor} shadow-lg shadow-gray-200/50
                    `}
                >
                    {/* Left accent dot */}
                    <div
                        className={`absolute left-0 top-0 bottom-0 w-1 ${config.dotColor}`}
                    />

                    <div className="flex items-center gap-3 p-4 pl-5">
                        {/* Icon */}
                        <Icon
                            className={`w-4.5 h-4.5 ${config.iconColor} flex-shrink-0`}
                        />

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p
                                className={`text-sm font-medium ${config.textColor}`}
                            >
                                {message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className={`
                                flex-shrink-0 p-1 rounded-lg 
                                hover:bg-white/50 transition-colors
                                text-gray-400 hover:text-gray-600
                            `}
                        >
                            <Icon icon={FaTimes} className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Progress bar */}
                    {duration > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100/80">
                            <motion.div
                                className={`h-full ${config.progressColor}`}
                                initial={{ width: "100%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.016 }}
                            />
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// ✅ Toast Container - Top Right
export const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            <div className="pointer-events-auto space-y-3">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

// ✅ Toast Context & Provider
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration + 300);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};
