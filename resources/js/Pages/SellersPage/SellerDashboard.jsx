import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LineChart,
    Line,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBoxOpen,
    faCartShopping,
    faMoneyBillTrendUp,
    faEye,
    faBell,
    faCircleInfo,
    faGaugeHigh,
    faTags,
    faTruckFast,
    faSackDollar,
    faCreditCard,
    faRightFromBracket,
    faTriangleExclamation,
    faCircleCheck,
    faClock,
} from "@fortawesome/free-solid-svg-icons";

import { SellerSidebar } from "@/Components/Seller/SellerSidebar";

/* ============================================
   Small UI helpers
============================================= */
const StatCard = ({ icon, title, value, sub }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 border border-gray-100">
        <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-indigo-50 flex items-center justify-center">
                <FontAwesomeIcon icon={icon} className="text-indigo-600" />
            </div>
            <div>
                <div className="text-sm text-gray-500">{title}</div>
                <div className="text-2xl font-semibold text-gray-800">
                    {value}
                </div>
                {sub ? (
                    <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                ) : null}
            </div>
        </div>
    </div>
);

const Badge = ({ color, children }) => {
    const styles = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        yellow: "bg-yellow-100 text-yellow-700",
        red: "bg-red-100 text-red-700",
        gray: "bg-gray-100 text-gray-700",
        indigo: "bg-indigo-100 text-indigo-700",
        orange: "bg-orange-100 text-orange-700",
    }[color || "gray"];
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${styles}`}>
            {children}
        </span>
    );
};

const OrderStatusBadge = ({ status }) => {
    const map = {
        Pending: { color: "yellow", label: "Pending", icon: faClock },
        Shipped: { color: "blue", label: "Shipped", icon: faTruckFast },
        Delivered: { color: "green", label: "Delivered", icon: faCircleCheck },
        Cancelled: {
            color: "red",
            label: "Cancelled",
            icon: faTriangleExclamation,
        },
    };
    const s = map[status] || map.Pending;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
      ${s.color === "yellow" && "bg-yellow-100 text-yellow-700"}
      ${s.color === "blue" && "bg-blue-100 text-blue-700"}
      ${s.color === "green" && "bg-green-100 text-green-700"}
      ${s.color === "red" && "bg-red-100 text-red-700"}
    `}
        >
            <FontAwesomeIcon icon={s.icon} />
            {s.label}
        </span>
    );
};

const Money = ({ children }) => (
    <span className="font-semibold text-gray-800">
        RM {Number(children).toFixed(2)}
    </span>
);

/* ============================================
   Trial Modal
============================================= */
const TrialModal = ({
    isOpen,
    onClose,
    onSubscribe,
    trialDaysLeft,
    trialEndsAt,
    planUrl = "/seller/subscription",
}) => {
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-50">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100"
            >
                <div className="p-6">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faGaugeHigh}
                                className="text-indigo-600"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">
                                Welcome to your Free Trial
                            </h3>
                            <p className="text-gray-600 mt-1">
                                You have{" "}
                                <span className="font-semibold text-gray-900">
                                    {trialDaysLeft} day(s)
                                </span>{" "}
                                left. Your trial ends on{" "}
                                <span className="font-semibold text-gray-900">
                                    {new Date(trialEndsAt).toLocaleDateString()}
                                </span>
                                .
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-100 p-4">
                        <div className="text-sm text-indigo-900">
                            Upgrade now to unlock:
                        </div>
                        <ul className="list-disc pl-5 mt-2 text-sm text-indigo-900 space-y-1">
                            <li>Unlimited product listings</li>
                            <li>Priority support & faster payouts</li>
                            <li>Advanced analytics & marketing tools</li>
                        </ul>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                        By subscribing, you agree to our{" "}
                        <a
                            href="/terms"
                            className="text-indigo-600 hover:underline"
                        >
                            Terms
                        </a>{" "}
                        and{" "}
                        <a
                            href="/policy"
                            className="text-indigo-600 hover:underline"
                        >
                            Subscription Policy
                        </a>
                        .
                    </p>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Later
                        </button>
                        <button
                            onClick={() => onSubscribe(planUrl)}
                            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

/* ============================================
   Main Seller Dashboard
============================================= */
export default function SellerDashboard() {
    const [shop, setShop] = useState(null);
    const [trialDaysLeft, setTrialDaysLeft] = useState(0);
    const [showTrialModal, setShowTrialModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({});

    // Fetch your real data here
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                // Example: replace with your real backend endpoint
                // const { data } = await axios.get("/seller/dashboard/data");
                // For now, we’ll use your original dummy shape (with a couple more fields)
                const data = {
                    shop_name: "Gemilang Store",
                    trial_ends_at: "2025-08-25",
                    has_subscription: false,
                    notifications: [
                        {
                            id: 1,
                            type: "info",
                            message: "3 items are low in stock.",
                        },
                        {
                            id: 2,
                            type: "success",
                            message: "Order #INV-00821 has been paid.",
                        },
                        {
                            id: 3,
                            type: "warning",
                            message: "Trial ends in 3 days.",
                        },
                    ],
                    kpis: {
                        products: 15,
                        orders: 120,
                        earnings: 3580.75,
                        views: 8421,
                        conversionRate: 2.8,
                    },
                    orders: [
                        {
                            id: "INV-00821",
                            customer: "Ali Hasan",
                            product: "Eco-Friendly Bottle",
                            status: "Shipped",
                            paid: true,
                            date: "2025-08-01",
                            total: 120.0,
                        },
                        {
                            id: "INV-00820",
                            customer: "Siti Aisyah",
                            product: "Vintage Jeans",
                            status: "Pending",
                            paid: false,
                            date: "2025-07-31",
                            total: 89.5,
                        },
                        {
                            id: "INV-00819",
                            customer: "John Tan",
                            product: "Handmade Soap",
                            status: "Delivered",
                            paid: true,
                            date: "2025-07-30",
                            total: 58.75,
                        },
                    ],
                    salesGraph: [
                        { name: "Jan", earnings: 400, visits: 1200 },
                        { name: "Feb", earnings: 600, visits: 1500 },
                        { name: "Mar", earnings: 800, visits: 1700 },
                        { name: "Apr", earnings: 550, visits: 1600 },
                        { name: "May", earnings: 900, visits: 2100 },
                        { name: "Jun", earnings: 760, visits: 2000 },
                        { name: "Jul", earnings: 970, visits: 2400 },
                    ],
                    topProducts: [
                        { name: "Handmade Soap", units: 150, revenue: 1220 },
                        {
                            name: "Eco-Friendly Bottle",
                            units: 120,
                            revenue: 2160,
                        },
                        { name: "Vintage Jeans", units: 90, revenue: 1890 },
                    ],
                };

                if (!mounted) return;

                setShop(data);
                setKpis(data.kpis || {});
                const today = new Date();
                const trialEnd = new Date(data.trial_ends_at);
                const diffTime = trialEnd - today;
                const daysLeft = Math.max(
                    0,
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                );
                setTrialDaysLeft(daysLeft);

                // Show the modal if on trial and not subscribed
                if (daysLeft > 0 && !data.has_subscription)
                    setShowTrialModal(true);
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const trialBanner = useMemo(() => {
        if (!shop) return null;
        if (shop.has_subscription) return null;
        if (trialDaysLeft <= 0)
            return (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-700">
                        <FontAwesomeIcon icon={faTriangleExclamation} />
                        <span className="font-medium">
                            Your trial has expired. Some features are limited.
                        </span>
                    </div>
                    <a
                        href="/seller/subscription"
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-sm"
                    >
                        Subscribe Now
                    </a>
                </div>
            );

        return (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-800">
                    <FontAwesomeIcon icon={faClock} />
                    <span>
                        You have{" "}
                        <span className="font-semibold">
                            {trialDaysLeft} day(s)
                        </span>{" "}
                        left in your free trial.
                    </span>
                </div>
                <a
                    href="/seller/subscription"
                    className="px-3 py-1.5 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                >
                    Upgrade
                </a>
            </div>
        );
    }, [shop, trialDaysLeft]);

    const handleSubscribe = (url) => {
        window.location.href = url || "/seller/subscription";
    };

    if (loading || !shop) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="flex items-center gap-3 text-gray-600">
                    <span className="animate-spin h-5 w-5 inline-block rounded-full border-2 border-gray-300 border-t-gray-600" />
                    Loading dashboard…
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SellerSidebar shopName={shop.shop_name} />

            {/* Main */}
            <main className="flex-1 p-6">
                {/* Top header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {shop.shop_name}!
                        </h1>
                        <div className="text-sm text-gray-500">
                            Here’s what’s happening today.
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                            <FontAwesomeIcon
                                icon={faBell}
                                className="text-gray-600"
                            />
                            {!!shop.notifications?.length && (
                                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                                    {shop.notifications.length}
                                </span>
                            )}
                        </button>
                        <a
                            href="/seller/subscription"
                            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                        >
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="mr-2"
                            />
                            Upgrade
                        </a>
                    </div>
                </div>

                {/* Trial banner */}
                {trialBanner && <div className="mb-6">{trialBanner}</div>}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
                    <StatCard
                        icon={faBoxOpen}
                        title="Products"
                        value={kpis.products ?? 0}
                        sub="Active listings"
                    />
                    <StatCard
                        icon={faCartShopping}
                        title="Orders"
                        value={kpis.orders ?? 0}
                        sub="Total orders"
                    />
                    <StatCard
                        icon={faMoneyBillTrendUp}
                        title="Earnings"
                        value={<Money>{kpis.earnings ?? 0}</Money>}
                        sub="All-time"
                    />
                    <StatCard
                        icon={faEye}
                        title="Store Views"
                        value={kpis.views ?? 0}
                        sub={`Conversion ${kpis.conversionRate ?? 0}%`}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                    <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800">
                                Monthly Earnings
                            </div>
                            <Badge color="indigo">Last 12 months</Badge>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={shop.salesGraph}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="earnings"
                                    fill="#4f46e5"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800">
                                Store Traffic
                            </div>
                            <Badge color="blue">Visits</Badge>
                        </div>
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={shop.salesGraph}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#0ea5e9"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            title: "Add New Product",
                            desc: "Create a new listing",
                            href: "/seller/products/create",
                            color: "indigo",
                        },
                        {
                            title: "Bulk Upload CSV",
                            desc: "Upload multiple products",
                            href: "/seller/products/bulk-upload",
                            color: "blue",
                        },
                        {
                            title: "Create Discount",
                            desc: "Run a promotion",
                            href: "/seller/promotions/create",
                            color: "emerald",
                        },
                    ].map((a) => (
                        <a
                            key={a.title}
                            href={a.href}
                            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-800">
                                        {a.title}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {a.desc}
                                    </div>
                                </div>
                                <span
                                    className={`h-10 w-10 rounded-lg flex items-center justify-center
                    ${a.color === "indigo" && "bg-indigo-50 text-indigo-600"}
                    ${a.color === "blue" && "bg-sky-50 text-sky-600"}
                    ${a.color === "emerald" && "bg-emerald-50 text-emerald-600"}
                  `}
                                >
                                    <FontAwesomeIcon icon={faTags} />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Content Row: Recent Orders + Top Products */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Orders */}
                    <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-5 overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800">
                                Recent Orders
                            </div>
                            <a
                                href="/seller/orders"
                                className="text-sm text-indigo-600 hover:underline"
                            >
                                View all
                            </a>
                        </div>
                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="p-2">Order ID</th>
                                        <th className="p-2">Customer</th>
                                        <th className="p-2">Product</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Payment</th>
                                        <th className="p-2">Total</th>
                                        <th className="p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shop.orders.map((o) => (
                                        <tr key={o.id} className="border-t">
                                            <td className="p-2 font-medium text-gray-700">
                                                {o.id}
                                            </td>
                                            <td className="p-2">
                                                {o.customer}
                                            </td>
                                            <td className="p-2">{o.product}</td>
                                            <td className="p-2">
                                                <OrderStatusBadge
                                                    status={o.status}
                                                />
                                            </td>
                                            <td className="p-2">
                                                {o.paid ? (
                                                    <Badge color="green">
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge color="orange">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                <Money>{o.total}</Money>
                                            </td>
                                            <td className="p-2">{o.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Top products */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800">
                                Top Products
                            </div>
                            <Badge color="gray">
                                {shop.topProducts.length} items
                            </Badge>
                        </div>
                        <div className="space-y-3">
                            {shop.topProducts.map((p) => (
                                <div
                                    key={p.name}
                                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50"
                                >
                                    <div>
                                        <div className="font-medium text-gray-800">
                                            {p.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {p.units} units sold
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        <Money>{p.revenue}</Money>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="font-semibold text-gray-800">
                            Notifications
                        </div>
                        <a
                            href="/seller/notifications"
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            View all
                        </a>
                    </div>
                    {shop.notifications?.length ? (
                        <ul className="space-y-2">
                            {shop.notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50"
                                >
                                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                        <FontAwesomeIcon
                                            icon={
                                                n.type === "success"
                                                    ? faCircleCheck
                                                    : n.type === "warning"
                                                    ? faTriangleExclamation
                                                    : faCircleInfo
                                            }
                                            className={
                                                n.type === "success"
                                                    ? "text-green-600"
                                                    : n.type === "warning"
                                                    ? "text-yellow-600"
                                                    : "text-gray-600"
                                            }
                                        />
                                    </div>
                                    <div className="text-sm text-gray-700">
                                        {n.message}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-sm text-gray-500">
                            No notifications yet.
                        </div>
                    )}
                </div>
            </main>

            {/* Trial Modal */}
            <TrialModal
                isOpen={showTrialModal}
                onClose={() => setShowTrialModal(false)}
                onSubscribe={handleSubscribe}
                trialDaysLeft={trialDaysLeft}
                trialEndsAt={shop.trial_ends_at}
            />
        </div>
    );
}
