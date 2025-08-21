import React, { useState, useEffect } from "react";
import {
    Plus,
    Edit,
    Trash,
    Search,
    Eye,
    Pause,
    Play,
    Copy,
} from "lucide-react";
import { SellerSidebar } from "@/Components/Seller/SellerSidebar";

export default function PromotionPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [promotions, setPromotions] = useState([
        {
            id: 1,
            name: "Back to School Sale",
            discount: "20%",
            type: "Flash Sale",
            startDate: "2025-08-01T00:00:00",
            endDate: "2025-08-20T23:59:59",
            status: "Active",
            usageLimit: 100,
            claimed: 80,
            badge: "🔥 Hot Deal",
        },
        {
            id: 2,
            name: "Buy 1 Get 1 Free - Snacks",
            discount: "BOGO",
            type: "BOGO",
            startDate: "2025-08-10T00:00:00",
            endDate: "2025-08-12T23:59:59",
            status: "Expired",
            usageLimit: 50,
            claimed: 50,
            badge: "⚡ Flash Sale",
        },
    ]);
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const filteredPromotions = promotions.filter((promo) =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handlePauseAll = () => {
        setPromotions((prev) =>
            prev.map((p) =>
                p.status === "Active" ? { ...p, status: "Paused" } : p
            )
        );
    };

    const handleDeleteExpired = () => {
        setPromotions((prev) => prev.filter((p) => p.status !== "Expired"));
    };

    const handleToggleStatus = (id) => {
        setPromotions((prev) =>
            prev.map((p) =>
                p.id === id
                    ? {
                          ...p,
                          status: p.status === "Active" ? "Paused" : "Active",
                      }
                    : p
            )
        );
    };

    const handleDuplicate = (promo) => {
        const newPromo = {
            ...promo,
            id: Date.now(),
            name: `${promo.name} (Copy)`,
            status: "Paused",
        };
        setPromotions((prev) => [...prev, newPromo]);
    };

    const formatCountdown = (endDate) => {
        const end = new Date(endDate).getTime();
        const diff = end - now.getTime();
        if (diff <= 0) return "Expired";
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SellerSidebar shopName="Gemilang Berjaya" />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Promotions
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create, manage, and track promotions to boost your
                            sales.
                        </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow">
                        <Plus className="w-4 h-4" /> New Promotion
                    </button>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm mb-6 gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search promotions..."
                        className="flex-1 outline-none border-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select className="border p-2 rounded text-sm">
                        <option value="">All Types</option>
                        <option value="Flash Sale">Flash Sale</option>
                        <option value="BOGO">Buy 1 Get 1</option>
                        <option value="Voucher">Voucher</option>
                        <option value="Free Shipping">Free Shipping</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">
                        {filteredPromotions.length} promotions found
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handlePauseAll}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Pause All
                        </button>
                        <button
                            onClick={handleDeleteExpired}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                        >
                            Delete Expired
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700 text-sm">
                                <th className="py-3 px-4">Promotion Name</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Discount</th>
                                <th className="py-3 px-4">Badge</th>
                                <th className="py-3 px-4">Usage</th>
                                <th className="py-3 px-4">Ends In</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.map((promo) => (
                                <tr
                                    key={promo.id}
                                    className="border-b hover:bg-gray-50 text-black"
                                >
                                    <td className="py-3 px-4 font-medium">
                                        {promo.name}
                                    </td>
                                    <td className="py-3 px-4">{promo.type}</td>
                                    <td className="py-3 px-4">
                                        {promo.discount}
                                    </td>
                                    <td className="py-3 px-4">{promo.badge}</td>
                                    <td className="py-3 px-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (promo.claimed /
                                                            promo.usageLimit) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {promo.claimed}/{promo.usageLimit}{" "}
                                            claimed
                                        </p>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">
                                        {promo.status === "Expired"
                                            ? "Expired"
                                            : formatCountdown(promo.endDate)}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                promo.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : promo.status === "Paused"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {promo.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button
                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDuplicate(promo)
                                            }
                                            className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200"
                                            title="Duplicate"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                        {promo.status === "Active" ? (
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(promo.id)
                                                }
                                                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                                                title="Pause"
                                            >
                                                <Pause className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(promo.id)
                                                }
                                                className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                                                title="Activate"
                                            >
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            title="Delete"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
