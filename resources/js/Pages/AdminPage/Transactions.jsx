import { Sidebar } from "@/Components/Admin/Sidebar";
import React from "react";
import { FaSearch, FaDownload, FaFileInvoiceDollar } from "react-icons/fa";

export default function Transactions() {
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
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Transactions
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage all subscription transactions.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 md:mt-0">
                            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                                <FaDownload /> Export CSV
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                <FaFileInvoiceDollar /> Generate Report
                            </button>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center border rounded-lg px-3 py-2 w-full md:w-1/3">
                            <FaSearch className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search by name or ID"
                                className="w-full focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <select className="border rounded-lg px-3 py-2">
                                <option value="">All Status</option>
                                <option value="success">Success</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                            </select>
                            <select className="border rounded-lg px-3 py-2">
                                <option value="">All Plans</option>
                                <option value="basic">Basic</option>
                                <option value="premium">Premium</option>
                                <option value="enterprise">Enterprise</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-200 text-black">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Transaction ID
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Customer
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Plan
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Amount
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Status
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Date
                                    </th>
                                    <th className="border border-gray-200 px-4 py-2 text-left text-gray-600">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    {
                                        id: "#TXN001",
                                        name: "John Doe",
                                        plan: "Premium",
                                        amount: "$50.00",
                                        status: "success",
                                        date: "2025-08-10",
                                    },
                                    {
                                        id: "#TXN002",
                                        name: "Jane Smith",
                                        plan: "Basic",
                                        amount: "$20.00",
                                        status: "pending",
                                        date: "2025-08-09",
                                    },
                                    {
                                        id: "#TXN003",
                                        name: "Mike Johnson",
                                        plan: "Enterprise",
                                        amount: "$120.00",
                                        status: "failed",
                                        date: "2025-08-08",
                                    },
                                ].map((txn, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border border-gray-200 px-4 py-2">
                                            {txn.id}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {txn.name}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {txn.plan}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {txn.amount}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    txn.status === "success"
                                                        ? "bg-green-100 text-green-700"
                                                        : txn.status ===
                                                          "pending"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {txn.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    txn.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            {txn.date}
                                        </td>
                                        <td className="border border-gray-200 px-4 py-2">
                                            <button className="text-indigo-600 hover:underline">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}