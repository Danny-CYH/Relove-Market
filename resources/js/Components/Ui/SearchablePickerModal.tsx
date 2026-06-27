import { FaSearch, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function SearchablePickerModal({
    isOpen,
    onClose,
    items = [],
    onSelect,
    title = "Search Products",
    placeholder = "What are you looking for?",
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    // 内部处理搜索
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 2) {
            setResults([]);
            return;
        }

        const query = searchTerm.toLowerCase();
        const filtered = items.filter((item) => {
            const name = item.product_name?.toLowerCase() || "";
            const category = item.category?.category_name?.toLowerCase() || "";
            return name.includes(query) || category.includes(query);
        });
        setResults(filtered);
    }, [searchTerm, items]);

    // 关闭时重置
    const handleClose = () => {
        setSearchTerm("");
        setResults([]);
        onClose();
    };

    const handleSelect = (item) => {
        setSearchTerm("");
        setResults([]);
        onSelect(item);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {title}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <FaTimes className="text-gray-500" />
                            </button>
                        </div>

                        {/* Search Input */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 text-sm text-black border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-60 p-2">
                            {/* 热门搜索（没有搜索词时显示） */}
                            {!searchTerm && (
                                <div className="p-2">
                                    <p className="text-xs text-gray-400 font-medium mb-3">
                                        POPULAR SEARCHES
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {["Vintage Sofa", "Laptop", "Handbag", "Books", "Samsung"].map(
                                            (tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1.5 text-sm bg-gray-100 text-black rounded-full hover:bg-gray-200 cursor-pointer transition"
                                                    onClick={() => setSearchTerm(tag)}
                                                >
                                                    {tag}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* 搜索结果 */}
                            {searchTerm.length >= 2 && (
                                <div className="p-2">
                                    {results.length > 0 ? (
                                        <div className="space-y-1">
                                            {results.map((item) => (
                                                <div
                                                    key={item.product_id}
                                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    <img
                                                        src={
                                                            import.meta.env
                                                                .VITE_BASE_URL +
                                                            item.product_image?.[0]
                                                                ?.image_path
                                                        }
                                                        alt={item.product_name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-gray-900 text-sm truncate">
                                                            {item.product_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {item.category?.category_name}
                                                        </p>
                                                    </div>
                                                    <span className="font-bold text-green-600 text-sm whitespace-nowrap">
                                                        RM {item.product_price}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p className="text-sm">No results found</p>
                                            <p className="text-xs">Try a different keyword</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}