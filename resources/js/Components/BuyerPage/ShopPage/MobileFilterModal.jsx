import { X } from "lucide-react";

export function MobileFilterModal({
    applyFilters,
    handlePriceInputChange,
    list_categoryItem,
    priceRange,
    resetFilters,
    selectedCategories,
    selectedConditions,
    setMobileFiltersOpen,
    toggleCategory,
    toggleCondition,
}) {
    const categories = list_categoryItem || [];

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Filters
                    </h3>
                    <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-2 text-gray-600 hover:text-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {categories.map((category) => {
                                const name = category.category_name;
                                const active =
                                    selectedCategories.includes(name);
                                return (
                                    <button
                                        key={category.category_id}
                                        onClick={() => toggleCategory(name)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                            active
                                                ? "bg-blue-600 text-white"
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                    >
                                        {name}
                                    </button>
                                );
                            })}
                            {categories.length === 0 && (
                                <p className="text-xs text-gray-500">
                                    No categories available.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Price Range
                        </h4>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                value={priceRange[0]}
                                onChange={(e) =>
                                    handlePriceInputChange(0, e.target.value)
                                }
                                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                            <span className="text-gray-400">to</span>
                            <input
                                type="number"
                                min="0"
                                value={priceRange[1]}
                                onChange={(e) =>
                                    handlePriceInputChange(1, e.target.value)
                                }
                                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Condition
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {["New", "Excellent", "Good", "Fair"].map(
                                (condition) => {
                                    const active =
                                        selectedConditions.includes(condition);
                                    return (
                                        <button
                                            key={condition}
                                            onClick={() =>
                                                toggleCondition(condition)
                                            }
                                            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                                active
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                        >
                                            {condition}
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                    <button
                        onClick={resetFilters}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
                    >
                        Reset
                    </button>
                    <button
                        onClick={applyFilters}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
