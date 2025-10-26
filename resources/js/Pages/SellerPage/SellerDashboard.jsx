import React, { useEffect, useMemo, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import {
    faBoxOpen,
    faCartShopping,
    faMoneyBillTrendUp,
    faBell,
    faTags,
    faCreditCard,
    faMoneyCheck,
    faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { StatCard } from "@/Components/SellerPage/SellerDashboard/StatCard";
import { TrialModal } from "@/Components/SellerPage/SellerDashboard/TrialModal";
import { OrderStatusBadge } from "@/Components/SellerPage/SellerDashboard/OrderStatusBadge";
import { Badge } from "@/Components/SellerPage/SellerDashboard/Badge";
import { Money } from "@/Components/SellerPage/SellerDashboard/Money";
import { TrialBanner } from "@/Components/SellerPage/SellerDashboard/TrialBanner";
import { NotificationDropdown } from "@/Components/SellerPage/SellerDashboard/NotificationDropdown";

import axios from "axios";

import { Link, usePage } from "@inertiajs/react";

export default function SellerDashboard() {
    const [sellerData, setSellerData] = useState([]);
    const [shop, setShop] = useState(null);
    const [trialDaysLeft, setTrialDaysLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [kpis, setKpis] = useState({});
    const [realTimeOrders, setRealTimeOrders] = useState([]);
    const [orderData, setOrderData] = useState([]);
    const [subscriptionLoading, setSubscriptionLoading] = useState(true);
    const [showTrialModal, setShowTrialModal] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [newOrders, setNewOrders] = useState(new Set());
    const [showNewOrderBadge, setShowNewOrderBadge] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationDropdown, setShowNotificationDropdown] =
        useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState(null);
    const [listedProducts, setListedProducts] = useState([]);
    const [timeFilter, setTimeFilter] = useState("monthly"); // 'daily', 'monthly', 'yearly'

    const { auth } = usePage().props;

    // Function to show notification - FIXED: Use useCallback to prevent recreation
    const showNotification = useCallback((message, type = "info") => {
        const newNotification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date(),
        };

        setNotifications((prev) => [newNotification, ...prev].slice(0, 20));
        setNotificationCount((prev) => prev + 1);

        // Auto-remove notification after 8 seconds
        setTimeout(() => {
            setNotifications((prev) =>
                prev.filter((n) => n.id !== newNotification.id)
            );
            setNotificationCount((prev) => Math.max(0, prev - 1));
        }, 8000);
    }, []);

    // Fetch subscription status
    const fetchSubscriptionStatus = async () => {
        try {
            setSubscriptionLoading(true);
            const response = await axios.get("/api/seller-subscriptions");

            const sellerSubscription = response.data.seller;
            const sellerSubscription_status = response.data.seller.status;

            setSubscriptionStatus(sellerSubscription);

            if (
                sellerSubscription.subscription_plan_id === "PLAN-TRIAL" &&
                sellerSubscription_status !== "active"
            ) {
                setTimeout(() => {
                    setShowTrialModal(true);
                }, 1500);
            }

            // Calculate trial days left
            if (sellerSubscription?.end_date) {
                const today = new Date();
                const trialEnd = new Date(sellerSubscription.end_date);
                const diffTime = trialEnd - today;
                const daysLeft = Math.max(
                    0,
                    Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                );
                setTrialDaysLeft(daysLeft);
            }
        } catch (error) {
            console.error("Error fetching subscription:", error);
        } finally {
            setSubscriptionLoading(false);
        }
    };

    // Check if seller has active subscription (not trial)
    const hasActiveSubscription = useMemo(() => {
        if (!subscriptionStatus) return false;

        return (
            subscriptionStatus.subscription_plan_id !== "PLAN-TRIAL" &&
            subscriptionStatus.status === "active"
        );
    }, [subscriptionStatus]);

    // CALCULATE EARNINGS BASED ON TIME FILTER
    const calculateEarnings = useCallback((orders, filterType) => {
        if (!orders || !Array.isArray(orders)) return 0;

        const currentDate = new Date();

        const filteredOrders = orders.filter((order) => {
            if (!order.created_at || !order.amount) return false;

            const orderDate = new Date(order.created_at);

            switch (filterType) {
                case "daily":
                    return (
                        orderDate.getDate() === currentDate.getDate() &&
                        orderDate.getMonth() === currentDate.getMonth() &&
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                case "monthly":
                    return (
                        orderDate.getMonth() === currentDate.getMonth() &&
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                case "yearly":
                    return (
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                default:
                    return false;
            }
        });

        return filteredOrders.reduce((sum, order) => {
            const orderAmount = parseFloat(order.amount) || 0;
            return sum + orderAmount;
        }, 0);
    }, []);

    // CALCULATE ORDERS BASED ON TIME FILTER
    const calculateOrders = useCallback((orders, filterType) => {
        if (!orders || !Array.isArray(orders)) return 0;

        const currentDate = new Date();

        const filteredOrders = orders.filter((order) => {
            if (!order.created_at) return false;

            const orderDate = new Date(order.created_at);

            switch (filterType) {
                case "daily":
                    return (
                        orderDate.getDate() === currentDate.getDate() &&
                        orderDate.getMonth() === currentDate.getMonth() &&
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                case "monthly":
                    return (
                        orderDate.getMonth() === currentDate.getMonth() &&
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                case "yearly":
                    return (
                        orderDate.getFullYear() === currentDate.getFullYear()
                    );
                default:
                    return false;
            }
        });

        return filteredOrders.length;
    }, []);

    // CALCULATE STORE TRAFFIC
    const calculateStoreTraffic = useCallback((orders, products) => {
        const totalOrders = orders?.length || 0;
        const estimatedConversionRate = 0.02;
        const estimatedTraffic = Math.round(
            totalOrders / estimatedConversionRate
        );

        const totalProductViews =
            products?.reduce((sum, product) => {
                return sum + (product.views || 0);
            }, 0) || 0;

        return totalProductViews > 0 ? totalProductViews : estimatedTraffic;
    }, []);

    // CALCULATE CONVERSION RATE
    const calculateConversionRate = useCallback((orders, traffic) => {
        if (!traffic || traffic === 0) return 0;

        const totalOrders = orders?.length || 0;
        const conversionRate = (totalOrders / traffic) * 100;
        return parseFloat(conversionRate.toFixed(2));
    }, []);

    // CALCULATE TOTAL ORDERS
    const calculateTotalOrders = useCallback((orders) => {
        return orders?.length || 0;
    }, []);

    // CALCULATE ALL KPIs - FIXED: Use useCallback
    const calculateAllKPIs = useCallback(
        (orders, products, filterType = "monthly") => {
            const earnings = calculateEarnings(orders, filterType);
            const ordersCount = calculateOrders(orders, filterType);
            const storeTraffic = calculateStoreTraffic(orders, products);
            const totalOrders = calculateTotalOrders(orders);
            const conversionRate = calculateConversionRate(
                orders,
                storeTraffic
            );
            const totalProducts = products?.length || 0;

            return {
                earnings,
                ordersCount,
                storeTraffic,
                totalOrders,
                conversionRate,
                totalProducts,
            };
        },
        [
            calculateEarnings,
            calculateOrders,
            calculateStoreTraffic,
            calculateConversionRate,
            calculateTotalOrders,
        ]
    );

    // Clear new order badge when user views orders
    const handleViewOrders = () => {
        setShowNewOrderBadge(false);
        setNewOrders(new Set());
    };

    useEffect(() => {
        fetchSubscriptionStatus();
    }, []);

    // Real-time order updates with Echo - COMPLETELY FIXED VERSION
    useEffect(() => {
        if (!auth?.user?.seller_id || !window.Echo) {
            console.log("Echo not available or seller_id missing");
            return;
        }

        const channel = window.Echo.private(
            `seller.orders.${auth.user.seller_id}`
        );

        // FIXED: Consistent event names - use WITH dot prefix for both
        channel.listen(".new.order.created", (e) => {
            console.log("✅ Real-time new order received:", e);

            const newOrder = e.order;
            const orderId = newOrder.order_id;

            // Add to new orders set
            setNewOrders((prev) => {
                const newSet = new Set(prev);
                newSet.add(orderId);
                return newSet;
            });

            // Show new order badge
            setShowNewOrderBadge(true);

            // Create detailed notification message
            const productName =
                newOrder.product?.product_name || "Unknown Product";
            const customerName = newOrder.user?.name || "Unknown Customer";
            const orderAmount = newOrder.amount
                ? `RM ${newOrder.amount}`
                : "N/A";

            const notificationMessage = `🆕 New Order #${orderId}\n${productName}\nFrom: ${customerName}\nAmount: ${orderAmount}`;

            // Add notification
            showNotification(notificationMessage, "success");

            // Update recent orders by prepending the new order
            setRealTimeOrders((prev) => {
                const updatedOrders = [newOrder, ...prev];
                return updatedOrders.slice(0, 5);
            });

            // Update order data for charts - FIXED: Use functional update
            setOrderData((prev) => [newOrder, ...prev]);

            // Update KPIs - FIXED: Calculate from updated state
            setKpis((prev) => {
                const updatedOrders = [newOrder, ...orderData];
                const products = sellerData?.product || [];
                return calculateAllKPIs(updatedOrders, products, timeFilter);
            });

            console.log("📊 Charts updated with new order data");
        });

        // Listen for order updates - FIXED: Use dot prefix
        channel.listen(".order.updated", (e) => {
            console.log("🔄 Order updated:", e);

            const updatedOrder = e.order;

            // Update in realTimeOrders
            setRealTimeOrders((prev) =>
                prev.map((order) =>
                    order.order_id === updatedOrder.order_id
                        ? updatedOrder
                        : order
                )
            );

            // Update in orderData
            setOrderData((prev) =>
                prev.map((order) =>
                    order.order_id === updatedOrder.order_id
                        ? updatedOrder
                        : order
                )
            );

            // Recalculate KPIs after order update
            setKpis((prev) => {
                const products = sellerData?.product || [];
                return calculateAllKPIs(orderData, products, timeFilter);
            });

            showNotification(
                `📦 Order #${updatedOrder.order_id} status updated to ${updatedOrder.order_status}`,
                "info"
            );
        });

        return () => {
            channel.stopListening(".new.order.created");
            channel.stopListening(".order.updated");
            window.Echo.leaveChannel(`seller.orders.${auth.user.seller_id}`);
        };
    }, [
        auth?.user?.seller_id,
        sellerData,
        showNotification,
        calculateAllKPIs,
        timeFilter,
    ]); // FIXED: Removed orderData dependency

    // Fetch listed products for subscribed sellers
    useEffect(() => {
        if (hasActiveSubscription && sellerData?.seller_store?.store_id) {
            const fetchListedProducts = async () => {
                try {
                    const response = await axios.get(
                        "/api/seller/featured-products"
                    );

                    setListedProducts(response.data.featured_products || []);
                } catch (error) {
                    console.error("Error fetching listed products:", error);
                    setListedProducts([]);
                }
            };

            fetchListedProducts();
        }
    }, [hasActiveSubscription, sellerData?.seller_store?.store_id]);

    // GENERATE EARNINGS CHART DATA BASED ON TIME FILTER
    const generateEarningsChartData = useCallback((orders, filterType) => {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        switch (filterType) {
            case "daily":
                // Last 7 days
                const days = [];
                for (let i = 6; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    days.push({
                        name: date.toLocaleDateString("en-US", {
                            weekday: "short",
                        }),
                        fullDate: date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        }),
                        date: new Date(date),
                    });
                }

                return days.map((day) => {
                    const dayOrders =
                        orders?.filter((order) => {
                            if (!order.created_at || !order.amount)
                                return false;
                            const orderDate = new Date(order.created_at);
                            return (
                                orderDate.getDate() === day.date.getDate() &&
                                orderDate.getMonth() === day.date.getMonth() &&
                                orderDate.getFullYear() ===
                                    day.date.getFullYear()
                            );
                        }) || [];

                    const earnings = dayOrders.reduce((sum, order) => {
                        const orderAmount = parseFloat(order.amount) || 0;
                        return sum + orderAmount;
                    }, 0);

                    const ordersCount = dayOrders.length;

                    return {
                        name: day.name,
                        fullName: day.fullDate,
                        earnings: parseFloat(earnings.toFixed(2)),
                        orders: ordersCount,
                    };
                });

            case "monthly":
                // Last 6 months
                const months = [];
                for (let i = 5; i >= 0; i--) {
                    const date = new Date();
                    date.setMonth(date.getMonth() - i);
                    months.push({
                        name: date.toLocaleDateString("en-US", {
                            month: "short",
                        }),
                        fullName: date.toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        }),
                        month: date.getMonth(),
                        year: date.getFullYear(),
                    });
                }

                return months.map((month) => {
                    const monthOrders =
                        orders?.filter((order) => {
                            if (!order.created_at || !order.amount)
                                return false;
                            const orderDate = new Date(order.created_at);
                            return (
                                orderDate.getMonth() === month.month &&
                                orderDate.getFullYear() === month.year
                            );
                        }) || [];

                    const earnings = monthOrders.reduce((sum, order) => {
                        const orderAmount = parseFloat(order.amount) || 0;
                        return sum + orderAmount;
                    }, 0);

                    const ordersCount = monthOrders.length;

                    return {
                        name: month.name,
                        fullName: month.fullName,
                        earnings: parseFloat(earnings.toFixed(2)),
                        orders: ordersCount,
                    };
                });

            case "yearly":
                // Last 5 years
                const years = [];
                for (let i = 4; i >= 0; i--) {
                    const year = currentYear - i;
                    years.push({
                        name: year.toString(),
                        fullName: year.toString(),
                        year: year,
                    });
                }

                return years.map((yearData) => {
                    const yearOrders =
                        orders?.filter((order) => {
                            if (!order.created_at || !order.amount)
                                return false;
                            const orderDate = new Date(order.created_at);
                            return orderDate.getFullYear() === yearData.year;
                        }) || [];

                    const earnings = yearOrders.reduce((sum, order) => {
                        const orderAmount = parseFloat(order.amount) || 0;
                        return sum + orderAmount;
                    }, 0);

                    const ordersCount = yearOrders.length;

                    return {
                        name: yearData.name,
                        fullName: yearData.fullName,
                        earnings: parseFloat(earnings.toFixed(2)),
                        orders: ordersCount,
                    };
                });

            default:
                return [];
        }
    }, []);

    // Update KPIs when time filter changes
    useEffect(() => {
        if (orderData.length > 0) {
            const products = sellerData?.product || [];
            const updatedKPIs = calculateAllKPIs(
                orderData,
                products,
                timeFilter
            );
            setKpis(updatedKPIs);
        }
    }, [timeFilter, orderData, sellerData, calculateAllKPIs]);

    // Fetch initial data
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const { data } = await axios.get("/api/getData-dashboard");

                if (!mounted) return;

                setSellerData(data.seller_storeInfo[0]);
                setShop(data);

                const orders = data.order_data || [];
                const products = data.seller_storeInfo[0]?.product || [];

                const calculatedKPIs = calculateAllKPIs(
                    orders,
                    products,
                    timeFilter
                );
                setKpis(calculatedKPIs);
                setRealTimeOrders(orders);
                setOrderData(orders);

                if (data.trial_ends_at) {
                    const today = new Date();
                    const trialEnd = new Date(data.trial_ends_at);
                    const diffTime = trialEnd - today;
                    const daysLeft = Math.max(
                        0,
                        Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    );
                    setTrialDaysLeft(daysLeft);
                }
            } catch (e) {
                console.error("Error fetching dashboard data:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [calculateAllKPIs, timeFilter]);

    const handleStartTrial = async () => {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 7);

        const startDateISO = startDate.toISOString();
        const endDateISO = endDate.toISOString();

        const trialData = {
            status: "active",
            start_date: startDateISO,
            end_date: endDateISO,
        };

        try {
            const response = await axios.post("/api/start-trial", trialData);
            console.log("Trial started:", response.data);
            setShowTrialModal(false);
            // Refresh subscription status
            fetchSubscriptionStatus();
            alert(
                "Free trial started successfully! Enjoy your 7-day trial period."
            );
        } catch (error) {
            console.error("Failed to start trial:", error);
            alert("Failed to start free trial. Please try again.");
        }
    };

    const handleSubscribe = (url) => {
        window.location.href = url || "/seller-manage-subscription";
    };

    // Generate chart data with real order data and time filter
    const earningsChartData = useMemo(() => {
        return generateEarningsChartData(orderData, timeFilter);
    }, [orderData, timeFilter, generateEarningsChartData]);

    // Custom tooltip formatter for the charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const dataPoint = earningsChartData.find(
                (item) => item.name === label
            );
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-800">
                        {dataPoint?.fullName || label}
                    </p>
                    {payload.map((entry, index) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name === "earnings"
                                ? "Earnings: "
                                : "Orders: "}
                            <span className="font-medium">
                                {entry.name === "earnings"
                                    ? `RM ${entry.value}`
                                    : entry.value}
                            </span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Get filter display name
    const getFilterDisplayName = (filter) => {
        switch (filter) {
            case "daily":
                return "Daily";
            case "monthly":
                return "Monthly";
            case "yearly":
                return "Yearly";
            default:
                return "Monthly";
        }
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
            <SellerSidebar shopName={sellerData.seller_store?.store_name} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 md:ml-0">
                {/* Top header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-3">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                            Welcome back, {sellerData.seller_name || ""}!
                        </h1>
                        <div className="text-sm text-gray-500">
                            Here's what's happening today.
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto relative">
                        {/* Notification Bell with Dropdown */}
                        <div className="relative">
                            <button
                                className="relative p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                                onClick={() =>
                                    setShowNotificationDropdown(
                                        !showNotificationDropdown
                                    )
                                }
                            >
                                <FontAwesomeIcon
                                    icon={faBell}
                                    className="text-gray-600"
                                />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification dropdown components */}
                            <NotificationDropdown
                                notifications={notifications}
                                showNotificationDropdown={
                                    showNotificationDropdown
                                }
                                setNotifications={setNotifications}
                                setShowNotificationDropdown={
                                    setShowNotificationDropdown
                                }
                            />
                        </div>

                        <Link
                            href={route("seller-manage-subscription")}
                            className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm whitespace-nowrap"
                        >
                            <FontAwesomeIcon
                                icon={faCreditCard}
                                className="mr-2"
                            />
                            Upgrade
                        </Link>
                    </div>
                </div>

                {/* Trial banner */}
                <TrialBanner
                    seller={auth.seller}
                    trialDaysLeft={trialDaysLeft}
                />

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <StatCard
                        icon={faBoxOpen}
                        title="Products"
                        value={kpis.totalProducts || 0}
                        sub="Active listings"
                    />
                    <StatCard
                        icon={faCartShopping}
                        title="Orders"
                        value={kpis.ordersCount || 0}
                        sub={`${getFilterDisplayName(timeFilter)} orders`}
                    />
                    <StatCard
                        icon={faMoneyBillTrendUp}
                        title={`${getFilterDisplayName(timeFilter)} Earnings`}
                        value={<Money>{kpis.earnings || 0}</Money>}
                        sub={`Current ${timeFilter}`}
                    />
                </div>

                {/* Charts with real data */}
                <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 mb-6">
                    {/* Earnings Bar Chart */}
                    <div className="col-span-1 xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                            <div className="font-semibold text-gray-800">
                                {getFilterDisplayName(timeFilter)} Earnings &
                                Orders
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faCalendarAlt}
                                    className="text-gray-400"
                                />
                                <select
                                    value={timeFilter}
                                    onChange={(e) =>
                                        setTimeFilter(e.target.value)
                                    }
                                    className="px-3 py-1.5 w-full md:w-40 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="daily">Daily View</option>
                                    <option value="monthly">Monthly View</option>
                                    <option value="yearly">Yearly View</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-64 md:h-80">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart
                                    data={earningsChartData}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />
                                    <YAxis
                                        yAxisId="left"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                        tickFormatter={(value) => `RM${value}`}
                                    />
                                    <YAxis
                                        yAxisId="right"
                                        orientation="right"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6b7280", fontSize: 12 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        yAxisId="left"
                                        dataKey="earnings"
                                        fill="#4f46e5"
                                        radius={[4, 4, 0, 0]}
                                        name="earnings"
                                        maxBarSize={40}
                                    />
                                    <Bar
                                        yAxisId="right"
                                        dataKey="orders"
                                        fill="#10b981"
                                        radius={[4, 4, 0, 0]}
                                        name="orders"
                                        maxBarSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-indigo-600 rounded min-h-[1rem]"></div>
                                <span className="text-xs text-gray-600">
                                    Earnings (RM)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-green-500 rounded min-h-[1rem]"></div>
                                <span className="text-xs text-gray-600">
                                    Orders
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {[
                        {
                            title: "Add New Product",
                            desc: "Create a new listing",
                            href: "/seller-manage-product",
                            color: "indigo",
                            icon: faBoxOpen,
                        },
                        {
                            title: "Product Earning",
                            desc: "Manage product earning",
                            href: "/seller-manage-earning",
                            color: "blue",
                            icon: faMoneyCheck,
                        },
                        {
                            title: "Create Discount",
                            desc: "Run a promotion",
                            href: "/seller-manage-discount",
                            color: "emerald",
                            icon: faTags,
                        },
                    ].map((a) => (
                        <a
                            key={a.title}
                            href={a.href}
                            className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-semibold text-gray-800 text-sm md:text-base">
                                        {a.title}
                                    </div>
                                    <div className="text-xs md:text-sm text-gray-500">
                                        {a.desc}
                                    </div>
                                </div>
                                <span
                                    className={`h-8 w-8 md:h-10 md:w-10 rounded-lg flex items-center justify-center
                    ${a.color === "indigo" && "bg-indigo-50 text-indigo-600"}
                    ${a.color === "blue" && "bg-sky-50 text-sky-600"}
                    ${a.color === "emerald" && "bg-emerald-50 text-emerald-600"}
                  `}
                                >
                                    <FontAwesomeIcon icon={a.icon} />
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                {/* Content Row: Recent Orders + Products Section */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    {/* Orders */}
                    <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5 overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800 flex items-center gap-2">
                                Recent Orders
                                {showNewOrderBadge && (
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                )}
                            </div>
                            <Link
                                href={route("seller-manage-order")}
                                className="text-sm text-indigo-600 hover:underline"
                                onClick={handleViewOrders}
                            >
                                View all
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="p-2">Order ID</th>
                                        <th className="p-2">Customer</th>
                                        <th className="p-2">Order Status</th>
                                        <th className="p-2">Payment</th>
                                        <th className="p-2">Total</th>
                                        <th className="p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {realTimeOrders.slice(0, 5).map((order) => (
                                        <tr
                                            key={order.order_id}
                                            className={`border-t hover:bg-gray-50 transition-colors ${
                                                newOrders.has(order.order_id)
                                                    ? "bg-green-50 border-l-4 border-l-green-500"
                                                    : ""
                                            }`}
                                        >
                                            <td className="p-2 font-medium text-gray-700 whitespace-nowrap">
                                                {order.order_id}
                                                {newOrders.has(
                                                    order.order_id
                                                ) && (
                                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        New
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-2 text-black whitespace-nowrap">
                                                {order.user?.name || "N/A"}
                                            </td>

                                            <td className="p-2">
                                                <OrderStatusBadge
                                                    status={order.order_status}
                                                />
                                            </td>
                                            <td className="p-2">
                                                {order.payment_status ? (
                                                    <Badge color="green">
                                                        Paid
                                                    </Badge>
                                                ) : (
                                                    <Badge color="orange">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-2 whitespace-nowrap">
                                                <Money>{order.amount}</Money>
                                            </td>
                                            <td className="p-2 text-black whitespace-nowrap">
                                                {new Date(
                                                    order.created_at
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Products Section - Dynamic based on subscription */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-gray-800">
                                {hasActiveSubscription
                                    ? "Your Products"
                                    : "Top Products"}
                            </div>
                            <Badge color="gray">
                                {hasActiveSubscription
                                    ? `${listedProducts.length} listed`
                                    : `${shop.topProducts?.length || 0} items`}
                            </Badge>
                        </div>

                        {hasActiveSubscription ? (
                            // Show listed products for subscribed sellers with scrollbar
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {listedProducts.length > 0 ? (
                                    listedProducts.map((product) => (
                                        <div
                                            key={product.product_id}
                                            className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="truncate flex-1 min-w-0">
                                                <div className="font-medium text-gray-800 truncate">
                                                    {product.product_name}
                                                </div>
                                                <div className="text-xs text-gray-500 flex gap-4 flex-wrap">
                                                    <span>
                                                        Stock:{" "}
                                                        {product.product_quantity ||
                                                            0}
                                                    </span>
                                                    <span>
                                                        Price:{" "}
                                                        <Money>
                                                            {
                                                                product.product_price
                                                            }
                                                        </Money>
                                                    </span>
                                                </div>
                                            </div>
                                            <div
                                                className={`text-xs px-2 py-1 rounded flex-shrink-0 ml-2 ${
                                                    product.product_status ===
                                                    "available"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {product.product_status ||
                                                    "draft"}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <FontAwesomeIcon
                                            icon={faBoxOpen}
                                            className="text-gray-300 h-8 w-8 mb-2"
                                        />
                                        <p className="text-sm text-gray-500">
                                            No products listed yet
                                        </p>
                                        <Link
                                            href="/seller-manage-product"
                                            className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-block"
                                        >
                                            Add your first product
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Show top products for trial/non-subscribed sellers
                            <div className="space-y-3">
                                {(shop.topProducts || []).map((p) => (
                                    <div
                                        key={p.name}
                                        className="flex items-center justify-between border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="truncate flex-1">
                                            <div className="font-medium text-gray-800 truncate">
                                                {p.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {p.units} units sold
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700 whitespace-nowrap ml-2">
                                            <Money>{p.revenue}</Money>
                                        </div>
                                    </div>
                                ))}
                                {(!shop.topProducts ||
                                    shop.topProducts.length === 0) && (
                                    <div className="text-center py-4">
                                        <p className="text-sm text-gray-500">
                                            Subscribe to list your products
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Trial Modal */}
            <TrialModal
                isOpen={showTrialModal}
                onClose={() => setShowTrialModal(false)}
                onStartTrial={handleStartTrial}
                onSubscribe={handleSubscribe}
                trialDaysLeft={trialDaysLeft}
                trialEndsAt={shop.trial_ends_at}
                storeName={sellerData.seller_store?.store_name || ""}
            />
        </div>
    );
}
