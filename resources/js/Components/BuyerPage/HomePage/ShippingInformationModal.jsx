export function ShippingInformationModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Shipping Information
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
                        We work with trusted couriers to deliver items safely
                        and quickly.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Standard delivery: 3-7 business days.</li>
                        <li>Express delivery: 1-3 business days.</li>
                        <li>
                            Tracking numbers are available once items are
                            shipped.
                        </li>
                        <li>Shipping fees are shown at checkout.</li>
                    </ul>
                    <p>
                        Delivery timelines may vary based on location and
                        seller availability.
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
