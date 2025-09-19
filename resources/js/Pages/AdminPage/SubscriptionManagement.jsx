import { useState } from "react";
import { Sidebar } from "@/Components/Admin/Sidebar";

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([
        {
            id: 1,
            planName: "Basic Plan",
            price: "$9.99/month",
            status: "Active",
            duration: "Monthly",
            features: ["Up to 10 products", "Basic analytics", "Email support"],
            subscribers: 125,
            revenue: "$1248.75",
            createdAt: "2023-01-15",
        },
        {
            id: 2,
            planName: "Pro Plan",
            price: "$29.99/month",
            status: "Active",
            duration: "Monthly",
            features: [
                "Unlimited products",
                "Advanced analytics",
                "Priority support",
                "API access",
            ],
            subscribers: 78,
            revenue: "$2339.22",
            createdAt: "2023-02-10",
        },
        {
            id: 3,
            planName: "Enterprise Plan",
            price: "$99.99/month",
            status: "Active",
            duration: "Monthly",
            features: [
                "Unlimited products",
                "Advanced analytics",
                "24/7 support",
                "API access",
                "Custom integrations",
            ],
            subscribers: 25,
            revenue: "$2499.75",
            createdAt: "2023-03-05",
        },
        {
            id: 4,
            planName: "Annual Basic",
            price: "$99.99/year",
            status: "Active",
            duration: "Yearly",
            features: ["Up to 10 products", "Basic analytics", "Email support"],
            subscribers: 42,
            revenue: "$4199.58",
            createdAt: "2023-04-20",
        },
        {
            id: 5,
            planName: "Starter Plan",
            price: "$4.99/month",
            status: "Inactive",
            duration: "Monthly",
            features: ["Up to 5 products", "Basic analytics"],
            subscribers: 0,
            revenue: "$0.00",
            createdAt: "2023-05-15",
        },
    ]);

    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [durationFilter, setDurationFilter] = useState("All");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter subscriptions based on search, status, and duration
    const filteredSubscriptions = subscriptions.filter((subscription) => {
        const matchesSearch =
            filter === "" ||
            subscription.planName.toLowerCase().includes(filter.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || subscription.status === statusFilter;

        const matchesDuration =
            durationFilter === "All" ||
            subscription.duration === durationFilter;

        return matchesSearch && matchesStatus && matchesDuration;
    });

    // Toggle subscription status
    const toggleSubscriptionStatus = (id) => {
        setSubscriptions(
            subscriptions.map((sub) =>
                sub.id === id
                    ? {
                          ...sub,
                          status:
                              sub.status === "Active" ? "Inactive" : "Active",
                      }
                    : sub
            )
        );
    };

    // Delete subscription
    const deleteSubscription = (id) => {
        if (
            window.confirm(
                "Are you sure you want to delete this subscription plan?"
            )
        ) {
            setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
        }
    };

    // Calculate total metrics
    const totalSubscribers = subscriptions.reduce(
        (sum, sub) => sum + sub.subscribers,
        0
    );
    const totalRevenue = subscriptions.reduce((sum, sub) => {
        const revenue = parseFloat(
            sub.revenue.replace("$", "").replace(",", "")
        );
        return sum + revenue;
    }, 0);
    const activePlans = subscriptions.filter(
        (sub) => sub.status === "Active"
    ).length;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <aside className="w-64 bg-white shadow hidden lg:block">
                <Sidebar pendingCount={3} />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-indigo-100 p-3 mr-4">
                                <svg
                                    className="w-6 h-6 text-indigo-600"
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
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Total Subscribers
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {totalSubscribers}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-green-100 p-3 mr-4">
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
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Monthly Revenue
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    ${totalRevenue.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-md">
                        <div className="flex items-center">
                            <div className="rounded-full bg-blue-100 p-3 mr-4">
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
                                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                    />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Active Plans
                                </p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {activePlans}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header with title and actions */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Subscription Plans
                                </h2>
                                <p className="text-gray-600">
                                    Manage and create subscription plans for
                                    sellers
                                </p>
                            </div>

                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Create New Plan
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search plans by name..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                <svg
                                    className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>

                            <select
                                value={durationFilter}
                                onChange={(e) =>
                                    setDurationFilter(e.target.value)
                                }
                                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Durations</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    {/* Subscription Plans */}
                    <div className="overflow-hidden">
                        {filteredSubscriptions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredSubscriptions.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div
                                            className={`p-4 ${
                                                plan.status === "Active"
                                                    ? "bg-indigo-600"
                                                    : "bg-gray-400"
                                            } text-white`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold">
                                                    {plan.planName}
                                                </h3>
                                                <span className="bg-white text-indigo-600 text-xs font-semibold px-2 py-1 rounded">
                                                    {plan.duration}
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-2xl font-bold">
                                                    {plan.price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                                    Features
                                                </h4>
                                                <ul className="text-sm text-gray-700">
                                                    {plan.features.map(
                                                        (feature, index) => (
                                                            <li
                                                                key={index}
                                                                className="flex items-center mb-1"
                                                            >
                                                                <svg
                                                                    className="w-4 h-4 text-green-500 mr-2"
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
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                                {feature}
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Subscribers
                                                    </p>
                                                    <p className="font-semibold">
                                                        {plan.subscribers}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">
                                                        Revenue
                                                    </p>
                                                    <p className="font-semibold">
                                                        {plan.revenue}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center mt-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        plan.status === "Active"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {plan.status}
                                                </span>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSubscription(
                                                                plan
                                                            );
                                                            setShowEditModal(
                                                                true
                                                            );
                                                        }}
                                                        className="text-indigo-600 hover:text-indigo-900"
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
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            toggleSubscriptionStatus(
                                                                plan.id
                                                            )
                                                        }
                                                        className={
                                                            plan.status ===
                                                            "Active"
                                                                ? "text-yellow-600 hover:text-yellow-900"
                                                                : "text-green-600 hover:text-green-900"
                                                        }
                                                    >
                                                        {plan.status ===
                                                        "Active" ? (
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                        ) : (
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
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deleteSubscription(
                                                                plan.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
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
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <svg
                                    className="w-16 h-16 text-gray-300 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <p className="mt-4 text-gray-500">
                                    No subscription plans found matching your
                                    criteria.
                                </p>
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                >
                                    Create Your First Plan
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">1</span>{" "}
                                to <span className="font-medium">5</span> of{" "}
                                <span className="font-medium">5</span> plans
                            </div>
                            <div className="inline-flex items-center space-x-2">
                                <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">
                                    1
                                </button>
                                <button className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Plan Modal (simplified) */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Create New Subscription Plan
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Subscription plan creation form would go
                                    here.
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowCreateModal(false)
                                        }
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Create Plan
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Plan Modal (simplified) */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Edit Subscription Plan
                                </h3>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">
                                    Editing: {selectedSubscription?.planName}
                                </p>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
