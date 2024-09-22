import { NextResponse } from "next/server"
import dbConnect from "@/lib/connectdb"
import reviews from "@/models/reviews"
export const POST = async (req)=>{
    try{
        await dbConnect()
        const data = await req.json()
        console.log(data)
        if(!data){
            return NextResponse.json({message:"no data received!."},{status:400})
        }
        const newReview = await reviews.create(data)
        return NextResponse.json({message:"reviews posted sucessfully",data:newReview},{status:201})
    }catch(err){
        console.log(err.message)
        return NextResponse.json({message:err.message},{status:500})
    }
}