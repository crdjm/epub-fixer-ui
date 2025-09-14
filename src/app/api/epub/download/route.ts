import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

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

    // Security check: ensure the file path doesn't contain traversal sequences
    if (filePath.includes("..")) {
      return NextResponse.json(
        { error: "Invalid file path" },
        { status: 400 }
      );
    }

    // Construct the full file path
    const fullPath = path.join(process.cwd(), filePath);
    
    // Check if file exists
    try {
      await fs.access(fullPath);
    } catch {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await fs.readFile(fullPath);
    
    // Get file extension to set content type
    const ext = path.extname(filePath).toLowerCase();
    let contentType = "application/octet-stream";
    
    if (ext === ".epub") {
      contentType = "application/epub+zip";
    } else if (ext === ".html") {
      contentType = "text/html";
    }

    let responseBody = fileBuffer;

    // For HTML files, we need to rewrite relative links to use the download API
    if (ext === ".html") {
      const fileContent = fileBuffer.toString('utf-8');
      const directoryPath = path.dirname(filePath);
      
      // Rewrite relative links to use the download API
      // This regex looks for href attributes with relative paths (not starting with http or /)
      const updatedContent = fileContent.replace(
        /href=["']([^http\/#][^"']*\.(html|htm))["']/g,
        (match, relativePath) => {
          const fullPathToLinkedFile = path.posix.join(directoryPath, relativePath);
          return `href="/api/epub/download?file=${fullPathToLinkedFile}"`;
        }
      );
      
      responseBody = Buffer.from(updatedContent, 'utf-8');
    }

    // Create response with appropriate headers
    const response = new NextResponse(responseBody as any);
    response.headers.set("Content-Type", contentType);
    
    // For HTML files, display in browser; for EPUB files, force download
    if (ext === ".html") {
      response.headers.set("Content-Disposition", `inline; filename="${path.basename(filePath)}"`);
    } else {
      response.headers.set("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
    }
    
    return response;
  } catch (error: any) {
    console.error("File download error:", error);
    return NextResponse.json(
      { error: "Failed to download file", details: error.message },
      { status: 500 }
    );
  }
}