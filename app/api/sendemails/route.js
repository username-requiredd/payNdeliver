import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { to, subject, text, html } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      },
    });

    await transporter.verify();

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to,
      subject: subject,
      text: text,
      html: html,
    });

    return NextResponse.json(
      { message: "Email sent successfully", info },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Error sending email", error: error.message },
      { status: 500 }
    );
  }
}
