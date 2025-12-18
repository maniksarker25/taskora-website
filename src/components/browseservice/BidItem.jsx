"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import client from "../../../public/profile_image.jpg";
import { useAcceptBidMutation, useDeleteBidMutation } from "@/lib/features/bidApi/bidApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import ConfirmBookingModal from "../my_tasks/ConfirmBookingModal";

// ... (existing imports but ConfirmBookingModal needs to be adjusted based on relative path. BidItem is in src/components/browseservice, ConfirmBookingModal is in src/components/my_tasks. So path is ../my_tasks/ConfirmBookingModal)

const BidItem = ({ bid, task, refetchBids }) => {
  const [taskStatus, setTaskStatus] = useState(task?.status || "OPEN_FOR_BID");
  const role = useSelector((state) => state?.auth?.user?.role);
  const userID = useSelector((state) => state?.auth?.user?.profileId);
  const customerId = task?.customer?._id;

  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const executeAcceptBid = async (bidId, promoCode) => {
    if (taskStatus !== "OPEN_FOR_BID") {
      toast.error("Task is no longer open for bids.");
      return;
    }

    try {
      const payload = { bidID: bidId };
      if (promoCode && promoCode.trim()) {
        payload.promoCode = promoCode.trim();
      }

      const result = await acceptBid(payload).unwrap();

      if (result.success) {
        setIsConfirmModalOpen(false);
        const paymentLink = result?.data?.paymentLink;
        const reference = result?.data?.reference;

        // toast.success(
        //   paymentLink
        //     ? "Bid accepted! Redirecting to payment..."
        //     : "Bid accepted successfully!",
        //   {
        //     style: {
        //       backgroundColor: "#d1fae5",
        //       color: "#065f46",
        //       borderLeft: "6px solid #10b981",
        //     },
        //     duration: 3500,
        //   }
        // );

        if (paymentLink && typeof window !== "undefined") {
          window.open(paymentLink, "_blank");
        }

        if (reference) {
          console.log("Payment reference:", reference);
        }

        setTaskStatus(result?.data?.status || "IN_PROGRESS");
        refetchBids();
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
      toast.error(
        error?.data?.message || "Failed to accept bid. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (!confirm("Are you sure you want to delete this bid?")) return;

    try {
      const result = await deleteBid(bidId).unwrap();

      if (result.success) {
        toast.success("Bid deleted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        refetchBids();
      }
    } catch (error) {
      console.error("Failed to delete bid:", error);
      toast.error(
        error?.data?.message || "Failed to delete bid. Please try again.",
        {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        }
      );
    }
  };

  return (
    <>
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onContinue={(code) => executeAcceptBid(bid._id, code)}
        bidAmount={bid.price}
        isLoading={isAcceptingBid}
      />
      <div className="flex gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <Image
          src={bid?.provider?.profile_image || client}
          alt={bid?.provider?.name || "Provider"}
          width={64}
          height={64}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {bid?.provider?.name || "Anonymous"}
            </h3>
            <span className="text-xs text-gray-400">
              {formatTimeAgo(bid.createdAt)}
            </span>
          </div>
          <p className="text-gray-400 text-xl mb-2">₦ {bid.price}</p>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">
                {bid?.provider?.avgRating || "0"}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({bid?.provider?.totalRatingCount || "0"} Reviews)
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            {bid.details || "No message provided."}
          </p>
          <div className="flex gap-6 flex-wrap">
            {role === "customer" && userID === customerId && taskStatus === "OPEN_FOR_BID" && (
              <button
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={isAcceptingBid}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isAcceptingBid
                  ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Accept Bid
              </button>
            )}
            {role === "provider" && taskStatus === "OPEN_FOR_BID" && (
              <button
                onClick={() => handleDeleteBid(bid._id)}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isDeleting
                  ? "bg-red-400 text-white hover:bg-red-700 cursor-pointer hover:text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                {isDeleting ? "Deleting..." : "Delete Bid"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BidItem;