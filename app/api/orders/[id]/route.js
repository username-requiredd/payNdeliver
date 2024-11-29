import dbConnect from "@/lib/connectdb"
import { Order } from "@/models/orders"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// GET method to retrieve a single order
export const GET = async (req, { params }) => {
    try {
        await dbConnect()
        const { id } = params 

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid order ID" }, { status: 400 })
        }

        const getOrder = await Order.findById(id)

        if (!getOrder) {
            return NextResponse.json({ message: "Order not found!" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Order retrieved successfully!", 
            data: getOrder
        }, { status: 200 })
    } catch (err) {
        console.error("Order retrieval error:", err)
        return NextResponse.json({ 
            message: "Error retrieving order", 
            error: err.message 
        }, { status: 500 })
    }
}

// PUT method to update an order
export const PUT = async (req, { params }) => {
    try {
        await dbConnect()
        console.log("connected to database!..")
        const { id } = params

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid order ID" }, { status: 400 })
        }

        const body = await req.json()
        console.log("put data:",body)
        // Flexible update object with validation
        const updateData = {}

        if (body.status) {
            updateData.status = body.status
            console.log("put data status:", updateData.status)
        }

        // Payment update with more robust validation
        if (body.payment) {
            updateData.payment = {}

            if (body.payment.type) {
                updateData.payment.type = body.payment.type
            }

            if (body.payment.status) {
                updateData.payment.status = body.payment.status
            }

            if (body.paymentSignature) {
                updateData.payment.transactionHash = body.paymentSignature
            }

            if (body.payment.wallet) {
                updateData.payment.wallet = body.payment.wallet
            }
        }

        // Validate paid status
        if (updateData.status === 'paid') {
            if (!updateData.payment?.type) {
                return NextResponse.json({ 
                    message: "Payment type is required for paid orders" 
                }, { status: 400 })
            }
        }

        // Update order
    
        const updatedOrder = await Order.findByIdAndUpdate(
            id, 
            { $set: updateData },
            { 
                new: true,  // Return the updated document
                runValidators: true  // Run model validations
            }
        )
        console.log("order uodated!")

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found!" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Order updated successfully!",
            data: updatedOrder
        }, { status: 200 })
    } catch (err) {
        console.error("Order update error:", err)
        return NextResponse.json({
            message: "Error updating order", 
            error: err.message
        }, { status: 500 })
    }
}

// DELETE method to remove an order
export const DELETE = async (req, { params }) => {
    try {
        await dbConnect()
        const { id } = params 

        // Validate ObjectId
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid order ID" }, { status: 400 })
        }

        // Find and delete the order
        const deletedOrder = await Order.findByIdAndDelete(id)

        if (!deletedOrder) {
            return NextResponse.json({ message: "Order not found!" }, { status: 404 })
        }

        return NextResponse.json({
            message: "Order deleted successfully!", 
            data: deletedOrder
        }, { status: 200 })
    } catch (err) {
        console.error("Order deletion error:", err)
        return NextResponse.json({ 
            message: "Error deleting order", 
            error: err.message 
        }, { status: 500 })
    }
}
