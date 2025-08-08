import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { Sidebar } from "@/Components/Admin/Sidebar";

export default function AdminDashboard() {
    const [metrics, setMetrics] = useState(null);
    const [filter, setFilter] = useState("");
    const [showSearch, setShowSearch] = useState(false);

    const { props } = usePage();

    const filteredSellers = props.list_sellerRegistration?.filter((seller) => {
        return (
            seller.name.toLowerCase().includes(filter.toLowerCase()) ||
            seller.email.toLowerCase().includes(filter.toLowerCase()) ||
            seller.store_name.toLowerCase().includes(filter.toLowerCase()) ||
            seller.business?.business_type
                .toLowerCase()
                .includes(filter.toLowerCase())
        );
    });

    useEffect(() => {
        setMetrics({
            totalUsers: 2450,
            totalTransactions: 892,
            pendingSellers: props.list_sellerRegistration?.length || 0,
            revenue: 15780.25,
        });
    }, [props.list_sellerRegistration]);

    // const approveRequest = 

    const chartData = [
        { name: "Jan", revenue: 1200 },
        { name: "Feb", revenue: 2100 },
        { name: "Mar", revenue: 800 },
        { name: "Apr", revenue: 1600 },
        { name: "May", revenue: 2400 },
        { name: "Jun", revenue: 3000 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow hidden md:block">
                <div className="p-6 font-bold text-lg text-indigo-700">
                    Admin Panel
                </div>
                <Sidebar />
            </aside>

            <main className="flex-1 p-6">
                <h1 className="text-black text-2xl font-semibold mb-4">
                    Admin Dashboard
                </h1>

                {metrics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-4 shadow rounded">
                            <p className="text-sm text-gray-500">Total Users</p>
                            <p className="text-blue-500 text-2xl font-bold">
                                {metrics.totalUsers}
                            </p>
                        </div>
                        <div className="bg-white p-4 shadow rounded">
                            <p className="text-sm text-gray-500">
                                Transactions
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
                                {metrics.totalTransactions}
                            </p>
                        </div>
                        <div className="bg-white p-4 shadow rounded">
                            <p className="text-sm text-gray-500">
                                Pending Sellers
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
                                {metrics.pendingSellers}
                            </p>
                        </div>
                        <div className="bg-white p-4 shadow rounded">
                            <p className="text-sm text-gray-500">
                                Revenue (RM)
                            </p>
                            <p className="text-blue-500 text-2xl font-bold">
                                RM {metrics.revenue.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Revenue Chart */}
                <div className="bg-white shadow p-6 rounded mb-10">
                    <h2 className="text-black text-lg font-semibold mb-4">
                        Monthly Revenue Overview
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="revenue" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Seller Approval with Filter */}
                <div>
                    <div className="flex flex-row justify-between">
                        <h2 className="text-black text-lg font-semibold mb-4">
                            Pending Seller Approvals
                        </h2>

                        <div className="mb-4 flex items-center gap-2">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="px-2 rounded-full hover:bg-gray-200"
                                aria-label="Toggle Search"
                            >
                                <FaSearch className="text-black w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {showSearch && (
                                    <motion.input
                                        key="search-input"
                                        initial={{ width: 0, opacity: 0 }}
                                        animate={{ width: "250px", opacity: 1 }}
                                        exit={{ width: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        type="text"
                                        placeholder="Filter by name, email, store or type..."
                                        className="px-4 py-2 border rounded text-black overflow-hidden"
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {filteredSellers && filteredSellers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg">
                                <thead className="bg-gray-200 text-black text-sm">
                                    <tr>
                                        <th className="text-left px-4 py-2">
                                            Name
                                        </th>
                                        <th className="text-left px-4 py-2">
                                            Email
                                        </th>
                                        <th className="text-left px-4 py-2">
                                            Phone
                                        </th>
                                        <th className="text-left px-4 py-2">
                                            Store Name
                                        </th>
                                        <th className="text-left px-4 py-2">
                                            Business Type
                                        </th>
                                        <th className="text-left px-4 py-2">
                                            Status
                                        </th>
                                        <th className="text-center px-4 py-2">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSellers.length > 0 ? (
                                        filteredSellers.map((seller) => (
                                            <tr
                                                key={seller.registration_id}
                                                className="hover:bg-gray-50 border-b text-black text-sm"
                                            >
                                                <td className="px-4 py-2">
                                                    {seller.name}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {seller.email}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {seller.phone_number}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {seller.store_name}
                                                </td>
                                                <td className="px-4 py-2">
                                                    {seller.business
                                                        ?.business_type ??
                                                        "N/A"}
                                                </td>
                                                <td className="text-red-600 font-bold px-4 py-2">
                                                    {seller.status}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <button
                                                        onClick={() =>
                                                            approveRequest(
                                                                seller.registration_id
                                                            )
                                                        }
                                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center px-4 py-6 text-gray-500 text-sm"
                                            >
                                                No seller registrations found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-600 text-sm italic">
                            No pending seller registrations match your filter.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
}
