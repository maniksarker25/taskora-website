"use client"
import React, { useState } from "react";
import Image from "next/image";
import client from "../../../public/profile_image.jpg";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useSocketContext } from "@/app/context/SocketProvider";
import { MessageCircle } from "lucide-react";

const QuestionItem = ({ question, task }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const userID = useSelector((state) => state?.auth?.user?.profileId);
  const user = useSelector((state) => state?.auth?.user?.role);
  const users = useSelector((state) => state?.auth?.user);
  const customerId = task?.customer?._id;
  const { socket, isConnected, sendMessageSoket, seenMessage } = useSocketContext();

  console.log("tasksksfksdjlfksadj", task)

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

  //   modal
  const handleChatClick = () => {
    // if (!user?.role) {
    //   toast.error("Please log in to access the chat feature.");
    //   return;
    // }

    setIsModalOpen(true);
  };

  //   send sms
  const handleSend = () => {
    // logic: Only customer sees this button (userID === customerId check in render)
    // So the receiver should be the provider who asked the question.
    const receiverId = question?.provider?._id || question?.provider?.profileId;

    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (!receiverId) {
      toast.error("Unable to identify the recipient.");
      return;
    }

    const data = {
      text: message,
      imageUrl: [""],
      pdfUrl: [""],
      receiver: receiverId
    }


    sendMessageSoket(data);
    setMessage("");
    setIsModalOpen(false)
    if (window !== undefined) {
      window.location.href = "/chat";
    }
  };

  return (
    <div className="flex gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <Image
        src={question?.provider?.profile_image || question?.user?.profileImage || client}
        alt={question?.user?.name || "User"}
        width={64}
        height={64}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-900">
            {question?.provider?.name || "Anonymous"}
          </h3>
          <span className="text-xs text-gray-400">
            {formatTimeAgo(question.createdAt)}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800 mb-1">Q:</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {question.details}
          </p>

          {question.question_image && (
            <div className="mt-2">
              <img
                src={question.question_image}
                alt="Question attachment"
                className="max-w-xs rounded-lg border border-gray-200"
              />
            </div>
          )}

          {userID === customerId && (
            <div className="flex mt-10">
              <button
                onClick={handleChatClick}
                className="px-10 py-2 bg-[#115E59] text-white rounded-md hover:bg-[#0d726b] cursor-pointer">
                Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/*  CHAT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-md p-5 rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chat Box</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 text-xl">
                ✕
              </button>
            </div>

            {/* Message Input */}
            <textarea
              className="w-full border rounded-md p-3 h-24 outline-none"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              // disabled={task?.status === "COMPLETED" || task?.status === "CANCELLED"}
              className={`px-6 py-2.5 rounded-md transition transform duration-300 hover:scale-105 flex gap-2 items-center justify-center mt-12 ${(task?.status === "COMPLETED" || task?.status === "CANCELLED") ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#115e59] text-white hover:bg-teal-800 cursor-pointer"}`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionItem;