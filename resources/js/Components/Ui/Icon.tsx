import React from "react";
import { IconType } from "react-icons";

interface IconProps {
    icon: IconType;
    className?: string;
    size?: number;
    color?: string;
    onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
    icon: IconComponent,
    className = "",
    onClick,
}) => {
    return <IconComponent className={className} onClick={onClick} />;
};
