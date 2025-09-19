import { useState, useEffect } from "react";
import { Sidebar } from "@/Components/Admin/Sidebar";
import { Link } from "@inertiajs/react";

export default function AdminDashboard() {
    const [timeFrame, setTimeFrame] = useState("monthly");
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Simulate data loading
    useEffect(() => {
        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const savedNotifications = localStorage.getItem("notifications");
        const savedUnreadCount = localStorage.getItem("unreadCount");

        if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
        }

        if (savedUnreadCount) {
            setUnreadCount(parseInt(savedUnreadCount));
        }

        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Save notifications and unread count to localStorage when they change
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
        localStorage.setItem("unreadCount", unreadCount.toString());
    }, [notifications, unreadCount]);

    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.channel("pending-seller-list");

        channel.listen(".SellerRegistered", (e) => {
            console.log("📢 New seller registered:", e);

            const newNotification = {
                id: Date.now(),
                seller: e.seller,
                read: false,
                timestamp: new Date().toISOString(),
            };

            setNotifications((prev) => [newNotification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Trigger browser notification
            if (Notification.permission === "granted") {
                new Notification("New Seller Registered", {
                    body: `${e.seller.business_name} just registered!`,
                    icon: "../image/shania_yan.png", // <-- your custom icon
                });
            }
        });

        return () => {
            window.Echo.leaveChannel("pending-seller-list");
        };
    }, []);

    const markAsRead = (id) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, read: true }))
        );
        setUnreadCount(0);
    };

    const clearAllNotifications = () => {
        setNotifications([]);
        setUnreadCount(0);
    };

    const formatTime = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor(
            (now - notificationTime) / (1000 * 60)
        );

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24)
            return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    };

    // Sample data - in a real app, this would come from your backend
    const dashboardData = {
        overview: {
            totalRevenue: 12486.72,
            totalOrders: 248,
            totalCustomers: 1842,
            conversionRate: 4.2,
        },
        revenueData: {
            monthly: [
                12500, 11000, 9800, 11500, 10500, 12000, 11800, 12400, 13200,
                12800, 13500, 14200,
            ],
            weekly: [1200, 1800, 1500, 2200, 1900, 2100, 2400],
            daily: [120, 180, 150, 220, 190, 210, 240],
        },
        recentActivities: [
            {
                id: 1,
                user: "John Doe",
                action: "placed an order",
                target: "Order #3245",
                time: "2 mins ago",
            },
            {
                id: 2,
                user: "Sarah Wilson",
                action: "registered as seller",
                target: "Fashion Store",
                time: "15 mins ago",
            },
            {
                id: 3,
                user: "Michael Brown",
                action: "cancelled subscription",
                target: "Pro Plan",
                time: "32 mins ago",
            },
            {
                id: 4,
                user: "Emma Johnson",
                action: "subscribed to",
                target: "Enterprise Plan",
                time: "1 hour ago",
            },
            {
                id: 5,
                user: "Robert Davis",
                action: "requested refund for",
                target: "Order #3128",
                time: "2 hours ago",
            },
        ],
        statistics: {
            sales: {
                current: 12486.72,
                previous: 11245.36,
                trend: "up",
            },
            visitors: {
                current: 5842,
                previous: 5248,
                trend: "up",
            },
            orders: {
                current: 248,
                previous: 228,
                trend: "up",
            },
            conversion: {
                current: 4.2,
                previous: 3.8,
                trend: "up",
            },
        },
        topSellers: [
            { id: 1, name: "Electronics Hub", sales: 5842, growth: 12.4 },
            { id: 2, name: "Fashion Store", sales: 4521, growth: 8.2 },
            { id: 3, name: "Home Decor", sales: 3215, growth: 5.7 },
            { id: 4, name: "Book World", sales: 2845, growth: 15.2 },
            { id: 5, name: "Sports Gear", sales: 2458, growth: -2.1 },
        ],
    };

    // Calculate percentage change
    const calculateChange = (current, previous) => {
        if (previous === 0) return 100;
        return (((current - previous) / previous) * 100).toFixed(1);
    };

    // Stats Cards Component
    const StatCard = ({ title, value, previous, trend, icon, color }) => (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center">
                <div className={`rounded-full ${color} p-3 mr-4`}>{icon}</div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className="flex items-baseline">
                        <p className="text-2xl font-bold text-gray-800">
                            {typeof value === "number"
                                ? value.toLocaleString()
                                : value}
                        </p>
                        {previous !== undefined && (
                            <span
                                className={`ml-2 text-sm font-medium ${
                                    trend === "up"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {trend === "up" ? "↑" : "↓"}{" "}
                                {calculateChange(value, previous)}%
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Mini Chart Component (simplified)
    const MiniChart = ({ data, color }) => (
        <div className="h-[40px] w-full flex items-end">
            {data.map((value, index) => {
                const height = Math.max(
                    10,
                    (value / Math.max(...data)) * 100 * 0.4
                );
                return (
                    <div
                        key={index}
                        className="flex-1 mx-0.5"
                        style={{
                            height: `${height}%`,
                            backgroundColor: color,
                            opacity: 0.7,
                        }}
                    />
                );
            })}
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar pendingCount={3} />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Dashboard Overview
                        </h1>
                        <p className="text-gray-600">
                            Welcome back, Admin! Here's what's happening with
                            your store today.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <select
                            value={timeFrame}
                            onChange={(e) => setTimeFrame(e.target.value)}
                            className="w-full text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="daily">Today</option>
                            <option value="weekly">This Week</option>
                            <option value="monthly">This Month</option>
                        </select>

                        {/* Notification Button */}
                        <div className="relative">
                            <button
                                className="p-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                onClick={() =>
                                    setIsNotificationOpen((prev) => !prev)
                                }
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C8.67 6.165 8 7.388 8 8.75V14.158c0 .538-.214 1.055-.595 1.437L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9"
                                    />
                                </svg>

                                {/* Notification Badge */}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                                    <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-800">
                                            Notifications
                                        </h3>
                                        <div className="flex space-x-2">
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Mark all as read
                                                </button>
                                            )}
                                            {notifications.length > 0 && (
                                                <button
                                                    onClick={
                                                        clearAllNotifications
                                                    }
                                                    className="text-xs text-red-600 hover:text-red-800"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">
                                                No notifications
                                            </div>
                                        ) : (
                                            <ul>
                                                {notifications.map(
                                                    (notification) => (
                                                        <li
                                                            key={
                                                                notification.id
                                                            }
                                                            className={`border-b border-gray-100 last:border-b-0 ${
                                                                notification.read
                                                                    ? "bg-gray-50"
                                                                    : "bg-white"
                                                            }`}
                                                            onClick={() =>
                                                                markAsRead(
                                                                    notification.id
                                                                )
                                                            }
                                                        >
                                                            <div className="p-3 hover:bg-gray-100 cursor-pointer">
                                                                <div className="flex items-start">
                                                                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                                                        <svg
                                                                            className="w-5 h-5 text-green-600"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={
                                                                                    2
                                                                                }
                                                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            New
                                                                            Seller
                                                                            Registration
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {
                                                                                notification
                                                                                    .seller
                                                                                    .business_name
                                                                            }{" "}
                                                                            registered
                                                                            as a
                                                                            seller
                                                                        </p>
                                                                        <p className="text-xs text-gray-400 mt-1">
                                                                            {formatTime(
                                                                                notification.timestamp
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    {!notification.read && (
                                                                        <div className="flex-shrink-0 ml-2">
                                                                            <span className="h-2 w-2 bg-indigo-500 rounded-full block"></span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}
                                    </div>

                                    {notifications.length > 0 && (
                                        <div className="p-2 border-t border-gray-200 text-center">
                                            <Link
                                                href={route(
                                                    "pending-seller-list"
                                                )}
                                                className="text-sm text-indigo-600 hover:text-indigo-800"
                                                onClick={() =>
                                                    setIsNotificationOpen(false)
                                                }
                                            >
                                                View all seller requests
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    // Loading skeleton
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="bg-white p-6 rounded-xl shadow-md"
                                >
                                    <div className="animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                                    <div className="h-64 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <div
                                                key={i}
                                                className="flex items-center"
                                            >
                                                <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard
                                title="Total Revenue"
                                value={dashboardData.statistics.sales.current}
                                previous={
                                    dashboardData.statistics.sales.previous
                                }
                                trend={dashboardData.statistics.sales.trend}
                                color="bg-green-100"
                                icon={
                                    <svg
                                        className="w-6 h-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                }
                            />

                            <StatCard
                                title="Total Orders"
                                value={dashboardData.statistics.orders.current}
                                previous={
                                    dashboardData.statistics.orders.previous
                                }
                                trend={dashboardData.statistics.orders.trend}
                                color="bg-blue-100"
                                icon={
                                    <svg
                                        className="w-6 h-6 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                }
                            />

                            <StatCard
                                title="Total Customers"
                                value={
                                    dashboardData.statistics.visitors.current
                                }
                                previous={
                                    dashboardData.statistics.visitors.previous
                                }
                                trend={dashboardData.statistics.visitors.trend}
                                color="bg-purple-100"
                                icon={
                                    <svg
                                        className="w-6 h-6 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                }
                            />

                            <StatCard
                                title="Conversion Rate"
                                value={`${dashboardData.statistics.conversion.current}%`}
                                previous={
                                    dashboardData.statistics.conversion.previous
                                }
                                trend={
                                    dashboardData.statistics.conversion.trend
                                }
                                color="bg-yellow-100"
                                icon={
                                    <svg
                                        className="w-6 h-6 text-yellow-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Main Dashboard Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            {/* Revenue Chart */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Revenue Overview
                                    </h2>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">
                                            This month
                                        </span>
                                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="h-64">
                                    {/* In a real app, you would use a charting library like Chart.js or Recharts */}
                                    <div className="h-full flex flex-col justify-between">
                                        <div className="flex-1 relative">
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                <div className="text-center">
                                                    <svg
                                                        className="w-16 h-16 mx-auto mb-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                                        />
                                                    </svg>
                                                    <p>
                                                        Revenue chart would be
                                                        displayed here
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-8">
                                            <MiniChart
                                                data={
                                                    dashboardData.revenueData[
                                                        timeFrame
                                                    ]
                                                }
                                                color="#4f46e5"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Recent Activities
                                    </h2>
                                    <Link
                                        href="#"
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {dashboardData.recentActivities.map(
                                        (activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex"
                                            >
                                                <div className="flex-shrink-0 mr-3">
                                                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <svg
                                                            className="w-5 h-5 text-indigo-600"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M13 10V3L4 14h7v7l9-11h-7z"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-800">
                                                        <span className="font-medium">
                                                            {activity.user}
                                                        </span>{" "}
                                                        {activity.action}{" "}
                                                        <span className="font-medium">
                                                            {activity.target}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Sellers */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-semibold text-gray-800">
                                        Top Sellers
                                    </h2>
                                    <Link
                                        href="#"
                                        className="text-sm text-indigo-600 hover:text-indigo-800"
                                    >
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-4">
                                    {dashboardData.topSellers.map((seller) => (
                                        <div
                                            key={seller.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        {seller.name
                                                            .split(" ")
                                                            .map(
                                                                (word) =>
                                                                    word[0]
                                                            )
                                                            .join("")}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {seller.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        $
                                                        {seller.sales.toLocaleString()}{" "}
                                                        in sales
                                                    </p>
                                                </div>
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${
                                                    seller.growth >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {seller.growth >= 0 ? "+" : ""}
                                                {seller.growth}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-white p-6 rounded-xl shadow-md">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href={route("pending-seller-list")}
                                        className="p-4 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors"
                                    >
                                        <div className="bg-indigo-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-5 h-5 text-indigo-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            Seller Requests
                                        </span>
                                    </Link>

                                    <Link
                                        href={route("list-transaction")}
                                        className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
                                    >
                                        <div className="bg-green-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-5 h-5 text-green-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            Transactions
                                        </span>
                                    </Link>

                                    <Link
                                        href={route("subscription-management")}
                                        className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
                                    >
                                        <div className="bg-purple-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-5 h-5 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            Subscriptions
                                        </span>
                                    </Link>

                                    <Link
                                        href="#"
                                        className="p-4 bg-yellow-50 rounded-lg text-center hover:bg-yellow-100 transition-colors"
                                    >
                                        <div className="bg-yellow-100 p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-5 h-5 text-yellow-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                            Users
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
