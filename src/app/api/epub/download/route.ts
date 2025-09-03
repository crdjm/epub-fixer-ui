import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PROCESSED_DIR = path.join(process.cwd(), "processed");

export async function GET(request: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get("file");
    
    if (!filePath) {
      return NextResponse.json(
        { error: "File path is required" },
        { status: 400 }
      );
    }

    // Security check: prevent directory traversal
    if (filePath.includes("..") || filePath.startsWith("/")) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Construct full file path
    const fullPath = path.join(PROCESSED_DIR, filePath);

    // Verify the file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Get file stats to determine content type
    const stats = await fs.stat(fullPath);
    if (!stats.isFile()) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Read file
    const fileBuffer = await fs.readFile(fullPath);
    
    // Determine content type based on file extension
    let contentType = "application/octet-stream";
    if (filePath.endsWith(".epub")) {
      contentType = "application/epub+zip";
    } else if (filePath.endsWith(".html")) {
      contentType = "text/html";
    }

    // Get filename for Content-Disposition header
    const fileName = path.basename(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Length": stats.size.toString(),
      },
    });
  } catch (error) {
    console.error("File download error:", error);
    return NextResponse.json(
      { error: "Failed to download file", details: error.message },
      { status: 500 }
    );
  }
}