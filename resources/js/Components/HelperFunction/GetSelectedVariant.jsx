export function GetSelectedVariant({ selectedVariant, product }) {
    return {
        variant_id: selectedVariant?.variant_id || null,
        variant_key: selectedVariant?.variant_key || "default",
        combination: selectedVariant?.variant_combination || {},
        quantity: selectedVariant?.quantity || product?.product_quantity,
        price: selectedVariant?.price || product?.product_price,
    };
}
