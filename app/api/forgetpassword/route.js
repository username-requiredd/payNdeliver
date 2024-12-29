import dbConnect from "@/lib/connectdb";
import UsersModel from "../../../models/usersmodel";
import Business from "@/models/businessmodel";
import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const createResetEmailTemplate = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #4CAF50; color: white; padding: 10px 20px; 
                text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </div>
    <p>Or copy and paste this link in your browser:</p>
    <p>${resetUrl}</p>
    <p style="color: #666; font-size: 14px;">
      If you didn't request this, please ignore this email or contact support.
      This link will expire in 1 hour.
    </p>
  </div>
`;

export const POST = async (req) => {
  // console.log("API route triggered");

  try {
    // console.log("Connecting to database...");
    await dbConnect();

    const { email } = await req.json();
    // console.log("Received email:", email);

    let existingUser = await UsersModel.findOne({ email: email });
    let userType = "user";

    if (!existingUser) {
      // console.log("Searching in business collection...");
      existingUser = await Business.findOne({ email: email });
      userType = "business";

      if (!existingUser) {
        // console.log("No user found with this email");
        return NextResponse.json(
          { message: "User does not exist!" },
          { status: 404 }
        );
      }
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const passwordResetExpires = Date.now() + 3600000; // 1 hour

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;
    await existingUser.save();

    // Use a default URL if environment variable is not set
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;
    // console.log("Reset URL:", resetUrl);

    try {
      // Verify transporter connection
      await transporter.verify();

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: createResetEmailTemplate(resetUrl),
      });

      return NextResponse.json(
        {
          message: "Password reset link has been sent to your email",
          userType,
        },
        { status: 200 }
      );
    } catch (emailError) {
      // console.error("Email sending failed:", emailError);
      // Revert the saved token if email fails
      existingUser.resetToken = undefined;
      existingUser.resetTokenExpiry = undefined;
      await existingUser.save();

      return NextResponse.json(
        { message: "Failed to send reset email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (err) {
    // console.error("Error details:", err);
    return NextResponse.json(
      { message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
};
