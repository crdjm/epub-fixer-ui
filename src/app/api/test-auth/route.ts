import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = (await cookies()).get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET || "fallback_secret_key",
    );
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
