import React from "react";
import { useSelector } from "react-redux";
import { useRejectOfferMutation } from "@/lib/features/bidApi/bidApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TaskBudgetSection = ({ task, role, onBidClick }) => {
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const user = useSelector((state) => state.auth?.user);
  const router = useRouter();

  const isDirectOffer = task?.provider === user?.profileId || (typeof task?.provider === 'object' && task?.provider?._id === user?.profileId);

  const handleReject = async () => {
    toast("Reject Offer", {
      description: "Are you sure you want to reject this offer?",
      action: {
        label: "Reject",
        onClick: async () => {
          try {
            const result = await rejectOffer(task._id).unwrap();
            if (result.success) {
              toast.success("Offer rejected successfully");
              router.push("/my_bids");
            }
          } catch (error) {
            toast.error(error?.data?.message || "Failed to reject offer");
          }
        },
      },
      cancel: {
        label: "Cancel",
      },
    });
  };

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
        <div className="flex gap-4">
          {isDirectOffer && task?.status === "OPEN_FOR_BID" && (
            <button
              onClick={handleReject}
              disabled={isRejecting}
              className="bg-red-500 hover:bg-red-600 cursor-pointer text-white py-3 px-8 rounded-lg font-medium transition-colors disabled:bg-gray-400"
            >
              {isRejecting ? "Rejecting..." : "Reject Offer"}
            </button>
          )}
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
    </div>
  );
};

export default TaskBudgetSection;