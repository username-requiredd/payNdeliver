import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Cart from "@/models/cartmodel";
import { ObjectId } from "mongodb";
export async function GET(req, { params }) {
    console.log("Fetching cart for user:", params.id);
    const {id} = params
    try {
      console.log("Connecting to database...");
      await dbConnect();
      console.log("Database connected successfully");
  
  
      console.log("Searching for cart...");
      const cart = await Cart.findOne({userId: new ObjectId(id) });
  
      if (cart) {
        console.log("Cart found:", cart);
        return NextResponse.json(
          { message: "Cart retrieved successfully", data: cart },
          { status: 200 }
        );
      } else {
        console.log("No cart found for this user.");
        return NextResponse.json(
          { message: "No cart found for this user." },
          { status: 404 }
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
  