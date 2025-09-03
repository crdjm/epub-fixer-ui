import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection by fetching users
    const users = await prisma.user.findMany({
      take: 5,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      userCount: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
      }))
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}