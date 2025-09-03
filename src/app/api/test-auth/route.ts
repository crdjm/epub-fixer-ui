import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    
    return Response.json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Auth test error:", error);
    return Response.json({
      success: false,
      error: "Failed to test auth",
      details: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}