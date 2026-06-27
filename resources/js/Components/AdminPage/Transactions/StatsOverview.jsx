import { CheckCircle, Clock, DollarSign, Loader2, Wallet } from "lucide-react";

const metricCards = [
    {
        key: "totalRevenue",
        label: "Commission Revenue",
        icon: DollarSign,
        color: "text-emerald-700 bg-emerald-50 border-emerald-100",
        format: (value) => `RM ${Number(value || 0).toFixed(2)}`,
    },
    {
        key: "completedTransactions",
        label: "Completed Orders",
        icon: CheckCircle,
        color: "text-blue-700 bg-blue-50 border-blue-100",
        format: (value) => Number(value || 0),
    },
    {
        key: "pendingRelease",
        label: "Pending Release",
        icon: Clock,
        color: "text-amber-700 bg-amber-50 border-amber-100",
        format: (value) => Number(value || 0),
    },
    {
        key: "releasedPayments",
        label: "Released Payments",
        icon: Wallet,
        color: "text-indigo-700 bg-indigo-50 border-indigo-100",
        format: (value) => Number(value || 0),
    },
];

export function StatsOverview({ metrics, metricsLoading, isMobile }) {
    return (
        <div
            className={`grid gap-3 mb-6 ${
                isMobile ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-4"
            }`}
        >
            {metricCards.map(({ key, label, icon: Icon, color, format }) => (
                <div
                    key={key}
                    className={`rounded-xl border bg-white p-4 shadow-sm ${color}`}
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase text-gray-500">
                                {label}
                            </p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {metricsLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                                ) : (
                                    format(metrics?.[key])
                                )}
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                            <Icon className="h-5 w-5" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
