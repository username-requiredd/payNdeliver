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
export const PUT = async (req, { params }) => {
  try {
    await dbConnect();
    const { id } = params;

    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ message: "Invalid order ID" }, { status: 400 })
    }

    const body = await req.json();
    console.log("Full request body:", JSON.stringify(body, null, 2));

    // More comprehensive error handling
    const updateData = {};

    try {
      if (body.status) {
        updateData.status = body.status;
      }

      if (body.payment) {
        updateData.payment = {
          type: body.payment.type,
          status: body.payment.status,
          wallet: body.payment.wallet,
          transactionHash:
            body.payment.transactionHash || body.paymentSignature,
        };
      }

      // Validate paid status
      if (updateData.status === "paid" && !updateData.payment?.type) {
        return NextResponse.json(
          {
            message: "Payment type is required for paid orders",
          },
          { status: 400 }
        );
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
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
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return NextResponse.json(
        {
          message: "Validation Error",
          error: validationError.message,
          details: validationError,
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error("Detailed Order Update Error:", {
      message: err.message,
      name: err.name,
      stack: err.stack,
    });
    return NextResponse.json(
      {
        message: "Unexpected Error Updating Order",
        error: err.message,
        details: err.stack,
      },
      { status: 500 }
    );
  }
};
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
