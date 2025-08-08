import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { usePage } from "@inertiajs/react";

import { Sidebar } from "@/Components/Admin/Sidebar";

export default function PendingSellerTable() {
    const { props } = usePage();
    const sellers = props.list_sellerRegistration || [];

    const [filter, setFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Filter logic
    useEffect(() => {
        let filtered = sellers;

        if (filter.trim() !== "") {
            const keyword = filter.toLowerCase();
            filtered = filtered.filter((seller) =>
                [
                    seller.name,
                    seller.email,
                    seller.store_name,
                    seller?.business?.business_type,
                ].some((field) => field?.toLowerCase().includes(keyword))
            );
        }

        if (dateFilter !== "") {
            filtered = filtered.filter((seller) =>
                seller.created_at.startsWith(dateFilter)
            );
        }

        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [filter, dateFilter, sellers]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
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
                                onChange={(e) => setFilter(e.target.value)}
                                className="border px-4 py-2 rounded-md w-full md:w-64 text-black"
                            />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="border px-4 py-2 rounded-md w-full md:w-48 text-black"
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
                                            key={seller.id}
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
                                                <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs mr-2">
                                                    Approve
                                                </button>
                                                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">
                                                    Reject
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
