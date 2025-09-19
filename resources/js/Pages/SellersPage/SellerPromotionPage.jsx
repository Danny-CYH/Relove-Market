import React, { useState, useEffect, useMemo } from "react";

import { Plus, Edit, Trash, Search, Eye, Pause, Play } from "lucide-react";

import axios from "axios";

import { SellerSidebar } from "@/Components/Seller/SellerSidebar";

import { SellerViewPromotion_Modal } from "@/Components/Seller/SellerViewPromotion_Modal";
import { SellerAddPromotion_Modal } from "@/Components/Seller/SellerAddPromotion_Modal";
import { SellerEditPromotion_Modal } from "@/Components/Seller/SellerEditPromotion_Modal";
import { SellerDeletePromotion_Modal } from "@/Components/Seller/SellerDeletePromotion_Modal";

export default function SellerPromotionPage({ list_promotion }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const [viewPromotion, setViewPromotion] = useState(null);
    const [editPromotion, setEditPromotion] = useState(null);
    const [deletePromotion, setDeletePromotion] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("");
    const [promotions, setPromotions] = useState([]);

    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatCountdown = (startDate, endDate) => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        const nowTime = now.getTime();

        if (nowTime < start) {
            // Not started yet → countdown to start
            const diff = start - nowTime;
            return `Starts in ${formatDiff(diff)}`;
        } else if (nowTime >= start && nowTime < end) {
            // Already started → countdown to end
            const diff = end - nowTime;
            return `Ends in ${formatDiff(diff)}`;
        } else {
            // Already expired
            return "Expired";
        }
    };

    const formatDiff = (diff) => {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        return d > 0 ? `${d}d ${h}h ${m}m ${s}s` : `${h}h ${m}m ${s}s`;
    };

    const filteredPromotions = useMemo(() => {
        return list_promotion
            .filter((p) =>
                p.promotion_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase().trim())
            )
            .filter((p) => (typeFilter ? p.type === typeFilter : true));
    }, [list_promotion, searchTerm, typeFilter]);

    // KPIs
    const kpi = useMemo(() => {
        const active = promotions.filter((p) => p.status === "Active").length;
        const claimed = promotions.reduce((a, c) => a + (c.claimed || 0), 0);
        const expiringSoon = promotions.filter(
            (p) =>
                formatCountdown(p.endDate) !== "Expired" &&
                new Date(p.endDate) - now < 24 * 3600 * 1000
        ).length;
        return { active, claimed, expiringSoon };
    }, [promotions, now]);

    const add_promotion = async (e, formData) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                route("add-promotion"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const edit_promotion = async (e, formData) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                route("edit-promotion"),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const delete_promotion = async (e, promotionID) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                route("delete-promotion"),
                promotionID,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <SellerSidebar shopName="Gemilang Berjaya" />

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Promotions
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create, manage, and track promotions to boost your
                            sales.
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setIsAddOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                    >
                        <Plus className="w-4 h-4" /> New Promotion
                    </button>
                </div>

                {/* Analytics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow flex flex-col">
                        <span className="text-sm text-gray-500">
                            Active Promotions
                        </span>
                        <span className="text-xl font-bold text-green-600">
                            {kpi.active}
                        </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow flex flex-col">
                        <span className="text-sm text-gray-500">
                            Total Claimed
                        </span>
                        <span className="text-xl font-bold text-blue-600">
                            {kpi.claimed}
                        </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow flex flex-col">
                        <span className="text-sm text-gray-500">
                            Revenue Impact
                        </span>
                        <span className="text-xl font-bold text-purple-600">
                            RM 12,340
                        </span>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow flex flex-col">
                        <span className="text-sm text-gray-500">
                            Expiring Soon
                        </span>
                        <span className="text-xl font-bold text-red-600">
                            {kpi.expiringSoon}
                        </span>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="flex items-center bg-white p-3 rounded-lg shadow-sm gap-3">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search promotions..."
                        className="flex-1 outline-none border-none text-black focus:ring-0 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Bulk Actions */}
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        {filteredPromotions.length} promotions found
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm text-black bg-gray-100 rounded hover:bg-gray-200">
                            Pause All
                        </button>
                        <button className="px-3 py-1 text-sm text-black bg-gray-100 rounded hover:bg-gray-200">
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
                                <th className="py-3 px-4">Promotion Type</th>
                                <th className="py-3 px-4">Discount</th>
                                <th className="py-3 px-4">Usage</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPromotions.map((promo) => (
                                <tr
                                    key={promo.promotion_id}
                                    className="border-b hover:bg-gray-50 text-black"
                                >
                                    <td className="py-3 px-4 font-medium">
                                        {promo.promotion_name}
                                    </td>
                                    <td className="py-3 px-4 font-medium">
                                        {promo.promotion_type}
                                    </td>
                                    <td className="py-3 px-4">
                                        {promo.promotion_discount} %
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="w-40 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full"
                                                style={{
                                                    width: `${
                                                        (promo.claimed /
                                                            Math.max(
                                                                1,
                                                                promo.promotion_limit
                                                            )) *
                                                        100
                                                    }%`,
                                                }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {promo.promotion_limit} /{" "}
                                            {promo.promotion_limit} claimed
                                        </p>
                                    </td>
                                    <td className="py-3 px-4 text-sm font-medium">
                                        {formatCountdown(
                                            promo.promotion_startDate,
                                            promo.promotion_endDate
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                promo.promotion_status ===
                                                "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : promo.status === "Paused"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {promo.promotion_status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 flex gap-2">
                                        <button
                                            onClick={() => {
                                                setViewPromotion(promo);
                                                setIsViewOpen(true);
                                            }}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                            title="Preview"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditPromotion(promo);
                                                setIsEditOpen(true);
                                            }}
                                            className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200"
                                            title="Edit"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setDeletePromotion(promo.promotion_id);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                            title="Delete"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {filteredPromotions.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-10 text-center text-gray-500"
                                    >
                                        No promotions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modals for adding promotions */}
            {isAddOpen && (
                <SellerAddPromotion_Modal
                    onAdd={(e, formData) => {
                        add_promotion(e, formData);
                    }}
                    onClose={() => setIsAddOpen(false)}
                />
            )}

            {/* Modal for edit the promotions */}
            {isEditOpen && (
                <SellerEditPromotion_Modal
                    promotion={editPromotion}
                    onEdit={(e, formData) => {
                        edit_promotion(e, formData);
                    }}
                    onClose={() => {
                        setIsEditOpen(false);
                    }}
                />
            )}

            {/* Modal for delete the promotion */}
            {isDeleteOpen && (
                <SellerDeletePromotion_Modal
                    promotion={deletePromotion}
                    onDelete={(e, formData) => {
                        delete_promotion(e, formData);
                    }}
                    onClose={() => {
                        setIsDeleteOpen(false);
                    }}
                />
            )}

            {/* Modal for view the promotion */}
            {isViewOpen && (
                <SellerViewPromotion_Modal
                    promotion={viewPromotion}
                    onClose={() => setIsViewOpen(false)}
                />
            )}
        </div>
    );
}
