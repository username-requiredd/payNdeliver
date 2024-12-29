import dbConnect from "@/lib/connectdb"
import notifications from "@/models/notifications"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export const GET = async (req, { params }) => {
    const { id } = params
    
    try {
        await dbConnect()
        const data = await notifications.find({ 
            userId: new ObjectId(id) })
        
        if (data.length === 0) {
            return NextResponse.json(
                { 
                    message: "No notifications found!", 
                    data: [] 
                },
                { status: 200 }
            )
        }
        
        return NextResponse.json(
            { 
                message: "Successfully retrieved notifications!", 
                data: data 
            },
            { status: 200 }
        )

    } catch (err) {
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        )
    }
}

export const PUT = async (req, { params }) => {
    const { id } = params
    
    try {
        await dbConnect()
        const updateData = await req.json()
        
        if (!updateData) {
            return NextResponse.json(
                { message: "Empty request body!" },
                { status: 400 }
            )
        }

        const updatedNotification = await notifications.updateMany(
            { userId: new ObjectId(id) },
            { $set: updateData },
            { new: true } 
        )

        if (!updatedNotification) {
            return NextResponse.json(
                { message: "Notification not found!" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Successfully updated notification!",
                data: updatedNotification
            },
            { status: 200 }
        )

    } catch (err) {
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        )
    }
}

export const DELETE = async (req, { params }) => {
    const { id } = params
    
    try {
        await dbConnect()
        const deletedNotification = await notifications.findOneAndDelete(
            { userId: new ObjectId(id) }
        )

        if (!deletedNotification) {
            return NextResponse.json(
                { message: "Notification not found!" },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Successfully deleted notification!",
                data: deletedNotification
            },
            { status: 200 }
        )

    } catch (err) {
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        )
    }
}