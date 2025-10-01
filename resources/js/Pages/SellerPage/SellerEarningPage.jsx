import React, { useState } from "react";
import {
    DollarSign,
    Calendar,
    Clock,
    TrendingUp,
    Download,
} from "lucide-react";
import { SellerSidebar } from "@/Components/SellerPage/SellerSidebar";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

export default function EarningsPage() {
    const [filter, setFilter] = useState("monthly");

    const earningsData = {
        total: 14500,
        pending: 3200,
        thisMonth: 4200,
        lastMonth: 3800,
    };

    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                label: "Earnings",
                data: [1200, 1800, 1400, 2000, 2500, 2100, 3000],
                fill: true,
                backgroundColor: "rgba(34,197,94,0.2)",
                borderColor: "rgba(34,197,94,1)",
                tension: 0.3,
            },
        ],
    };

    const transactions = [
        {
            id: 1,
            date: "2025-08-10",
            amount: 500,
            status: "Paid",
            ref: "#ORD1234",
        },
        {
            id: 2,
            date: "2025-08-09",
            amount: 1200,
            status: "Pending",
            ref: "#ORD1235",
        },
        {
            id: 3,
            date: "2025-08-08",
            amount: 800,
            status: "Paid",
            ref: "#ORD1236",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <SellerSidebar shopName={"Gemilang Berjaya"} />

            <main className="flex-1 p-6">
                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Earnings
                    </h1>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <Download size={18} /> Download Report
                    </button>
                </div>

                {/* Earnings Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
                        <DollarSign className="text-green-600" />
                        <div>
                            <div className="text-sm text-gray-500">
                                Total Earnings
                            </div>
                            <div className="text-lg font-bold">
                                RM {earningsData.total}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
                        <Clock className="text-yellow-500" />
                        <div>
                            <div className="text-sm text-gray-500">
                                Pending Payouts
                            </div>
                            <div className="text-lg font-bold">
                                RM {earningsData.pending}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
                        <Calendar className="text-blue-500" />
                        <div>
                            <div className="text-sm text-gray-500">
                                This Month
                            </div>
                            <div className="text-lg font-bold">
                                RM {earningsData.thisMonth}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow flex items-center gap-3">
                        <TrendingUp className="text-purple-500" />
                        <div>
                            <div className="text-sm text-gray-500">
                                Last Month
                            </div>
                            <div className="text-lg font-bold">
                                RM {earningsData.lastMonth}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Earnings Chart */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">Earnings Overview</h2>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="border rounded px-2 py-1 text-sm"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <Line data={chartData} />
                </div>

                {/* Transactions Table */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-lg font-bold mb-4">
                        Recent Transactions
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-2">Date</th>
                                    <th className="px-4 py-2">Order Ref</th>
                                    <th className="px-4 py-2">Amount</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b">
                                        <td className="px-4 py-2">{tx.date}</td>
                                        <td className="px-4 py-2">{tx.ref}</td>
                                        <td className="px-4 py-2">
                                            RM {tx.amount}
                                        </td>
                                        <td className="px-4 py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    tx.status === "Paid"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {tx.status}
                                            </span>
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