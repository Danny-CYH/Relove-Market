import {
    Baby,
    Book,
    Dumbbell,
    Heart,
    Laptop,
    Shirt,
    Sofa,
    Palette,
    Gem,
    Car,
    Recycle,
} from "lucide-react";
import type { ComponentType } from "react";

type Category = {
    icon: ComponentType<{ className?: string }>;
    color: string;
};

export const categoryIcons: Category[] = [
    { icon: Shirt, color: "text-green-600" },
    { icon: Laptop, color: "text-blue-600" },
    { icon: Sofa, color: "text-yellow-600" },
    { icon: Baby, color: "text-pink-600" },
    { icon: Book, color: "text-purple-600" },
    { icon: Dumbbell, color: "text-orange-600" },
    { icon: Heart, color: "text-rose-500" },
    { icon: Palette, color: "text-indigo-600" },
    { icon: Gem, color: "text-teal-600" },
    { icon: Car, color: "text-gray-600" },
    { icon: Recycle, color: "text-green-500" },
];
