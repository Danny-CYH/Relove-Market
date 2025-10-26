import { useState, useEffect, useRef } from "react";

import axios from "axios";

import { Sidebar } from "@/Components/AdminPage/Sidebar";
import Create_Subscriptions_Modal from "@/Components/AdminPage/SubscriptionManagement/Create_Subscriptions_Modal";
import Edit_Subscriptions_Modal from "@/Components/AdminPage/SubscriptionManagement/Edit_Subscriptions_Modal";
import Delete_Subscriptions_Modal from "@/Components/AdminPage/SubscriptionManagement/Delete_Subscriptions_Modal";

export default function SubscriptionManagement() {
    const [subscriptions, setSubscriptions] = useState([]);

    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [durationFilter, setDurationFilter] = useState("All");

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedSubscription, setSelectedSubscription] = useState(null);

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const echoRef = useRef(null);

    const [formData, setFormData] = useState({
        plan_name: "",
        description: "",
        price: "",
        duration: "",
        status: "Active",
        features: [""],
        limits: {
            max_products: 0,
            max_conversations: 0,
            featured_listing: false,
        },
    });

    // Initialize Echo for real-time updates
    const initializeEcho = () => {
        if (typeof window.Echo !== "undefined") {
            echoRef.current = window.Echo.channel("subscriptions");

            // Listen for subscription created
            echoRef.current.listen(".subscription.created", async (e) => {
                console.log("📢 New subscription created event:", e);
                // Refresh current page to get updated pagination
                await fetchSubscriptionsWithPage(currentPage);
            });

            // Listen for subscription updated
            echoRef.current.listen(".subscription.updated", async (e) => {
                console.log("📢 Subscription updated event:", e);
                // Refresh current page to get updated data
                await fetchSubscriptionsWithPage(currentPage);
            });

            // Listen for subscription deleted
            echoRef.current.listen(".subscription.deleted", async (e) => {
                console.log("📢 Subscription deleted event:", e);

                // Check if we need to adjust page after deletion
                const currentItemsCount = subscriptions.length;
                const isLastItemOnPage = currentItemsCount === 1;
                const hasPreviousPage = currentPage > 1;

                if (isLastItemOnPage && hasPreviousPage) {
                    await fetchSubscriptionsWithPage(currentPage - 1);
                } else {
                    await fetchSubscriptionsWithPage(currentPage);
                }
            });

            // Listen for status updates
            echoRef.current.listen(
                ".subscription.status.updated",
                async (e) => {
                    console.log("📢 Subscription status updated event:", e);
                    await fetchSubscriptionsWithPage(currentPage);
                }
            );
        } else {
            console.warn("Echo is not available. Real-time updates disabled.");
        }
    };

    // Cleanup Echo listener
    const cleanupEcho = () => {
        if (echoRef.current) {
            echoRef.current.stopListening(".subscription.created");
            echoRef.current.stopListening(".subscription.updated");
            echoRef.current.stopListening(".subscription.deleted");
            echoRef.current.stopListening(".subscription.status.updated");
            echoRef.current.unsubscribe();
        }
    };

    // Helper function to handle pagination after mutations
    const handlePaginationAfterMutation = async (action = "default") => {
        const currentItemsCount = subscriptions.length;

        switch (action) {
            case "delete":
                // If deleting the last item on a page (not first page), go to previous page
                if (currentItemsCount === 1 && currentPage > 1) {
                    await fetchSubscriptionsWithPage(currentPage - 1);
                } else {
                    await fetchSubscriptionsWithPage(currentPage);
                }
                break;

            case "create":
                // If creating on a full page, might need to go to first page to see new item
                // Or stay on current page and let server handle pagination
                await fetchSubscriptionsWithPage(currentPage);
                break;

            default:
                await fetchSubscriptionsWithPage(currentPage);
        }
    };

    // Fetch subscriptions from database
    const fetchSubscriptionsWithPage = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/api/admin/get-subscriptions?page=${page}`
            );

            setSubscriptions(response.data.subscription.data);

            setCurrentPage(response.data.subscription.current_page);
            setLastPage(response.data.subscription.last_page);

            setPagination({
                from: response.data.subscription.from,
                to: response.data.subscription.to,
                total: response.data.subscription.total,
                current_page: response.data.subscription.current_page,
                last_page: response.data.subscription.last_page,
            });
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            alert("Failed to load subscription plans");
        } finally {
            setLoading(false);
        }
    };

    // Update your main fetch function to use the same logic
    const fetchSubscriptions = async () => {
        await fetchSubscriptionsWithPage(currentPage);
    };

    // Filter subscriptions based on search, status, and duration
    const filteredSubscriptions = subscriptions.filter((subscription) => {
        const matchesSearch =
            filter === "" ||
            subscription.plan_name.toLowerCase().includes(filter.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || subscription.status === statusFilter;

        const matchesDuration =
            durationFilter === "All" ||
            subscription.duration === durationFilter;

        return matchesSearch && matchesStatus && matchesDuration;
    });

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.plan_name.trim()) {
            newErrors.plan_name = "Plan name is required";
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = "Valid price is required";
        }

        if (!formData.duration) {
            newErrors.duration = "Duration is required";
        }

        // Fix: Check if features array has at least one non-empty feature
        const validFeatures = formData.features.filter(
            (feature) => feature && feature.trim() !== ""
        );

        if (validFeatures.length === 0) {
            newErrors.features = "At least one feature is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            plan_name: "",
            price: "",
            duration: "",
            status: "Active",
            features: [""],
            description: "",
            limits: {},
        });
        setErrors({});
    };

    // Handle input changes including nested limits
    const handleInputChange = (field, value) => {
        if (field === "limits") {
            setFormData((prev) => ({
                ...prev,
                limits: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    // Handle features changes
    const handleFeatureChange = (index, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData((prev) => ({
            ...prev,
            features: newFeatures,
        }));
    };

    const addFeature = () => {
        setFormData((prev) => ({
            ...prev,
            features: [...prev.features, ""],
        }));
    };

    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            const newFeatures = formData.features.filter((_, i) => i !== index);
            setFormData((prev) => ({
                ...prev,
                features: newFeatures,
            }));
        }
    };

    // Create new subscription
    const createSubscription = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                features: formData.features.filter(
                    (feature) => feature.trim() !== ""
                ),
                limits: formData.limits,
            };

            const response = await axios.post(
                "/api/admin/create-subscriptions",
                payload
            );

            // Refresh the current page to get updated pagination data
            await fetchSubscriptionsWithPage(currentPage);

            setShowCreateModal(false);
            resetForm();
            alert("Subscription plan created successfully!");
        } catch (error) {
            console.error("Error creating subscription:", error);
            alert("Failed to create subscription plan");
        } finally {
            setLoading(false);
        }
    };

    // Update subscription
    const updateSubscription = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                features: formData.features.filter(
                    (feature) => feature.trim() !== ""
                ),
                limits: formData.limits,
            };

            const response = await axios.put(
                `/api/admin/update-subscriptions/${selectedSubscription.subscription_plan_id}`,
                payload
            );

            // Refresh the current page to get updated data
            await fetchSubscriptionsWithPage(currentPage);

            setShowEditModal(false);
            setSelectedSubscription(null);
            resetForm();
            alert("Subscription plan updated successfully!");
        } catch (error) {
            console.error("❌ Error updating subscription:", error);
            alert("Failed to update subscription plan");
        } finally {
            setLoading(false);
        }
    };

    // Delete subscription
    const deleteSubscription = async () => {
        setLoading(true);
        try {
            await axios.delete(
                `/api/admin/delete-subscriptions/${selectedSubscription.subscription_plan_id}`
            );

            await handlePaginationAfterMutation("delete");

            setShowDeleteModal(false);
            setSelectedSubscription(null);
            alert("Subscription plan deleted successfully!");
        } catch (error) {
            console.error("Error deleting subscription:", error);
            alert("Failed to delete subscription plan");
        } finally {
            setLoading(false);
        }
    };

    // Toggle subscription status
    const toggleSubscriptionStatus = async (id) => {
        const subscription = subscriptions.find(
            (sub) => sub.subscription_plan_id === id
        );
        if (!subscription) return;

        setLoading(true);
        try {
            const newStatus =
                subscription.status === "Active" ? "Inactive" : "Active";
            const response = await axios.patch(
                `/api/admin/change-subscriptions/${id}/status`,
                {
                    status: newStatus,
                }
            );

            console.log(response);

            setSubscriptions((prev) =>
                prev.map((sub) =>
                    sub.subscription_plan_id === id
                        ? { ...sub, status: newStatus }
                        : sub
                )
            );
            alert(`Subscription ${newStatus.toLowerCase()} successfully!`);
        } catch (error) {
            console.error("Error updating subscription status:", error);
            alert("Failed to update subscription status");
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal with subscription dat
    const openEditModal = (subscription) => {
        setSelectedSubscription(subscription);

        // Extract features properly - handle both object and string formats
        let features = [""];
        if (
            subscription.subscription_features &&
            subscription.subscription_features.length > 0
        ) {
            // Extract feature_text from subscription_features objects
            features = subscription.subscription_features.map(
                (feature) => feature.feature_text || ""
            );
        } else if (subscription.features && subscription.features.length > 0) {
            // If features is already an array of strings
            features = [...subscription.features];
        }

        setFormData({
            plan_name: subscription.plan_name,
            price: subscription.price.toString().replace("RM", "").trim(),
            duration: subscription.duration,
            status: subscription.status,
            features: features,
            description: subscription.description || "",
            limits: subscription.limits || "",
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (subscription) => {
        setSelectedSubscription(subscription);
        setShowDeleteModal(true);
    };

    // Calculate total metrics
    const totalSubscribers = subscriptions.reduce(
        (sum, sub) => sum + sub.subscribers,
        0
    );
    const totalRevenue = subscriptions.reduce((sum, sub) => {
        const revenueValue = sub?.revenue || "$0"; // Default to $0 if missing
        const revenue = parseFloat(
            revenueValue.toString().replace("$", "").replace(",", "")
        );
        return sum + (isNaN(revenue) ? 0 : revenue); // Avoid NaN
    }, 0);

    const activePlans = subscriptions.filter(
        (sub) => sub.status === "Active"
    ).length;

    useEffect(() => {
        fetchSubscriptions();
        initializeEcho();

        return () => {
            cleanupEcho();
        };
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar for desktop */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6 md:mt-0 mt-16">
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
                                onClick={() => {
                                    resetForm();
                                    setShowCreateModal(true);
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                                disabled={loading}
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
                                    className="text-black w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                className="text-black border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                                className="text-black border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Durations</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">
                                Loading subscription plans...
                            </p>
                        </div>
                    )}

                    {/* Subscription Plans */}
                    <div className="overflow-hidden">
                        {!loading && filteredSubscriptions.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {filteredSubscriptions.map((plan) => (
                                    <div
                                        key={plan.subscription_plan_id}
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
                                                    {plan.plan_name}
                                                </h3>
                                                <span className="bg-white text-indigo-600 text-xs font-semibold px-2 py-1 rounded">
                                                    {plan.duration} days
                                                </span>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-2xl font-bold">
                                                    RM {plan.price}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="mb-4">
                                                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                                                    Features
                                                </h4>
                                                <ul className="text-sm text-gray-700">
                                                    {plan?.features?.map(
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
                                                        onClick={() =>
                                                            openEditModal(plan)
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                        disabled={loading}
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
                                                                plan.subscription_plan_id
                                                            )
                                                        }
                                                        className={
                                                            plan.status ===
                                                            "Active"
                                                                ? "text-yellow-600 hover:text-yellow-900"
                                                                : "text-green-600 hover:text-green-900"
                                                        }
                                                        disabled={loading}
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
                                                            openDeleteModal(
                                                                plan
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={loading}
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
                            !loading && (
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
                                        No subscription plans found matching
                                        your criteria.
                                    </p>
                                    <button
                                        onClick={() => {
                                            resetForm();
                                            setShowCreateModal(true);
                                        }}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                                    >
                                        Create Your First Plan
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Showing{" "}
                                <span className="text-black font-medium">
                                    {pagination.from}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium">
                                    {pagination.to}
                                </span>{" "}
                                of{" "}
                                <span className="text-black font-medium">
                                    {pagination.total}
                                </span>{" "}
                                results ({" "}
                                <span className="text-primary font-bold mx-auto">
                                    Page {currentPage} of {lastPage}
                                </span>{" "}
                                )
                            </div>
                            // Update your pagination section - Remove the
                            comment that breaks JSX
                            <div className="inline-flex items-center space-x-2">
                                {currentPage > 1 && (
                                    <button
                                        className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={async () => {
                                            const newPage = Math.max(
                                                currentPage - 1,
                                                1
                                            );
                                            await fetchSubscriptionsWithPage(
                                                newPage
                                            );
                                        }}
                                    >
                                        Previous
                                    </button>
                                )}

                                <button className="px-3 py-1.5 rounded-md bg-indigo-600 text-white">
                                    {currentPage}
                                </button>

                                {currentPage < lastPage && (
                                    <button
                                        className="px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        onClick={async () => {
                                            const newPage = Math.min(
                                                currentPage + 1,
                                                lastPage
                                            );
                                            await fetchSubscriptionsWithPage(
                                                newPage
                                            );
                                        }}
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Plan Modal */}
                {showCreateModal && (
                    <Create_Subscriptions_Modal
                        onClose={() => {
                            setShowCreateModal(false);
                            resetForm();
                        }}
                        onSubmit={createSubscription}
                        loading={loading}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onFeatureChange={handleFeatureChange}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                        errors={errors}
                    />
                )}

                {/* Edit Plan Modal */}
                {showEditModal && (
                    <Edit_Subscriptions_Modal
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedSubscription(null);
                            resetForm();
                        }}
                        onSubmit={updateSubscription}
                        loading={loading}
                        formData={formData}
                        onInputChange={handleInputChange}
                        onFeatureChange={handleFeatureChange}
                        onAddFeature={addFeature}
                        onRemoveFeature={removeFeature}
                        errors={errors}
                        selectedSubscription={selectedSubscription}
                    />
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <Delete_Subscriptions_Modal
                        onClose={() => {
                            setShowDeleteModal(false);
                            setSelectedSubscription(null);
                        }}
                        onConfirm={deleteSubscription}
                        loading={loading}
                        selectedSubscription={selectedSubscription}
                    />
                )}
            </main>
        </div>
    );
}
