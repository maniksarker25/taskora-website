import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

const TaskHeader = ({ task }) => {
  return (
    <>
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <Link className="flex items-center" href="/browseservice">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm text-[#115e59] font-semibold">
            Back To Map
          </span>
        </Link>
      </div>

      <div className="p-4 bg-white border-b border-gray-200">
        <StatusBadge status={task?.status || "OPEN_FOR_BID"} />
      </div>
    </>
  );
};

export default TaskHeader;