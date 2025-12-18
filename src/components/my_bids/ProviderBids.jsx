import React, { useState } from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { toast } from "sonner";
import { useCreateBidMutation, useDeleteBidMutation } from '@/lib/features/bidApi/bidApi';
import { useAuth } from '@/components/auth/useAuth';
import { User } from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import BidModal from '../browseservice/BidModal';
import client from "../../../public/profile_image.jpg";

const ProviderBids = ({ taskDetails, bidsData, questionsData, taskId, refetchBids }) => {
  const info = bidsData?.data?.result || [];
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const [activeTab, setActiveTab] = useState("bids");
  const [taskStatus, setTaskStatus] = useState(taskDetails?.status || "OPEN_FOR_BID");
  const { user } = useAuth();
  const router = useRouter();

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
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

  const handleDeleteBid = async (bidId) => {
    if (!confirm("Are you sure you want to delete this bid?")) return;

    try {
      const result = await deleteBid(bidId).unwrap();

      if (result?.success) {
        toast.success("Bid deleted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        
        if (refetchBids && typeof refetchBids === 'function') {
          refetchBids();
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      } else {
        toast.error(result?.message || "Failed to delete bid", {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Failed to delete bid:", error);
      
      if (error?.status === 'FETCH_ERROR' || error?.status === 'PARSING_ERROR') {
        toast.error("Network error. Please check your connection.", {
          style: {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            borderLeft: "6px solid #ef4444",
          },
          duration: 3000,
        });
      } else {
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
    }
  };

  const handleBidSubmit = async (bidData) => {
    try {
      const result = await createBid(bidData).unwrap();

      if (result.success) {
        toast.success("Bid sent successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        setIsBidModalOpen(false);
        
        // Refetch bids after successful submission
        if (refetchBids && typeof refetchBids === 'function') {
          refetchBids();
        }
      }
    } catch (error) {
      console.error("Failed to submit bid:", error);
      toast.error(
        error?.data?.message || "Failed to submit bid. Please try again.",
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

  // BidModal এ কোন task data পাঠানো হবে
  const bidModalTaskData = {
    _id: taskId,
    title: taskDetails?.title,
    budget: taskDetails?.budget,
    category: taskDetails?.category,
    customer: taskDetails?.customer
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 border rounded-2xl p-6 bg-white shadow mt-8 ">
        {/* Left side */}
        <div className="flex-1 space-y-6">
          {/* user */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <User size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Posted By</p>
              <p className="text-sm text-gray-600">{taskDetails?.customer?.name || "N/A"}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <FaMapMarkerAlt size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Location</p>
              <p className="text-sm text-gray-600">{taskDetails?.address || "Not specified"}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex items-center justify-center">
              <MdDateRange size={20} />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">
                To Be Done On
              </p>
              <p className="text-sm text-gray-600">
                {taskDetails?.preferredDeliveryDateTime ? (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span className="text-sm">
                      {new Date(taskDetails.preferredDeliveryDateTime).toLocaleDateString()}
                    </span>
                  </div>
                ) : "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <p className='text-xl font-bold pb-4'>Details</p>
            <p>{taskDetails?.description || "No description available"}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-3 ">
        <button
          onClick={() => setActiveTab("bids")}
          className={`pb-2 ${activeTab === "bids"
            ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
            : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
            }`}
        >
          Bids
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`pb-2 ${activeTab === "questions"
            ? "border-b-2 bg-[#115E59] px-6 rounded-md py-2 text-white cursor-pointer"
            : "text-black bg-[#E6F4F1] px-6 rounded-md py-2 cursor-pointer"
            }`}
        >
          Questions
        </button>
      </div>

      {/* Bids / Questions */}
      <div className="mt-4 space-y-4">
        {activeTab === "bids" && info?.length > 0 ? (
          info.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg"
            >
              <div className="flex flex-col justify-between gap-10 bg-[#E6F4F1] rounded-xl px-4 py-4 ">
                <div className="flex flex-wrap lg:justify-between items-center gap-4 md:gap-8">
                  <div className="w-14 h-14 md:w-24 md:h-24 rounded-full overflow-clip">
                    <Image
                      src={bid?.provider?.profile_image || client}
                      alt={bid?.provider?.name || "Provider"}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="">
                    <h4 className="font-semibold md:text-xl">{bid?.provider?.name || "Anonymous"}</h4>
                    <p className="flex items-center text-gray-500 gap-1 text-sm md:text-base">
                      <FaStar className="text-yellow-500 text-sm md:text-base" />
                      {bid?.provider?.totalRatingCount || "0"} Reviews
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-xl md:text-3xl">
                      ₦ {bid.price || "0"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDeleteBid(bid._id)}
                    disabled={isDeleting}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${!isDeleting
                      ? "bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {isDeleting ? "Deleting..." : "Delete Bid"}
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-gray-600 text-sm mt-2">{bid.details || "No details provided"}</p>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">
                    {formatTimeAgo(bid.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : activeTab === "bids" ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No bids yet. Be the first to bid on this task!</p>
            <button
              onClick={() => setIsBidModalOpen(true)}
              className="bg-[#115E59] hover:bg-[#0a7c75] text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Submit A Bid
            </button>
          </div>
        ) : null}

        {activeTab === "questions" && questionsData?.data?.length > 0 ? (
          questionsData.data.map((q) => (
            <div
              key={q._id}
              className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Image
                src={q?.provider?.profile_image || q?.user?.profileImage || client}
                alt={q?.user?.name || "User"}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {q?.provider?.name || "Anonymous"}
                  </h3>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(q.createdAt)}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-800 mb-1">Q:</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {q.details}
                  </p>

                  {q.question_image && (
                    <div className="mt-2">
                      <img
                        src={q.question_image}
                        alt="Question attachment"
                        className="max-w-xs rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                {q.answer && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-green-700">
                        Task Poster Response:
                      </span>
                      {q.answeredAt && (
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(q.answeredAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {q.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : activeTab === "questions" ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No questions available</p>
          </div>
        ) : null}
      </div>

      {/* Bid Modal */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        task={bidModalTaskData}
        onSubmit={handleBidSubmit}
        isLoading={isSubmittingBid}
      />
    </div>
  )
}

export default ProviderBids