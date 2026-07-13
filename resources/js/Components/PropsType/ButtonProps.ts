import React from "react";

export interface ButtonProps {
    children?: React.ReactNode;

    className?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    fontSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
    iconSize?: string;
    iconPosition?: "left" | "right";
    isLoading?: boolean;
    loadingText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    size?: "sm" | "md" | "lg" | "pill" | "icon" | "visual";
    type?: "button" | "submit" | "reset";
    variant?:
        | "primary"
        | "secondary"
        | "ghost"
        | "outline"
        | "success"
        | "successSoft"
        | "danger"
        | "dangerSoft"
        | "dangerOutline"
        | "warningSoft"
        | "neutralSoft"
        | "black";
    position?: "left" | "center" | "right" | "center-block" | "right-block";
    buttonText?: string;
    onClick?: () => void;
}
