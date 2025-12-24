"use client";
import React, { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import NotificationCard from "@/components/profile/NotificationCard";
import { IoIosNotifications } from "react-icons/io";
import { useGetNotificationsQuery } from "@/lib/features/notification/notificationApi";
import { useSelector } from "react-redux";

const ServiceProviderNotification = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.role;

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
    isFetching
  } = useGetNotificationsQuery({ page, limit });

  const notifications = notificationsData?.data?.result || [];
  const meta = notificationsData?.data?.meta;

  // Calculate unread count
  const unreadCount = notifications.filter(n => n.seenBy?.length === 0).length;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-gray-100">
            <IoIosNotifications className="text-2xl text-gray-600" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3 py-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto lg:px-8 py-4 lg:py-6 mt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
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
            <h2 className="text-gray-700 text-2xl font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={refetch}
          disabled={isFetching}
          className={`inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ${isFetching ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications yet</h3>
          <p className="text-gray-600">You don't have any notifications at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-center gap-3 mb-6 py-6">
          {notifications.map((notification) => (
            <NotificationCard
              userRole={userRole}
              key={notification._id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceProviderNotification;