import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, return error
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if user has a password (not a Google account)
    if (!user.password) {
      return NextResponse.json(
        {
          error:
            "This account was created with Google. Please use Google Sign-In instead.",
        },
        { status: 400 },
      );
    }

    // Compare hashed passwords using bcrypt
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      console.log("simple-auth/login: Invalid password for user:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create a simple JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.email === process.env.ADMIN_EMAIL,
      },
      process.env.AUTH_SECRET || "fallback_secret_key",
      { expiresIn: "1d" },
    );

    // Return success with token
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.email === process.env.ADMIN_EMAIL,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
