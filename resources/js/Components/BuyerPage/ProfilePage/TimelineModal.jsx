import dayjs from "dayjs";
import { X } from "lucide-react";

const STATUS_FLOW = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Completed",
];

const getStatusTimestamp = (order, status) => {
    const map = {
        Pending: order?.created_at,
        Processing: order?.processing_at,
        Shipped: order?.shipped_at,
        Delivered: order?.delivered_at,
        Completed: order?.completed_at,
    };

    return map[status] || order?.updated_at || order?.created_at || null;
};

export function TimelineModal({
    getOrderTotal,
    getProductImage,
    getProductName,
    getTotalItemsCount,
    timelineModal,
    setTimelineModal,
}) {
    if (!timelineModal?.isOpen) return null;

    const order = timelineModal.order || {};
    const currentIndex = Math.max(
        0,
        STATUS_FLOW.indexOf(order.order_status)
    );

    const handleClose = () =>
        setTimelineModal({ isOpen: false, order: null });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Order Timeline
                        </h2>
                        {order.order_id && (
                            <p className="text-xs text-gray-500">
                                Order ID: {order.order_id}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="grid gap-6 px-6 py-6 md:grid-cols-[1fr_280px]">
                    <div className="space-y-4">
                        {STATUS_FLOW.map((status, index) => {
                            const isActive = index <= currentIndex;
                            const timestamp = getStatusTimestamp(order, status);
                            return (
                                <div
                                    key={status}
                                    className="flex items-start gap-4"
                                >
                                    <div className="mt-1 flex flex-col items-center">
                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                isActive
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />
                                        {index < STATUS_FLOW.length - 1 && (
                                            <div
                                                className={`h-10 w-px ${
                                                    isActive
                                                        ? "bg-green-400"
                                                        : "bg-gray-200"
                                                }`}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {status}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {timestamp
                                                ? dayjs(timestamp).format(
                                                      "DD MMM YYYY, hh:mm A"
                                                  )
                                                : "Pending update"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    (import.meta.env.VITE_BASE_URL || "") +
                                    getProductImage(order)
                                }
                                alt={getProductName(order)}
                                className="h-12 w-12 rounded-lg object-cover"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {getProductName(order)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {getTotalItemsCount(order)} items
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Total</span>
                                <span className="font-semibold text-gray-900">
                                    RM {getOrderTotal(order).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Status</span>
                                <span className="font-medium text-gray-900">
                                    {order.order_status || "Pending"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
