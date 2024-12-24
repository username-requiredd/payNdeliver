import dbConnect from "@/lib/connectdb";
import { Order } from "@/models/orders";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// GET method to retrieve a single order
export const GET = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    let getOrder = await Order.findById(id);
    if (!getOrder) {
      getOrder = await Order.find({ customerId: new ObjectId(id) });
    }

    if (!getOrder) {
      return NextResponse.json(
        { message: "Order not found!" },
        { status: 404 }
      );
    }
    console.log(getOrder);
    return NextResponse.json(
      {
        message: "Order retrieved successfully!",
        data: getOrder,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order retrieval error:", err);
    return NextResponse.json(
      {
        message: "Error retrieving order",
        error: err.message,
      },
      { status: 500 }
    );
  }
};

// PUT method to update an order

// PUT route with improved validation
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate allowed status values
    const allowedStatus = [
      "pending",
      "processing",
      "paid",
      "cancelled",
      "completed",
    ];
    if (body.status && !allowedStatus.includes(body.status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    // Build update object with validation
    const updateData = {};

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.payment) {
      if (!body.payment.type) {
        return NextResponse.json(
          { message: "Payment type is required" },
          { status: 400 }
        );
      }

      updateData.payment = {
        type: body.payment.type,
        status: body.payment.status || "pending",
        wallet: body.payment.wallet || null,
        transactionHash:
          body.payment.transactionHash || body.payment.paymentSignature || null,
      };
    }

    // If setting status to paid, ensure payment exists
    if (body.status === "paid" && !updateData.payment && !body.payment) {
      return NextResponse.json(
        { message: "Payment details required for paid status" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        lean: true, // For better performance
      }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: "Order not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Order updated successfully!",
        data: updatedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return NextResponse.json(
      {
        message: "Failed to update order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
// DELETE method to remove an order
export const DELETE = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 }
      );
    }

    // Find and delete the order
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return NextResponse.json(
        { message: "Order not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Order deleted successfully!",
        data: deletedOrder,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Order deletion error:", err);
    return NextResponse.json(
      {
        message: "Error deleting order",
        error: err.message,
      },
      { status: 500 }
    );
  }
};
