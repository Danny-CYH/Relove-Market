import { Button } from "@/Components/Ui/Button";

export function Modal({
    isOpen,
    onClose,
    title,
    children,
    primaryLabel = "Got It",
    onPrimaryClick,
    secondaryLabel,
    onSecondaryClick,
}) {
    if (!isOpen) return null;

    const handlePrimary = onPrimaryClick ?? onClose;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-5 text-sm text-gray-700 space-y-4">
                    {children}
                </div>

                <div
                    className={`flex items-center justify-end border-t border-gray-200 px-6 py-4 ${
                        secondaryLabel ? "gap-3" : ""
                    }`}
                >
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
                        onClick={handlePrimary}
                        size="sm"
                        variant="success"
                    >
                        {primaryLabel}
                    </Button>
                </div>
            </div>
        </div>
    );
}
