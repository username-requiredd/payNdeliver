import { NextResponse } from "next/server"
import dbConnect from "@/lib/connectdb"
import Order from "@/models/orders"

export async function POST(req) {
    try {
        await dbConnect()
        const data = await req.json()
        
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json({ message: "Invalid order data" }, { status: 400 })
        }
        
        const newOrder = await Order.create(data)
        
        return NextResponse.json({ message: "Order created successfully", data: newOrder }, { status: 201 })
    } catch (err) {
        console.error("Error creating order:", err)
        return NextResponse.json({ message: "Error creating new order" }, { status: 500 })
    }
}