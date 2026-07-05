import { useState, useRef, useEffect } from "react";
import { Link } from "@inertiajs/react";
import {
    FaPlus,
    FaMinus,
    FaChevronDown,
    FaChevronUp,
    FaCheck,
    FaStore,
    FaTag,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
        if (combo.Colors || combo.Color)
            parts.push(combo.Colors || combo.Color);
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

    if (availableVariants.length <= 1) return null;

    return (
        <div className="relative z-10">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating || isOutOfStock}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1 rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap border border-emerald-200"
            >
                {isUpdating ? (
                    <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                    <>
                        <span>🔄</span>
                        <span className="text-emerald-800 max-w-[80px] truncate">
                            {getCurrentVariantDisplay() || "Select"}
                        </span>
                        {isOpen ? (
                            <FaChevronUp className="w-2.5 h-2.5" />
                        ) : (
                            <FaChevronDown className="w-2.5 h-2.5" />
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
                                        <FaCheck className="w-4 h-4 text-emerald-600" />
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
    return (
        <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
            <button
                onClick={() => onUpdate(quantity - 1)}
                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-l-lg transition disabled:opacity-50"
                disabled={quantity <= 1 || isLoading || isOutOfStock}
            >
                <FaMinus className="text-xs text-gray-600" />
            </button>
            <span className="w-8 text-center text-sm font-medium text-gray-900">
                {quantity}
            </span>
            <button
                onClick={() => onUpdate(quantity + 1)}
                className="px-2.5 py-1.5 hover:bg-gray-100 rounded-r-lg transition disabled:opacity-50"
                disabled={quantity >= stock || isLoading || isOutOfStock}
            >
                <FaPlus className="text-xs text-gray-600" />
            </button>
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

    // ========== 数据提取 ==========
    const product = item.product;
    const variant = item.selected_variant;
    const variants = product?.product_variant || [];

    const productName = product?.product_name || "Unknown Product";
    const productImage = product?.product_image || "";
    const sellerName =
        product?.seller?.seller_store?.store_name || "Unknown Store";
    const categoryName = product?.category?.category_name || "";
    const quantity = item.selected_quantity || 1;
    const price = parseFloat(variant?.price || 0);
    const stock = parseInt(variant?.quantity || 0);
    const isOutOfStock = stock === 0;

    const availableVariants = variants.filter(
        (v) => parseInt(v.quantity || 0) > 0,
    );
    const hasMultipleVariants = availableVariants.length > 1;

    // ========== 变体辅助函数 ==========
    const isVariantSelected = (v) => variant?.variant_id === v.variant_id;

    const getVariantLabel = (v) => {
        const combo = v.variant_combination || {};
        const parts = [];
        if (combo.Colors || combo.Color)
            parts.push(combo.Colors || combo.Color);
        if (combo.Size) parts.push(combo.Size);
        return parts.join(" • ") || v.variant_key || "Variant";
    };

    const getVariantColor = (v) => {
        const combo = v.variant_combination || {};
        return combo.Colors || combo.Color || "";
    };

    const handleVariantSelect = async (v) => {
        setIsUpdatingVariant(true);
        try {
            await onUpdateVariant?.(item.id, {
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

    // ========== Render ==========
    return (
        <div
            className={`bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-visible ${
                isSelected
                    ? "border-emerald-400 shadow-md shadow-emerald-100"
                    : "border-gray-200 hover:border-gray-300"
            } ${isOutOfStock ? "opacity-70" : ""}`}
        >
            {/* ===== 顶部：复选框 + 店铺名称 + 变体选择器 ===== */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50/80 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <label className="relative flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => onSelect?.(item.id)}
                            className="w-4 h-4 text-emerald-600 bg-white border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer transition-all group-hover:border-emerald-400"
                            disabled={isLoading}
                        />
                        <span className="absolute -inset-2" />
                    </label>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <FaStore className="w-4 h-4 text-emerald-500" />
                        <span>{sellerName}</span>
                    </div>
                </div>

                {/* 变体选择器 - 只在有多个变体时显示 */}
                {hasMultipleVariants && (
                    <VariantDropdown
                        variant={variant}
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

            {/* ===== 商品内容 ===== */}
            <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 items-start md:items-center p-4">
                {/* ===== Product Info - col-span-6 ===== */}
                <div className="flex items-center gap-4 md:col-span-6 w-full md:w-auto">
                    <div className="relative w-14 h-14 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                        <img
                            src={import.meta.env.VITE_BASE_URL + productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = "/placeholder.jpg";
                            }}
                        />
                        {isOutOfStock && (
                            <span className="absolute bottom-1 left-1 bg-red-500 text-white text-[8px] font-medium px-1.5 py-0.5 rounded-full">
                                Out of Stock
                            </span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <Link
                            href={route("relove-market.product-details", {
                                productId: product?.product_id,
                            })}
                            className="hover:text-emerald-600 transition-colors"
                        >
                            <h3 className="font-semibold text-gray-900 truncate">
                                {productName}
                            </h3>
                        </Link>

                        {/* Category Name */}
                        {categoryName && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <FaTag className="w-3 h-3 text-emerald-500" />
                                <span className="text-xs text-emerald-600 font-medium">
                                    {categoryName}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== 底部操作行 - col-span-6 ===== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full md:col-span-6 mt-3 md:mt-0">
                    {/* 数量控制 */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <QuantityControl
                            quantity={quantity}
                            stock={stock}
                            onUpdate={(newQty) =>
                                onUpdateQuantity?.(item.id, newQty)
                            }
                            isLoading={isLoading}
                            isOutOfStock={isOutOfStock}
                        />

                        {!isOutOfStock && stock < 5 && (
                            <span className="text-[10px] text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                ⚠️ {stock} left
                            </span>
                        )}
                    </div>

                    {/* 价格 */}
                    <div className="text-right">
                        <span className="font-bold text-emerald-600 text-base">
                            RM {(price * quantity).toFixed(2)}
                        </span>
                        {quantity > 1 && (
                            <p className="text-xs text-gray-400">
                                RM {price.toFixed(2)} ea
                            </p>
                        )}
                        {!isOutOfStock && stock < 5 && stock > 0 && (
                            <p className="text-xs text-amber-500">
                                ⚠️ {stock} left
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
