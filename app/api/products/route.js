import { getServerSession } from "next-auth";
import dbConnect from "@/lib/connectdb";
import { authOptions } from "../auth/[...nextauth]/route";
import productsmodel from "@/models/productsmodel";
import businessmodel from "@/models/businessmodel";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
        }

        const { name, description, price, category, image, instock } = await req.json();

        const business = await businessmodel.findOne({ ownerId: session.user.id });
        if (!business) {
            return NextResponse.json({ message: "Business not found" }, { status: 404 });
        }

        const newProduct = await productsmodel.create({
            businessId: business._id,
            name,
            description,
            price,
            category,
            image,
            instock
        });

        return NextResponse.json({ message: "Product successfully created!", data: newProduct }, { status: 201 });

    } catch (err) {
        console.error("Error:", err.message);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};


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