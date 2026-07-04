import { useState } from "react";
import { Link } from "@inertiajs/react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

export function CartCard({
    item, // 完整的 cart item 数据
    isLoading = false,
}) {
    console.log("CartCard item:", item); // 调试输出

    const product = item.product;
    const variant = item.selected_variant;

    // ========== Render ==========
    return (
        <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-center">
            {/* Product Info */}
            <div className="flex items-center gap-4 md:col-span-6 w-full md:w-auto">
                <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                        src={import.meta.env.VITE_BASE_URL + product.product_image}
                        alt={product.product_name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                        {product.product_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {product.category.category_name}
                    </p>
                    {/* {variant && (
                        <p className="text-xs text-gray-400 truncate">
                            {variant.combination}
                        </p>
                    )} */}
                    <p className="text-xs text-gray-400 truncate">
                        {product.seller?.seller_store?.store_name}
                    </p>
                </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between md:justify-center md:col-span-2 w-full md:w-auto mt-3 md:mt-0">
                <span className="text-sm text-gray-500 md:hidden">Qty:</span>
                <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                    <button
                        // onClick={() => updateQuantity(item.id, variant.quantity - 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50"
                        disabled={variant.quantity <= 1}
                    >
                        <FaMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {variant.quantity}
                    </span>
                    <button
                        // onClick={() => updateQuantity(item.id, variant.quantity + 1)}
                        className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50"
                        disabled={variant.quantity >= product.product_quantity}
                    >
                        <FaPlus className="text-xs text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between md:justify-end md:col-span-3 w-full md:w-auto mt-3 md:mt-0">
                <span className="text-sm text-gray-500 md:hidden">Price:</span>
                <div className="text-right">
                    <span className="font-bold text-emerald-600 text-base">
                        RM{" "}
                        {(parseFloat(variant.price) * variant.quantity).toFixed(
                            2,
                        )}
                    </span>
                    <p className="text-xs text-gray-400">
                        RM {parseFloat(variant.price).toFixed(2)} each
                    </p>
                    {product.product_quantity < 5 &&
                        product.product_quantity > 0 && (
                            <p className="text-xs text-amber-500">
                                ⚠️ {product.product_quantity} left
                            </p>
                        )}
                </div>
            </div>

            {/* Action */}
            {/* <div className="flex justify-end md:col-span-1 w-full md:w-auto mt-3 md:mt-0">
                <button
                    onClick={() => removeItem(item.id)}
                    disabled={loadingStates[item.id]}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2 disabled:opacity-50"
                >
                    {loadingStates[item.id] ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <FaTrash className="text-sm" />
                    )}
                </button>
            </div> */}
        </div>
    );
}
