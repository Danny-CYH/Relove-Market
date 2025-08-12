import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";
import axios from "axios";

import { Sidebar } from "@/Components/Admin/Sidebar";

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch sellers from server
    const fetchSellers = async () => {
        try {
            const res = await axios.get("/admin/dashboard/list");
            setRealTimeSellers(res.data);
        } catch (error) {
            console.error("Failed to fetch sellers:", error);
        }
    };

    const handleAction = async (registrationId, action, reason = "") => {
        try {
            // Show loading state
            setModalMessage("Processing your request...");
            setModalType("loading");
            setIsModalOpen(true);

            console.log(registrationId);

            const response = await axios.post(
                `/admin/pending-seller/${registrationId}/action`,
                { action, reason }
            );

            // Show success
            setModalMessage(response.data.successMessage || "Action successful!");
            setModalType("success");

            // Close only after success delay
            setTimeout(() => {
                setIsModalOpen(false);
                fetchSellers();
            }, 2000);
        } catch (error) {
            console.error(error);

            // Show error (no auto-close)
            setModalMessage("Something went wrong.");
            setModalType("error");
        }
    };

    // To listen to the new registered seller for real time updating
    useEffect(() => {
        fetchSellers();

        // Listen to Laravel Echo for real-time updates
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

    // Filtering logic
    const sellersData = realTimeSellers.data || [];

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
            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                        {modalType === "loading" && (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                                <p className="text-gray-700">{modalMessage}</p>
                            </div>
                        )}
                        {modalType === "success" && (
                            <p className="text-green-600 font-semibold">
                                {modalMessage}
                            </p>
                        )}
                        {modalType === "error" && (
                            <p className="text-red-600 font-semibold">
                                {modalMessage}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for view the request details */}
            {sellerDetails_modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSellerDetails_modal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>

                        {/* Header */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                            Seller Details
                        </h2>

                        {/* Seller Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                            <p>
                                <strong>Name:</strong> {selectedSeller?.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedSeller?.email}
                            </p>
                            <p>
                                <strong>Phone:</strong>{" "}
                                {selectedSeller?.phone_number}
                            </p>
                            <p>
                                <strong>Store Name:</strong>{" "}
                                {selectedSeller?.store_name}
                            </p>
                            <p>
                                <strong>Registration ID:</strong>{" "}
                                {selectedSeller?.registration_id}
                            </p>
                        </div>

                        {/* Store License PDF Preview */}
                        {selectedSeller?.store_license && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    Store License
                                </h3>
                                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg border">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded">
                                            PDF
                                        </span>
                                        <span className="text-gray-800">
                                            {selectedSeller.store_license}
                                        </span>
                                    </div>
                                    <a
                                        href={`${
                                            import.meta.env.VITE_APP_URL
                                        }/storage/${
                                            selectedSeller.store_license
                                        }`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                    >
                                        View
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-6 flex justify-between gap-3 border-t pt-4">
                            <button
                                onClick={() => {
                                    setSellerDetails_modal(false);
                                    setRejectSeller_modal(true);
                                }}
                                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => {
                                    setSellerDetails_modal(false);
                                    setApproveSeller_modal(true);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* modal for approve request */}
            {approveSeller_modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl text-black font-bold mb-4">
                            Approve Seller
                        </h2>
                        <p className="text-black">
                            Are you sure you want to approve{" "}
                            <span className="font-semibold">
                                {selectedSeller?.name}
                            </span>
                            ?
                        </p>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setApproveSeller_modal(false)}
                                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    // Call your API to approve seller here
                                    console.log("Approving:", selectedSeller);
                                    setApproveSeller_modal(false);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* modal for reject request */}
            {rejectSeller_modal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-xl">
                        <h2 className="text-xl text-black font-bold mb-4">
                            Reject Seller
                        </h2>
                        <p className="text-black">
                            Are you sure you want to reject{" "}
                            <span className="font-semibold">
                                {selectedSeller?.name}
                            </span>
                            ?
                        </p>

                        {/* Reason for rejection */}
                        <div className="mt-4">
                            <label
                                htmlFor="rejectionReason"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Reason for Rejection (optional)
                            </label>
                            <textarea
                                id="rejectionReason"
                                name="reason"
                                rows="5"
                                value={rejectionReason}
                                onChange={(e) =>
                                    setRejectionReason(e.target.value)
                                }
                                placeholder="Enter reason if rejecting..."
                                className="w-full textarea textarea-lg bg-white text-black border-solid border-2 border-black rounded-md p-2"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => setRejectSeller_modal(false)}
                                className="text-black bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();

                                    setRejectSeller_modal(false);
                                    handleAction(
                                        selectedSeller.registration_id,
                                        "Rejected",
                                        rejectionReason
                                    );
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="p-6 font-bold text-lg text-indigo-700">
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
