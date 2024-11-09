import dbConnect from '@/lib/connectdb';
import Business from '@/models/businessmodel';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// GET Route - Fetch a business by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const business = await Business.findOne({ _id: new ObjectId(id) });
    
    if (!business) {
      return NextResponse.json({ message: "Business not found!" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Success!", data: business }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// POST Route - Create a new business
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();  // Assumes incoming request is JSON
    const newBusiness = new Business(body); // Create a new Business model instance
    
    await newBusiness.save(); // Save the business to the database
    
    return NextResponse.json({ message: "Business created successfully!", data: newBusiness }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// PUT Route - Update a business by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    // console.log("connected to db")
    const { id } = params;
    const body = await req.json();
      // console.log("put body:",body)
    
    // Update the business document in the database
    const updatedBusiness = await Business.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { new: true }  // Return the updated document
    );

    if (!updatedBusiness) {
      return NextResponse.json({ message: "Business not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Business updated successfully!", data: updatedBusiness }, { status: 200 });
  } catch (err) {
    // console.log("error:",err.message)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// DELETE Route - Delete a business by ID
export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    // Delete the business from the database
    const deletedBusiness = await Business.findOneAndDelete({ _id: new ObjectId(id) });
    
    if (!deletedBusiness) {
      return NextResponse.json({ message: "Business not found!" }, { status: 404 });
    }

    return NextResponse.json({ message: "Business deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
