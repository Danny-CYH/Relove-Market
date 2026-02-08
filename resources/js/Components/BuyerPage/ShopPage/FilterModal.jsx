export function FilterModal({
    expandedFilters,
    handlePriceInputChange,
    list_categoryItem,
    priceRange,
    categoryCounts,
    resetFilters,
    selectedCategories,
    selectedConditions,
    toggleCategory,
    toggleCondition,
    toggleFilterSection,
}) {
    const categories = list_categoryItem || [];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                    onClick={resetFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Reset
                </button>
            </div>

            <div className="space-y-5">
                {/* Categories */}
                <div>
                    <button
                        onClick={() => toggleFilterSection("categories")}
                        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900"
                    >
                        <span>Categories</span>
                        <span>{expandedFilters.categories ? "−" : "+"}</span>
                    </button>
                    {expandedFilters.categories && (
                        <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
                            {categories.map((category) => {
                                const name = category.category_name;
                                const count =
                                    categoryCounts?.[name] ??
                                    categoryCounts?.[category.category_id] ??
                                    0;
                                const checked =
                                    selectedCategories.includes(name);
                                return (
                                    <label
                                        key={category.category_id}
                                        className="flex items-center justify-between gap-2 text-sm text-gray-700"
                                    >
                                        <span className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 rounded"
                                                checked={checked}
                                                onChange={() =>
                                                    toggleCategory(name)
                                                }
                                            />
                                            {name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {count}
                                        </span>
                                    </label>
                                );
                            })}
                            {categories.length === 0 && (
                                <p className="text-xs text-gray-500">
                                    No categories available.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Price */}
                <div>
                    <button
                        onClick={() => toggleFilterSection("price")}
                        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900"
                    >
                        <span>Price Range</span>
                        <span>{expandedFilters.price ? "−" : "+"}</span>
                    </button>
                    {expandedFilters.price && (
                        <div className="mt-3 space-y-3">
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
                            <p className="text-xs text-gray-500">
                                Set min and max price.
                            </p>
                        </div>
                    )}
                </div>

                {/* Condition */}
                <div>
                    <button
                        onClick={() => toggleFilterSection("condition")}
                        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900"
                    >
                        <span>Condition</span>
                        <span>{expandedFilters.condition ? "−" : "+"}</span>
                    </button>
                    {expandedFilters.condition && (
                        <div className="mt-3 space-y-2">
                            {["New", "Excellent", "Good", "Fair"].map(
                                (condition) => (
                                    <label
                                        key={condition}
                                        className="flex items-center gap-2 text-sm text-gray-700"
                                    >
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 rounded"
                                            checked={selectedConditions.includes(
                                                condition
                                            )}
                                            onChange={() =>
                                                toggleCondition(condition)
                                            }
                                        />
                                        {condition}
                                    </label>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
