import type { IconType } from "react-icons";
import {
    FaCheck,
    FaExclamation,
    FaInfo,
    FaExclamationTriangle,
} from "react-icons/fa";

// declare toast type
export type ToastType = "info" | "success" | "error" | "warning";

// declare the inteface of the toast
export interface ToastConfig {
  icon: IconType;
  borderColor: string;
  pillBg: string;
  pillBorder: string;
  iconCircleBg: string;
  iconColor: string;
  textColor: string;
  progressTrackBg: string;
  progressFill: string;
  role: "status" | "alert";
}

// TOAST CONFIG will return the type record of the combination of toast type and toast config
export const TOAST_CONFIG: Record<ToastType,ToastConfig> = {
    info: {
        icon: FaInfo,
        borderColor: "border-blue-100",
        pillBg: "bg-blue-50/60",
        pillBorder: "border-blue-100/80",
        iconCircleBg: "bg-blue-400",
        iconColor: "text-blue-500",
        textColor: "text-slate-700",
        progressTrackBg: "#f0f7ff",
        progressFill: "#60a5fa",
        role: "status",
    },
    success: {
        icon: FaCheck,
        borderColor: "border-emerald-100",
        pillBg: "bg-emerald-50/60",
        pillBorder: "border-emerald-100/80",
        iconCircleBg: "bg-emerald-400",
        iconColor: "text-green-500",
        textColor: "text-slate-700",
        progressTrackBg: "#f0fdf4",
        progressFill: "#34d399",
        role: "status",
    },
    error: {
        icon: FaExclamation,
        borderColor: "border-rose-100",
        pillBg: "bg-rose-50/60",
        pillBorder: "border-rose-100/80",
        iconCircleBg: "bg-rose-400",
        iconColor: "text-red-500",
        textColor: "text-slate-700",
        progressTrackBg: "#fff1f2",
        progressFill: "#fb7185",
        role: "alert",
    },
    warning: {
        icon: FaExclamationTriangle,
        borderColor: "border-amber-100",
        pillBg: "bg-amber-50/60",
        pillBorder: "border-amber-100/80",
        iconCircleBg: "bg-amber-400",
        iconColor: "text-yellow-500",
        textColor: "text-slate-700",
        progressTrackBg: "#fffbeb",
        progressFill: "#fbbf24",
        role: "alert",
    },
};

// function for accepting the props when calling the toast components
export const getToastConfig = (type: ToastType): ToastConfig => TOAST_CONFIG[type as ToastType];
