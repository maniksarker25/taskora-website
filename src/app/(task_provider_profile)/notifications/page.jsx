"use client";
import React, { useState } from "react";
import { Bell, RefreshCw, Eye } from "lucide-react";
import { IoIosNotifications } from "react-icons/io";
import NotificationCard from "@/components/profile/NotificationCard";
import { useGetNotificationsQuery, useMarkNotificationAsSeenMutation } from "@/lib/features/notification/notificationApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Notifications = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;
  
  // Fetch notifications
  const { 
    data: notificationsData, 
    isLoading, 
    error, 
    refetch 
  } = useGetNotificationsQuery({ page, limit });
  
  const [markNotificationAsSeen] = useMarkNotificationAsSeenMutation();
  
  const notifications = notificationsData?.data?.result || [];
  const meta = notificationsData?.data?.meta;
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => n.seenBy?.length === 0).length;
  
  // Handle mark all as seen
  const handleMarkAllAsSeen = async () => {
    if (unreadCount === 0) return;
    
    try {
      const unreadNotifications = notifications.filter(n => n.seenBy?.length === 0);
      const promises = unreadNotifications.map(notification => 
        markNotificationAsSeen(notification._id)
      );
      
      await Promise.all(promises);
      toast.success(`Marked ${unreadCount} notifications as read`);
      refetch();
    } catch (error) {
      console.error("Error marking all as seen:", error);
      toast.error(error.message || "Error marking all as seen");
    }
  };
  
  // Handle individual notification marked as seen
  const handleNotificationMarkedAsSeen = (notificationId) => {
    // This callback can be used to update local state if needed
    console.log("Notification marked as seen:", notificationId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <div className="p-2 rounded-lg bg-gray-100">
            <IoIosNotifications className="text-2xl text-gray-600" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Notifications</h3>
          <p className="text-gray-600 mb-4">Failed to load notifications. Please try again.</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-50 relative">
            <IoIosNotifications className="text-2xl text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-600 text-lg sm:text-xl lg:text-2xl">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsSeen}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Eye className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">You don't have any notifications at the moment.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 mb-6">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification._id}
                notification={notification}
                userRole={userRole}
                onMarkAsSeen={handleNotificationMarkedAsSeen}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPage > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Previous
              </button>
              
              <span className="text-gray-600">
                Page {page} of {meta.totalPage}
              </span>
              
              <button
                onClick={() => setPage(prev => Math.min(meta.totalPage, prev + 1))}
                disabled={page === meta.totalPage}
                className={`px-4 py-2 rounded-lg ${page === meta.totalPage ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;