import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";
import axios from "axios";

import { Sidebar } from "@/Components/Admin/Sidebar";
import { LoadingProgress } from "@/Components/Admin/LoadingProgress";
import { SellerDetails_Modal } from "@/Components/Admin/SellerDetails_Modal";
import { ApproveSeller_Modal } from "@/Components/Admin/ApproveSeller_Modal";
import { RejectSeller_Modal } from "@/Components/Admin/RejectSeller_Modal";

export default function PendingSellerTable() {
    const { props } = usePage();
    const [realTimeSellers, setRealTimeSellers] = useState(
        props.list_sellerRegistration || { data: [] }
    );

    const [filter, setFilter] = useState("");
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

    // Filtering logic
    const sellersData = realTimeSellers.data || [];

    // Fetch all pending sellers from server
    const fetchSellers = async () => {
        try {
            const res = await axios.get("/admin/dashboard/list");
            setRealTimeSellers(res.data);
        } catch (error) {
            console.error("Failed to fetch sellers:", error);
        }
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
                fetchSellers();
            }, 2000);
        } catch (error) {
            setModalMessage("Something went wrong: " + error.message);
            setModalType("error");

            setTimeout(() => {
                setLoadingProgress(false);
                fetchSellers();
            }, 5000);
        }
    };

    // To listen to the new registered seller for real time updating
    useEffect(() => {
        fetchSellers();

        window.Echo.channel("pending-seller-list").listen(
            ".SellerRegistered",
            async () => {
                await fetchSellers();
            }
        );

        // Cleanup
        return () => {
            window.Echo.leaveChannel("pending-seller-list");
        };
    }, []);

    // Filter the seller data based on specific criteria
    const filtered = sellersData.filter((seller) => {
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

        return keywordMatch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

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
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="flex flex-row p-6 font-bold text-lg text-indigo-700">
                    Admin Panel
                </div>
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="p-4 bg-white rounded-xl shadow-md">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                        <h2 className="text-2xl font-semibold text-black">
                            Pending Seller Approvals
                        </h2>
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <input
                                type="text"
                                placeholder="Filter by name, email, store, or type..."
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border px-4 py-2 rounded-md w-full md:w-64 text-black"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border text-sm">
                            <thead className="bg-gray-100 text-black">
                                <tr>
                                    <th className="px-4 py-2 border">#</th>
                                    <th className="px-4 py-2 border">Name</th>
                                    <th className="px-4 py-2 border">Email</th>
                                    <th className="px-4 py-2 border">Store</th>
                                    <th className="px-4 py-2 border">
                                        Business Type
                                    </th>
                                    <th className="px-4 py-2 border">
                                        Date / Time Applied
                                    </th>
                                    <th className="px-4 py-2 border">Status</th>
                                    <th className="px-4 py-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((seller, index) => (
                                        <tr
                                            key={seller.registration_id}
                                            className="hover:bg-gray-50 text-black"
                                        >
                                            <td className="px-4 py-2 border text-center">
                                                {(currentPage - 1) *
                                                    itemsPerPage +
                                                    index +
                                                    1}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {seller.name}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {seller.email}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {seller.store_name}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {
                                                    seller?.business
                                                        ?.business_type
                                                }
                                            </td>
                                            <td className="px-4 py-2 border">
                                                {seller.created_at
                                                    ? format(
                                                          new Date(
                                                              seller.created_at
                                                          ),
                                                          "dd MMM yyyy, hh:mm a"
                                                      )
                                                    : "N/A"}
                                            </td>
                                            <td className="px-4 py-2 border">
                                                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                    {seller.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border text-center">
                                                <button
                                                    onClick={() => {
                                                        setSelectedSeller(
                                                            seller
                                                        );
                                                        setSellerDetails_modal(
                                                            true
                                                        );
                                                    }}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No pending registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex justify-start items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black"
                        >
                            Prev
                        </button>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded ${
                                    page === currentPage
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-200"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-black"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
