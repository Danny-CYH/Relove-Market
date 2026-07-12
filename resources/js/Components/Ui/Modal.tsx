import { Button } from "@/Components/Ui/Button";
import React from "react";

export function Modal({
    isOpen,
    onClose,
    icon,
    title,
    description,
    note,
    noteIcon,
    primaryLabel,
    primaryOnClick,
    secondaryLabel,
    secondaryOnClick,
    buttonLayout = "right",
    buttonDirection = "row",
    fullWidth = false,
}) {
    if (!isOpen) return null;

    const hasPrimary = !!primaryLabel;
    const hasSecondary = !!secondaryLabel;
    const hasAnyButton = hasPrimary || hasSecondary;

    const handlePrimary = primaryOnClick ?? onClose;
    const handleSecondary = secondaryOnClick ?? onClose;

    // 渲染图标
    const renderTitleIcon = () => {
        if (!icon) return null;
        return React.cloneElement(icon, {
            size: 40,
            className: "text-green-500",
        });
    };

    const renderNoteIcon = () => {
        if (!noteIcon) return null;
        return React.cloneElement(noteIcon, {
            size: 16,
            className: "text-blue-500",
        });
    };

    const getButtonJustify = () => {
        if (fullWidth) return "flex-col";
        if (buttonLayout === "center") return "justify-center";
        if (buttonLayout === "right") return "justify-end";
        return "justify-end";
    };

    // 按钮宽度样式
    const getButtonWidth = (isSecondary = false) => {
        if (fullWidth) return "w-full";
        if (hasSecondary && !fullWidth) return "flex-1";
        return "";
    };

    // 按钮方向
    const getButtonDirection = () => {
        if (fullWidth || buttonDirection === "col") return "flex-col";
        return "flex-row";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6 relative">
                {/* 如果没有按钮，显示右上角的 X 关闭按钮 */}
                {!hasAnyButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}

                {/* 图标 */}
                {icon && (
                    <div className="flex justify-center mb-3">
                        {renderTitleIcon()}
                    </div>
                )}

                {/* 标题 */}
                {title && (
                    <h2 className="text-center text-2xl font-bold text-gray-900">
                        {title}
                    </h2>
                )}

                {/* 描述 */}
                {description && (
                    <p className="text-center mt-2 text-md text-gray-600 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* 小提示 Note */}
                {note && (
                    <div className="flex items-center justify-center gap-2 mt-3 text-sm text-blue-500 font-bold">
                        {renderNoteIcon()}
                        <span>{note}</span>
                    </div>
                )}

                {/* 按钮区域 */}
                {hasAnyButton && (
                    <div
                        className={`mt-6 flex ${getButtonDirection()} ${getButtonJustify()} gap-3`}
                    >
                        {/* 次要按钮 */}
                        {hasSecondary && (
                            <Button
                                type="button"
                                onClick={handleSecondary}
                                size="sm"
                                variant="dangerOutline"
                                className={getButtonWidth(true)}
                            >
                                {secondaryLabel}
                            </Button>
                        )}

                        {/* 主要按钮 */}
                        <Button
                            type="button"
                            onClick={handlePrimary}
                            size="sm"
                            variant="success"
                            className={getButtonWidth()}
                        >
                            {primaryLabel}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
