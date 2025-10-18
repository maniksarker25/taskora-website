"use client";
import { Menu, Search, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

const ChatSideNav = () => {
  const router = useRouter();
  
  const chatUser = [
    {
      id: 1,
      Name: "Lee Williamso",
      short_message: "Hey, are you available for a quick call?",
      image: "https://i.pravatar.cc/150?img=1",
    },
    {
      id: 2,
      Name: "Eleanor Pena",
      short_message: "Yes, that's gonna work, hopefully.",
      image: "https://i.pravatar.cc/150?img=2",
    },
    {
      id: 3,
      Name: "Jacob Jones",
      short_message: "I'll send you the files by tonight.",
      image: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 4,
      Name: "Theresa Webb",
      short_message: "Can we move the meeting to tomorrow?",
      image: "https://i.pravatar.cc/150?img=4",
    },
    {
      id: 5,
      Name: "Courtney Henry",
      short_message: "Thanks for the update! Much appreciated.",
      image: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 6,
      Name: "Marvin McKinney",
      short_message: "Let's finalize the design this week.",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 7,
      Name: "Marvin McKinney",
      short_message: "Let's finalize the design this week.",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 8,
      Name: "Marvin McKinney",
      short_message: "Let's finalize the design this week.",
      image: "https://i.pravatar.cc/150?img=6",
    },
    {
      id: 9,
      Name: "Marvin McKinney",
      short_message: "Let's finalize the design this week.",
      image: "https://i.pravatar.cc/150?img=6",
    },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="relative pt-36 md:pt-0 ">
        {/* Mobile Back Button - Moved inside with proper spacing */}
        <div className="lg:hidden px-2">
          <Link
            href='/'
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <ArrowLeft className="w-5 h-5 text-[#00786f]" />
            <span className="font-medium text-gray-700">Back</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6 border-b pb-4 px-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search conversations"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent bg-[#E6F4F1] text-gray-600"
            />
          </div>
        </div>

        {/* Scrollable Chat List Container */}
        <div className="w-full max-h-[calc(100vh-280px)] lg:max-h-[650px] overflow-y-auto px-2">
          {chatUser.map((user, index) => (
            <ul
              key={index}
              className="flex items-center gap-3 p-4 hover:bg-[#E6F4F1] cursor-pointer rounded-2xl transition-colors"
            >
              <div className="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 overflow-clip">
                <img
                  src={user.image}
                  className="rounded-full w-full h-full object-cover"
                  alt={user.Name}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-base lg:text-xl font-semibold truncate">{user.Name}</p>
                <p className="text-xs lg:text-sm text-gray-500 truncate">{user.short_message}</p>
              </div>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatSideNav;