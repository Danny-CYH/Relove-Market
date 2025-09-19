import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import axios from "axios";

import { Sidebar } from "@/Components/Admin/Sidebar";
import { LoadingProgress } from "@/Components/Admin/LoadingProgress";
import { SellerDetails_Modal } from "@/Components/Admin/SellerDetails_Modal";
import { ApproveSeller_Modal } from "@/Components/Admin/ApproveSeller_Modal";
import { RejectSeller_Modal } from "@/Components/Admin/RejectSeller_Modal";

export default function PendingSellerTable({ list_sellerRegistration }) {
    const [realTimeSellers, setRealTimeSellers] = useState(
        list_sellerRegistration.data || []
    );

    const [filter, setFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [selectedSeller, setSelectedSeller] = useState(null);

    const [sellerDetails_modal, setSellerDetails_modal] = useState(false);
    const [approveSeller_modal, setApproveSeller_modal] = useState(false);
    const [rejectSeller_modal, setRejectSeller_modal] = useState(false);

    const [rejectionReason, setRejectionReason] = useState("");

    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState(""); // "success" or "error"
    const [loadingProgress, setLoadingProgress] = useState(false);

    const [pendingCount, setPendingCount] = useState(0);

    // Status Badge Component
    function StatusBadge({ status }) {
        const statusColors = {
            Pending: "bg-yellow-100 text-yellow-800",
            Approved: "bg-green-100 text-green-800",
            Rejected: "bg-red-100 text-red-800",
            Registered: "bg-blue-100 text-blue-800",
        };

        return (
            <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    statusColors[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status}
            </span>
        );
    }

    // Pagination Component
    function Pagination({ data, onPageChange }) {
        if (!data || data.length === 0) return null;

        const currentPage = data.current_page;
        const lastPage = data.last_page;

        // Don't show pagination if there's only one page
        if (lastPage <= 1) return null;

        const pages = [];

        // Always show first page
        pages.push(1);

        // Show pages around current page
        for (
            let i = Math.max(2, currentPage - 1);
            i <= Math.min(lastPage - 1, currentPage + 1);
            i++
        ) {
            if (!pages.includes(i)) pages.push(i);
        }

        // Always show last page
        if (lastPage > 1 && !pages.includes(lastPage)) {
            pages.push(lastPage);
        }

        // Add ellipsis where needed
        const paginationItems = [];
        let prevPage = 0;

        pages.forEach((page) => {
            if (page - prevPage > 1) {
                paginationItems.push(
                    <span key={`ellipsis-${page}`} className="px-3 py-2">
                        ...
                    </span>
                );
            }
            paginationItems.push(
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-2 rounded-md ${
                        currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                    {page}
                </button>
            );
            prevPage = page;
        });

        return (
            <div className="flex justify-center mt-6">
                <nav className="flex items-center space-x-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 rounded-md ${
                            currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        Previous
                    </button>

                    {paginationItems}

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className={`px-3 py-2 rounded-md ${
                            currentPage === lastPage
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        Next
                    </button>
                </nav>
            </div>
        );
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // In a real implementation, you would fetch data for the new page
        // For now, we'll just simulate it with the existing data
    };

    // Code for processing the action to the pending seller
    const handleAction = async (registrationId, action, reason = "") => {
        try {
            // Show loading modal
            setModalMessage("Processing your request...");
            setModalType("loading");
            setLoadingProgress(true);

            const response = await axios.post(
                `/admin/pending-seller/${registrationId}/action`,
                { action, reason }
            );

            if (action === "Approved") {
                setModalMessage(
                    response.data.successMessage || "Action successful!"
                );
            } else {
                setModalMessage(
                    response.data.successMessage || "Action successful!"
                );
            }

            setModalType("success");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 2000);
        } catch (error) {
            console.log(error);
            setModalMessage("Something went wrong: " + error.message);
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
            }, 5000);
        }
    };

    // To listen to the new registered seller for real time updating
    useEffect(() => {
        // request permission for receiving notification
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission().then((permission) => {
                console.log("Notification permission:", permission);
            });
        }

        // Function for query the seller registration data
        const fetchSellers = async () => {
            try {
                const res = await axios.get("/admin/dashboard/list");
                const sellers = res.data.data;

                setRealTimeSellers(sellers);

                // count only sellers with "Pending" status
                const pending = sellers.filter(
                    (s) => s.status === "Pending"
                ).length;
                setPendingCount(pending);
            } catch (error) {
                console.error("Failed to fetch sellers:", error);
            }
        };

        fetchSellers();

        if (!window.Echo) return;

        const channel = window.Echo.channel("pending-seller-list");

        const sellerListener = (e) => {
            console.log("📢 SellerUpdated event received:", e);

            if (e.action === "Registered") {
                // add new seller at the top
                setRealTimeSellers((prev) => [e.seller, ...prev]);
                setPendingCount((prev) => prev + 1);

                // Send desktop notification
                if (
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {
                    new Notification("🆕 New Seller Pending", {
                        body: `${e.seller.name} has registered and is waiting for approval.`,
                        icon: "/image/shania_yan.png", // optional
                    });
                }
            }

            if (e.action === "Approved" || e.action === "Rejected") {
                setRealTimeSellers((prev) =>
                    prev.filter(
                        (s) => s.registration_id !== e.seller.registration_id
                    )
                );
                setPendingCount((prev) => Math.max(prev - 1, 0));
            }
        };

        channel.listen(".SellerRegistered", sellerListener);

        // Cleanup
        return () => {
            channel.stopListening(".SellerRegistered");
            window.Echo.leaveChannel("pending-seller-list");
        };
    }, []);

    // Filter the seller data based on specific criteria
    const filtered = realTimeSellers.filter((seller) => {
        const keywordMatch =
            filter.trim() === "" ||
            [
                seller.name,
                seller.email,
                seller.store_name,
                seller?.business?.business_type,
            ].some((field) =>
                field?.toLowerCase().includes(filter.toLowerCase())
            );

        const statusMatch =
            statusFilter === "All" || seller.status === statusFilter;

        return keywordMatch && statusMatch;
    });

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Modal for view the request details */}
            {sellerDetails_modal && (
                <SellerDetails_Modal
                    selectedSeller={selectedSeller}
                    onApprove={() => setApproveSeller_modal(true)}
                    onReject={() => setRejectSeller_modal(true)}
                    onClose={() => setSellerDetails_modal(false)}
                />
            )}

            {/* Modal for approve the seller */}
            {approveSeller_modal && (
                <ApproveSeller_Modal
                    selectedSeller={selectedSeller}
                    onApprove={() => {
                        setApproveSeller_modal(false);
                        handleAction(
                            selectedSeller.registration_id,
                            "Approved"
                        );
                    }}
                    onClose={() => {
                        setApproveSeller_modal(false);
                    }}
                />
            )}

            {/* Modal for rejecting the seller */}
            {rejectSeller_modal && (
                <RejectSeller_Modal
                    selectedSeller={selectedSeller}
                    onReject={(reason) =>
                        handleAction(
                            selectedSeller.registration_id,
                            "Rejected",
                            reason
                        )
                    }
                    rejectionReason={rejectionReason}
                    setRejectionReason={setRejectionReason}
                    onClose={() => {
                        setRejectSeller_modal(false);
                    }}
                />
            )}

            {/* Loading Progress Modal */}
            {loadingProgress && (
                <LoadingProgress
                    modalMessage={modalMessage}
                    modalType={modalType}
                />
            )}

            {/* Sidebar */}
            <Sidebar pendingCount={pendingCount} />

            {/* Main Content */}
            <main className="flex-1 p-4 lg:p-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header with title and filters */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Seller Management
                                </h2>
                                <p className="text-gray-600">
                                    Review and manage seller registration
                                    requests
                                </p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-1/2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Registered">
                                        Registered
                                    </option>
                                </select>

                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search sellers..."
                                        value={filter}
                                        onChange={(e) => {
                                            setFilter(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="text-black border border-gray-300 rounded-md pl-10 pr-4 py-2 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Seller
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Business Details
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Date Applied
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filtered.length > 0 ? (
                                    filtered.map((seller) => (
                                        <tr
                                            key={seller.registration_id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                        <span className="text-indigo-800 font-medium">
                                                            {seller.name
                                                                ? seller.name
                                                                      .charAt(0)
                                                                      .toUpperCase()
                                                                : "S"}
                                                        </span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {seller.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {seller.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {seller.store_name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {seller?.business
                                                        ?.business_type ||
                                                        "N/A"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {seller.created_at
                                                    ? format(
                                                          new Date(
                                                              seller.created_at
                                                          ),
                                                          "dd MMM yyyy, hh:mm a"
                                                      )
                                                    : "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    status={seller.status}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSeller(
                                                            seller
                                                        );
                                                        setSellerDetails_modal(
                                                            true
                                                        );
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    View
                                                </button>
                                                {seller.status ===
                                                    "Pending" && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedSeller(
                                                                    seller
                                                                );
                                                                setApproveSeller_modal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-green-600 hover:text-green-900 mr-4"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setSelectedSeller(
                                                                    seller
                                                                );
                                                                setRejectSeller_modal(
                                                                    true
                                                                );
                                                            }}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                        >
                                            No seller registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        data={list_sellerRegistration}
                        onPageChange={handlePageChange}
                    />
                </div>
            </main>
        </div>
    );
}
