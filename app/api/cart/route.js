import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Cart from "@/models/cartmodel";

export async function POST(req) {
  console.log("Cart API route handler called for POST");

  try {
    // console.log("Connecting to database...");
    await dbConnect();
    // console.log("Database connected successfully");

    const data = await req.json();
    console.log("Cart data:", data);
    
    if (!data || !data.userId || !data.products) {
      // console.log("Invalid data received");
      return NextResponse.json(
        { message: "Invalid cart data. Please provide userId and at least one product." },
        { status: 400 }
      );
    }
    
    // console.log("Checking for existing cart...");
    let cart = await Cart.findOne({ userId: data.userId });
    
    if (cart) {
      // console.log("Existing cart found. Updating...");
      cart.products = data.products;
      await cart.save();
      // console.log("Cart updated successfully");
    } else {
      // console.log("No existing cart found. Creating new cart...");
      cart = await Cart.create(data);
      console.log("saved cart data...",cart)
      // console.log("New cart created successfully");
    }
    
    // console.log("Final cart data:", JSON.stringify(cart, null, 2));
    
    return NextResponse.json(
      { message: "Cart saved successfully!", data: cart },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error in cart API route:", err);
    
    if (err.name === 'ValidationError') {
      // console.log("Validation error:", err.errors);
      return NextResponse.json(
        { message: "Invalid data format", details: err.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "An error occurred while saving the cart" },
      { status: 500 }
    );
  }
}

