// Determine display price
export function getDisplayPrice(product, variantDetails) {
    const basePrice = parseFloat(product.product_price);

    if (variantDetails.hasVariants) {
        // If there are variants with different prices
        if (variantDetails.minVariantPrice !== variantDetails.maxVariantPrice) {
            return {
                main: `RM ${variantDetails.minVariantPrice.toFixed(2)} - RM ${variantDetails.maxVariantPrice.toFixed(2)}`,
                isRange: true,
            };
        }
        // If all variants have the same price
        else if (
            variantDetails.minVariantPrice === variantDetails.maxVariantPrice
        ) {
            return {
                main: `RM ${variantDetails.minVariantPrice.toFixed(2)}`,
                original:
                    basePrice !== variantDetails.minVariantPrice
                        ? basePrice
                        : null,
                isRange: false,
            };
        }
    }

    // No variants or single price
    return {
        main: `RM ${basePrice.toFixed(2)}`,
        isRange: false,
    };
};
