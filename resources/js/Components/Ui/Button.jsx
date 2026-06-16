import React, { forwardRef } from "react";

// Define variant classes for the button
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
    black: "bg-gray-800 hover:bg-gray-900 text-white",
};

// Define size classes for the button
const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
    pill: "px-3 py-1.5 text-xs rounded-full",
    icon: "p-2 rounded-lg",
    visual: "px-6 py-4 rounded-full",
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

// Filter out falsy values and join classes (e.g. remove the space)
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
        },
        ref,
    ) => {
        const isDisabled = disabled || isLoading;
        const btn_text = buttonText || children;

        // ✅ Render content based on loading state
        const renderContent = (text) => {
            // Loading state
            if (isLoading) {
                return (
                    <>
                        <span className={`animate-spin ${iconSize}`}>
                            {leftIcon || "⟳"}{" "}
                            {/* Fallback spinner if no icon */}
                        </span>
                        {loadingText || text || "Loading..."}
                    </>
                );
            }

            // Normal state
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
                ref={ref}
                type={type}
                disabled={isDisabled}
                className={joinClasses(
                    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
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
