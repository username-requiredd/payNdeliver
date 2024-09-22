import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Business from "@/models/businessmodel";
import bcrypt from "bcryptjs";

// POST handler to create a new business
export const POST = async (req) => {
  try {
    await dbConnect(); // Ensure database connection
    console.log("Database connected");

    const data = await req.json(); // Parse the request body
    console.log(data);

    // Check if the business already exists
    const businessExist = await Business.findOne({ email: data.email });
    if (businessExist) {
      return NextResponse.json(
        { message: "Business already exists!" },
        { status: 401 }
      );
    }

    // Hash the password before saving
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newBusiness = await Business.create({
      ...data,
      password: passwordHash, // Use the hashed password
    });

    console.log("New business created:", newBusiness);

    return NextResponse.json(
      { message: "Business created successfully", data: newBusiness },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

// GET handler to fetch all businesses
export const GET = async (req) => {
  try {
    await dbConnect(); // Ensure database connection
    const fetchBusiness = await Business.find({});

    if (fetchBusiness.length === 0) {
      return NextResponse.json(
        { message: "No businesses found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Success!", data: fetchBusiness },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
