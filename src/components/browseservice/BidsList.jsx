import React from "react";
import BidItem from "./BidItem";
import { toast } from "sonner";
import { useGetBidsByTaskIdQuery } from "@/lib/features/bidApi/bidApi";

const BidsList = ({ task }) => {
  const {
    data: bidsData,
    isLoading: isLoadingBids,
    error: bidsError,
    refetch: refetchBids
  } = useGetBidsByTaskIdQuery(task?._id);

  const bids = bidsData?.data?.result || [];

  if (isLoadingBids) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (bidsError) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load bids.</p>
        <button
          onClick={refetchBids}
          className="mt-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bids.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No bids yet. Be the first to bid on this task!</p>
      </div>
    );
  }

  return (
    <div>
      {bids.map((bid) => (
        <BidItem 
          key={bid._id} 
          bid={bid} 
          task={task}
          refetchBids={refetchBids}
        />
      ))}
    </div>
  );
};

export default BidsList;