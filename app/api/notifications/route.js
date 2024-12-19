import dbConnect from "@/lib/connectdb"
import notifications from "@/models/notifications"
import { NextResponse } from "next/server";

export const POST = async (req) => {
    try {
        await dbConnect()
        const data = await req.json()
        
        if (!data) {
            return NextResponse.json(
                { message: "Empty request body!" },
                { status: 400 }  
            )
        }
        
        const newNotification = await notifications.create(data) 
        return NextResponse.json(
            { 
                message: "Successfully posted notifications!", 
                data: newNotification 
            },
            { status: 201 }
        )

    } catch (err) {
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        )
    }
}

