import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/connectdb"
import productsmodel from "../../../../models/productsmodel"
import { ObjectId } from 'mongodb';

export const GET = async (req, { params }) => {
    try {
        const { id } = params
        await dbConnect()
        
        const products = await productsmodel.find({ 
            businessId: new ObjectId(id) })
        
        if (products.length === 0) {
            return NextResponse.json({ message: "No products found for this business." }, { status: 404 })
        }
        
        return NextResponse.json({ message: "Success", data: products }, { status: 200 })
    } catch (err) {
        console.error(err) 
        return NextResponse.json({ message: "Something went wrong.", error: err.message }, { status: 500 })
    }
}