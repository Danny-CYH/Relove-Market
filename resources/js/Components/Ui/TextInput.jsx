import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export default forwardRef(function TextInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        variant = "default", // 'default' | 'white' | 'transparent'
        size = "md", // 'sm' | 'md' | 'lg'
        error = false,
        ...props
    },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    // Size variants
    const sizeClasses = {
        sm: "py-1.5 px-3 text-sm",
        md: "py-2.5 px-4 text-sm",
        lg: "py-3 px-5 text-base",
    };

    // Variant styles
    const variantClasses = {
        default:
            "bg-white border-gray-200 focus:border-emerald-400 focus:ring-emerald-400",
        white: "bg-white/50 backdrop-blur-sm border-gray-200 focus:border-emerald-400 focus:ring-emerald-400",
        transparent:
            "bg-transparent border-gray-200 focus:border-emerald-400 focus:ring-emerald-400",
    };

    return (
        <input
            {...props}
            type={type}
            className={`
                rounded-xl 
                border 
                shadow-sm 
                transition-all 
                duration-200 
                w-full
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                disabled:opacity-50 
                disabled:cursor-not-allowed
                placeholder:text-gray-400
                hover:border-gray-300
                focus:outline-none
                focus:ring-2
                focus:ring-offset-0
                ${className}
            `}
            ref={localRef}
        />
    );
});
