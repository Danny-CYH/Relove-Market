import { Button } from "@/Components/Ui/Button";

const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    xl: "max-w-xl",
};

const joinClasses = (...classes) => classes.filter(Boolean).join(" ");

export function ConfirmDialog({
    title,
    titleAs: TitleTag = "h2",
    maxWidth = "md",
    panelClassName = "",
    showShadow = false,
    onClose,
    children,
    cancelLabel = "Cancel",
    cancelVariant = "secondary",
    onCancel,
    confirmLabel,
    confirmVariant = "primary",
    onConfirm,
    confirmType = "button",
    footerClassName = "mt-6 flex justify-end gap-2",
}) {
    const handleCancel = onCancel ?? onClose;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                className={joinClasses(
                    "bg-white rounded-lg p-6 w-full",
                    maxWidthClasses[maxWidth] ?? maxWidthClasses.md,
                    showShadow && "shadow-xl",
                    panelClassName,
                )}
            >
                <TitleTag
                    className={joinClasses(
                        "text-black font-bold mb-4",
                        TitleTag === "h3" ? "text-lg" : "text-xl",
                    )}
                >
                    {title}
                </TitleTag>

                {children}

                <div className={footerClassName}>
                    <Button onClick={handleCancel} size="sm" variant={cancelVariant}>
                        {cancelLabel}
                    </Button>
                    {confirmLabel && (
                        <Button
                            type={confirmType}
                            onClick={onConfirm}
                            size="sm"
                            variant={confirmVariant}
                        >
                            {confirmLabel}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
