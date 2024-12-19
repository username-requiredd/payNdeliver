"use client";
import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Package,
  Truck,
  CreditCard,
  XCircle,
} from "lucide-react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import axios from "axios";
import { useSession } from "next-auth/react";
import FormatDate from "@/components/formatdate";

const iconMapping = {
  Package: Package,
  CreditCard: CreditCard,
  AlertCircle: AlertCircle,
  XCircle: XCircle,
  Bell: Bell,
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const getNotifications = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `/api/notifications/${session.user.id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        const notificationsWithIcons = response.data.data.map(
          (notification) => ({
            ...notification,
            icon: iconMapping[notification.iconName] || Bell,
          })
        );
        setNotifications(notificationsWithIcons);
      } else {
        console.log("error fetching notifications");
        throw new Error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      setError("Failed to fetch notifications. Please try again later.");
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    if (session?.user?.id) {
      getNotifications();
    }

    return () => {
      controller.abort();
    };
  }, [session?.user?.id]);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications?.filter(
    (notification) => filter === "all" || notification.status === filter
  );

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        read: true,
      }));
      setNotifications(updatedNotifications);

      await axios.put(`/api/notifications/${session.user.id}`, {
        read: true,
      });
    } catch (error) {
      setError("Failed to mark notifications as read");
      getNotifications();
    }
  };

  // Delete a specific notification
  const deleteNotification = async (id) => {
    try {
      setNotifications(notifications.filter((n) => n.id !== id));

      await axios.delete(`/api/notifications/${session.user.id}`);
      getNotifications();
    } catch (error) {
      setError("Failed to delete notification");
      getNotifications();
    }
  };

  // Render notification icon based on status
  const NotificationIcon = ({ icon: Icon, status }) => {
    const statusColors = {
      success: "text-green-500 bg-green-100",
      error: "text-red-500 bg-red-100",
      warning: "text-yellow-500 bg-yellow-100",
    };

    return (
      <div
        className={`p-3 rounded-full ${
          statusColors[status] || "text-blue-500 bg-blue-100"
        }`}
      >
        <Icon className="w-6 h-6" aria-hidden="true" />
      </div>
    );
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
          {error && (
            <div
              className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <Bell className="w-8 h-8 text-gray-600" aria-hidden="true" />
              <h1 className="text-2xl font-bold text-gray-800">
                Notifications
              </h1>
            </div>
            {notifications?.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-800 transition-colors"
                aria-label="Mark all notifications as read"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="flex space-x-2 mb-6 overflow-x-auto" role="tablist">
            {["all", "success", "error", "warning"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                role="tab"
                aria-selected={filter === status}
                className={`px-4 py-2 rounded-full text-sm capitalize whitespace-nowrap
                ${
                  filter === status
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300 animate-pulse" />
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>No notifications to show</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg 
                  ${
                    notification.read
                      ? "bg-gray-50"
                      : "bg-blue-50 border-l-4 border-blue-500"
                  }
                  hover:bg-gray-100 transition-colors`}
                >
                  <NotificationIcon
                    icon={notification.icon}
                    status={notification.status}
                  />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {notification.message}
                    </p>
                    <time className="text-xs text-gray-500">
                      {FormatDate(notification.createdAt)}
                    </time>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    aria-label={`Delete notification: ${notification.title}`}
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NotificationPage;
