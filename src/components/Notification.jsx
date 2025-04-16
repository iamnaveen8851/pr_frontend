import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BellIcon } from "@heroicons/react/24/outline";
import {
  getNotifications,
  markNotificationAsRead,
} from "../redux/actions/notificationAction";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );
  // console.log(notifications, "notifications...........");

  // Fetch notifications only if we have unread notifications
  useEffect(() => {
    dispatch(getNotifications());
  }, []);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mark notification as read
  const handleMarkAsRead = (notificationId) => {
    // console.log("mark as read", notificationId);
    dispatch(markNotificationAsRead(notificationId)); //check it why its not invoking
  };

  // Format notification time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Rest of your component remains the same, but update these functions: */}
      {/* Replace markAllAsRead with handleMarkAllAsRead */}
      {/* Replace markAsRead with handleMarkAsRead */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-[9px] bottom-[12px] right-[8px] inline-flex items-center justify-center px-[7px] py-[5px] text-[12px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                // onClick={() =>
                //   console.log("mark all as read make an api for that also")
                // }
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              </div>
            ) : notifications.length > 0 ? (
              // In the notifications.map section, update the rendering:

              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {/* Icon based on notification type */}
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-300">
                          {notification.type === "task"
                            ? "T"
                            : notification.type === "project"
                            ? "P"
                            : notification.type === "comment"
                            ? "C"
                            : "N"}
                        </span>
                      </div>
                    </div>
                    <div
                      className="ml-3 flex-1 cursor-pointer"
                      onClick={() => handleMarkAsRead(notification._id)}
                    >
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        {notification.message}
                      </p>
                      {notification.sender && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          From: {notification.sender.username}
                        </p>
                      )}
                      {notification.type === "project" &&
                        notification.project && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Project: {notification.project.name}
                          </p>
                        )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
