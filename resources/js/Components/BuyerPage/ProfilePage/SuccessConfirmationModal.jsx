import { ThumbsUp, X } from "lucide-react";

export function SuccessConfirmationModal({
    confirmedOrder,
    setConfirmedOrder,
    setShowSuccessModal,
    showSuccessModal,
}) {
    if (!showSuccessModal) return null;

    const handleClose = () => {
        setShowSuccessModal(false);
        if (setConfirmedOrder) {
            setConfirmedOrder(null);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Order Confirmed
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-6 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <ThumbsUp className="text-green-600" size={22} />
                    </div>
                    <p className="text-gray-800">
                        Thanks for confirming delivery. Your order is now
                        marked as completed.
                    </p>
                    {confirmedOrder?.order_id && (
                        <p className="text-sm text-gray-500">
                            Order ID:{" "}
                            <span className="font-medium text-gray-700">
                                {confirmedOrder.order_id}
                            </span>
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
