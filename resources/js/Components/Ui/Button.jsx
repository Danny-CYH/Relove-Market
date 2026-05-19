import React, { forwardRef } from "react";

const variantClasses = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-300 text-gray-800 hover:bg-gray-400",
    ghost: "text-gray-600 hover:bg-gray-50",
    outline: "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    successSoft:
        "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    dangerSoft:
        "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200",
    dangerOutline:
        "bg-white border border-red-300 text-red-700 hover:bg-red-50",
    warningSoft:
        "bg-yellow-100 text-yellow-800 border border-yellow-300 hover:bg-yellow-200",
    neutralSoft:
        "bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200",
};

const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    pill: "px-3 py-1.5 text-xs rounded-full",
    icon: "p-2 rounded-lg",
};

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export const Button = forwardRef(
    (
        {
            children,
            className = "",
            disabled = false,
            fullWidth = false,
            isLoading = false,
            leftIcon = null,
            rightIcon = null,
            size = "md",
            type = "button",
            variant = "primary",
            ...props
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                className={joinClasses(
                    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                    variantClasses[variant] || variantClasses.primary,
                    sizeClasses[size] || sizeClasses.md,
                    fullWidth && "w-full",
                    className,
                )}
                {...props}
            >
                {isLoading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    leftIcon
                )}
                {children}
                {rightIcon}
            </button>
        );
    },
);

Button.displayName = "Button";
