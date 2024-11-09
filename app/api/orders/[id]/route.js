import dbConnect from "@/lib/connectdb"
import Order from "@/models/orders"
import { NextResponse } from "next/server"

export const GET = async(req,{params})=>{
    try{
        await dbConnect()
        const {id} = params 
        // console.log(id)
        const getOrder = await Order.findOne({id: new ObjectId(id)})
        // console.log(getOrder)
        if(getOrder.length === 0){
            return NextResponse.json({message:"order not found!"},{status:404})
        }
        return NextResponse.json({message:"order retrieved successfully!",data:getOrder},{status:200})
    }catch(err){
        return NextResponse.json({message:err.message},{status:500})
    }
}