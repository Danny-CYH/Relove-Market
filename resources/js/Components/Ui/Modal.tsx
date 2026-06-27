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
}) {
    if (!isOpen) return null;

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

    // 判断有几个按钮
    const hasSecondary = !!secondaryLabel;
    const hasPrimary = !!primaryLabel;

    // 处理按钮点击 - 默认关闭
    const handlePrimary = primaryOnClick ?? onClose;
    const handleSecondary = secondaryOnClick ?? onClose;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl p-6">
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

                {/* 🆕 按钮：一个就 full width，两个就各 50% */}
                <div
                    className={`mt-6 flex gap-3 ${!hasSecondary ? "flex-col" : ""}`}
                >
                    {/* 次要按钮（如果有两个按钮时在左边） */}
                    {hasSecondary && (
                        <Button
                            type="button"
                            onClick={handleSecondary}
                            size="sm"
                            variant="dangerOutline"
                            className="flex-1 w-full sm:w-1/2"
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
                        className={`flex-1 ${hasSecondary ? "w-full sm:w-1/2" : "w-full"}`}
                    >
                        {primaryLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
