import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faEdit,
    faTrash,
    faCrown,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

import { Sidebar } from "@/Components/Admin/Sidebar";

export default function SubscriptionManagement() {
    const { props } = usePage();

    const list_subscription = props.list_subscription;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSub, setCurrentSub] = useState(null);

    // Open modal for editing
    const openEditModal = (sub) => {
        setCurrentSub(sub);
        setIsModalOpen(true);
    };

    // Handle save
    const handleSave = () => {
        setSubscriptions((prev) =>
            prev.map((sub) => (sub.id === currentSub.id ? currentSub : sub))
        );
        setIsModalOpen(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Edit Modal */}
            {isModalOpen && currentSub && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faEdit} /> Edit Subscription
                        </h2>

                        {/* Form Fields */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Plan Name
                            </label>
                            <input
                                type="text"
                                value={currentSub.name}
                                onChange={(e) =>
                                    setCurrentSub({
                                        ...currentSub,
                                        name: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Price ($)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={currentSub.price}
                                onChange={(e) =>
                                    setCurrentSub({
                                        ...currentSub,
                                        price: parseFloat(e.target.value),
                                    })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Duration
                            </label>
                            <input
                                type="text"
                                value={currentSub.duration}
                                onChange={(e) =>
                                    setCurrentSub({
                                        ...currentSub,
                                        duration: e.target.value,
                                    })
                                }
                                className="mt-1 block w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Save Changes
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
                <div className="p-6 bg-white rounded-xl shadow-md">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faCrown}
                                className="text-yellow-500"
                            />
                            Subscription Management
                        </h1>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow">
                            <FontAwesomeIcon icon={faPlus} /> Add New Plan
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 text-sm text-black">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 border-b text-left font-semibold text-gray-600">
                                        Plan Name
                                    </th>
                                    <th className="px-4 py-3 border-b text-left font-semibold text-gray-600">
                                        Duration
                                    </th>
                                    <th className="px-4 py-3 border-b text-left font-semibold text-gray-600">
                                        Price
                                    </th>
                                    <th className="px-4 py-3 border-b text-center font-semibold text-gray-600">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {list_subscription.map((sub) => (
                                    <tr
                                        key={sub.subscriptions_id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3 border-b">
                                            {sub.subscription_name}
                                        </td>
                                        <td className="px-4 py-3 border-b">
                                            {sub.duration} days
                                        </td>
                                        <td className="px-4 py-3 border-b text-green-600 font-bold flex items-center gap-1">
                                            RM {parseFloat(sub.price)}
                                        </td>
                                        <td className="px-4 py-3 border-b text-center">
                                            <div className="flex justify-center gap-3">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(sub)
                                                    }
                                                    className="text-yellow-500 hover:text-yellow-600"
                                                    title="Edit"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                    />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
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
