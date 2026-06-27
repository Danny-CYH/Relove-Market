import { Filter, Search, X } from "lucide-react";

export function FilterSection({
    clearAllFilters,
    dateRange,
    filter,
    hasActiveFilters,
    paymentMethodFilter,
    setDateRange,
    setFilter,
    setPaymentMethodFilter,
    setShowFilters,
    setStatusFilter,
    showFilters,
    statusFilter,
}) {
    return (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={filter}
                        onChange={(event) => setFilter(event.target.value)}
                        placeholder="Search order, buyer, or seller"
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>

                    {hasActiveFilters() && (
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                            <X className="h-4 w-4" />
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="All">All statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                        <option value="paid">Ready to release</option>
                        <option value="released">Released</option>
                    </select>

                    <select
                        value={paymentMethodFilter}
                        onChange={(event) =>
                            setPaymentMethodFilter(event.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="All">All payment methods</option>
                        <option value="card">Card</option>
                        <option value="stripe">Stripe</option>
                        <option value="cash">Cash</option>
                    </select>

                    <input
                        type="date"
                        value={dateRange.start}
                        onChange={(event) =>
                            setDateRange({
                                ...dateRange,
                                start: event.target.value,
                            })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    />

                    <input
                        type="date"
                        value={dateRange.end}
                        onChange={(event) =>
                            setDateRange({
                                ...dateRange,
                                end: event.target.value,
                            })
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
            )}
        </div>
    );
}
