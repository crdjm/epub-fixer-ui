import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/simple-auth-middleware";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's EPUB files from database
    const epubs = await prisma.epub.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: epubs,
    });
  } catch (error) {
    console.error("Error fetching EPUB files:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch EPUB files",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
