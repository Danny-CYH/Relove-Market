export function SellerDetails_Modal({
    selectedSeller,
    onApprove,
    onReject,
    onClose,
}) {
    return (
        <>
            {/* Modal for seller details */}
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>

                    {/* Header */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                        Seller Details
                    </h2>

                    {/* Seller Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                        <p>
                            <strong>Name:</strong> {selectedSeller?.name}
                        </p>
                        <p>
                            <strong>Email:</strong> {selectedSeller?.email}
                        </p>
                        <p>
                            <strong>Phone:</strong>{" "}
                            {selectedSeller?.phone_number}
                        </p>
                        <p>
                            <strong>Store Name:</strong>{" "}
                            {selectedSeller?.store_name}
                        </p>
                        <p>
                            <strong>Registration ID:</strong>{" "}
                            {selectedSeller?.registration_id}
                        </p>
                    </div>

                    {/* Store License PDF Preview */}
                    {selectedSeller?.store_license && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                Store License
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                                        PDF
                                    </span>
                                    <span className="text-gray-800">
                                        {selectedSeller.store_license}
                                    </span>
                                </div>
                                <a
                                    href={`${
                                        import.meta.env.VITE_APP_URL
                                    }/storage/${selectedSeller.store_license}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    View
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-6 flex justify-between gap-3 border-t pt-4">
                        <button
                            onClick={() => {
                                onReject();
                                onClose();
                            }}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                        >
                            Reject
                        </button>
                        <button
                            onClick={() => {
                                onApprove();
                                onClose();
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
