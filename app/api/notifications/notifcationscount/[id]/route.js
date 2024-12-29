import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Notification from "@/models/notifications";
import { ObjectId } from "mongodb";

export const GET = async (req, { params }) => {
    const { id } = params;
    console.log(`Fetching notifications for user ID: ${id}`);

    try {
        // Validate the user ID
        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { message: "Invalid user ID" },
                { status: 400 }
            );
        }

        // Connect to the database
        await dbConnect();
        console.log("Successfully connected to database");

        // Check if the user exists (optional)
        const userExists = await Notification.findOne({ userId: new ObjectId(id) });
        if (!userExists) {
            return NextResponse.json(
                { message: "User not found!" },
                { status: 404 }
            );
        }

        // Count unread notifications
        const unreadCount = await Notification.countDocuments({
            userId: new ObjectId(id),
            read: false,
        });
        console.log(`Unread notifications count for user ID ${id}: ${unreadCount}`);

        return NextResponse.json(
            { message: "Unread notifications count retrieved!", count: unreadCount },
            { status: 200 }
        );
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return NextResponse.json(
            { message: "Failed to fetch notifications", error: err.message },
            { status: 500 }
        );
    }
};