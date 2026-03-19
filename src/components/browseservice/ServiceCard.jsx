// // components/browseservice/ServiceCard.jsx
// "use client";
// import React from "react";
// import { LuMapPin } from "react-icons/lu";
// import { SlCalender } from "react-icons/sl";
// import { IoTimerOutline } from "react-icons/io5";
// import Image from "next/image";
// import userImage from "../../../public/profile_image.jpg";

// const ServiceCard = ({ task, isActive = false }) => {
//   // console.log("taskkkskjfkasdjflksj===>>>>>>>",task)
//   const formatTaskData = (task) => {
//     return {
//       id: task?._id,
//       userImage: task?.customer?.profile_image || userImage,
//       serviceName: task?.title || "No Title",
//       category: typeof task?.category === 'object' ? task?.category?.name : task?.category || "General",
//       userName: typeof task?.customer === 'object' ? task?.customer?.name : "Unknown User",
//       place: task?.address || task?.city || "Location not specified",
//       city: task?.city || "City not specified",
//       month: task?.preferredDeliveryDateTime
//         ? new Date(task.preferredDeliveryDateTime).toLocaleDateString("en-US", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//           }) + (task.preferredTime ? ` ${task.preferredTime}` : "")
//         : "Flexible",
//       status: task?.status === "OPEN_FOR_BID" ? "open" : "closed",
//       price: `₦ ${task?.budget || "0"}`,
//       description: task?.description,
//       totalOffer: task?.totalOffer || 0,
//     };
//   };

//   const taskData = formatTaskData(task);

//   return (
//     <div className={`flex flex-col gap-4 rounded-md p-6 cursor-pointer border-2 transition-all duration-400 ease-in-out bg-white ${isActive ? 'border-[#115e59] ring-2 ring-[#115e59] ring-opacity-50 shadow-md' : 'border-gray-200 hover:border-[#115e59]'}`}>
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <span className="text-xs font-medium text-white bg-[#115e59] px-2 py-1 rounded-full">
//           {taskData.category}
//         </span>
//         <span
//           className={`text-xs font-medium px-2 py-1 rounded-full ${
//             taskData.status === "open"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {taskData.status === "open" ? "Open" : "Closed"}
//         </span>
//       </div>

//       {/* Service Name */}
//       <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
//         {taskData.serviceName}
//       </h3>

//       {/* Description */}
//       <p className="text-sm text-gray-600 line-clamp-3">
//         {taskData.description || "No description available"}
//       </p>

//       {/* Location and Date Info */}
//       <div className="flex flex-col gap-2">
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <LuMapPin className="w-4 h-4 text-[#115e59]" />
//           <span>{taskData.place}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <SlCalender className="w-4 h-4 text-[#115e59]" />
//           <span>{taskData.city}</span>
//         </div>
//         <div className="flex items-center gap-2 text-sm text-gray-600">
//           <IoTimerOutline className="w-4 h-4 text-[#115e59]" />
//           <span>{taskData.month}</span>
//         </div>
//       </div>

//       {/* User Info and Price */}
//       <div className="flex justify-between items-center pt-2 border-t border-gray-200">
//         <div className="flex gap-1.5 items-center">
//           <div className="w-10 h-10 rounded-full overflow-hidden">
//             <Image
//               src={taskData.userImage}
//               alt={taskData.userName}
//               width={40}
//               height={40}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex flex-col">
//             <span className="text-sm font-medium text-gray-900">
//               {taskData.userName}
//             </span>
//             <span className="text-xs text-gray-500">
//               {taskData.totalOffer} offers
//             </span>
//           </div>
//         </div>
//         <div className="text-right">
//           <span className="text-lg font-bold text-gray-900">
//             {taskData.price}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceCard;

"use client";

import Image from "next/image";
import { LuMapPin } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import defaultAvatar from "../../../public/profile_image.jpg";

const ServiceCard = ({ task, isActive = false }) => {
  // Helper for cleaner data extraction
  const taskData = {
    category: task?.category?.name || task?.category || "General",
    title: task?.title || "Untitled Task",
    status: task?.status === "OPEN_FOR_BID" ? "Open" : "Closed",
    description: task?.description || "No details provided for this task.",
    location: task?.address || task?.city || "Remote / Flexible",
    city: task?.city || "Unknown",
    budget: task?.budget ? `₦${Number(task.budget).toLocaleString()}` : "Flexible",
    offers: task?.totalOffer || 0,
    userImage: task?.customer?.profile_image || defaultAvatar,
    userName: task?.customer?.name || "Member",
    date: task?.preferredDeliveryDateTime
      ? new Date(task.preferredDeliveryDeliveryDateTime).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "Flexible Date",
  };

  return (
    <div
      className={`group flex flex-col gap-4 rounded-2xl p-5 border-2 transition-all duration-300 bg-white shadow-sm hover:shadow-md
      ${
        isActive
          ? "border-[#115e59] ring-4 ring-[#115e59]/10 shadow-lg"
          : "border-gray-100 hover:border-teal-200"
      }`}
    >
      {/* Top Badge Row */}
      <div className="flex justify-between items-center">
        <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-[#115e59] px-3 py-1 rounded-md">
          {taskData.category}
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              taskData.status === "Open" ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-xs font-bold text-gray-500 uppercase">{taskData.status}</span>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#115e59] transition-colors line-clamp-1">
          {taskData.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {taskData.description}
        </p>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-1 gap-y-2 py-2">
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <LuMapPin className="text-[#115e59]" />
          </div>
          <span className="truncate">{taskData.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
          <div className="p-1.5 bg-gray-50 rounded-lg">
            <SlCalender className="text-[#115e59]" />
          </div>
          <span>{taskData.date}</span>
        </div>
      </div>

      {/* Footer: Profile & Pricing */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src={taskData.userImage}
              alt={taskData.userName}
              fill
              className="rounded-full object-cover border-2 border-white shadow-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800">{taskData.userName}</span>
            <span className="text-[10px] font-semibold text-[#115e59] uppercase tracking-wide">
              {taskData.offers} {taskData.offers === 1 ? "Offer" : "Offers"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Budget</p>
          <span className="text-xl font-black text-gray-900">{taskData.budget}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
