import { Button } from "@/Components/Ui/Button";

export function Modal({
    isOpen,
    onClose,
    icon,
    title,
    description, 
    children,
    buttons, 
    primaryLabel,
    onPrimaryClick,
    secondaryLabel,
    onSecondaryClick,
}) {
    if (!isOpen) return null;

    // 处理按钮配置：优先使用 buttons 数组，否则回退到简化的 primary/secondary
    const renderButtons = () => {
        // 如果传入了 buttons 数组，使用它
        if (buttons && buttons.length > 0) {
            return buttons.map((btn, index) => (
                <Button
                    key={index}
                    type="button"
                    onClick={btn.onClick}
                    size={btn.size || "sm"}
                    variant={btn.variant || "success"}
                    disabled={btn.disabled}
                    className={btn.className}
                >
                    {btn.label}
                </Button>
            ));
        }

        // 回退到兼容旧版的简化模式
        const primaryClick = onPrimaryClick ?? onClose;
        return (
            <>
                {secondaryLabel && (
                    <Button
                        type="button"
                        onClick={onSecondaryClick ?? onClose}
                        size="sm"
                        variant="outline"
                    >
                        {secondaryLabel}
                    </Button>
                )}
                <Button
                    type="button"
                    onClick={primaryClick}
                    size="sm"
                    variant="success"
                >
                    {primaryLabel || "Got It"}
                </Button>
            </>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
                {/* 顶部：图标 + 标题 + 描述（居中） */}
                <div className="text-center">
                    {/* 图标 */}
                    {icon && (
                        <div className="flex justify-center mb-3">{icon}</div>
                    )}

                    {/* 标题 */}
                    {title && (
                        <h2 className="text-xl font-bold text-gray-900">
                            {title}
                        </h2>
                    )}

                    {/* 描述 */}
                    {description && (
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                            {description}
                        </p>
                    )}
                </div>

                {/* 额外自定义内容（如进度条、表单等） */}
                {children && (
                    <div className="mt-4 text-sm text-gray-700">{children}</div>
                )}

                {/* 底部按钮（居中） */}
                <div className="mt-6 flex flex-col-reverse sm:flex-row justify-center gap-3">
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}
