// In your GetVariantDetails.js helper file
export function getVariantDetails(product) {
    if (!product.product_variant || product.product_variant.length === 0) {
        return {
            size: null,
            color: null,
            hasVariants: false,
            minVariantPrice: null,
            maxVariantPrice: null,
            variantCount: 0,
            uniqueOptions: [],
        };
    }

    let color = null;
    let size = null;
    let prices = [];
    let options = [];

    // Track if we found actual color and size values
    let hasColorValue = false;
    let hasSizeValue = false;

    product.product_variant.forEach((variant) => {
        if (variant.price) {
            prices.push(parseFloat(variant.price));
        }

        try {
            if (variant.variant_combination) {
                const combination =
                    typeof variant.variant_combination === "string"
                        ? JSON.parse(variant.variant_combination)
                        : variant.variant_combination;

                // Check for color - only set if it exists and is a valid color
                if (!color && !hasColorValue) {
                    if (combination.Colors) {
                        color = combination.Colors;
                        hasColorValue = true;
                    } else if (combination.color) {
                        color = combination.color;
                        hasColorValue = true;
                    }
                }

                // Check for size - only set if it exists
                if (!size && !hasSizeValue) {
                    if (combination.Size) {
                        size = combination.Size;
                        hasSizeValue = true;
                    } else if (combination.size) {
                        size = combination.size;
                        hasSizeValue = true;
                    }
                }

                // Collect options for display
                if (combination.Colors || combination.color) {
                    options.push(combination.Colors || combination.color);
                }
            }
        } catch (e) {
            console.error("Error parsing variant combination:", e);
        }
    });

    // Only use variant_key as fallback if we haven't found a color AND we're sure it's actually a color
    if (!hasColorValue && product.product_variant[0]?.variant_key) {
        // Check if the variant_key looks like a color (not a size)
        const key = product.product_variant[0].variant_key.toLowerCase();
        const possibleSizePattern = /^\d+$|^[xsmlxl]+$|^\d+\s*(cm|in)$/i;

        if (!possibleSizePattern.test(key)) {
            color = product.product_variant[0].variant_key;
        }
    }

    const minPrice = prices.length > 0 ? Math.min(...prices) : null;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

    return {
        color: hasColorValue ? color : null, // Only return color if we're sure it's a color
        size: hasSizeValue ? size : null,
        hasVariants: prices.length > 0,
        minVariantPrice: minPrice,
        maxVariantPrice: maxPrice,
        variantCount: prices.length,
        uniqueOptions: [...new Set(options)],
    };
}
