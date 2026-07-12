import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "@inertiajs/react";
import {
    FaPlus,
    FaMinus,
    FaChevronDown,
    FaChevronUp,
    FaCheck,
    FaStore,
    FaTag,
    FaTrashAlt,
    FaHeart,
    FaShareAlt,
    FaExclamationTriangle,
    FaSpinner
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { Icon } from "./Icon";

// ========== 子组件：变体下拉菜单 ==========
function VariantDropdown({
    variant,
    availableVariants,
    isVariantSelected,
    getVariantColor,
    getVariantLabel,
    onSelect,
    isUpdating,
    isOutOfStock,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    const getCurrentVariantDisplay = () => {
        if (!variant) return null;
        const combo = variant.variant_combination || {};
        const parts = [];
        if (combo.Colors) parts.push(combo.Colors);
        if (combo.Size) parts.push(combo.Size);
        return parts.join(" • ") || variant.variant_key || "Variant";
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50">
            {" "}
            {/* ✅ 增加 z-50 */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-50 whitespace-nowrap border border-gray-200"
            >
                {isUpdating ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <span className="text-gray-400">🔄</span>
                        <span className="text-gray-700 max-w-[80px] truncate">
                            {getCurrentVariantDisplay()}
                        </span>
                        {isOpen ? (
                            <Icon
                                icon={FaChevronUp}
                                className="w-2.5 h-2.5 text-gray-400"
                            />
                        ) : (
                            <Icon
                                icon={FaChevronDown}
                                className="w-2.5 h-2.5 text-gray-400"
                            />
                        )}
                    </>
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-[100] max-h-56 overflow-y-auto" // ✅ z-[100]
                    >
                        {availableVariants.map((v) => {
                            const isSelected = isVariantSelected(v);
                            const vColor = getVariantColor(v);
                            const vLabel = getVariantLabel(v);
                            const vPrice = parseFloat(v.price || 0);
                            return (
                                <button
                                    key={v.variant_id}
                                    onClick={() => {
                                        onSelect(v);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                                        isSelected
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    {vColor && (
                                        <span
                                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    vColor.toLowerCase(),
                                            }}
                                        />
                                    )}
                                    <span className="flex-1 text-left text-xs font-medium">
                                        {vLabel}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                        RM {vPrice.toFixed(2)}
                                    </span>
                                    {isSelected && (
                                        <Icon
                                            icon={FaCheck}
                                            className="w-4 h-4 text-emerald-600"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ========== 子组件：数量控制器 ==========
function QuantityControl({
    quantity,
    stock,
    onUpdate,
    isLoading,
    isOutOfStock,
}) {
    const isAtMaxStock = quantity >= stock;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-1 bg-gray-50 rounded-full border border-gray-200 overflow-hidden">
                <button
                    onClick={() => onUpdate(quantity - 1)}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                >
                    <Icon icon={FaMinus} className="text-xs text-gray-600" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                </span>
                <button
                    onClick={() => onUpdate(quantity + 1)}
                    className="px-3 py-1.5 hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isAtMaxStock}
                >
                    <Icon icon={FaPlus} className="text-xs text-gray-600" />
                </button>
            </div>
        </div>
    );
}

// ========== 主组件 ==========
export function CartCard({
    item,
    onUpdateQuantity,
    onRemove,
    onUpdateVariant,
    isLoading = false,
    isSelected = false,
    onSelect,
}) {
    const [isUpdatingVariant, setIsUpdatingVariant] = useState(false);

    const product_info = item.product;
    const productVariants = item.product.product_variant;

    const selected_variant = item.selected_variant;
    const selectedVariantPrice = item.selected_variant.price;
    const selectedQuantity = item.selected_quantity;

    const stockAvailable = selected_variant.quantity;
    const isOutOfStock = selected_variant.quantity === 0;

    const hasMultipleVariants = productVariants.length >= 1;
    const availableVariants = productVariants.filter(
        (v) => Number(v.quantity) > 0,
    );

    // ========== 变体辅助函数 ==========
    const isVariantSelected = (v) =>
        selected_variant.variant_id === v.variant_id;

    const getVariantLabel = (v) => {
        const combo = v.variant_combination;
        const parts = [];
        if (combo.Colors) parts.push(combo.Colors);
        if (combo.Size) parts.push(combo.Size);
        return parts.join(" • ");
    };

    const getVariantColor = (v) => {
        const combo = v.variant_combination;
        return combo.Colors;
    };

    const handleVariantSelect = async (v) => {
        setIsUpdatingVariant(true);

        try {
            await onUpdateVariant?.(product_info.product_id, {
                variant_id: v.variant_id,
                variant_combination: v.variant_combination || {},
                price: v.price,
                quantity: v.quantity,
            });
        } catch (error) {
            console.error("Error updating variant:", error);
        } finally {
            setIsUpdatingVariant(false);
        }
    };

    const handleQuantityUpdate = (newQuantity) => {
        onUpdateQuantity?.(product_info.product_id, newQuantity);
    };

    const handleRemove = () => {
        onRemove?.(product_info.product_id);
    };

    const handleSelect = () => {
        onSelect?.(product_info.product_id);
    };

    const variant = useMemo(() => {
        if (!item.selected_variant) return null;

        let parsed = item.selected_variant;

        if (typeof parsed === "string") {
            try {
                parsed = JSON.parse(parsed);
            } catch (e) {
                console.error("Error parsing variant:", e);
                return null;
            }
        }

        if (Array.isArray(parsed)) {
            return parsed.length > 0 ? parsed[0] : null;
        }

        return parsed;
    }, [item.selected_variant]);

    // ========== Render ==========
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                    ? "border-emerald-400 shadow-lg shadow-emerald-100/50"
                    : "border-gray-100 hover:border-gray-200 hover:shadow-md"
            } ${isOutOfStock ? "opacity-60" : ""}`}
        >
            {/* ✅ 选中状态标签 */}
            {isSelected && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-medium rounded-full">
                        <Icon icon={FaCheck} className="w-2.5 h-2.5" />
                        Selected
                    </span>
                </div>
            )}

            {/* ✅ 主体内容 */}
            <div className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* ✅ 复选框 + 图片区域 */}
                    <div className="flex items-center gap-4 sm:w-2/5">
                        <label className="relative flex items-center cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={handleSelect}
                                className="w-4 h-4 text-emerald-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all group-hover:border-emerald-400"
                                disabled={isLoading}
                            />
                            <span className="absolute -inset-2" />
                        </label>

                        <Link
                            href={route("relove-market.product-details", {
                                productId: product_info.product_id,
                            })}
                            className="relative flex-shrink-0"
                        >
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border border-gray-100 transition-all duration-300 group-hover:shadow-md">
                                <img
                                    src={
                                        import.meta.env.VITE_BASE_URL +
                                        product_info.product_image
                                    }
                                    alt={product_info.product_name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        e.target.src = "/placeholder.jpg";
                                    }}
                                />
                            </div>
                            {isOutOfStock && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-medium px-1.5 py-0.5 rounded-full">
                                    Out
                                </span>
                            )}
                        </Link>

                        <div className="min-w-0 flex-1">
                            <Link
                                href={route("relove-market.product-details", {
                                    productId: product_info.product_id,
                                })}
                                className="hover:text-emerald-600 transition-colors"
                            >
                                <h3 className="font-semibold text-gray-900 text-sm truncate">
                                    {product_info.product_name}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <div className="flex items-center gap-1">
                                    <Icon
                                        icon={FaStore}
                                        className="w-3 h-3 text-gray-400"
                                    />
                                    <span className="text-xs text-gray-500">
                                        {product_info.seller_store}
                                    </span>
                                </div>
                                <span className="text-gray-300 text-xs">•</span>
                                <div className="flex items-center gap-1">
                                    <Icon
                                        icon={FaTag}
                                        className="w-3 h-3 text-emerald-400"
                                    />
                                    <span className="text-xs text-emerald-600 font-medium">
                                        {product_info.category}
                                    </span>
                                </div>
                            </div>

                            {!isOutOfStock && stockAvailable <= 5 && (
                                <div className="flex items-center gap-1.5 mt-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-200 w-fit">
                                    <Icon
                                        icon={FaExclamationTriangle}
                                        className="w-3 h-3"
                                    />
                                    Only {stockAvailable} left
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ✅ 右侧：数量 + 价格 + 操作 */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:w-3/5">
                        <div className="flex items-center gap-3">
                            <QuantityControl
                                quantity={selectedQuantity}
                                stock={stockAvailable}
                                onUpdate={handleQuantityUpdate}
                                isLoading={isLoading}
                                isOutOfStock={isOutOfStock}
                            />

                            {hasMultipleVariants && (
                                <VariantDropdown
                                    variant={selected_variant}
                                    availableVariants={availableVariants}
                                    isVariantSelected={isVariantSelected}
                                    getVariantColor={getVariantColor}
                                    getVariantLabel={getVariantLabel}
                                    onSelect={handleVariantSelect}
                                    isUpdating={isUpdatingVariant}
                                    isOutOfStock={isOutOfStock}
                                />
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="font-bold text-emerald-600 text-lg">
                                    RM{" "}
                                    {(
                                        selectedVariantPrice * selectedQuantity
                                    ).toFixed(2)}
                                </span>
                                {selectedQuantity > 1 && (
                                    <p className="text-xs text-gray-400">
                                        RM {selectedVariantPrice} ea
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleRemove}
                                    disabled={isLoading}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Remove item"
                                >
                                    {isLoading ? (
                                        <Icon
                                            icon={FaSpinner}
                                            className="w-4 h-4 animate-spin"
                                        />
                                    ) : (
                                        <Icon
                                            icon={FaTrashAlt}
                                            className="w-4 h-4"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ 底部快速操作栏 */}
            <div className="px-4 sm:px-5 py-2 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button className="text-xs text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-1">
                        <Icon icon={FaHeart} className="w-3 h-3" />
                        Wishlist
                    </button>
                    <button className="text-xs text-gray-400 hover:text-emerald-600 transition-colors flex items-center gap-1">
                        <Icon icon={FaShareAlt} className="w-3 h-3" />
                        Share
                    </button>
                </div>
                <div className="text-[10px] text-gray-400">
                    Item ID: {product_info.product_id}
                </div>
            </div>
        </motion.div>
    );
}

export default CartCard;
