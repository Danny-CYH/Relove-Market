export function TermsConditions({ isOpen, onClose, onAccept }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Terms & Conditions
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
                        By using Relove Market, you agree to keep your account
                        information accurate and follow all local laws and
                        marketplace guidelines.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Only list items you own and can deliver.</li>
                        <li>
                            Provide truthful descriptions, photos, and pricing.
                        </li>
                        <li>
                            Respect other users and keep communication
                            professional.
                        </li>
                        <li>
                            Payments are processed securely through approved
                            channels.
                        </li>
                    </ul>
                    <p>
                        We may update these terms at any time to protect the
                        community and the platform.
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                    <button
                        type="button"
                        onClick={onAccept}
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
