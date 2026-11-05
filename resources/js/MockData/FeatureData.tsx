import { FaHeart, FaShieldAlt, FaRecycle, FaGlobe } from "react-icons/fa";
import type { ComponentType } from "react";

type featureIcon = {
    icon: ComponentType<{className?: string}>
    text: string,
    color: string,
}

export const featureData: featureIcon[] = [
    {
        icon: FaHeart,
        text: "Pre-loved fashion",
        color: "text-rose-400",
    },
    {
        icon: FaShieldAlt,
        text: "Secure shopping",
        color: "text-emerald-400",
    },
    {
        icon: FaRecycle,
        text: "Zero waste",
        color: "text-teal-400",
    },
    {
        icon: FaGlobe,
        text: "Global community",
        color: "text-blue-400",
    },
];
