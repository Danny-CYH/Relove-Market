import dayjs from "dayjs";
import { DollarSign, Eye, RefreshCw } from "lucide-react";

export function TransactionRow({
    actionLoading,
    manualReleasePayment,
    showOrderTracking,
    transaction,
}) {
    const earning = transaction?.seller_earning?.[0];
    const canRelease =
        transaction?.order_status === "Completed" && earning?.status === "Pending";

    return (
        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="font-mono text-sm font-semibold text-gray-900">
                        {transaction.order_id}
                    </p>
                    <p className="truncate text-sm text-gray-600">
                        {transaction.user?.name || "Unknown buyer"} to{" "}
                        {transaction.seller?.seller_name || "Unknown seller"}
                    </p>
                    <p className="text-xs text-gray-400">
                        {dayjs(transaction.created_at).format(
                            "DD MMM YYYY, HH:mm"
                        )}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => showOrderTracking(transaction)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    title="Track order"
                >
                    <Eye className="h-4 w-4" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                    <p className="text-xs text-gray-500">Payout</p>
                    <p className="font-semibold text-gray-900">
                        RM {Number(earning?.payout_amount || 0).toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="font-semibold text-gray-900">
                        {earning?.status || "N/A"}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Order</p>
                    <p className="font-semibold text-gray-900">
                        {transaction.order_status}
                    </p>
                </div>
                <div className="flex items-end justify-end">
                    {canRelease && (
                        <button
                            type="button"
                            onClick={() =>
                                manualReleasePayment(transaction.order_id)
                            }
                            disabled={actionLoading === transaction.order_id}
                            className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
                        >
                            {actionLoading === transaction.order_id ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                            ) : (
                                <DollarSign className="h-3 w-3" />
                            )}
                            Release
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
