export function ReturnsRefundsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Returns & Refunds
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
                    <p>
                        If an item arrives damaged or not as described, you can
                        request a return.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Requests must be submitted within 3 days.</li>
                        <li>Provide photos and order details for review.</li>
                        <li>
                            Approved refunds are processed back to the original
                            payment method.
                        </li>
                    </ul>
                    <p>
                        Some items are final sale and may not be eligible for
                        return.
                    </p>
                </div>

                <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
