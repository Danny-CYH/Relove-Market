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
    FaExclamationTriangle,
    FaSpinner,
    FaTrashAlt,
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
        if (combo.Colors) {
            parts.push(combo.Colors);
        }
        if (combo.Size) {
            parts.push(combo.Size);
        }
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

    if (availableVariants.length <= 1) return null;

    return (
        <div className="relative z-10">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap border border-emerald-200"
            >
                {isUpdating ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <span>🔄</span>
                        <span className="text-emerald-800 max-w-[80px] truncate">
                            {getCurrentVariantDisplay()}
                        </span>
                        {isOpen ? (
                            <Icon icon={FaChevronUp} className="w-2.5 h-2.5" />
                        ) : (
                            <Icon
                                icon={FaChevronDown}
                                className="w-2.5 h-2.5"
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
                        className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl shadow-2xl border-2 border-emerald-200 py-1 z-20 max-h-56 overflow-y-auto"
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
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                        isSelected
                                            ? "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500"
                                            : "hover:bg-gray-50 text-gray-700"
                                    }`}
                                >
                                    {vColor && (
                                        <span
                                            className="w-5 h-5 rounded-full border-2 border-white shadow-md flex-shrink-0"
                                            style={{
                                                backgroundColor:
                                                    vColor.toLowerCase(),
                                            }}
                                        />
                                    )}
                                    <span className="flex-1 text-left text-xs font-medium">
                                        {vLabel}
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
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
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                <button
                    onClick={() => onUpdate(quantity - 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50"
                    disabled={quantity <= 1}
                >
                    <Icon icon={FaMinus} className="text-xs text-gray-600" />
                </button>
                <span className="w-8 text-center text-sm font-medium text-gray-900">
                    {quantity}
                </span>
                <button
                    onClick={() => onUpdate(quantity + 1)}
                    className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50"
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
    const isOutOfStock = selected_variant.quantity;

    const hasMultipleVariants = productVariants.length > 1;
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
        const combo = v.variant_combination || {};
        return combo.Colors || combo.Color || "";
    };

    const handleVariantSelect = async (v) => {
        setIsUpdatingVariant(true);

        try {
            // ✅ 使用 cartId 而不是 productId 更新变体
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

    const handleQuantityUpdate = (newQuantity: number) => {
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

        // 如果是字符串，解析为对象
        if (typeof parsed === "string") {
            try {
                parsed = JSON.parse(parsed);
            } catch (e) {
                console.error("Error parsing variant:", e);
                return null;
            }
        }

        // 如果是数组，取第一个
        if (Array.isArray(parsed)) {
            return parsed.length > 0 ? parsed[0] : null;
        }

        return parsed;
    }, [item.selected_variant]);

    // ========== Render ==========
    return (
        <div>
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                <div className="flex items-center gap-3">
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
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <Icon
                            icon={FaStore}
                            className="w-4 h-4 text-emerald-500"
                        />
                        <span>{product_info.seller_store}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
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

                    <button
                        onClick={handleRemove}
                        disabled={isLoading}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Remove item"
                    >
                        {isLoading ? (
                            <Icon
                                icon={FaSpinner}
                                className="w-4 h-4 animate-spin"
                            />
                        ) : (
                            <Icon icon={FaTrashAlt} className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-start md:items-center p-4">
                <div className="flex items-center gap-4 md:col-span-6 w-full md:w-auto">
                    <div className="relative w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                            src={
                                import.meta.env.VITE_BASE_URL +
                                product_info.product_image
                            }
                            alt={product_info.product_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                            }}
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <Link
                            href={route("relove-market.product-details", {
                                productId: product_info.product_id,
                            })}
                            className="hover:text-emerald-600 transition-colors"
                        >
                            <h3 className="font-semibold text-gray-900 truncate">
                                {product_info.product_name}
                            </h3>
                        </Link>

                        <div className="flex items-center gap-1 mt-0.5">
                            <Icon
                                icon={FaTag}
                                className="w-3 h-3 text-emerald-500"
                            />
                            <span className="text-xs text-emerald-600 font-medium">
                                {product_info.category}
                            </span>
                        </div>

                        {selected_variant.quantity <= 5 && (
                            <div className="flex items-center gap-1.5 mt-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-200 w-fit">
                                <Icon
                                    icon={FaExclamationTriangle}
                                    className="w-3 h-3"
                                />
                                Only {selected_variant.quantity} left in stock -
                                Order soon!
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full md:col-span-6 mt-3 md:mt-0">
                    <div className="flex items-center gap-3 flex-wrap">
                        <QuantityControl
                            quantity={selectedQuantity}
                            stock={stockAvailable}
                            onUpdate={handleQuantityUpdate}
                            isLoading={isLoading}
                            isOutOfStock={isOutOfStock}
                        />
                    </div>

                    <div className="text-right">
                        <span className="font-bold text-emerald-600 text-base">
                            RM{" "}
                            {(selectedVariantPrice * selectedQuantity).toFixed(
                                2,
                            )}
                        </span>
                        {selectedQuantity > 1 && (
                            <p className="text-xs text-gray-400">
                                RM {selectedVariantPrice} ea
                            </p>
                        )}
                        {stockAvailable < 5 && stockAvailable > 0 && (
                            <p className="text-xs text-amber-500">
                                ⚠️ {stockAvailable} left
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartCard;
