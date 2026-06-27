import dayjs from "dayjs";
import { CheckCircle, DollarSign, X } from "lucide-react";

export function OrderTrackingModal({
    manualReleasePayment,
    orderStatusSteps,
    selectedTransaction,
    setShowOrderTrackingModal,
}) {
    const trackingSteps =
        selectedTransaction.tracking_info?.tracking_steps || orderStatusSteps;
    const earning = selectedTransaction?.seller_earning?.[0];
    const canRelease =
        selectedTransaction?.order_status === "Completed" &&
        earning?.status === "Pending";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b border-gray-200 p-5">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">
                            Order Tracking
                        </h3>
                        <p className="font-mono text-sm text-gray-500">
                            {selectedTransaction.order_id}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowOrderTrackingModal(false)}
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-5 p-5">
                    <div className="grid gap-3 rounded-lg bg-gray-50 p-4 text-sm md:grid-cols-2">
                        <div>
                            <p className="text-xs text-gray-500">Buyer</p>
                            <p className="font-semibold text-gray-900">
                                {selectedTransaction.user?.name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Seller</p>
                            <p className="font-semibold text-gray-900">
                                {selectedTransaction.seller?.seller_name || "N/A"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="font-semibold text-gray-900">
                                {dayjs(selectedTransaction.created_at).format(
                                    "DD MMM YYYY, HH:mm"
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Payout</p>
                            <p className="font-semibold text-gray-900">
                                RM {Number(earning?.payout_amount || 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {trackingSteps.map((step, index) => {
                            const StepIcon = step.icon || CheckCircle;
                            const completed =
                                step.completed ||
                                index <=
                                    orderStatusSteps.findIndex(
                                        (item) =>
                                            item.status ===
                                            selectedTransaction.order_status
                                    );

                            return (
                                <div
                                    key={step.status}
                                    className="flex items-start gap-3"
                                >
                                    <div
                                        className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full ${
                                            completed
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        <StepIcon className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {step.status}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-200 p-5">
                    <button
                        type="button"
                        onClick={() => setShowOrderTrackingModal(false)}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                    {canRelease && (
                        <button
                            type="button"
                            onClick={() =>
                                manualReleasePayment(selectedTransaction.order_id)
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                        >
                            <DollarSign className="h-4 w-4" />
                            Release Payment
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
