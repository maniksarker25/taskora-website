// components/my_tasks/cancellation/components/StatusIcon.jsx
import { Check, X } from "lucide-react";

const StatusIcon = ({ status }) => {
    switch (status?.toUpperCase()) {
        case "PENDING":
            return (
                <div className="animate-pulse w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                </div>
            );
        case "ACCEPTED":
            return (
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                </div>
            );
        case "REJECTED":
            return (
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                    <X className="w-4 h-4 text-white" />
                </div>
            );
        case "DISPUTED":
            return (
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⚖️</span>
                </div>
            );
        default:
            return (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">?</span>
                </div>
            );
    }
};

export default StatusIcon;