import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/connectdb";
import usersmodel from "@/models/usersmodel";
export const POST = async (req, res) => {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        const userExist = await usersmodel.findOne({ email });
        if (userExist) {
            return NextResponse.json({ message: "User already exists!" }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await usersmodel.create({
            email,
            password: passwordHash,
        });

        return NextResponse.json({ message: "User created successfully!",data:newUser }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
};
