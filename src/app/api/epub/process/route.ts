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

// Function to detect EPUB version
async function detectEpubVersion(epubPath: string): Promise<"epub2" | "epub3"> {
  try {
    // Use epub-fix to detect version
    const { stdout, stderr } = await execPromise(`epub-fix validate "${epubPath}" --analyze-only`);
    if (stdout.includes("EPUB 2") || stdout.includes("EPUB2") || stdout.includes("Validation failed")) {
      return "epub2";
    } else {
      return "epub3";
    }
  } catch (error: any) {
    // If the command fails with "Validation failed" in stderr, it's likely an EPUB2
    if (error.stderr && error.stderr.includes("Validation failed")) {
      return "epub2";
    }
    console.warn("Could not detect EPUB version, assuming EPUB3:", error);
    return "epub3";
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

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    // Write file to disk
    await fs.writeFile(tempFilePath, fileBuffer);

    try {
      // Detect EPUB version
      const epubVersion = await detectEpubVersion(tempFilePath);
      console.log(`Detected EPUB version: ${epubVersion}`);

      let epub3Path = tempFilePath;
      let epub3FileName = originalFileName;
      let epub3Url: string | null = null;
      
      // If it's an EPUB2, convert it to EPUB3 first
      if (epubVersion === "epub2") {
        console.log("Converting EPUB2 to EPUB3...");
        epub3FileName = originalFileName.replace(/\.epub$/i, "_epub3.epub");
        epub3Path = path.join(outputDir, epub3FileName);
        
        // Convert EPUB2 to EPUB3
        // Note: epub-fix convert places output in the same directory as input when using relative paths
        // So we need to specify the full path for the output
        const convertCommand = `epub-fix convert "${tempFilePath}" -o "${epub3Path}"`;
        console.log("Executing conversion command:", convertCommand);
        const { stdout: convertStdout, stderr: convertStderr } = await execPromise(convertCommand);
        console.log("EPUB conversion stdout:", convertStdout);
        if (convertStderr) {
          console.warn("EPUB conversion stderr:", convertStderr);
        }
        
        // Verify conversion was successful
        // The converted file might be in a different location than expected
        // Let's check both the expected location and the input file's directory
        const possiblePaths = [
          epub3Path,
          path.join(path.dirname(tempFilePath), epub3FileName)
        ];
        
        let actualEpub3Path = null;
        for (const possiblePath of possiblePaths) {
          const exists = await fs.access(possiblePath).then(() => true).catch(() => false);
          if (exists) {
            actualEpub3Path = possiblePath;
            break;
          }
        }
        
        if (!actualEpub3Path) {
          throw new Error("EPUB2 to EPUB3 conversion failed - output file not created");
        }
        
        // If the file is in the wrong location, move it to the correct location
        if (actualEpub3Path !== epub3Path) {
          await fs.rename(actualEpub3Path, epub3Path);
        }
        
        // Verify conversion was successful
        const epub3Exists = await fs.access(epub3Path).then(() => true).catch(() => false);
        if (!epub3Exists) {
          throw new Error("EPUB2 to EPUB3 conversion failed - output file not created");
        }
        
        // Set the EPUB3 URL for later use
        epub3Url = `/processed/${fileId}/${epub3FileName}`;
      }

      // Fix the EPUB (either the original EPUB3 or the converted one)
      const fixedFileName = `fixed-${epub3FileName}`;
      const fixedEpubPath = path.join(outputDir, fixedFileName);
      const reportFileName = `report-${epub3FileName.replace(".epub", ".html")}`;
      const reportPath = path.join(outputDir, reportFileName);

      console.log("Fixing EPUB...");
      const fixCommand = `epub-fix --verify --keep-output "${epub3Path}" -o "${fixedEpubPath}" -r "${reportPath}"`;
      console.log("Executing fix command:", fixCommand);
      const { stdout: fixStdout, stderr: fixStderr } = await execPromise(fixCommand);
      console.log("EPUB fixing stdout:", fixStdout);
      if (fixStderr) {
        console.warn("EPUB fixing stderr:", fixStderr);
      }

      // Check if output files were created
      const fixedEpubExists = await fs.access(fixedEpubPath).then(() => true).catch(() => false);
      const reportExists = await fs.access(reportPath).then(() => true).catch(() => false);

      if (!fixedEpubExists) {
        throw new Error("EPUB fixing failed - fixed EPUB file was not created");
      }

      // Create a single database record for this upload with all URLs
      const epubRecord = await prisma.epub.create({
        data: {
          userId: session.user.id!, // Add non-null assertion since we've already checked session.user exists
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "completed",
          originalUrl: `/uploads/${fileId}-${originalFileName}`,
          epub3Url: epub3Url, // URL for EPUB3 version if converted from EPUB2
          fixedUrl: `/processed/${fileId}/${fixedFileName}`,
          logUrl: reportExists ? `/processed/${fileId}/${reportFileName}` : null,
        }
      });

      // Return results with download URLs
      return NextResponse.json({
        success: true,
        message: epubVersion === "epub2" 
          ? "EPUB2 converted to EPUB3 and fixed successfully" 
          : "EPUB3 fixed successfully",
        data: {
          id: epubRecord.id,
          originalFileName: originalFileName,
          epub3FileName: epubVersion === "epub2" ? epub3FileName : null,
          fixedFileName: fixedFileName,
          reportFileName: reportExists ? reportFileName : null,
          epub3FileUrl: epubVersion === "epub2" && epub3Url ? `/api/epub/download?file=${epub3Url.substring(1)}` : null,
          fixedFileUrl: `/api/epub/download?file=processed/${fileId}/${fixedFileName}`,
          reportFileUrl: reportExists ? `/api/epub/download?file=processed/${fileId}/${reportFileName}` : null,
        }
      });
    } catch (processError: any) {
      console.error("EPUB processing error:", processError);
      
      // Save failed processing attempt to database
      await prisma.epub.create({
        data: {
          userId: session.user.id!, // Add non-null assertion
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "failed",
          epub3Url: null,
        }
      });

      // Clean up temporary files
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn("Error cleaning up temporary file:", cleanupError);
      }

      return NextResponse.json(
        { error: "Failed to process EPUB file", details: (processError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("EPUB processing error:", error);
    return NextResponse.json(
      { error: "Failed to process EPUB file", details: (error as Error).message },
      { status: 500 }
    );
  }
}