import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/connectdb";
import productsmodel from "../../../../models/productsmodel";
import { ObjectId } from 'mongodb';

// GET route: Fetch products by business ID
export const GET = async (req, { params }) => {
  try {
    const { id } = params;
    await dbConnect();
    
    const products = await productsmodel.find({ businessId: new ObjectId(id) });
    
    if (products.length === 0) {
      return NextResponse.json({ message: "No products found for this business." }, { status: 200 });
    }
    
    return NextResponse.json({ message: "Success", data: products }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong.", error: err.message }, { status: 500 });
  }
};

// PUT route: Update a product by product ID
export const PUT = async (req, { params }) => {
  try {
    const { id } = params; // Product ID to update
    const body = await req.json(); // Updated product data
    await dbConnect();

    const updatedProduct = await productsmodel.findByIdAndUpdate(
      new ObjectId(id),
      body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully", data: updatedProduct }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong.", error: err.message }, { status: 500 });
  }
};

// DELETE route: Delete a product by product ID
export const DELETE = async (req, { params }) => {
  try {
    const { id } = params; // Product ID to delete
    await dbConnect();

    const deletedProduct = await productsmodel.findByIdAndDelete(new ObjectId(id));

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully", data: deletedProduct }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Something went wrong.", error: err.message }, { status: 500 });
  }
};
