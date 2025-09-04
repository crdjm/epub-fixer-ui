import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user's EPUB files from database
    const epubs = await prisma.epub.findMany({
      where: {
        userId: session.user.id,
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
      { error: "Failed to fetch EPUB files", details: (error as Error).message },
      { status: 500 }
    );
  }
}