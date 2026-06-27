import { AlertCircle } from "lucide-react";

const variantClasses = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
};

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export function Banner({
    message,
    variant = "error",
    onDismiss,
    className = "",
    icon: Icon = AlertCircle,
}) {
    if (!message) return null;

    return (
        <div
            className={joinClasses(
                "border p-3 rounded-lg mb-4 flex items-center justify-between",
                variantClasses[variant] ?? variantClasses.error,
                className,
            )}
            role="alert"
        >
            <div className="flex items-center gap-2 min-w-0">
                {Icon && <Icon size={16} className="flex-shrink-0" />}
                <span className="text-sm">{message}</span>
            </div>
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="text-current opacity-70 hover:opacity-100 flex-shrink-0 ml-2"
                    aria-label="Dismiss"
                >
                    <span className="text-lg leading-none">×</span>
                </button>
            )}
        </div>
    );
}
