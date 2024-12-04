import { NextResponse } from "next/server";
import dbConnect from "@/lib/connectdb";
import Business from "@/models/businessmodel";
import bcrypt from "bcryptjs";

// GET handler to fetch businesses with search and category filtering
export const GET = async (req) => {
  try {
    await dbConnect(); // Ensure database connection

    // Extract search parameters
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const category = searchParams.get('category') || 'All';
    console.log(category)
    const search = searchParams.get('search') || '';

    // Build query object
    let query = {};

    // Category filtering
    if (category !== 'All') {
      query.businessType = category;
    }

    // Search filtering
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { cuisineType: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
      console.log(search)
    }

    // Fetch businesses based on query
    const fetchedBusinesses = await Business.find(query);

    if (fetchedBusinesses.length === 0) {
      return NextResponse.json(
        { message: "No businesses found!", data: [] },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        message: "Success!", 
        data: fetchedBusinesses 
      },
      { status: 200 }
    );

  } catch (err) {
    console.error("Error fetching businesses:", err);
    return NextResponse.json(
      { message: err.message, data: [] }, 
      { status: 500 }
    );
  }
};

// Existing POST handler remains the same
export const POST = async (req) => {
  try {
    await dbConnect();
    
    const data = await req.json();
    
    const businessExist = await Business.findOne({ email: data.email });
    if (businessExist) {
      return NextResponse.json(
        { message: "Business already exists!" },
        { status: 401 }
      );
    }
    
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newBusiness = await Business.create({
      ...data,
      password: passwordHash,
    });
    
    return NextResponse.json(
      { message: "Business created successfully", data: newBusiness },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};