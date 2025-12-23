import React, { useState } from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { toast } from "sonner";
import { useCreateBidMutation, useDeleteBidMutation, useUpdateBidMutation } from '@/lib/features/bidApi/bidApi';
import { useAuth } from '@/components/auth/useAuth';
import { User } from 'lucide-react';
import { FaStar } from 'react-icons/fa6';
import BidModal from '../browseservice/BidModal';
import client from "../../../public/profile_image.jpg";
import { useCreateQuestionMutation } from '@/lib/features/question/questionApi';

const ProviderBids = ({ taskDetails, bidsData, questionsData, taskId, refetchBids }) => {
  console.log("taskDetails", taskDetails)
  const info = bidsData?.data?.result || [];
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();
  const [updateBid, { isLoading: isUpdatingBid }] = useUpdateBidMutation();
  const [deleteBid, { isLoading: isDeleting }] = useDeleteBidMutation();
  const [activeTab, setActiveTab] = useState("bids");
  const [taskStatus, setTaskStatus] = useState(taskDetails?.status || "OPEN_FOR_BID");
  const { user } = useAuth();
  const router = useRouter();
  const [createQuestion, { isLoading: isSubmittingQuestion }] = useCreateQuestionMutation();

  // Question Form State
  const [newQuestion, setNewQuestion] = useState("");
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, GIF, WEBP)");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setQuestionImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestionImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setQuestionImage(null);
    setQuestionImagePreview(null);
  };

  const handleQuestionSubmit = async () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      const formData = new FormData();
      const questionData = {
        task: taskId,
        details: newQuestion.trim()
      };

      formData.append('data', JSON.stringify(questionData));

      if (questionImage) {
        formData.append('question_image', questionImage);
      }

      const result = await createQuestion(formData).unwrap();

      if (result.success) {
        toast.success("Question submitted successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });

        setNewQuestion("");
        setQuestionImage(null);
        setQuestionImagePreview(null);
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
      toast.error(
        error?.data?.message || "Failed to submit question. Please try again.",
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

  const handleEditClick = (bid) => {
    setEditingBid(bid);
    setIsBidModalOpen(true);
  };

  const handleBidSubmit = async (bidData) => {
    try {
      let result;
      if (editingBid) {
        result = await updateBid({ id: editingBid._id, ...bidData }).unwrap();
      } else {
        result = await createBid(bidData).unwrap();
      }

      if (result.success) {
        toast.success(editingBid ? "Bid updated successfully!" : "Bid sent successfully!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        setIsBidModalOpen(false);
        setEditingBid(null);

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
              <div className="flex flex-col justify-between gap-10 bg-[#E6F4F1] rounded-xl px-4 py-4 md:max-h-[200px] min-h-[150px]">
                <div className="flex flex-wrap lg:justify-between items-center gap-4 md:gap-4">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full overflow-clip">
                    <Image
                      src={bid?.provider?.profile_image || client}
                      alt={bid?.provider?.name || "Provider"}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-semibold md:text-base">{bid?.provider?.name || "Anonymous"}</h4>

                    <div className='flex items-center gap-2 justify-between'>
                      <div>
                        <p className="flex items-center text-gray-500 gap-1 text-xs">
                          <FaStar className="text-yellow-500 text-xs" />
                          {bid?.provider?.totalRatingCount || "0"} Reviews
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold text-base text-gray-500">
                          ₦ {bid.price || "0"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {(user?.profileId === bid?.provider?.profileId || user?.profileId === bid?.provider?._id) && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleEditClick(bid)}
                      className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer text-xs"
                    >
                      Update Bid
                    </button>
                    <button
                      onClick={() => handleDeleteBid(bid._id)}
                      disabled={isDeleting}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors text-xs ${!isDeleting
                        ? "bg-red-500 text-white hover:bg-red-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isDeleting ? "Deleting..." : "Delete Bid"}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 max-h-[200px] md:max-h-[400px] overflow-y-auto">
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
              onClick={() => {
                setEditingBid(null);
                setIsBidModalOpen(true);
              }}
              className="bg-[#115E59] hover:bg-[#0a7c75] text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Submit A Bid
            </button>
          </div>
        ) : null}

        {activeTab === "questions" && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 md:text-center sm:text-left">Ask a Question</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex md:justify-center sm:justify-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                  <Image
                    src={user?.profile_image || client}
                    alt="Your profile"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this task..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent text-sm"
                  rows="3"
                />

                <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="w-full sm:w-auto flex justify-center sm:justify-start">
                    {questionImagePreview ? (
                      <div className="relative inline-block">
                        <img
                          src={questionImagePreview}
                          alt="Question preview"
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    ) : (
                      <label className="inline-flex mitems-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border border-2 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                        <span className="text-xs text-gray-600">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  <button
                    onClick={handleQuestionSubmit}
                    disabled={!newQuestion.trim() || isSubmittingQuestion}
                    className={`w-full sm:w-auto px-6 py-2 rounded-lg font-medium transition-colors text-sm ${newQuestion.trim() && !isSubmittingQuestion
                      ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                  >
                    {isSubmittingQuestion ? "Sending..." : "Send Question"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "questions" && questionsData?.data?.length > 0 ? (
          questionsData.data.map((q) => (
            <div
              key={q._id}
              className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex md:justify-center sm:justify-start">
                <Image
                  src={q?.provider?.profile_image || q?.user?.profileImage || client}
                  alt={q?.user?.name || "User"}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              </div>
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
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {q.details}
                  </p>

                  {q.question_image && (
                    <div className="mt-2 flex justify-center sm:justify-start">
                      <img
                        src={q.question_image}
                        alt="Question attachment"
                        className="max-w-full sm:max-w-xs rounded-lg border border-gray-200"
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
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
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
        onClose={() => {
          setIsBidModalOpen(false);
          setEditingBid(null);
        }}
        task={bidModalTaskData}
        onSubmit={handleBidSubmit}
        isLoading={isSubmittingBid || isUpdatingBid}
        initialData={editingBid}
      />
    </div>
  )
}

export default ProviderBids