import { CloudCog } from "lucide-react";
import React from "react";
import { useSelector } from "react-redux";

const TaskBudgetSection = ({ task, role, onBidClick }) => {
  const taskData = {
    budget: task?.budget?.toString() || "0",
    totalOffer: task?.totalOffer || 0,
  };

  // console.log("asdfladjf===>",task)
  //   const { user, isAuthenticated } = useSelector((state) => state.auth);
  //   const userEmail = user
  //   console.log("userEmail===>",userEmail)

  return (
    <div className="flex justify-between items-center border-t pt-6 px-4 bg-white">
      <div>
        <p className="text-sm font-medium text-gray-900 mb-1">
          Task budget
        </p>
        <p className="text-2xl font-bold text-gray-900">
          ₦{parseInt(taskData.budget).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {taskData.totalOffer} bids received
        </p>
      </div>

      <div>
        {role === "provider" && task?.status === "OPEN_FOR_BID" && (
          <button
            onClick={onBidClick}
            className="bg-[#115E59] hover:bg-teal-700 cursor-pointer text-white py-3 px-8 rounded-lg font-medium transition-colors"
          >
            Submit A Bid
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskBudgetSection;