export const ActionButton = ({ onClick, variant = "primary", children, className = "", disabled = false }) => {
    const baseClasses = "px-6 py-2.5 text-white rounded-md transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

    const variantClasses = {
        primary: "bg-[#115e59] hover:bg-teal-700",
        accept: "bg-[#115E59] hover:bg-[#115E59]/90",
        reject: "bg-red-600 hover:bg-red-700",
        delete: "bg-red-600 hover:bg-red-700",
        dispute: "bg-purple-600 hover:bg-purple-700",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default ActionButton;