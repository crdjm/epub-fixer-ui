import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user has a password
    if (!user.password) {
      return new Response(JSON.stringify({ error: "User has no password (Google account)" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Compare passwords
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return success with user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return new Response(JSON.stringify({ 
      success: true, 
      user: userWithoutPassword 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Test credentials error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}