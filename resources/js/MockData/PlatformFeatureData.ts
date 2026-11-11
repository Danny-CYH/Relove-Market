import { FaRecycle, FaShieldAlt, FaTags, FaCamera } from "react-icons/fa";
import type { ComponentType } from "react";

type PlatformFeature = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    text: string;
    color: string;
};

export const platformFeatureData: PlatformFeature[] = [
    {
        icon: FaRecycle,
        title: "Eco-Friendly",
        text: "Reduce waste and extend product life by giving items a second home.",
        color: "text-green-600",
    },
    {
        icon: FaShieldAlt,
        title: "Trusted Sellers",
        text: "All sellers are verified to ensure safe and reliable transactions.",
        color: "text-blue-600",
    },
    {
        icon: FaTags,
        title: "Affordable Finds",
        text: "Discover unique items at fair prices without breaking the bank.",
        color: "text-purple-600",
    },
    {
        icon: FaCamera,
        title: "Smart Search",
        text: "Search items in seconds using our AI-powered visual search recognition.",
        color: "text-orange-600",
    },
];
