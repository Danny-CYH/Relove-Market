import React from "react";
import { FaSearch } from "react-icons/fa";

export default function SearchBar({
    className,
    placeholder,
    handleSearch,
    setShowSearchResults,
    searchQuery,
}) {
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
