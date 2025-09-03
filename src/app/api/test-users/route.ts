import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Create a test user
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User"
      }
    });
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST() {
  try {
    // List all users
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}