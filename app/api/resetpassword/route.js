import dbConnect from "@/lib/connectdb";
import UsersModel from "../../../models/usersmodel";
import Business from "../../../models/businessmodel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
export const POST = async (req) => {
  try {
    await dbConnect();
    const { token, password } = await req.json();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const passwordHash = await bcrypt.hash(password, 10);

    // Check for user or business with the reset token
    let user =
      (await UsersModel.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() },
      })) ||
      (await Business.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() },
      }));

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token." },
        { status: 400 }
      );
    }

    // Update password
    user.password = passwordHash; 
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully!" });
  } catch (err) {
    // console.error(err);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
};
