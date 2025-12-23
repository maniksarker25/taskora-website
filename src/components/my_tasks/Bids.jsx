import React, { useState } from 'react'
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa6";
import srvcporvider from "../../../public/profile_image.jpg";
import Image from 'next/image';
import { toast } from "sonner";
import { useAcceptBidMutation } from '@/lib/features/bidApi/bidApi';
import { useAuth } from '@/components/auth/useAuth';
import { useSelector } from 'react-redux';
import ConfirmBookingModal from './ConfirmBookingModal';
import client from "../../../public/profile_image.jpg";
import { useSocketContext } from "@/app/context/SocketProvider";
import { useStartConversationMutation } from "@/lib/features/chatApi/chatApi";
import { MessageCircle } from "lucide-react";



const Bids = ({ taskDetails, bidsData, questionsData }) => {

  const info = bidsData?.data.result
  const role = useSelector((state) => state?.auth?.user?.role);

  const [activeTab, setActiveTab] = useState("bids");
  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();

  const [taskStatus, setTaskStatus] = useState(taskDetails?.status || "OPEN_FOR_BID");
  const { user } = useAuth();
  const router = useRouter();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);

  // Chat from Question State
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { sendMessageSoket } = useSocketContext();

  const executeAcceptBid = async (bidId, couponCode) => {
    if ((taskStatus || taskDetails?.status) !== "OPEN_FOR_BID") {
      toast.error("Task is no longer open for bids.");
      return;
    }

    try {
      const payload = { bidID: bidId };
      if (couponCode && couponCode.trim()) {
        payload.promoCode = couponCode.trim();
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
          window.location.href = paymentLink;
        }

        if (reference) {
          console.log("Payment reference:", reference);
        }

        setTaskStatus(result?.data?.status || "IN_PROGRESS");
        // refetchBids(); // refetchBids is not defined in the scope, kept original logic flow
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

  const openConfirmModal = (bid) => {
    setSelectedBid(bid);
    setIsConfirmModalOpen(true);
  };

  // const handleAcceptBid = async (bidId) => {
  //   if (taskStatus !== "OPEN_FOR_BID") {
  //     toast.error("Task is no longer open for bids.");
  //     return;
  //   }
  //   if (!confirm("Are you sure you want to accept this bid?")) return;
  //   try {
  //     const result = await acceptBid({ bidID: bidId }).unwrap();
  //     if (result?.success) {
  //       const paymentLink = result?.data?.paymentLink;
  //       const reference = result?.data?.reference;
  //
  //       toast.success(
  //         paymentLink
  //           ? "Bid accepted! Redirecting to payment..."
  //           : "Bid accepted successfully!",
  //         {
  //           style: {
  //             backgroundColor: "#d1fae5",
  //             color: "#065f46",
  //             borderLeft: "6px solid #10b981",
  //           },
  //           duration: 3500,
  //         }
  //       );
  //
  //       if (paymentLink && typeof window !== "undefined") {
  //         window.open(paymentLink, "_blank");
  //       }
  //
  //       if (reference) {
  //         console.log("Payment reference:", reference);
  //       }
  //
  //       setTaskStatus(result?.data?.status || "IN_PROGRESS");
  //     }
  //   } catch (error) {
  //     console.error("Failed to accept bid:", error);
  //     toast.error(error?.data?.message || "Failed to accept bid. Please try again.", {
  //       style: {
  //         backgroundColor: "#fee2e2",
  //         color: "#991b1b",
  //         borderLeft: "6px solid #ef4444",
  //       },
  //       duration: 3000,
  //     });
  //   }
  // };

  const handleChatClick = (bid) => {

    // if ((taskStatus || taskDetails?.status) !== "IN_PROGRESS") {
    //   toast.info("Chat is available only while the task is In Progress.");
    //   return;
    // }

    // Determine receiverId - pick the other participant (not the current user)
    const providerId = bid?.provider?._id || bid?.provider || bid?.providerId;
    const customerId = taskDetails?.customer?._id || taskDetails?.customer || taskDetails?.customerId;
    let resolvedReceiverId = null;
    // If both exist, prefer the other user
    if (providerId && customerId) {
      resolvedReceiverId = (providerId === user?._id || providerId === user?.id) ? customerId : providerId;
    } else {
      resolvedReceiverId = providerId || customerId;
    }
    const receiverId = resolvedReceiverId;

    if (!receiverId) {
      toast.error("Unable to find user to chat with");
      return;
    }

    // Navigate to chat page with receiverId
    router.push(`/chat?receiverId=${receiverId}`);
  };

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

  const handleOpenChatModal = (q) => {
    setSelectedQuestion(q);
    setChatMessage("");
    setIsChatModalOpen(true);
  };

  const handleSendQuestionChat = async () => {
    const receiverId = selectedQuestion?.provider?._id || selectedQuestion?.provider?.profileId || selectedQuestion?.user?._id;

    if (!chatMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!receiverId) {
      toast.error("Unable to identify the recipient.");
      return;
    }

    try {
      const data = {
        text: chatMessage,
        imageUrl: [""],
        pdfUrl: [""],
        receiver: receiverId
      }

      sendMessageSoket(data);
      setChatMessage("");
      setIsChatModalOpen(false);

      toast.success("Message sent! Redirecting to chat...");

      setTimeout(() => {
        if (typeof window !== 'undefined') {
          router.push(`/chat/${receiverId}`);
        }
      }, 1000);

    } catch (error) {
      console.error("Failed to start chat:", error);
      toast.error("Failed to send message via socket.");
    }
  };

  return (
    <div>
      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onContinue={(code) => executeAcceptBid(selectedBid?._id || selectedBid?.id, code)}
        bidAmount={selectedBid?.price}
        isLoading={isAcceptingBid}
      />

      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 border rounded-2xl p-4 sm:p-6 bg-white shadow mt-8 items-stretch lg:items-start">
        {/* Left side */}
        <div className="flex-1 space-y-6">
          {/* Location */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex-shrink-0 flex items-center justify-center">
              <FaMapMarkerAlt size={20} />
            </div>
            <div className=''>
              <p className="text-base sm:text-lg font-semibold text-black">Location</p>
              <p className="text-xs sm:text-sm text-gray-600">{taskDetails?.address}</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-full bg-[#E6F4F1] text-[#115E59] flex-shrink-0 flex items-center justify-center">
              <MdDateRange size={20} />
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-black">
                To Be Done On
              </p>
              <div className="text-xs sm:text-sm text-gray-600">
                {taskDetails?.preferredDeliveryDateTime && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <span>{new Date(taskDetails.preferredDeliveryDateTime).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full lg:w-auto">
          <div className="bg-[#E6F4F1] rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-sm">
            <div className="mb-4">
              <p className="text-sm sm:text-base text-gray-500">Task budget</p>
              <p className="text-xl sm:text-2xl font-bold text-black">₦ {taskDetails?.budget}</p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full">
              <button className="flex-1 px-4 py-2 border-2 border-[#115e59] rounded-md hover:bg-[#115e59] hover:text-white transition transform duration-300 cursor-pointer text-sm">
                Edit Task
              </button>
              <button
                className=" px-4 py-2.5 bg-[#115e59] text-white rounded-md hover:bg-teal-800 transition transform duration-300 hover:scale-105 cursor-pointer text-sm"
              >
                Remove Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab("bids")}
          className={`px-4 sm:px-6 py-2 rounded-md transition-colors cursor-pointer text-sm sm:text-base ${activeTab === "bids"
            ? "bg-[#115E59] text-white"
            : "text-black bg-[#E6F4F1] hover:bg-gray-200"
            }`}
        >
          Bids
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 sm:px-6 py-2 rounded-md transition-colors cursor-pointer text-sm sm:text-base ${activeTab === "questions"
            ? "bg-[#115E59] text-white"
            : "text-black bg-[#E6F4F1] hover:bg-gray-200"
            }`}
        >
          Questions
        </button>
      </div>

      {/* Bids / Questions */}
      <div className="mt-4 space-y-4">
        {activeTab === "bids" &&
          info?.map((bid) => (
            <div
              key={bid._id || bid.id}
              className="flex flex-col lg:flex-row gap-4 p-4 border rounded-lg bg-white"
            >
              {/* left side */}
              <div className="flex flex-col justify-between gap-6 sm:gap-10 bg-[#E6F4F1] rounded-xl p-4 lg:w-1/3 xl:w-1/4">
                <div className="flex flex-col sm:flex-row lg:flex-col items-center sm:items-start lg:items-center xl:flex-row xl:items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20  rounded-full overflow-clip border-2 border-white shadow-sm flex-shrink-0">
                    <Image
                      src={srvcporvider}
                      alt={bid?.provider?.name || "Provider"}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center sm:text-left lg:text-center xl:text-left">
                    <h4 className="font-semibold text-lg">{bid?.provider?.name}</h4>
                    <p className="flex items-center justify-center sm:justify-start lg:justify-center xl:justify-start text-gray-500 gap-1 text-xs sm:text-sm">
                      <FaStar className="text-yellow-500" />
                      (0 Reviews)
                    </p>
                    <p className="font-bold text-lg sm:text-xl text-[#115E59] mt-1 sm:hidden lg:block xl:hidden">
                      ₦ {bid.price}
                    </p>
                  </div>
                  <div className="hidden sm:block lg:hidden xl:block ml-auto sm:ml-0 lg:ml-auto xl:ml-auto">
                    <p className="font-bold text-xl">
                      ₦ {bid.price}
                    </p>
                  </div>
                </div>

                {/* accept button */}
                <div className="flex flex-col gap-3">
                  {role === "customer" && (taskStatus || taskDetails?.status) === "OPEN_FOR_BID" && (
                    <button
                      onClick={() => openConfirmModal(bid)}
                      disabled={isAcceptingBid}
                      className={`w-full px-4 py-2.5 rounded-lg font-medium transition-colors text-sm ${!isAcceptingBid
                        ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {isAcceptingBid ? "Accepting..." : "Accept Bid"}
                    </button>
                  )}
                </div>
              </div>

              {/* right side */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                    {bid?.details || "No details provided"}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs sm:text-sm text-gray-400">
                    {bid.date || formatTimeAgo(bid.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "questions" &&
          questionsData?.data?.map((q) => (
            <div
              key={q._id}
              className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors bg-white rounded-lg"
            >
              <div className="flex md:justify-center sm:justify-start">
                <Image
                  src={q?.provider?.profile_image || q?.user?.profileImage || client}
                  alt={q?.user?.name || "User"}
                  width={64}
                  height={64}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border border-gray-100"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                    {q?.provider?.name || "Anonymous"}
                  </h3>
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    {formatTimeAgo(q.createdAt)}
                  </span>
                </div>

                {/* Question */}
                <div className="mb-3">
                  <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-tighter mb-1">Question</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {q.details}
                  </p>

                  {/* Question Image */}
                  {q.question_image && (
                    <div className="mt-3 flex justify-center sm:justify-start">
                      <img
                        src={q.question_image}
                        alt="Question attachment"
                        className="max-w-full sm:max-w-xs rounded-lg border border-gray-200 shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Answer */}
                {q.answer && (
                  <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 mt-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] sm:text-xs font-bold text-green-700 uppercase tracking-wider">
                        Response from Poster
                      </span>
                      {q.answeredAt && (
                        <span className="text-[10px] text-gray-400">
                          {formatTimeAgo(q.answeredAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {q.answer}
                    </p>
                  </div>
                )}

                {/* Chat button for customer */}
                {role === "customer" && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleOpenChatModal(q)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#115E59] text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* QUESTION CHAT MODAL */}
      {isChatModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-[100] p-4">
          <div className="bg-white w-full max-w-md p-5 rounded-xl shadow-xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Message {selectedQuestion?.provider?.name || "Provider"}</h2>
              <button onClick={() => setIsChatModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors text-2xl">
                ✕
              </button>
            </div>

            {/* Message Input */}
            <div className="relative">
              <textarea
                className="w-full border border-gray-200 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent transition-all text-sm resize-none"
                placeholder="Hi, I saw your question about my task..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendQuestionChat}
                disabled={!chatMessage.trim()}
                className={`px-6 py-2 rounded-lg font-bold text-white transition-all transform hover:scale-105 flex items-center gap-2 ${!chatMessage.trim()
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#115E59] hover:bg-teal-800 shadow-md"
                  }`}
              >
                <MessageCircle className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bids