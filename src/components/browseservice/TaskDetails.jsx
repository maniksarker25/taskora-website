"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import client from "../../../public/client.png";
import Image from "next/image";
import Link from "next/link";
import BidModal from "@/components/browseservice/BidModal";
import {
  useAcceptBidMutation,
  useCreateBidMutation,
} from "@/lib/features/bidApi/bidApi";
import { toast } from "sonner";

const TaskDetails = ({ task }) => {
  const [contentTab, setContentTab] = useState("Bids");
  const [newQuestion, setNewQuestion] = useState("");
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bids, setBids] = useState([]);

  // RTK Query mutations
  const [createBid, { isLoading: isSubmittingBid }] = useCreateBidMutation();
  const [acceptBid, { isLoading: isAcceptingBid }] = useAcceptBidMutation();

  console.log("Task Details Props:", task);

  // Use actual task data
  const taskData = {
    title: task?.title || "Task Title",
    poster: {
      name: task?.customer?.name || "Customer",
      profile_image: task?.customer?.profile_image || client,
    },
    location: task?.city || task?.address || "Location not specified",
    dueDate: task?.preferredDate
      ? new Date(task.preferredDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
      : "Schedule not set",
    budget: task?.budget?.toString() || "0",
    description: task?.description || "No description available.",
    category: task?.category?.name || "General",
    status: task?.status || "OPEN_FOR_BID",
    totalOffer: task?.totalOffer || 0,
    createdAt: task?.createdAt
      ? new Date(task.createdAt).toLocaleDateString()
      : "Recently",
  };

  // Sample bids data (in real app, this would come from API)
  const sampleBids = [
    {
      id: 1,
      user: "John Doe",
      rating: "4.8",
      reviewCount: "203",
      bidAmount: 850,
      message:
        "I have 5 years of experience in similar tasks. Can complete within 2 days.",
      timeAgo: "1 hour ago",
      profileImage: client,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      rating: "4.9",
      reviewCount: "156",
      bidAmount: 920,
      message:
        "Professional service with all tools provided. Available immediately.",
      timeAgo: "2 hours ago",
      profileImage: client,
    },
  ];

  // Sample questions data
  const questions = [
    {
      id: 1,
      user: "Grace Carey",
      rating: "4.5",
      reviewCount: "148",
      question: "Do I need to bring any tools or equipment?",
      answer: "No, all necessary tools will be provided for this task.",
      timeAgo: "2 hours ago",
      profileImage: client,
    },
  ];

  const contentTabs = ["Bids", "Questions"];

  // Handle bid submission
  const handleBidSubmit = async (bidData) => {
    try {
      const result = await createBid(bidData).unwrap();

      if (result.success) {
        console.log("Bid created successfully:", result);
        toast.success("Bid send successfull!", {
          style: {
            backgroundColor: "#d1fae5",
            color: "#065f46",
            borderLeft: "6px solid #10b981",
          },
          duration: 3000,
        });
        setIsBidModalOpen(false);
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

  // Handle bid acceptance
  const handleAcceptBid = async (bidId) => {
    if (!confirm("Are you sure you want to accept this bid?")) return;

    try {
      const result = await acceptBid(bidId).unwrap();

      if (result.success) {
        console.log("Bid accepted successfully:", result);
        alert("Bid accepted! The task has been assigned.");

        // In a real app, you might want to refetch bids and task status here
        // await refetchBids();
        // await refetchTask();
      }
    } catch (error) {
      console.error("Failed to accept bid:", error);
      alert(error?.data?.message || "Failed to accept bid. Please try again.");
    }
  };

  const handleQuestionSubmit = () => {
    if (newQuestion.trim()) {
      console.log("New question:", newQuestion);
      // Here you would typically send the question to your API
      setNewQuestion("");
    }
  };

  // Dynamic status configuration
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

  const currentStatusConfig = getStatusConfig(taskData.status);

  // Use sample bids for now - in real app, use useGetTaskBidsQuery
  useEffect(() => {
    setBids(sampleBids);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
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

      {/* Dynamic Status Display */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${currentStatusConfig.color}`}
        >
          {currentStatusConfig.icon}
          {currentStatusConfig.label}
        </div>
      </div>

      {/* Task Header */}
      <div className="p-4 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {taskData.title}
        </h1>

        {/* Category Badge */}
        <div className="mb-6">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {taskData.category}
          </span>
        </div>

        {/* Poster Info */}
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={taskData.poster.profile_image}
            alt={taskData.poster.name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <p className="text-xs text-gray-500">Posted by</p>
            <p className="text-sm font-medium text-gray-900">
              {task?.provider?.name}
            </p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <MapPin className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Location</p>
            <p className="text-sm text-gray-900">{taskData.location}</p>
          </div>
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
            <Calendar className="w-4 h-4 text-[#115E59]" />
          </div>
          <div>
            <p className="text-xs text-gray-500">To Be Done On</p>
            <p className="text-sm text-gray-900">{taskData.dueDate}</p>
          </div>
        </div>

        {/* Task Description */}
        <div className="p-4 bg-gray-50 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Task Details
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {taskData.description}
          </p>
        </div>

        {/* Budget and Action */}
        <div className="flex justify-between items-center border-t pt-6">
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
            <button
              onClick={() => setIsBidModalOpen(true)}
              className="bg-[#115E59] hover:bg-teal-700 cursor-pointer text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Submit A Bid
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white border-b border-gray-200 sticky top-16 z-10">
        {contentTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setContentTab(tab)}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
              contentTab === tab
                ? "text-white bg-[#115E59] cursor-pointer border-b-2 border-[#115E59]"
                : "text-gray-600 hover:text-gray-900 cursor-pointer hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {contentTab === "Bids" ? (
        <div>
          {/* Bids List */}
          {bids.map((bid) => (
            <div
              key={bid.id}
              className="flex gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <Image
                src={bid.profileImage}
                alt={bid.user}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{bid.user}</h3>
                  <span className="text-xs text-gray-400">{bid.timeAgo}</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {bid.rating}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({bid.reviewCount} Reviews)
                  </span>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {bid.message}
                </p>

                {/* Bid Amount and Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-lg font-bold text-[#115e59]">
                      ₦{bid.bidAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Bid Amount
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptBid(bid.id)}
                      disabled={isAcceptingBid}
                      className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${
                        isAcceptingBid
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-[#115e59] text-white hover:bg-teal-700 cursor-pointer"
                      }`}
                    >
                      {isAcceptingBid ? "Accepting..." : "Accept Bid"}
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer">
                      Message
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View More Button */}
          <div className="p-4 bg-white">
            <button className="w-full bg-[#115E59] hover:bg-teal-700 cursor-pointer text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Load More Bids
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white">
          {/* Ask Question Form */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex gap-3">
              <Image
                src={client}
                alt="Your profile"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask a question about this task..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-[#115E59] focus:border-transparent"
                  rows="3"
                />
                <div className="flex justify-end items-center mt-3">
                  <button
                    onClick={handleQuestionSubmit}
                    disabled={!newQuestion.trim()}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      newQuestion.trim()
                        ? "bg-[#115E59] text-white hover:bg-teal-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Send Question
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div>
            {questions.map((question) => (
              <div
                key={question.id}
                className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={question.profileImage}
                  alt={question.user}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                      {question.user}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {question.timeAgo}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {question.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({question.reviewCount} Reviews)
                    </span>
                  </div>

                  {/* Question */}
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-800 mb-1">Q:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {question.question}
                    </p>
                  </div>

                  {/* Answer */}
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-green-700">
                        Task Poster Response:
                      </span>
                      <span className="text-xs text-gray-500">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {question.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button for Questions */}
          <div className="p-4 bg-white">
            <button className="w-full bg-[#115e59] hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">
              Load More Questions
            </button>
          </div>
        </div>
      )}

      {/* Bid Modal */}
      <BidModal
        isOpen={isBidModalOpen}
        onClose={() => setIsBidModalOpen(false)}
        task={task}
        onSubmit={handleBidSubmit}
        isLoading={isSubmittingBid}
      />
    </div>
  );
};

export default TaskDetails;
