import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROCESSED_DIR = path.join(process.cwd(), "processed");

export async function DELETE(request: Request) {
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
    const epubId = searchParams.get("id");
    
    if (!epubId) {
      return NextResponse.json(
        { error: "EPUB ID is required" },
        { status: 400 }
      );
    }

    // Fetch the EPUB record from database
    const epub = await prisma.epub.findUnique({
      where: {
        id: epubId,
        userId: session.user.id, // Ensure user owns this EPUB
      },
    });

    if (!epub) {
      return NextResponse.json(
        { error: "EPUB not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete files from file system
    try {
      // Delete original file if it exists
      if (epub.originalUrl) {
        const originalFilePath = path.join(process.cwd(), epub.originalUrl);
        await fs.unlink(originalFilePath).catch(() => {
          // Ignore if file doesn't exist
        });
      }

      // Delete fixed file if it exists
      if (epub.fixedUrl) {
        const fixedFilePath = path.join(process.cwd(), epub.fixedUrl);
        await fs.unlink(fixedFilePath).catch(() => {
          // Ignore if file doesn't exist
        });
      }

      // Delete EPUB3 file if it exists
      if (epub.epub3Url) {
        const epub3FilePath = path.join(process.cwd(), epub.epub3Url);
        await fs.unlink(epub3FilePath).catch(() => {
          // Ignore if file doesn't exist
        });
      }

      // Delete log/report file if it exists
      if (epub.logUrl) {
        const logFilePath = path.join(process.cwd(), epub.logUrl);
        await fs.unlink(logFilePath).catch(() => {
          // Ignore if file doesn't exist
        });
      }

      // Delete processed directory if it exists and is empty
      if (epub.fixedUrl) {
        const processedDir = path.dirname(path.join(process.cwd(), epub.fixedUrl));
        try {
          const files = await fs.readdir(processedDir);
          if (files.length === 0) {
            await fs.rmdir(processedDir);
          }
        } catch (error) {
          // Ignore directory deletion errors
        }
      }
    } catch (fileError) {
      console.warn("Error deleting files:", fileError);
    }

    // Delete database record
    await prisma.epub.delete({
      where: {
        id: epubId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "EPUB deleted successfully",
    });
  } catch (error) {
    console.error("EPUB deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete EPUB", details: (error as Error).message },
      { status: 500 }
    );
  }
}