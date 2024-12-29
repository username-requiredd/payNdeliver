import dbConnect from "@/lib/connectdb";
import notifications from "@/models/notifications";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = async (req) => {
  try {
    await dbConnect();
    const data = await req.json();
    console.log("Received notification data:", data);

    if (!data) {
      return NextResponse.json(
        { message: "Empty request body!" },
        { status: 400 }
      );
    }

    // Handle both single and multiple notifications
    const isArray = Array.isArray(data);
    const notificationsToCreate = isArray ? data : [data];

    // Transform the data to ensure userId is used correctly
    const transformedNotifications = notificationsToCreate.map(
      (notification) => {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(
          notification.userId
        );
        return {
          ...notification,
          userId: isValidObjectId
            ? new mongoose.Types.ObjectId(notification.userId)
            : notification.userId, // Leave as string if not an ObjectId
        };
      }
    );

    try {
      let newNotifications;
      if (isArray) {
        newNotifications = await notifications.insertMany(
          transformedNotifications
        );
      } else {
        newNotifications = await notifications.create(
          transformedNotifications[0]
        );
      }

      return NextResponse.json(
        {
          message: "Successfully posted notifications!",
          data: isArray ? newNotifications : newNotifications[0],
        },
        { status: 201 }
      );
    } catch (createError) {
      console.error("Notification creation error:", createError);
      return NextResponse.json(
        {
          message: "Failed to create notifications",
          error: createError.message,
          details: createError,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
