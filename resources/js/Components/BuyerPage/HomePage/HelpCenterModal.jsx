export function HelpCenterModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Help Center
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
                        Need help with an order, payment, or account? Start
                        here.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Order tracking and delivery updates</li>
                        <li>Payment and refund questions</li>
                        <li>Account and profile support</li>
                        <li>Seller guidelines and policies</li>
                    </ul>
                    <p>
                        For urgent issues, email us at
                        <span className="font-medium">
                            {" "}
                            relovemarket006@gmail.com
                        </span>
                        .
                    </p>
                </div>

                <div className="flex items-center justify-end border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
}
