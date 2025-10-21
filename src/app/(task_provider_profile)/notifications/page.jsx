import React from "react";
import client from "../../../../public/client.png";
import NotificationCard from "@/components/profile/NotificationCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoIosNotifications } from "react-icons/io";

const notifications = [
  {
    name: "Tyler S.",
    task: "Test Task",
    time: "FRI AT 16:44 PM",
    image: client,
  },
  {
    name: "Tyler S.",
    task: "Test Task",
    time: "FRI AT 16:44 PM",
    image: client,
  },
  {
    name: "Tyler S.",
    task: "Test Task",
    time: "FRI AT 16:44 PM",
    image: client,
  },
];

const Notifications = () => {
  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="flex items-center gap-3 mb-6 lg:mb-8">
        <button className=" hover:bg-gray-100 rounded-lg transition-colors lg:p-0 lg:hover:bg-transparent">
          <IoIosNotifications className="text-2xl text-gray-600 cursor-pointer hover:text-gray-800 transition-colors" />
        </button>
        <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
         Notifications
        </h2>
      </div>
      <div className="grid grid-cols-1 items-center gap-2 mb-6">
        {notifications.map((note, index) => (
          <NotificationCard key={index} {...note} />
        ))}
      </div>
    </div>
  );
};

export default Notifications;
