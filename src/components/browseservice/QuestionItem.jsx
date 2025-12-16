import React from "react";
import Image from "next/image";
import client from "../../../public/client.png";
import { useSelector } from "react-redux";

const QuestionItem = ({ question, task }) => {
  const userID = useSelector((state) => state?.auth?.user?.profileId);
  const customerId = task?.customer?._id;

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
              <button className="px-10 py-2 bg-[#115E59] text-white rounded-md hover:bg-[#0d726b] cursor-pointer">
                Chat
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionItem;