import { NextResponse } from "next/server";
import { generateToken, verifyToken } from "@/lib/csrf";
import { getSession } from "@/utils/session";
import { cookies } from "next/headers";

// Generate a new CSRF token
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Use user's session id as secret
    const secret = session.user.id;

    // Generate new CSRF token
    const token = await generateToken(secret);

    // Store token in secure, httpOnly cookie
    cookies().set("csrf_secret", secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return NextResponse.json({ csrfToken: token }, { status: 200 });
  } catch (error) {
    // console.error("CSRF token generation error:", error);
    return NextResponse.json(
      { message: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}

// Validate CSRF token
export async function POST(req) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const clientToken = req.headers.get("x-csrf-token");
    if (!clientToken) {
      return NextResponse.json(
        { message: "CSRF token missing" },
        { status: 400 }
      );
    }

    // Get secret from cookie
    const secret = cookies().get("csrf_secret")?.value;
    if (!secret) {
      return NextResponse.json(
        { message: "CSRF secret missing" },
        { status: 400 }
      );
    }

    // Verify the token
    const isValid = await verifyToken(secret, clientToken);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid CSRF token" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "CSRF token validated successfully" },
      { status: 200 }
    );
  } catch (error) {
    // console.error("CSRF validation error:", error);
    return NextResponse.json(
      {
        message: "CSRF validation failed",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

