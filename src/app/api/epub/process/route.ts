import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import { getCurrentUser } from "@/lib/simple-auth-middleware";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

const execPromise = promisify(exec);

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const PROCESSED_DIR = path.join(process.cwd(), "processed");

// Ensure required directories exist
async function ensureDirectories() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(PROCESSED_DIR, { recursive: true });
}

// Check epub-fix version
async function checkEpubFixVersion(): Promise<string> {
  try {
    const { stdout } = await execPromise("epub-fix --version");
    const versionMatch = stdout.trim().match(/(\d+\.\d+)/);
    if (versionMatch) {
      return versionMatch[1];
    }
    return "0.0";
  } catch (error) {
    console.warn("Error checking epub-fix version:", error);
    return "0.0";
  }
}

// Detect EPUB version by examining the file content
async function detectEpubVersion(filePath: string): Promise<"epub2" | "epub3"> {
  try {
    // Run epub-fix convert command with --dry-run to detect version
    // We'll capture the output to determine the version
    const command = `epub-fix convert --dry-run "${filePath}"`;
    const { stdout, stderr } = await execPromise(command);

    // Check the output for version information
    const output = stdout + stderr;
    console.log("EPUB version detection output:", output);

    // Look for version information in the output
    if (
      output.includes("EPUB version detected: 2.0") ||
      output.includes("Converting EPUB 2.0 to EPUB 3.0")
    ) {
      return "epub2";
    } else if (
      output.includes("EPUB version detected: 3.0") ||
      output.includes("Converting EPUB 3.0")
    ) {
      return "epub3";
    } else {
      // Default to EPUB3 if we can't determine the version
      console.warn(
        "Could not determine EPUB version from output, defaulting to EPUB3",
      );
      return "epub3";
    }
  } catch (error) {
    console.warn("Error detecting EPUB version:", error);
    // Default to EPUB3 if we can't determine the version
    return "epub3";
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check epub-fix version
    const version = await checkEpubFixVersion();
    const [major, minor] = version.split(".").map(Number);
    if (major < 1 || (major === 1 && minor < 1)) {
      return NextResponse.json(
        {
          error: `epub-fix version 1.1 or later required. Current version: ${version}`,
        },
        { status: 500 },
      );
    }
    console.log(`Using epub-fix version ${version}`);

    // Ensure directories exist
    await ensureDirectories();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Save uploaded file to temporary location
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const originalFileName = file.name;
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempFilePath = path.join(UPLOAD_DIR, `${fileId}-${originalFileName}`);

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

        const convertCommand = `GEMINI_API_KEY=${process.env.GEMINI_API_KEY} epub-fix convert --use-gemini "${tempFilePath}"`;
        console.log("Executing conversion command:", convertCommand);
        const { stdout: convertStdout, stderr: convertStderr } =
          await execPromise(convertCommand);
        console.log("EPUB conversion stdout:", convertStdout);
        if (convertStderr) {
          console.warn("EPUB conversion stderr:", convertStderr);
        }

        const actualEpub3Path = path.join(
          UPLOAD_DIR,
          `${fileId}-${epub3FileName}`,
        );

        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          await fs.access(actualEpub3Path);
          epub3Path = actualEpub3Path;
          epub3Url = `/uploads/${fileId}-${epub3FileName}`;
          console.log("EPUB3 file found at:", actualEpub3Path);
        } catch (accessError) {
          console.warn(
            "EPUB3 file not found at expected location, checking alternative locations...",
          );
          try {
            const files = await fs.readdir(UPLOAD_DIR);
            console.log(
              "Files in upload directory:",
              files.filter((f) => f.includes(fileId)),
            );
          } catch (dirError) {
            console.log("Error reading directory:", dirError);
          }
          throw new Error(
            "EPUB2 to EPUB3 conversion failed - output file not created at expected location",
          );
        }
      }

      const outputDir = path.join(PROCESSED_DIR, fileId);
      await fs.mkdir(outputDir, { recursive: true });
      console.log("Created output directory:", outputDir);

      const fixedFileName = `fixed-${epub3FileName}`;
      const reportFileName = `report-${epub3FileName.replace(".epub", ".html")}`;

      console.log("Fixing EPUB...");
      const fixCommand = `GEMINI_API_KEY=${process.env.GEMINI_API_KEY} epub-fix --use-gemini "${epub3Path}"`;
      console.log("Executing fix command:", fixCommand);
      const { stdout: fixStdout, stderr: fixStderr } =
        await execPromise(fixCommand);
      console.log("EPUB fixing stdout:", fixStdout);
      if (fixStderr) {
        console.warn("EPUB fixing stderr:", fixStderr);
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const baseName = path.basename(epub3Path, ".epub");
      console.log("Looking for files with base name:", baseName);

      const dirPath = path.dirname(epub3Path);
      console.log("Searching in directory:", dirPath);

      let foundFixedEpubPath = "";
      let foundReportPath = "";
      let fixedEpubExists = false;
      let reportExists = false;

      try {
        const files = await fs.readdir(dirPath);
        console.log("All files in directory:", files);

        for (const file of files) {
          if (file.endsWith("_fixed.epub")) {
            const fileBaseName = file.replace("_fixed.epub", "");
            if (epub3Path.includes(fileBaseName)) {
              foundFixedEpubPath = path.join(dirPath, file);
              fixedEpubExists = true;
              console.log("Found fixed EPUB:", foundFixedEpubPath);
            }
          }

          if (file.endsWith("_report.html")) {
            const fileBaseName = file.replace("_report.html", "");
            if (epub3Path.includes(fileBaseName)) {
              foundReportPath = path.join(dirPath, file);
              reportExists = true;
              console.log("Found report:", foundReportPath);
            }
          }
        }
      } catch (dirError) {
        console.log("Error reading directory:", dirError);
      }

      if (!fixedEpubExists) {
        const expectedFixedPath = path.join(dirPath, `${baseName}_fixed.epub`);
        console.log("Checking expected fixed EPUB path:", expectedFixedPath);
        fixedEpubExists = await fs
          .access(expectedFixedPath)
          .then(() => true)
          .catch(() => false);
        if (fixedEpubExists) {
          foundFixedEpubPath = expectedFixedPath;
          console.log("Found fixed EPUB at expected path");
        }
      }

      if (!reportExists) {
        const expectedReportPath = path.join(
          dirPath,
          `${baseName}_report.html`,
        );
        console.log("Checking expected report path:", expectedReportPath);
        reportExists = await fs
          .access(expectedReportPath)
          .then(() => true)
          .catch(() => false);
        if (reportExists) {
          foundReportPath = expectedReportPath;
          console.log("Found report at expected path");
        }
      }

      if (!reportExists) {
        console.warn("Warning: Report file was not created by epub-fix tool");
        try {
          const fallbackReportPath = path.join(
            dirPath,
            `${baseName}_report.html`,
          );
          await fs.writeFile(
            fallbackReportPath,
            "<html><body><h1>Processing Report</h1><p>No issues found or report generation failed.</p></body></html>",
          );
          reportExists = true;
          foundReportPath = fallbackReportPath;
          console.log("Created fallback report file:", fallbackReportPath);
        } catch (writeError) {
          console.warn("Failed to create fallback report file:", writeError);
        }
      }

      if (!fixedEpubExists) {
        throw new Error("EPUB fixing failed - fixed EPUB file was not created");
      }

      console.log(
        "Fixed EPUB exists:",
        fixedEpubExists,
        "at",
        foundFixedEpubPath,
      );
      console.log("Report exists:", reportExists, "at", foundReportPath);

      const finalFixedEpubPath = path.join(outputDir, fixedFileName);
      const finalReportPath = path.join(outputDir, reportFileName);

      if (fixedEpubExists) {
        await fs.rename(foundFixedEpubPath, finalFixedEpubPath);
      }
      if (reportExists) {
        await fs.rename(foundReportPath, finalReportPath);
      }

      const epubRecord = await prisma.epub.create({
        data: {
          userId: user.id!,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "completed",
          originalUrl: `/uploads/${fileId}-${originalFileName}`,
          epub3Url: epub3Url,
          fixedUrl: `/processed/${fileId}/${fixedFileName}`,
          logUrl: `/processed/${fileId}/${reportFileName}`,
        },
      });

      return NextResponse.json({
        success: true,
        message:
          epubVersion === "epub2"
            ? "EPUB2 converted to EPUB3 and fixed successfully"
            : "EPUB3 fixed successfully",
        data: {
          id: epubRecord.id,
          originalFileName: originalFileName,
          epub3FileName: epubVersion === "epub2" ? epub3FileName : null,
          fixedFileName: fixedFileName,
          reportFileName: reportFileName,
          epub3FileUrl:
            epubVersion === "epub2" && epub3Url
              ? `/api/epub/download?file=${epub3Url.substring(1)}`
              : null,
          fixedFileUrl: `/api/epub/download?file=processed/${fileId}/${fixedFileName}`,
          reportFileUrl: `/api/epub/download?file=processed/${fileId}/${reportFileName}`,
        },
      });
    } catch (processError: any) {
      console.error("EPUB processing error:", processError);

      await prisma.epub.create({
        data: {
          userId: user.id!,
          title: originalFileName.replace(/\.[^/.]+$/, ""),
          fileName: originalFileName,
          fileSize: fileBuffer.length,
          fileType: file.type,
          status: "failed",
          originalUrl: `/uploads/${fileId}-${originalFileName}`,
          epub3Url: null,
          fixedUrl: null,
          logUrl: null,
        },
      });

      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.warn("Error cleaning up temporary file:", cleanupError);
      }

      return NextResponse.json(
        {
          error: "Failed to process EPUB file",
          details: processError.message || (processError as Error).message,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("EPUB processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process EPUB file",
        details: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
