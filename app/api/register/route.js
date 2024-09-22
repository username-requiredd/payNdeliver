// import dbConnect from "../../../lib/connectdb";
import dbConnect from "@/lib/connectdb";
import bcrypt from "bcryptjs"
// import usersmodel from "@/models/usersmodel";
import UsersModel from "../../../models/usersmodel";
import { NextResponse } from "next/server";

export const POST = async(req)=> {
    try {
        await dbConnect();
        const { username, password, email } = await req.json();
        
        const existingUser = await UsersModel.findOne({ email: email });
        if (existingUser) {
            return NextResponse.json({ message: "User already exists" }, { status: 401 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UsersModel.create({ 
            username, 
            email, 
            password: hashedPassword 
        });

        return NextResponse.json({ message: "Success", data: newUser }, { status: 201 });

    } catch (err) {
        console.error(err.message);
        return NextResponse.json({ message: "Something went wrong", error: err.message }, { status: 500 });
    }
}