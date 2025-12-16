import React from "react";
import { CheckCircle, Clock, MessageCircle, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const statusConfigs = {
      OPEN_FOR_BID: {
        label: "Open for bids",
        color: "bg-orange-100 text-orange-600 border-orange-200",
        icon: <Clock className="w-4 h-4" />,
      },
      IN_PROGRESS: {
        label: "In Progress",
        color: "bg-blue-100 text-blue-600 border-blue-200",
        icon: <MessageCircle className="w-4 h-4" />,
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-green-100 text-green-600 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      CANCELLED: {
        label: "Cancelled",
        color: "bg-red-100 text-red-600 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      },
      ASSIGNED: {
        label: "Assigned",
        color: "bg-purple-100 text-purple-600 border-purple-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
    };

    return statusConfigs[status] || statusConfigs["OPEN_FOR_BID"];
  };

  const currentStatusConfig = getStatusConfig(status);

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${currentStatusConfig.color}`}
    >
      {currentStatusConfig.icon}
      {currentStatusConfig.label}
    </div>
  );
};

export default StatusBadge;