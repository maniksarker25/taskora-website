// import React from "react";
// import { MapPin, Calendar } from "lucide-react";
// import Image from "next/image";
// import client from "../../../public/profile_image.jpg";

// const TaskInfoSection = ({ task }) => {
//   const taskData = {
//     title: task?.title || "Task Title",
//     poster: {
//       name: task?.customer?.name || "Customer",
//       profile_image: task?.customer?.profile_image || client,
//     },
//     location: task?.address || "Location not specified",
//     dueDate: task?.preferredDeliveryDateTime
//       ? new Date(task.preferredDeliveryDateTime).toLocaleDateString("en-US", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
//       : "Schedule not set",
//     description: task?.description || "No description available.",
//     category: task?.category?.name || "General",
//   };

//   return (
//     <div className="p-4 bg-white">
//       <h1 className="text-2xl font-bold text-gray-900 mb-3">
//         {taskData.title}
//       </h1>

//       <div className="mb-6">
//         <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//           {taskData.category}
//         </span>
//       </div>

//       <div className="flex items-center gap-3 mb-4">
//         <Image
//           src={taskData.poster.profile_image}
//           alt={taskData.poster.name}
//           width={48}
//           height={48}
//           className="w-12 h-12 rounded-full object-cover"
//         />
//         <div>
//           <p className="text-xs text-gray-500">Posted by</p>
//           <p className="text-sm font-medium text-gray-900">
//             {taskData.poster.name}
//           </p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 mb-3">
//         <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
//           <MapPin className="w-4 h-4 text-[#115E59]" />
//         </div>
//         <div>
//           <p className="text-xs text-gray-500">Location</p>
//           <p className="text-sm text-gray-900">{taskData.location}</p>
//         </div>
//       </div>

//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 flex items-center justify-center bg-[#E6F4F1] rounded-full">
//           <Calendar className="w-4 h-4 text-[#115E59]" />
//         </div>
//         <div>
//           <p className="text-xs text-gray-500">To Be Done On</p>
//           <p className="text-sm text-gray-900">{taskData.dueDate}</p>
//         </div>
//       </div>

//       <div className="p-4 bg-gray-50 rounded-lg mb-6">
//         <h2 className="text-lg font-semibold text-gray-900 mb-3">
//           Task Details
//         </h2>
//         <p className="text-sm text-gray-600 leading-relaxed">
//           {taskData.description}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default TaskInfoSection;

"use client";

import { Calendar, MapPin, Tag } from "lucide-react";
import Image from "next/image";
import client from "../../../public/profile_image.jpg";

const TaskInfoSection = ({ task }) => {
  const taskData = {
    title: task?.title || "Untitled Task",
    poster: {
      name: task?.customer?.name || "Client",
      profile_image: task?.customer?.profile_image || client,
    },
    location: task?.address || "Location not specified",
    dueDate: task?.preferredDeliveryDateTime
      ? new Date(task.preferredDeliveryDateTime).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Schedule not set",
    description: task?.description || "No description provided.",
    category: task?.category?.name || "General",
  };

  return (
    <div className="w-full max-w-full overflow-hidden bg-white">
      {/* 1. Category Badge & Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-100">
            {taskData.category}
          </span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 leading-tight break-words">
          {taskData.title}
        </h1>
      </div>

      {/* 2. Quick Info Grid (Compact 2-column) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Poster */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image
              src={taskData.poster.profile_image}
              alt={taskData.poster.name}
              fill
              className="rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Posted by
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">{taskData.poster.name}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm">
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Location
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">{taskData.location}</p>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-50 bg-slate-50/50">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white rounded-xl shadow-sm">
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Deadline
            </p>
            <p className="text-sm font-bold text-slate-700 truncate">{taskData.dueDate}</p>
          </div>
        </div>
      </div>

      {/* 3. Detailed Description */}
      <div className="relative p-6 rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-4 bg-teal-500 rounded-full" />
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
            Task Description
          </h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed break-words whitespace-pre-wrap">
          {taskData.description}
        </p>

        {/* Subtle background icon for style */}
        <Tag className="absolute -bottom-4 -right-4 w-24 h-24 text-slate-200/50 -rotate-12" />
      </div>
    </div>
  );
};

export default TaskInfoSection;
