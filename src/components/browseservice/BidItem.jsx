"use client";
import {
  useAcceptBidMutation,
  useDeleteBidMutation,
  useUpdateBidMutation,
} from "@/lib/features/bidApi/bidApi";
import { CheckCircle2, Clock, Edit3, ShieldCheck, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import client from "../../../public/profile_image.jpg";
import ConfirmBookingModal from "../my_tasks/ConfirmBookingModal";
import BidModal from "./BidModal";

const BidItem = ({ bid, task, refetchBids }) => {
  const [taskStatus, setTaskStatus] = useState(task?.status || "OPEN_FOR_BID");
  const role = useSelector((state) => state?.auth?.user?.role);
  const userID = useSelector((state) => state?.auth?.user?.profileId);
  const customerId = task?.customer?._id;

  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const [updateBid, { isLoading: isUpdatingBid }] = useUpdateBidMutation();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Logic remains identical to your code
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1h ago";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const executeAcceptBid = async (bidId, promoCode) => {
    if (taskStatus !== "OPEN_FOR_BID") {
      toast.error("Task is no longer open for bids.");
      return;
    }
    try {
      const payload = { bidID: bidId };
      if (promoCode && promoCode.trim()) payload.promoCode = promoCode.trim();
      const result = await acceptBid(payload).unwrap();
      if (result.success) {
        setIsConfirmModalOpen(false);
        if (result?.data?.paymentLink && typeof window !== "undefined") {
          window.open(result.data.paymentLink, "_blank");
        }
        setTaskStatus(result?.data?.status || "IN_PROGRESS");
        refetchBids();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to accept bid.");
    }
  };

  const handleUpdateBid = async (bidData) => {
    try {
      const result = await updateBid({ id: bid._id, ...bidData }).unwrap();
      if (result.success) {
        toast.success("Bid updated!");
        setIsEditModalOpen(false);
        refetchBids && refetchBids();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Update failed.");
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (!confirm("Are you sure?")) return;
    try {
      const result = await deleteBid(bidId).unwrap();
      if (result.success) {
        toast.success("Bid deleted.");
        refetchBids();
      }
    } catch (error) {
      toast.error("Deletion failed.");
    }
  };

  const bidModalTaskData = {
    _id: task?._id,
    title: task?.title,
    budget: task?.budget,
    category: task?.category,
    customer: task?.customer,
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

      <BidModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        task={bidModalTaskData}
        onSubmit={handleUpdateBid}
        isLoading={isUpdatingBid}
        initialData={bid}
      />

      {/* Main Card Design */}
      <div className="group relative bg-white p-5 border-b border-slate-100 hover:bg-slate-50/50 transition-all duration-300">
        <div className="flex gap-5 items-start">
          {/* Avatar Section with Verification Badge */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-sm group-hover:shadow-md transition-shadow">
              <Image
                src={bid?.provider?.profile_image || client}
                alt={bid?.provider?.name || "Provider"}
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-teal-500 fill-teal-50" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header: Name, Ratings and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">
                  {bid?.provider?.name || "Anonymous"}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {bid?.provider?.avgRating || "0.0"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                    ({bid?.provider?.totalRatingCount || "0"} Reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3 h-3" />
                <span className="text-[11px] font-medium tracking-tighter">
                  {formatTimeAgo(bid.createdAt)}
                </span>
              </div>
            </div>

            {/* Price & Description */}
            <div className="mb-4">
              <div className="inline-block px-3 py-1 bg-teal-50 rounded-lg mb-2">
                <span className="text-lg font-black text-[#115E59]">
                  ₦{bid.price?.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                {bid.details || "No detailed proposal message provided."}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-3 flex-wrap">
                {role === "customer" && userID === customerId && taskStatus === "OPEN_FOR_BID" && (
                  <button
                    onClick={() => setIsConfirmModalOpen(true)}
                    disabled={isAcceptingBid}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#115E59] text-white text-xs font-bold hover:bg-teal-700 transition-all active:scale-95 shadow-lg shadow-teal-900/10 disabled:opacity-50 disabled:active:scale-100"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Accept Proposal
                  </button>
                )}

                {role === "provider" && taskStatus === "OPEN_FOR_BID" && (
                  <>
                    {(userID === bid?.provider?.profileId || userID === bid?.provider?._id) && (
                      <>
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-all active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteBid(bid._id)}
                          disabled={isDeleting}
                          className="flex cursor-pointer items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 " />
                          {isDeleting ? "Withdrawing..." : "Withdraw"}
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BidItem;
