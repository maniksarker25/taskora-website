import React from "react";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import client from "../../../public/client.png";

const TaskInfoSection = ({ task }) => {
  const taskData = {
    title: task?.title || "Task Title",
    poster: {
      name: task?.customer?.name || "Customer",
      profile_image: task?.customer?.profile_image || client,
    },
    location: task?.address || "Location not specified",
    dueDate: task?.preferredDeliveryDateTime
      ? new Date(task.preferredDeliveryDateTime).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
      : "Schedule not set",
    description: task?.description || "No description available.",
    category: task?.category?.name || "General",
  };

  return (
    <div className="p-4 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-3">
        {taskData.title}
      </h1>

      <div className="mb-6">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {taskData.category}
        </span>
      </div>

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
            {taskData.poster.name}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
          <MapPin className="w-4 h-4 text-[#115E59]" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Location</p>
          <p className="text-sm text-gray-900">{taskData.location}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
          <Calendar className="w-4 h-4 text-[#115E59]" />
        </div>
        <div>
          <p className="text-xs text-gray-500">To Be Done On</p>
          <p className="text-sm text-gray-900">{taskData.dueDate}</p>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Task Details
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {taskData.description}
        </p>
      </div>
    </div>
  );
};

export default TaskInfoSection;