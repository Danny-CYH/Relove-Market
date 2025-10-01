export default function Delete_Subscriptions_Modal({
    onClose,
    onConfirm,
    loading,
    selectedSubscription,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Delete Subscription Plan
                    </h3>
                </div>
                <div className="p-6">
                    <p className="text-gray-600 mb-4">
                        Are you sure you want to delete the subscription plan{" "}
                        <strong>"{selectedSubscription?.plan_name}"</strong>?
                        This action cannot be undone and all associated data
                        will be permanently removed.
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete Plan"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
