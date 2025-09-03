import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const execPromise = promisify(exec);

// Ensure upload directories exist
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROCESSED_DIR = path.join(process.cwd(), "processed");

async function ensureDirectories() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.mkdir(PROCESSED_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating directories:", error);
  }
}

export async function POST(request: Request) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure directories exist
    await ensureDirectories();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Save uploaded file to temporary location
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const originalFileName = file.name;
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempFilePath = path.join(UPLOAD_DIR, `${fileId}-${originalFileName}`);
    const outputDir = path.join(PROCESSED_DIR, fileId);
    const outputEpubPath = path.join(outputDir, `fixed-${originalFileName}`);
    const outputLogPath = path.join(outputDir, `log-${originalFileName.replace(".epub", ".html")}`);

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Write file to disk
    await fs.writeFile(tempFilePath, fileBuffer);

    try {
      // Call your EPUB processing CLI tool
      // Replace this with the actual command for your EPUB processing tool
      const command = `your-epub-cli-tool --input "${tempFilePath}" --output-dir "${outputDir}"`;
      
      console.log("Executing command:", command);
      const { stdout, stderr } = await execPromise(command);
      
      console.log("EPUB processing stdout:", stdout);
      if (stderr) {
        console.warn("EPUB processing stderr:", stderr);
      }

      // Check if output files were created
      const epubExists = await fs.access(outputEpubPath).then(() => true).catch(() => false);
      const logExists = await fs.access(outputLogPath).then(() => true).catch(() => false);

      if (!epubExists) {
        throw new Error("Processed EPUB file was not created");
      }

      // Save file information to database
      const epubRecord = await prisma.epub.create({
        data: {
          userId: session.user.id,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "completed",
          originalUrl: `/uploads/${fileId}-${originalFileName}`,
          fixedUrl: logExists ? `/processed/${fileId}/fixed-${originalFileName}` : null,
          logUrl: logExists ? `/processed/${fileId}/log-${originalFileName.replace(".epub", ".html")}` : null,
        }
      });

      // Return results
      return NextResponse.json({
        success: true,
        message: "File processed successfully",
        data: {
          id: epubRecord.id,
          originalFileName: originalFileName,
          fixedFileName: `fixed-${originalFileName}`,
          logFileName: logExists ? `log-${originalFileName.replace(".epub", ".html")}` : null,
          fixedFileUrl: logExists ? `/api/epub/download?file=${fileId}/fixed-${originalFileName}` : null,
          logFileUrl: logExists ? `/api/epub/download?file=${fileId}/log-${originalFileName.replace(".epub", ".html")}` : null,
        }
      });
    } catch (processError) {
      console.error("EPUB processing error:", processError);
      
      // Save failed processing attempt to database
      await prisma.epub.create({
        data: {
          userId: session.user.id,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "failed",
        }
      });

      // Clean up temporary files
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn("Error cleaning up temporary file:", cleanupError);
      }

      return NextResponse.json(
        { error: "Failed to process EPUB file", details: processError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("EPUB processing error:", error);
    return NextResponse.json(
      { error: "Failed to process EPUB file", details: error.message },
      { status: 500 }
    );
  }
}