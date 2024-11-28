import dbConnect from "@/lib/connectdb"
import Order from "@/models/orders"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// Existing GET method (included for reference)
export const GET = async(req, {params}) => {
    try {
        await dbConnect()
        const {id} = params 
        const getOrder = await Order.findOne({_id: new ObjectId(id)})
        
        if(!getOrder) {
            return NextResponse.json({message:"Order not found!"}, {status: 404})
        }
        
        return NextResponse.json({
            message: "Order retrieved successfully!", 
            data: getOrder
        }, {status: 200})
    } catch(err) {
        return NextResponse.json({message: err.message}, {status: 500})
    }
}

// PUT method to update an order
export const PUT = async(req, {params}) => {
    try {
        await dbConnect()
        const {id} = params 
        console.log(`order id from put request`,id)
        const body = await req.json()
        console.log("order body from put request:", body)
        // Find the order and update it
        const updatedOrder = await Order.findOneAndUpdate(
            {_id: new ObjectId(id)}, 
            body, 
            {new: true, runValidators: true}
        )
        console.log("updated order", updatedOrder)
        if(!updatedOrder) {
            return NextResponse.json({message: "Order not found!"}, {status: 404})
        }
        
        return NextResponse.json({
            message: "Order updated successfully!", 
            data: updatedOrder
        }, {status: 200})
    } catch(err) {
        return NextResponse.json({message: err.message}, {status: 500})
    }
}

// DELETE method to remove an order
export const DELETE = async(req, {params}) => {
    try {
        await dbConnect()
        const {id} = params 
        
        // Find and delete the order
        const deletedOrder = await Order.findOneAndDelete({_id: new ObjectId(id)})
        
        if(!deletedOrder) {
            return NextResponse.json({message: "Order not found!"}, {status: 404})
        }
        
        return NextResponse.json({
            message: "Order deleted successfully!", 
            data: deletedOrder
        }, {status: 200})
    } catch(err) {
        return NextResponse.json({message: err.message}, {status: 500})
    }
}