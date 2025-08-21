import { usePage } from "@inertiajs/react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import echo from "../../echo.js"; // optional real-time
import { format } from "date-fns";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { Sidebar } from "@/Components/Admin/Sidebar";

/* ----------------------- Small UI helpers ----------------------- */
function StatCard({ label, value, sub, accent = "indigo" }) {
    const accentMap = {
        indigo: "text-indigo-600 bg-indigo-50",
        emerald: "text-emerald-600 bg-emerald-50",
        sky: "text-sky-600 bg-sky-50",
        amber: "text-amber-600 bg-amber-50",
    };
    return (
        <div className="bg-white p-4 rounded-xl shadow-md border">
            <div className="text-sm text-gray-500">{label}</div>
            <div
                className={`mt-1 text-2xl font-extrabold ${
                    accentMap[accent] || ""
                } inline-block px-2 py-1 rounded-lg`}
            >
                {value}
            </div>
            {sub ? (
                <div className="text-xs text-gray-500 mt-2">{sub}</div>
            ) : null}
        </div>
    );
}

function Badge({ children, color = "yellow" }) {
    const map = {
        yellow: "bg-yellow-100 text-yellow-800",
        green: "bg-green-100 text-green-800",
        red: "bg-red-100 text-red-800",
        gray: "bg-gray-100 text-gray-800",
        blue: "bg-blue-100 text-blue-800",
    };
    return (
        <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                map[color] || map.gray
            }`}
        >
            {children}
        </span>
    );
}

function Modal({ title, onClose, children, maxW = "max-w-2xl" }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div
                className={`bg-white rounded-xl shadow-xl w-full ${maxW} border`}
            >
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full hover:bg-gray-100 grid place-items-center text-gray-600"
                    >
                        ✕
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

function Toast({ show, type = "success", message, onClose }) {
    if (!show) return null;
    const typeMap = {
        success: "bg-emerald-50 text-emerald-700 border-emerald-300",
        error: "bg-red-50 text-red-700 border-red-300",
        info: "bg-sky-50 text-sky-700 border-sky-300",
    };
    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div
                className={`rounded-lg border shadow px-4 py-3 ${typeMap[type]}`}
            >
                <div className="flex items-start gap-3">
                    <div className="text-xl">
                        {type === "success"
                            ? "✅"
                            : type === "error"
                            ? "❌"
                            : "ℹ️"}
                    </div>
                    <div className="text-sm">{message}</div>
                    <button
                        onClick={onClose}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ----------------------- Main Component ----------------------- */
export default function AdminDashboard() {
    const { props } = usePage();
    const { list_sellerRegistration = [] } = props;
    const flash = props.flash || {};

    const [metrics, setMetrics] = useState(null);

    // seller list (we keep local copy so we can update immediately after approve/reject)
    const [sellers, setSellers] = useState(list_sellerRegistration || []);
    const [search, setSearch] = useState("");

    // modals
    const [viewSeller, setViewSeller] = useState(null);
    const [approveSeller, setApproveSeller] = useState(null);
    const [rejectSeller, setRejectSeller] = useState(null);
    const [rejectReason, setRejectReason] = useState("");

    // UX state
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState({
        show: false,
        type: "success",
        message: "",
    });

    // Revenue chart (demo data; replace with your API if needed)
    const chartData = useMemo(
        () => [
            { name: "Jan", revenue: 1200 },
            { name: "Feb", revenue: 2100 },
            { name: "Mar", revenue: 800 },
            { name: "Apr", revenue: 1600 },
            { name: "May", revenue: 2400 },
            { name: "Jun", revenue: 3000 },
        ],
        []
    );

    // Recent activity (demo content)
    const [recent, setRecent] = useState([
        {
            id: 1,
            type: "payment",
            text: "RM 129.00 subscription payment received",
            at: "2025-08-12 10:24",
        },
        {
            id: 2,
            type: "seller",
            text: "New seller application from Nur Aisyah",
            at: "2025-08-12 09:10",
        },
        {
            id: 3,
            type: "order",
            text: "Order #INV-1042 refunded (RM 45.00)",
            at: "2025-08-11 17:28",
        },
    ]);

    // metrics (demo: compute from props)
    useEffect(() => {
        setMetrics({
            totalUsers: 2450,
            totalTransactions: 892,
            pendingSellers: (props.list_sellerRegistration || []).length,
            revenue: 15780.25,
        });
    }, [props.list_sellerRegistration]);

    // keep sellers in sync with props
    useEffect(() => {
        setSellers(list_sellerRegistration || []);
    }, [list_sellerRegistration]);

    // Laravel Echo (optional) – refresh seller list in real-time when someone registers
    useEffect(() => {
        if (!window?.Echo) return;
        const channel = window.Echo.channel("pending-seller-list");
        channel.listen(".SellerRegistered", async () => {
            try {
                const res = await axios.get("/admin/dashboard/list"); // your existing endpoint
                setSellers(res.data?.data || res.data || []);
            } catch (e) {
                console.error("Failed to refresh sellers:", e);
            }
        });
        return () => {
            try {
                window.Echo.leaveChannel("pending-seller-list");
            } catch {}
        };
    }, []);

    // show flash success as toast (if redirected back with Inertia flashes)
    useEffect(() => {
        if (flash?.successMessage) {
            setToast({
                show: true,
                type: "success",
                message: flash.successMessage,
            });
        }
        if (flash?.errorMessage) {
            setToast({
                show: true,
                type: "error",
                message: flash.errorMessage,
            });
        }
    }, [flash]);

    const filteredSellers = useMemo(() => {
        if (!search.trim()) return sellers;
        const q = search.toLowerCase();
        return sellers.filter((s) =>
            [s.name, s.email, s.store_name, s?.business?.business_type]
                .filter(Boolean)
                .some((f) => String(f).toLowerCase().includes(q))
        );
    }, [sellers, search]);

    const handleAction = async (registrationId, action, reason = "") => {
        setSubmitting(true);
        try {
            const res = await axios.post(
                `/admin/pending-seller/${registrationId}/action`,
                {
                    action,
                    reason,
                }
            );

            // optimistic update: remove from pending
            setSellers((prev) =>
                prev.filter((s) => s.registration_id !== registrationId)
            );

            setToast({
                show: true,
                type: "success",
                message:
                    res?.data?.successMessage ||
                    "Action completed successfully.",
            });

            // close ONLY the modal we used
            setApproveSeller(null);
            setRejectSeller(null);
            setRejectReason("");
            setViewSeller(null);
        } catch (error) {
            console.error(error);
            setToast({
                show: true,
                type: "error",
                message:
                    error?.response?.data?.message || "Something went wrong.",
            });
            // keep modal open so admin can retry
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="p-6 font-bold text-lg text-indigo-700">
                    Admin Panel
                </div>
                <Sidebar />
            </aside>

            {/* Main */}
            <main className="flex-1 p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>
                    <div className="flex gap-2">
                        <a
                            href="/admin/transactions"
                            className="px-3 py-2 text-sm bg-white border rounded-lg shadow hover:bg-gray-50"
                        >
                            View Transactions
                        </a>
                        <a
                            href="/admin/subscriptions"
                            className="px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                        >
                            Manage Subscriptions
                        </a>
                    </div>
                </div>

                {/* KPI Cards */}
                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StatCard
                            label="Total Users"
                            value={metrics.totalUsers}
                            accent="sky"
                        />
                        <StatCard
                            label="Transactions"
                            value={metrics.totalTransactions}
                            accent="emerald"
                        />
                        <StatCard
                            label="Pending Sellers"
                            value={metrics.pendingSellers}
                            accent="amber"
                        />
                        <StatCard
                            label="Revenue (RM)"
                            value={`RM ${metrics.revenue.toFixed(2)}`}
                            accent="indigo"
                        />
                    </div>
                )}

                {/* Revenue Chart + Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white shadow p-6 rounded-xl border lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            Monthly Revenue Overview
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="revenue"
                                    fill="#4F46E5"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white shadow p-6 rounded-xl border">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            {recent.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-3"
                                >
                                    <div className="text-xl">
                                        {item.type === "payment"
                                            ? "💳"
                                            : item.type === "seller"
                                            ? "🧑‍💼"
                                            : "🧾"}
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-gray-800">
                                            {item.text}
                                        </div>
                                        <div className="text-gray-500 text-xs">
                                            {item.at}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <a
                                href="/admin/logs"
                                className="text-indigo-600 text-sm hover:underline"
                            >
                                View all logs
                            </a>
                        </div>
                    </div>
                </div>

                {/* Pending Sellers */}
                <div className="bg-white rounded-xl shadow p-6 border">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Pending Seller Approvals
                        </h2>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search by name/email/store/type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border rounded-lg px-3 py-2 text-sm w-full md:w-72"
                            />
                            <button
                                onClick={async () => {
                                    // manual refresh from your existing endpoint
                                    try {
                                        const res = await axios.get(
                                            "/admin/dashboard/list"
                                        );
                                        setSellers(
                                            res.data?.data || res.data || []
                                        );
                                    } catch (e) {
                                        setToast({
                                            show: true,
                                            type: "error",
                                            message: "Failed to refresh list.",
                                        });
                                    }
                                }}
                                className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Store</th>
                                    <th className="p-3">Business Type</th>
                                    <th className="p-3">Applied At</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSellers.length ? (
                                    filteredSellers.map((seller) => (
                                        <tr
                                            key={seller.registration_id}
                                            className="border-b hover:bg-gray-50"
                                        >
                                            <td className="p-3 text-gray-800">
                                                {seller.name}
                                            </td>
                                            <td className="p-3">
                                                {seller.email}
                                            </td>
                                            <td className="p-3">
                                                {seller.phone_number || "-"}
                                            </td>
                                            <td className="p-3">
                                                {seller.store_name}
                                            </td>
                                            <td className="p-3">
                                                {seller?.business
                                                    ?.business_type || "N/A"}
                                            </td>
                                            <td className="p-3">
                                                {seller.created_at
                                                    ? format(
                                                          new Date(
                                                              seller.created_at
                                                          ),
                                                          "dd MMM yyyy, hh:mm a"
                                                      )
                                                    : "N/A"}
                                            </td>
                                            <td className="p-3">
                                                <Badge color="yellow">
                                                    {seller.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setViewSeller(
                                                                seller
                                                            )
                                                        }
                                                        className="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-100"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setApproveSeller(
                                                                seller
                                                            )
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setRejectSeller(
                                                                seller
                                                            )
                                                        }
                                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            className="p-6 text-center text-gray-500"
                                            colSpan={8}
                                        >
                                            No pending registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* View Seller Modal */}
                {viewSeller && (
                    <Modal
                        title="Seller Application Details"
                        onClose={() => setViewSeller(null)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    Applicant
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="text-gray-500">
                                            Name:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Email:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.email}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Phone:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.phone_number || "-"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Registration ID:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.registration_id}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    Store
                                </h4>
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="text-gray-500">
                                            Name:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.store_name}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Business Type:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller?.business
                                                ?.business_type || "N/A"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">
                                            Applied At:
                                        </span>{" "}
                                        <span className="text-gray-800">
                                            {viewSeller.created_at
                                                ? format(
                                                      new Date(
                                                          viewSeller.created_at
                                                      ),
                                                      "dd MMM yyyy, hh:mm a"
                                                  )
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* PDF / License */}
                        {viewSeller?.store_license && (
                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                    Store License
                                </h4>
                                <div className="flex items-center justify-between p-3 rounded border bg-gray-50">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded">
                                            PDF
                                        </span>
                                        <span className="text-gray-700 text-sm break-all">
                                            {viewSeller.store_license}
                                        </span>
                                    </div>
                                    <a
                                        href={`${
                                            import.meta.env.VITE_APP_URL
                                        }/storage/${viewSeller.store_license}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setViewSeller(null)}
                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setApproveSeller(viewSeller);
                                    setViewSeller(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => {
                                    setRejectSeller(viewSeller);
                                    setViewSeller(null);
                                }}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            >
                                Reject
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Approve Modal */}
                {approveSeller && (
                    <Modal
                        title="Approve Seller"
                        onClose={() =>
                            submitting ? null : setApproveSeller(null)
                        }
                        maxW="max-w-md"
                    >
                        <p className="text-sm text-gray-700">
                            Are you sure you want to approve{" "}
                            <span className="font-semibold">
                                {approveSeller.name}
                            </span>
                            ?
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setApproveSeller(null)}
                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleAction(
                                        approveSeller.registration_id,
                                        "Approved"
                                    )
                                }
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                                disabled={submitting}
                            >
                                {submitting ? "Approving..." : "Approve"}
                            </button>
                        </div>
                    </Modal>
                )}

                {/* Reject Modal */}
                {rejectSeller && (
                    <Modal
                        title="Reject Seller"
                        onClose={() =>
                            submitting ? null : setRejectSeller(null)
                        }
                        maxW="max-w-lg"
                    >
                        <p className="text-sm text-gray-700">
                            Are you sure you want to reject{" "}
                            <span className="font-semibold">
                                {rejectSeller.name}
                            </span>
                            ?
                        </p>

                        <div className="mt-4">
                            <label
                                htmlFor="rejectionReason"
                                className="block text-sm text-gray-700 mb-2"
                            >
                                Reason for rejection (optional)
                            </label>
                            <textarea
                                id="rejectionReason"
                                rows={5}
                                value={rejectReason}
                                onChange={(e) =>
                                    setRejectReason(e.target.value)
                                }
                                placeholder="Enter a helpful, actionable reason for the seller…"
                                className="w-full border rounded-lg p-3 text-sm"
                            />
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setRejectSeller(null)}
                                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleAction(
                                        rejectSeller.registration_id,
                                        "Rejected",
                                        rejectReason
                                    )
                                }
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
                                disabled={submitting}
                            >
                                {submitting ? "Rejecting..." : "Reject"}
                            </button>
                        </div>
                    </Modal>
                )}
            </main>

            {/* Toast */}
            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((t) => ({ ...t, show: false }))}
            />
        </div>
    );
}