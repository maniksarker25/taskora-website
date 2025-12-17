// components/chat/ChatSideNav.jsx
"use client";
import { Search, ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useGetChatListQuery } from "@/lib/features/chatApi/chatApi";
import { useSocketContext } from "@/app/context/SocketProvider";
import { useAuth } from "@/components/auth/useAuth";
import { format } from "date-fns";

const ChatSideNav = ({ onMobileItemClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { data: chatUsers, refetch } = useGetChatListQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const { seenMessage, onMessageReceivedForUser } = useSocketContext();

  // Auto-refetch chat list every 1 second for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Also listen for socket notifications and refetch immediately
  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onMessageReceivedForUser(user.id, (data) => {
      refetch();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.id, refetch]);

  const handleUserClick = (user) => {
    const data = {
      conversationId: user?.lastMessage?.conversationId,
      msgByUserId: user?.lastMessage?.msgByUserId
    }
    seenMessage(data)
    refetch();
    router.push(`/chat/${user?.userData?._id}`);
    if (onMobileItemClick) {
      onMobileItemClick();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    try {
      return format(new Date(timestamp), "h:mm a");
    } catch (e) {
      return "";
    }
  };

  const filteredUsers = chatUsers?.data?.data?.filter((user) =>
    user?.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Sidebar */}
      <div className="relative pt-36 md:pt-0 h-full flex flex-col">
        {/* Mobile Back Button */}
        <div className="lg:hidden px-2 mb-2">
          <Link
            href='/'
            className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-100 rounded-lg transition-colors w-full"
          >
            <ArrowLeft className="w-5 h-5 text-[#00786f]" />
            <span className="font-medium text-gray-700">Back</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-4 border-b pb-4 px-4 sticky top-0 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#115e59] focus:border-transparent bg-gray-50 text-gray-800 placeholder-gray-400 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Chat List Container */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          {filteredUsers?.length > 0 ? (
            filteredUsers.map((user) => {
              const isActive = pathname.includes(user?.userData?._id);
              return (
                <div
                  key={user?._id}
                  onClick={() => handleUserClick(user)}
                  className={`group flex items-center gap-3 p-3 cursor-pointer rounded-xl transition-all duration-200 border border-transparent
                    ${isActive
                      ? "bg-[#E6F4F1] border-[#bce3de] shadow-sm"
                      : "hover:bg-gray-50 hover:border-gray-100"
                    }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 border border-gray-100">
                      {user?.userData?.profile_image && user?.userData?.profile_image.trim() !== "" ? (
                        <img
                          src={user?.userData?.profile_image}
                          alt={user?.userData?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src="/taskalley.svg"
                          alt="TaskAlley Logo"
                          className="w-7 h-7"
                        />
                      )}
                    </div>
                    {/* Online status indicator could go here */}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className={`text-sm font-semibold truncate ${isActive ? "text-[#00786f]" : "text-gray-900"}`}>
                        {user?.userData?.name}
                      </h3>
                      <span className="text-xs text-gray-400 font-medium ml-2 flex-shrink-0">
                        {formatTime(user?.lastMessage?.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className={`text-xs truncate max-w-[140px] ${!user?.lastMessage?.seen && !isActive ? "font-bold text-gray-800" : "text-gray-500"}`}>
                        {user?.lastMessage?.isMyMessage && "You: "}
                        {user?.lastMessage?.text || (user?.lastMessage?.imageUrl?.length > 0 ? "Sent an image" : "Sent a file")}
                      </p>
                      {user?.unseenMsg > 0 && (
                        <div className="bg-[#115E59] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] flex justify-center items-center shadow-sm">
                          {user?.unseenMsg}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <p className="text-sm">No conversations found</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSideNav;