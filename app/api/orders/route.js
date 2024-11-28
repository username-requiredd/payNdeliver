import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import { Order } from "@/models/orders";
// import  Order  from "@/models/orders";


export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();
        console.log("order data from api,",data)
        // Basic validation for required fields
        if (!data || !data.customerId || !data.businessId || !data.items || !data.totalAmountUSD || !data.payment) {
            console.log("missing fields!")
            return NextResponse.json({ message: "Missing required order fields" }, { status: 400 });
        }
        
        // Set default status values if not provided
        data.status = data.status || "pending";
        data.payment.status = data.payment.status || "pending";

        // Create the order
        const newOrder = await Order.create(data);
        console.log("order created sucessfully!...")

        // return NextResponse.json(
        //     { message: "Order created successfully", data: newOrder },
        //     { status: 201 }
        // );


        return NextResponse.json(
            { 
                message: "Order created successfully", 
                data: newOrder,
                orderId: newOrder._id 
            },
            { status: 201 }
        );
    } catch (err) {
        console.error("Error creating order:", err);
        
        // Check for validation or cast errors from Mongoose
        const isValidationError = err.name === 'ValidationError' || err.name === 'CastError';
        const errorMessage = isValidationError ? "Invalid data format" : "Error creating new order";

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
