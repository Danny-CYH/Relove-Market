export default function Create_Subscriptions_Modal({
    onClose,
    onSubmit,
    loading,
    formData,
    onInputChange,
    onFeatureChange,
    onAddFeature,
    onRemoveFeature,
    errors,
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Create New Subscription Plan
                    </h3>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Plan Name *
                            </label>
                            <input
                                type="text"
                                name="plan_name"
                                value={formData.plan_name}
                                onChange={(e) =>
                                    onInputChange("plan_name", e.target.value)
                                }
                                className={`text-black w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.plan_name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="e.g., Basic Plan"
                            />
                            {errors.plan_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.plan_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price *
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">
                                    RM
                                </span>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={(e) =>
                                        onInputChange("price", e.target.value)
                                    }
                                    className={`text-black w-full border rounded-md pl-8 pr-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                        errors.price
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    placeholder="0.00"
                                />
                            </div>
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration (days) *
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={(e) =>
                                    onInputChange("duration", e.target.value)
                                }
                                className={`text-black w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                    errors.duration
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                placeholder="e.g., 30"
                            />
                            {errors.duration && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.duration}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Limits Section */}
                    <div className="border-t pt-4">
                        <h4 className="text-md font-medium text-gray-900 mb-3">
                            Plan Limits
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Products
                                </label>
                                <input
                                    type="text"
                                    name="max_products"
                                    value={formData.limits?.max_products || ""}
                                    onChange={(e) =>
                                        onInputChange("limits", {
                                            ...formData.limits,
                                            max_products: e.target.value,
                                        })
                                    }
                                    className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., 50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Max Conversations
                                </label>
                                <input
                                    type="text"
                                    name="max_conversations"
                                    value={
                                        formData.limits?.max_conversations || ""
                                    }
                                    onChange={(e) =>
                                        onInputChange("limits", {
                                            ...formData.limits,
                                            max_conversations: e.target.value,
                                        })
                                    }
                                    className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., 15"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Listing
                                </label>
                                <select
                                    value={
                                        formData.limits?.featured_listing
                                            ? "true"
                                            : "false"
                                    }
                                    onChange={(e) =>
                                        onInputChange("limits", {
                                            ...formData.limits,
                                            featured_listing:
                                                e.target.value === "true",
                                        })
                                    }
                                    className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                onInputChange("description", e.target.value)
                            }
                            rows="3"
                            className="text-black w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Describe the subscription plan..."
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Features *
                            </label>
                            <button
                                type="button"
                                onClick={onAddFeature}
                                className="text-sm text-indigo-600 hover:text-indigo-700"
                            >
                                + Add Feature
                            </button>
                        </div>
                        {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={feature}
                                    onChange={(e) =>
                                        onFeatureChange(index, e.target.value)
                                    }
                                    className="text-black flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g., 24/7 Support"
                                />
                                {formData.features.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => onRemoveFeature(index)}
                                        className="px-3 py-2 text-red-600 hover:text-red-700"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                        {errors.features && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.features}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Plan"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
