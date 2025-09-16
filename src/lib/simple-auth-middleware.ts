import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db";

export async function simpleAuthMiddleware(
  request: NextRequest,
  response: NextResponse,
) {
  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    console.log(
      "simpleAuthMiddleware: No token found, redirecting to /simple-login",
    );
    // Redirect to simple login page
    return NextResponse.redirect(new URL("/simple-login", request.url));
  }

  try {
    console.log("simpleAuthMiddleware: Token found, verifying...");
    // Verify the token
    const decoded: any = jwt.verify(
      token,
      process.env.AUTH_SECRET || "fallback_secret_key",
    );

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log(
        "simpleAuthMiddleware: User not found, redirecting to /simple-login",
      );
      // Redirect to simple login page
      return NextResponse.redirect(new URL("/simple-login", request.url));
    }

    console.log("simpleAuthMiddleware: User authenticated, continuing...");
    // User is authenticated, continue
    return response;
  } catch (error) {
    console.log(
      "simpleAuthMiddleware: Token verification failed, redirecting to /simple-login",
      error,
    );
    // Redirect to simple login page
    return NextResponse.redirect(new URL("/simple-login", request.url));
  }
}

export async function getUserFromToken(token: string) {
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.AUTH_SECRET || "fallback_secret_key",
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.email === process.env.ADMIN_EMAIL,
        }
      : null;
  } catch (error) {
    return null;
  }
}

// Helper function to get user from token
export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;
  return await getUserFromToken(token);
}
