import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test the database connection by fetching users
    const users = await prisma.user.findMany();
    
    return Response.json({
      success: true,
      message: "Database connection successful",
      userCount: users.length,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return Response.json({
      success: false,
      error: "Database connection failed",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}