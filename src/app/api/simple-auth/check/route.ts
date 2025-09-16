import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    // Get the token from cookies
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) {
      return NextResponse.json({ authenticated: false });
    }

    // Parse the token from cookies
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/);
    if (!tokenMatch) {
      return NextResponse.json({ authenticated: false });
    }

    const token = tokenMatch[1];

    // Verify the token
    const decoded: any = jwt.verify(token, process.env.AUTH_SECRET || "fallback_secret_key");

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    // Return user info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.email === process.env.ADMIN_EMAIL
      }
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}