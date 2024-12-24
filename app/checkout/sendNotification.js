import axios from "axios";

const createNotification = async (notificationData) => {
  console.log("Starting notification creation with data:", {
    ...notificationData,
    userId: notificationData?.userId ? "[PRESENT]" : "[MISSING]",
  });

  try {
    // Data validation
    if (!notificationData || typeof notificationData !== "object") {
      console.error("Validation Error: Invalid notification data structure", {
        receivedType: typeof notificationData,
        receivedValue: notificationData,
      });
      throw new Error("Invalid notification data provided.");
    }

    // Required fields validation
    const requiredFields = ["userId", "title", "message", "type"];
    const missingFields = requiredFields.filter(
      (field) => !notificationData[field]
    );

    if (missingFields.length > 0) {
      console.error("Validation Error: Missing required fields", {
        missingFields,
        providedFields: Object.keys(notificationData),
      });
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    // Type validation
    if (!["in-app", "email", "sms"].includes(notificationData.type)) {
      console.error("Validation Error: Invalid notification type", {
        providedType: notificationData.type,
        allowedTypes: ["in-app", "email", "sms"],
      });
      throw new Error(
        "Invalid notification type. Must be one of: in-app, email, sms"
      );
    }

    console.log("Validation passed, sending notification request...");

    const response = await axios.post("/api/notifications", notificationData, {
      headers: {
        "Content-Type": "application/json",
        // Add any authorization headers if needed
        // "Authorization": `Bearer ${token}`
      },
      timeout: 10000, // 10 seconds timeout
    });

    console.log("Notification created successfully", {
      statusCode: response.status,
      notificationId: response.data?.id || "[NOT_PROVIDED]",
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    // Detailed error logging based on error type
    if (axios.isAxiosError(error)) {
      // Handle Axios specific errors
      console.error("Axios request failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout,
        errorMessage: error.message,
        responseData: error.response?.data,
      });

      if (error.code === "ECONNABORTED") {
        throw new Error("Notification request timed out. Please try again.");
      }

      if (error.response) {
        // Server responded with error status
        throw new Error(
          `Server error: ${error.response.data?.message || error.message}`
        );
      } else if (error.request) {
        // Request made but no response received
        throw new Error("No response received from notification server");
      }
    } else if (error instanceof Error) {
      // Handle validation and other errors
      console.error("Notification creation failed:", {
        errorType: error.constructor.name,
        message: error.message,
        stack: error.stack,
      });
    } else {
      // Handle unknown errors
      console.error("Unknown error during notification creation:", error);
    }

    // Rethrow the error with additional context if needed
    throw error instanceof Error
      ? error
      : new Error("Failed to create notification");
  }
};

export default createNotification;
