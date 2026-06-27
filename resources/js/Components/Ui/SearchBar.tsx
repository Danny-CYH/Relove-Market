import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({
    className,
    placeholder,
    setShowSearchResults,
    list_shoppingItem,
    onSearchResults,
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    // Handle search functionality
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (query.length > 1) {
            // Filter items based on search query
            const results = list_shoppingItem.filter(
                (product) =>
                    product.product_name
                        ?.toLowerCase()
                        .includes(query.toLowerCase()) ||
                    product.category?.category_name
                        ?.toLowerCase()
                        .includes(query.toLowerCase()),
            );

            // 🆕 把搜索结果传给父组件
            if (onSearchResults) {
                onSearchResults(results, query);
            }

            setShowSearchResults(true);
        } else {
            // 🆕 空搜索时，传空数组给父组件
            if (onSearchResults) {
                onSearchResults([], "");
            }
            setShowSearchResults(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder={placeholder}
                className={className}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() =>
                    searchQuery.length > 1 && setShowSearchResults(true)
                }
                onBlur={() =>
                    setTimeout(() => setShowSearchResults(false), 200)
                }
            />
            <button className="absolute right-3 top-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full">
                <FaSearch className="text-lg" />
            </button>
        </div>
    );
}
