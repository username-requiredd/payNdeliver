import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Cart from "@/models/cartmodel";
import { ObjectId } from "mongodb";

// GET Request: Fetch user's cart
export async function GET(req, { params }) {
  const { id } = params;
  try {
    await dbConnect();
    const cart = await Cart.findOne({ userId: new ObjectId(id) });

    if (cart) {
      return NextResponse.json(
        { message: "Cart retrieved successfully", data: cart },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No cart found for this user." },
        { status:200 }
      );
    }
  } catch (err) {
    console.error("Error in fetching cart:", err);
    return NextResponse.json(
      { message: "An error occurred while fetching the cart" },
      { status: 500 }
    );
  }
}

// PUT Request: Update user's cart
export async function PUT(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const { products } = await req.json(); // Parse JSON body from the request

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { message: "Invalid request format. 'products' should be an array." },
        { status: 400 }
      );
    }

    const cart = await Cart.findOneAndUpdate(
      { userId: new ObjectId(id) },
      { $set: { products } }, // Replace the existing products with new products
      { new: true, upsert: true } // Return the updated document and create if not exists
    );

    return NextResponse.json(
      { message: "Cart updated successfully", data: cart },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in updating cart:", err);
    return NextResponse.json(
      { message: "An error occurred while updating the cart" },
      { status: 500 }
    );
  }
}

// DELETE Request: Delete user's cart
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const result = await Cart.findOneAndDelete({ userId: new ObjectId(id) });

    if (!result) {
      return NextResponse.json(
        { message: "No cart found to delete for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Cart deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in deleting cart:", err);
    return NextResponse.json(
      { message: "An error occurred while deleting the cart" },
      { status: 500 }
    );
  }
}
