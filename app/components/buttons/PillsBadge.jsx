import { cn } from "@/assets/utils";
import PropTypes from "prop-types";

const PILL_STYLES = {
    default: " bg-stone-100 text-gray-800 border border-stone-200 shadow-md ",
    primary: " bg-blue-200 text-primary border border-blue-300 shadow-md ",
    "primary-dark": " bg-blue-600 text-white ",
    danger: " bg-red-200 text-red-800 border border-red-300 shadow-md ",
    success: " bg-green-200 text-green-800 border border-green-300 shadow-md ",
    warning: " bg-yellow-200 text-yellow-800 border border-yellow-300 shadow-md ",
    "warning-dark": " bg-yellow-500 text-white ",
};

const PillsBadge = ({ type, children, small, className }) => {
    const baseClasses = `font-medium ${small ? "px-1" : "px-2"} rounded-full`;
    const sizeClasses = small ? "text-xs" : "text-sm";

    return (
        <span className={cn(baseClasses, PILL_STYLES[type || "default"], sizeClasses, className)}>
            {children}
        </span>
    );
};

PillsBadge.propTypes = {
    type: PropTypes.oneOf(Object.keys(PILL_STYLES)),
    children: PropTypes.node.isRequired,
    small: PropTypes.bool,
    className: PropTypes.string,
};

export default PillsBadge;
