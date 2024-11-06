import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import { authOptions } from "../auth/[...nextauth]/route";
import ProductModel from "@/models/productsmodel";

export async function POST(req) {
  try {
    await dbConnect();
    // console.log("Connected to database");

    const session = await getServerSession(authOptions);
    if (!session) {
      // console.log("No session found");
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    const { name, description, price, category, image, instock, tags, brand } = await req.json();
    
    // Detailed validation
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!price) missingFields.push('price');
    if (!category) missingFields.push('category');
    if (instock === undefined) missingFields.push('instock');

    if (missingFields.length > 0) {
      return NextResponse.json({ message: `Missing required fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ message: "Price must be a non-negative number" }, { status: 400 });
    }

    if (typeof instock !== 'number' || instock < 0) {
      return NextResponse.json({ message: "Instock must be a non-negative number" }, { status: 400 });
    }

    // console.log("Product data:", { name, description, price, category, image, instock, tags, brand });

    const newProduct = await ProductModel.create({
      businessId: session.user.id,
      name,
      description,
      price,
      category,
      image,
      instock,
      tags,
      brand
    });

    // console.log("Product created successfully!");
    return NextResponse.json({ message: "Product successfully created", data: newProduct }, { status: 201 });

  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}

export const GET = async (req) => {
    try {
      await dbConnect();
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
      }
  
      const getBusinessId = await businessmodel.findOne({ ownerId: session.user.id });
      if (!getBusinessId) {
        return NextResponse.json({ message: "Cannot find products related to this business!" }, { status: 404 });
      }
  
      const getProducts = await productsmodel.find({ businessId: getBusinessId._id });
      return NextResponse.json({ message: "Success", data: getProducts }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  };