"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";

interface EpubFile {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  status: "processing" | "completed" | "failed";
  createdAt: string;
  logUrl?: string;
  fixedUrl?: string;
  epub3Url?: string; // For EPUB3 version of EPUB2 files
  originalUrl?: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<EpubFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = useSession();

  // Fetch user's existing EPUB files from the database
  useEffect(() => {
    const fetchUserEpubs = async () => {
      try {
        const response = await fetch("/api/epub/list");
        const result = await response.json();
        
        if (response.ok && result.success) {
          // Convert database records to UI format and create download URLs
          const epubFiles = result.data.map((epub: any) => ({
            id: epub.id,
            title: epub.title,
            fileName: epub.fileName,
            fileSize: epub.fileSize,
            status: epub.status,
            createdAt: epub.createdAt,
            logUrl: epub.logUrl ? `/api/epub/download?file=${epub.logUrl.substring(1)}` : undefined,
            fixedUrl: epub.fixedUrl ? `/api/epub/download?file=${epub.fixedUrl.substring(1)}` : undefined,
            epub3Url: epub.epub3Url ? `/api/epub/download?file=${epub.epub3Url.substring(1)}` : undefined,
            originalUrl: epub.originalUrl ? `/api/epub/download?file=${epub.originalUrl.substring(1)}` : undefined,
          }));
          setFiles(epubFiles);
        } else {
          console.error("Failed to fetch EPUB files:", result.error);
          toast.error("Failed to load your previous uploads");
        }
      } catch (error) {
        console.error("Error fetching EPUB files:", error);
        toast.error("Failed to load your previous uploads");
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserEpubs();
    }
  }, [session?.user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error(`File(s) too large: ${oversizedFiles.map(f => f.name).join(', ')}. Max size is 10MB.`);
      return;
    }

    // Check file count limit (max 5 files)
    if (files.length + acceptedFiles.length > 5) {
      toast.error("You can only upload up to 5 files. Please delete some files first.");
      return;
    }

    // Process each file
    acceptedFiles.forEach(async (file) => {
      const newFile: EpubFile = {
        id: Math.random().toString(36).substr(2, 9),
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
        fileName: file.name,
        fileSize: file.size,
        status: "processing",
        createdAt: new Date().toISOString(),
      };

      // Add file to state immediately
      setFiles(prev => [...prev, newFile]);
      setIsUploading(true);

      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append("file", file);

        // Send file to API for processing
        const response = await fetch("/api/epub/process", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Failed to process file");
        }

        // Update file status to completed with real URLs
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { 
                  ...f, 
                  status: "completed",
                  epub3Url: result.data.epub3FileUrl,
                  fixedUrl: result.data.fixedFileUrl,
                  logUrl: result.data.reportFileUrl,
                } 
              : f
          )
        );
        toast.success(`Processed ${file.name}`);
      } catch (error) {
        console.error("File processing error:", error);
        // Update file status to failed
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { 
                  ...f, 
                  status: "failed"
                } 
              : f
          )
        );
        toast.error(`Failed to process ${file.name}: ${(error as Error).message}`);
      } finally {
        setIsUploading(false);
      }
    });
  }, [files.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/epub+zip": [".epub"]
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  const handleDelete = async (id: string) => {
    // Confirm before deleting
    if (!confirm("Are you sure you want to remove this EPUB from your dashboard?")) {
      return;
    }
    
    try {
      const response = await fetch(`/api/epub/delete?id=${id}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete file");
      }
      
      // Remove file from UI state
      setFiles(prev => prev.filter(file => file.id !== id));
      toast.success("File removed successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error(`Failed to remove file: ${(error as Error).message}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Show loading state while fetching files
  if (isLoading) {
    return (
      <div className="py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <Toaster position="top-right" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">EPUB Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload EPUB files for conversion and accessibility checking
        </p>
      </div>

      {/* Upload Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? "border-indigo-500 bg-indigo-50" 
            : "border-gray-300 hover:border-gray-400"
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <div className="mt-4">
            <p className="text-lg font-medium text-gray-900">
              {isUploading ? "Processing files..." : isDragActive ? "Drop the files here" : "Upload EPUB files"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {isUploading 
                ? "Please wait while your files are being processed..." 
                : "Drag and drop your EPUB files here, or click to select files"}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Max file size: 10MB. Max 5 files.
            </p>
          </div>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Your EPUB Files</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {files.map((file) => (
                <li key={file.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-md flex items-center justify-center">
                          <svg 
                            className="h-6 w-6 text-indigo-600" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{file.title}</div>
                          <div className="text-sm text-gray-500">
                            {file.fileName} • {formatFileSize(file.fileSize)}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        {file.status === "processing" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Processing
                          </span>
                        ) : file.status === "completed" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Failed
                          </span>
                        )}
                      </div>
                      
                      {file.status === "completed" && (
                        <div className="flex space-x-4">
                          {file.epub3Url && (
                            <a
                              href={file.epub3Url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Download EPUB3
                            </a>
                          )}
                          {file.fixedUrl && (
                            <a
                              href={file.fixedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              Download Fixed EPUB
                            </a>
                          )}
                          {file.logUrl && (
                            <a
                              href={file.logUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View Report
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                      
                      {file.status === "failed" && (
                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="text-red-600 hover:text-red-900 text-sm font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900">How It Works</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">1</div>
            <p className="ml-3 text-sm text-blue-800">
              Upload your EPUB 2 or EPUB 3 files
            </p>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">2</div>
            <div className="ml-3 text-sm text-blue-800">
              Our system automatically processes your files:
              <ul className="list-disc list-inside mt-1 ml-2">
                <li>Converts EPUB 2 to EPUB 3</li>
                <li>Fixes accessibility issues</li>
                <li>Validates with EPUBCheck</li>
              </ul>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">3</div>
            <p className="ml-3 text-sm text-blue-800">
              Download your fixed EPUB and detailed reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}