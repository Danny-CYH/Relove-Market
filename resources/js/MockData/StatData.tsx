import type { ComponentType } from "react";
import { FaUsers, FaStar, FaShoppingBag, FaTree } from "react-icons/fa";

export type StatItem = {
  number: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

export const StatData: StatItem[] = [
  { number: "15K+", label: "Members", icon: FaUsers },
  { number: "98%", label: "Satisfied", icon: FaStar },
  { number: "5K+", label: "Items Sold", icon: FaShoppingBag },
  { number: "50K+", label: "Trees Saved", icon: FaTree },
];