// components/browseservice/ServiceCard.jsx
"use client";
import React from "react";
import { LuMapPin } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { IoTimerOutline } from "react-icons/io5";
import Image from "next/image";
import userImage from "../../../public/task_img.png";

const ServiceCard = ({ task, isActive = false }) => {
  console.log("taskkkskjfkasdjflksj===>>>>>>>",task)
  const formatTaskData = (task) => {
    return {
      id: task?._id,
      userImage: task?.customer?.profile_image || userImage,
      serviceName: task?.title || "No Title",
      category: typeof task?.category === 'object' ? task?.category?.name : task?.category || "General",
      userName: typeof task?.customer === 'object' ? task?.customer?.name : "Unknown User",
      place: task?.address || task?.city || "Location not specified",
      city: task?.city || "City not specified",
      month: task?.preferredDeliveryDateTime
        ? new Date(task.preferredDeliveryDateTime).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
        : "Flexible",
      status: task?.status === "OPEN_FOR_BID" ? "open" : "closed",
      price: `₦ ${task?.budget || "0"}`,
      description: task?.description,
      totalOffer: task?.totalOffer || 0,
    };
  };

  const taskData = formatTaskData(task);

  return (
    <div className={`flex flex-col gap-4 rounded-md p-6 cursor-pointer border-2 transition-all duration-400 ease-in-out bg-white ${isActive ? 'border-[#115e59] ring-2 ring-[#115e59] ring-opacity-50 shadow-md' : 'border-gray-200 hover:border-[#115e59]'}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-white bg-[#115e59] px-2 py-1 rounded-full">
          {taskData.category}
        </span>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            taskData.status === "open"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {taskData.status === "open" ? "Open" : "Closed"}
        </span>
      </div>

      {/* Service Name */}
      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
        {taskData.serviceName}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-600 line-clamp-3">
        {taskData.description || "No description available"}
      </p>

      {/* Location and Date Info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LuMapPin className="w-4 h-4 text-[#115e59]" />
          <span>{taskData.place}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <SlCalender className="w-4 h-4 text-[#115e59]" />
          <span>{taskData.city}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <IoTimerOutline className="w-4 h-4 text-[#115e59]" />
          <span>{taskData.month}</span>
        </div>
      </div>

      {/* User Info and Price */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-200">
        <div className="flex gap-1.5 items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={taskData.userImage}
              alt={taskData.userName}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {taskData.userName}
            </span>
            <span className="text-xs text-gray-500">
              {taskData.totalOffer} offers
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">
            {taskData.price}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;