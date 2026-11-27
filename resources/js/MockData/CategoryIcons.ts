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
    Plus,
    ToyBrick,
    Music2,
    Cat,
    Shovel,
    Cookie,
    Scissors,
    File,
    Globe,
} from "lucide-react";
import type { ComponentType } from "react";

type Category = {
    icon: ComponentType<{ className?: string }>;
    color: string;
};

export const categoryIcons: Record<string, Category> = {
    "Clothing & Accessories": { icon: Shirt, color: "text-green-600" },
    "Electronics & Gadgets": { icon: Laptop, color: "text-blue-600" },
    "Home & Furniture": { icon: Sofa, color: "text-yellow-600" },
    "Baby & Kids": { icon: Baby, color: "text-indigo-600" },
    "Books & Stationery": { icon: Book, color: "text-purple-600" },
    "Sports & Outdoors": { icon: Dumbbell, color: "text-orange-600" },
    "Beauty & Self-Care": { icon: Heart, color: "text-rose-500" },
    "Art & Collectibles": { icon: Palette, color: "text-indigo-600" },
    "Jewelry & Watches": { icon: Gem, color: "text-teal-600" },
    "Vehicles & Bikes": { icon: Car, color: "text-blue-400" },
    "Eco-Friendly Items": { icon: Recycle, color: "text-green-600" },
    "Toys & Games": { icon: ToyBrick, color: "text-purple-600" },
    "Music & Audio": { icon: Music2, color: "text-yellow-600" },
    "Kitchen & Dining": { icon: Cookie, color: "text-green-600" },
    "Pet Supplies": { icon: Cat, color: "text-yellow-600" },
    "Garden & Plants": { icon: Shovel, color: "text-green-600" },
    "Travel & Luggage": { icon: Globe, color: "text-blue-600" },
    "Handmade & Crafts": { icon: Scissors , color: "text-red-600" },
    "Office & Learning": { icon: File, color: "text-gray-500" },
    "Others": { icon: Plus, color: "text-green-600" },
};
