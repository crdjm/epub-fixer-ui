import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

// Generate a JWT token
async function generateToken(user: any) {
  const secret = new TextEncoder().encode(
    process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback_secret_key_here_please_change_me"
  );
  
  const token = await new SignJWT({ 
    id: user.id, 
    email: user.email, 
    name: user.name 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
    
  return token;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user has a password
    if (!user.password) {
      return NextResponse.json({ error: "User has no password (Google account)" }, { status: 400 });
    }
    
    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    
    // Generate token
    const token = await generateToken(user);
    
    // Return success with user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      success: true, 
      user: userWithoutPassword,
      token: token
    });
  } catch (error) {
    console.error("Manual login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}