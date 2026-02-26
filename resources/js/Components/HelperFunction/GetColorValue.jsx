// Add this helper function in your component
export function GetColorValue(colorName) {
    if (!colorName) return "#CBD5E1";

    const normalizedColor = colorName.toLowerCase().trim();

    // First, try exact match in color map
    const exactMatch = exactColorMatch(normalizedColor);
    if (exactMatch) return exactMatch;

    // If no exact match, parse the color name
    return parseComplexColor(normalizedColor);
}

// Exact color matches for common colors
function exactColorMatch(colorName) {
    const colorMap = {
        // Basic colors
        red: "#EF4444",
        blue: "#3B82F6",
        green: "#10B981",
        yellow: "#F59E0B",
        purple: "#8B5CF6",
        pink: "#EC4899",
        orange: "#F97316",
        brown: "#8B4513",
        black: "#1F2937",
        white: "#FFFFFF",
        gray: "#6B7280",
        "light gray": "#D1D5DB",
        "dark gray": "#374151",
        silver: "#C0C0C0",
        gold: "#FFD700",

        // Common fashion colors
        navy: "#1E3A8A",
        beige: "#F5F5DC",
        cream: "#FDF5E6",
        maroon: "#800000",
        burgundy: "#800020",
        olive: "#808000",
        khaki: "#C3B091",
        turquoise: "#40E0D0",
        teal: "#008080",
        lavender: "#E6E6FA",
        coral: "#FF7F50",
        peach: "#FFDAB9",
        mint: "#98FB98",
        charcoal: "#36454F",
        taupe: "#483C32",
        camel: "#C19A6B",
        rust: "#B7410E",
        mustard: "#FFDB58",
        sage: "#BCB88A",
        blush: "#FAD6D0",
        champagne: "#F7E7CE",
        ivory: "#FFFFF0",
        eggshell: "#F0EAD6",
    };

    return colorMap[colorName];
}

// Parse complex color names like "dark green + white"
function parseComplexColor(colorName) {
    // Handle patterns like "dark green", "light blue", etc.
    const modifierMatch = colorName.match(
        /^(dark|light|deep|pale|bright|soft|medium|dusty)(?:\s+|-)?(.+)$/,
    );

    if (modifierMatch) {
        const [_, modifier, baseColor] = modifierMatch;
        const baseHex = exactColorMatch(baseColor.trim());

        if (baseHex) {
            return modifyColor(baseHex, modifier);
        }
    }

    // Handle patterns with "+" like "green + white" (mix colors)
    if (
        colorName.includes("+") ||
        colorName.includes("and") ||
        colorName.includes("&")
    ) {
        const separator = colorName.includes("+")
            ? "+"
            : colorName.includes("and")
              ? "and"
              : "&";
        const colors = colorName.split(separator).map((c) => c.trim());

        if (colors.length >= 2) {
            const hex1 =
                exactColorMatch(colors[0]) ||
                generateColorFromString(colors[0]);
            const hex2 =
                exactColorMatch(colors[1]) ||
                generateColorFromString(colors[1]);

            if (hex1 && hex2) {
                return mixColors(hex1, hex2, 0.5); // 50/50 mix
            }
        }
    }

    // Handle patterns like "blue-green" (gradient between colors)
    if (colorName.includes("-")) {
        const colors = colorName.split("-").map((c) => c.trim());
        if (colors.length === 2) {
            const hex1 =
                exactColorMatch(colors[0]) ||
                generateColorFromString(colors[0]);
            const hex2 =
                exactColorMatch(colors[1]) ||
                generateColorFromString(colors[1]);

            if (hex1 && hex2) {
                return mixColors(hex1, hex2, 0.5);
            }
        }
    }

    // Handle multi-word colors like "forest green"
    const words = colorName.split(/\s+/);
    if (words.length > 1) {
        // Try to find a color in the words
        for (let word of words) {
            const match = exactColorMatch(word);
            if (match) return match;
        }
    }

    // If all else fails, generate from string
    return generateColorFromString(colorName);
}

// Modify color based on modifier (dark, light, etc.)
function modifyColor(hex, modifier) {
    // Convert hex to RGB
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    switch (modifier) {
        case "dark":
        case "deep":
            // Darken by 30%
            r = Math.floor(r * 0.7);
            g = Math.floor(g * 0.7);
            b = Math.floor(b * 0.7);
            break;
        case "light":
        case "pale":
        case "soft":
            // Lighten by 30%
            r = Math.floor(r + (255 - r) * 0.7);
            g = Math.floor(g + (255 - g) * 0.7);
            b = Math.floor(b + (255 - b) * 0.7);
            break;
        case "bright":
            // Increase saturation
            const avg = (r + g + b) / 3;
            r = Math.floor(r + (r - avg) * 0.5);
            g = Math.floor(g + (g - avg) * 0.5);
            b = Math.floor(b + (b - avg) * 0.5);
            break;
        case "dusty":
            // Add gray
            r = Math.floor((r + 128) / 2);
            g = Math.floor((g + 128) / 2);
            b = Math.floor((b + 128) / 2);
            break;
        case "medium":
            // Slight darken
            r = Math.floor(r * 0.9);
            g = Math.floor(g * 0.9);
            b = Math.floor(b * 0.9);
            break;
        default:
            break;
    }

    // Ensure values are within bounds
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Mix two colors with a given ratio (0-1)
function mixColors(hex1, hex2, ratio) {
    const r1 = parseInt(hex1.slice(1, 3), 16);
    const g1 = parseInt(hex1.slice(3, 5), 16);
    const b1 = parseInt(hex1.slice(5, 7), 16);

    const r2 = parseInt(hex2.slice(1, 3), 16);
    const g2 = parseInt(hex2.slice(3, 5), 16);
    const b2 = parseInt(hex2.slice(5, 7), 16);

    const r = Math.floor(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.floor(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.floor(b1 * (1 - ratio) + b2 * ratio);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Generate a consistent color from any string
function generateColorFromString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    // Use HSL for better color control
    const h = Math.abs(hash) % 360;
    const s = 70; // Consistent saturation
    const l = 60; // Consistent lightness

    return hslToHex(h, s, l);
}

// Convert HSL to Hex
function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r, g, b;
    if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
