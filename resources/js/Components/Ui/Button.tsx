import { forwardRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantClasses = {
    primary:
        "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md focus:ring-green-500",
    secondary:
        "bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-300",
    ghost:
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-300",
    outline:
        "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
    success:
        "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg focus:ring-green-500",
    successSoft:
        "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-300",
    danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md focus:ring-red-500",
    dangerSoft:
        "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-400",
    dangerOutline:
        "bg-white border border-red-300 text-red-600 hover:bg-red-50 focus:ring-red-400",
    warningSoft:
        "bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100 focus:ring-yellow-400",
    neutralSoft:
        "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 focus:ring-gray-300",
    black:
        "bg-gray-800 text-white hover:bg-gray-900 shadow-sm focus:ring-gray-600",
};

const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-xl",
    pill: "px-5 py-2 text-sm rounded-full shadow-sm hover:shadow-md",
    icon: "p-2.5 rounded-lg",
    visual: "px-8 py-4 text-base rounded-full shadow-lg hover:shadow-xl",
};

const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
};

const positionClasses = {
    left: "mr-auto",
    center: "mx-auto",
    right: "ml-auto",
    "center-block": "mx-auto block",
    "right-block": "ml-auto block",
};

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export const Button = forwardRef(
    (
        {
            children,
            className = "",
            disabled = false,
            fullWidth = false,
            fontSize = "base",
            iconSize = "text-lg",
            iconPosition = "left",
            isLoading = false,
            loadingText = "",
            leftIcon = null,
            rightIcon = null,
            size = "md",
            type = "button",
            variant = "primary",
            position = "left",
            buttonText = null,
            ...props
        }: ButtonProps,
        ref,
    ) => {
        const isDisabled = disabled || isLoading;
        const btn_text = buttonText || children;

        const renderContent = (text) => {
            if (isLoading) {
                return (
                    <>
                        <span className={joinClasses(iconSize, "inline-flex")}>
                            {leftIcon ? (
                                <span className="animate-spin">{leftIcon}</span>
                            ) : (
                                <LoadingSpinner />
                            )}
                        </span>
                        {loadingText || text || "Loading..."}
                    </>
                );
            }

            return (
                <>
                    {iconPosition === "left" && leftIcon && (
                        <span className={iconSize}>{leftIcon}</span>
                    )}
                    {text}
                    {iconPosition === "right" && rightIcon && (
                        <span className={iconSize}>{rightIcon}</span>
                    )}
                </>
            );
        };

        return (
            <button
                type={type}
                disabled={isDisabled}
                className={joinClasses(
                    baseClasses,
                    variantClasses[variant] || variantClasses.primary,
                    sizeClasses[size] || sizeClasses.md,
                    fontSizeClasses[fontSize] || fontSizeClasses.base,
                    positionClasses[position] || positionClasses.left,
                    fullWidth && "w-full",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    className,
                )}
                {...props}
            >
                {renderContent(btn_text)}
            </button>
        );
    },
);

Button.displayName = "Button";
