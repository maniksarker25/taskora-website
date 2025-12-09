"use client";
import React, { useState } from 'react'
import { CheckCircle, Clock, Bell, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useMarkNotificationAsSeenMutation } from '@/lib/features/notification/notificationApi';
import { toast } from 'sonner';

const NotificationCard = ({ notification, userRole = "customer", onMarkAsSeen }) => {
  const router = useRouter();
  const [isMarkingAsSeen, setIsMarkingAsSeen] = useState(false);
  const [markNotificationAsSeen] = useMarkNotificationAsSeenMutation();
  
  // ইসসিন চেক করো - প্রথমে seenBy, তারপর isSeen
  const isUnread = notification.seenBy?.length === 0 || !notification.isSeen;
  
  // Get icon based on type
  const getIcon = () => {
    switch(notification.type) {
      case 'TASK_ACCEPTED': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'EXTENSION_REQUEST': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get redirect path
  const getRedirectPath = () => {
    if (!notification.redirectLink) return null;
    
    if (notification.type === 'TASK_ACCEPTED' || notification.type === 'EXTENSION_REQUEST') {
      return userRole === "customer" 
        ? `/my_task/${notification.redirectLink}`
        : `/my_bids/${notification.redirectLink}`;
    }
    
    return null;
  };
  
  const redirectPath = getRedirectPath();
  
  // Handle notification click
  const handleClick = async () => {
    // First mark as seen if unread
    if (isUnread) {
      await handleMarkAsSeen();
    }
    
    // Then navigate if there's a redirect path
    if (redirectPath) {
      router.push(redirectPath);
    }
  };
  
  // Handle mark as seen separately
  const handleMarkAsSeen = async (e) => {
    if (e) {
      e.stopPropagation(); // Prevent triggering the main click
    }
    
    if (!isUnread || isMarkingAsSeen) return;
    
    try {
      setIsMarkingAsSeen(true);
      const result = await markNotificationAsSeen(notification._id).unwrap();
      
      if (result.success) {
        toast.success("Notification marked as read");
        // Call parent callback if provided
        if (onMarkAsSeen) {
          onMarkAsSeen(notification._id);
        }
      }
    } catch (error) {
      console.error("Error marking notification as seen:", error);
      toast.error("Failed to mark as read");
    } finally {
      setIsMarkingAsSeen(false);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 rounded-lg border transition-all duration-200 ${
        isUnread 
          ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      } ${redirectPath ? 'cursor-pointer hover:shadow-sm' : 'cursor-default'}`}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        <div className={`p-2 rounded-full ${isUnread ? 'bg-white border-blue-300' : 'bg-gray-50 border-gray-300'} border`}>
          {getIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h3>
            {isUnread && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDate(notification.createdAt)}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            notification.type === 'TASK_ACCEPTED' ? 'bg-green-100 text-green-800' :
            notification.type === 'EXTENSION_REQUEST' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {notification.type.replace('_', ' ')}
          </span>
          
          <div className="flex items-center gap-2">
            {isUnread && (
              <button
                onClick={handleMarkAsSeen}
                disabled={isMarkingAsSeen}
                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMarkingAsSeen ? (
                  <>
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Marking...
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    Mark as read
                  </>
                )}
              </button>
            )}
            
            {redirectPath && (
              <span className="text-xs text-blue-600">
                View →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard;