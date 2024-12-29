import axios from "axios";

const validateNotification = (notificationData) => {
  if (!notificationData || typeof notificationData !== "object") {
    throw new Error("Invalid notification data provided.");
  }

  const requiredFields = ["userId", "title", "message", "type"];
  const missingFields = requiredFields.filter(
    (field) => !notificationData[field]
  );

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }

  if (!["in-app", "email", "sms"].includes(notificationData.type)) {
    throw new Error(
      "Invalid notification type. Must be one of: in-app, email, sms"
    );
  }
};

const createNotification = async (notificationData) => {
  try {
    const isArray = Array.isArray(notificationData);
    const notifications = isArray ? notificationData : [notificationData];

    // Validate all notifications first
    notifications.forEach((notification, index) => {
      try {
        validateNotification(notification);
      } catch (error) {
        throw new Error(`Notification ${index}: ${error.message}`);
      }
    });

    const response = await axios.post(
      "/api/notifications",
      isArray ? notifications : notifications[0],
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 seconds timeout
      }
    );

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Notification request timed out. Please try again.");
      }
      if (error.response) {
        throw new Error(
          `Server error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        throw new Error("No response received from notification server");
      }
    }

    throw error instanceof Error
      ? error
      : new Error("Failed to create notification");
  }
};

export default createNotification;
