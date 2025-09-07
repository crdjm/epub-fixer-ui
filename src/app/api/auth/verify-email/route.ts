import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verification - EPUB Fixer</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
          <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-red-600 mb-4">Verification Error</h1>
              <p class="text-gray-700 mb-6">Missing verification token. Please check your email for the complete verification link.</p>
              <a href="/auth/signin" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Go to Sign In</a>
            </div>
          </div>
        </body>
      </html>
    `, {
      status: 400,
      headers: { 'Content-Type': 'text/html' }
    });
  }

  try {
    // Find the verification token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification - EPUB Fixer</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
              <div class="text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Verification Error</h1>
                <p class="text-gray-700 mb-6">Invalid verification token. The link may have expired or already been used.</p>
                <a href="/auth/signup" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Create New Account</a>
              </div>
            </div>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Check if token has expired
    if (verificationToken.expiresAt < new Date()) {
      await prisma.verificationToken.delete({
        where: { token },
      });
      
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification - EPUB Fixer</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body class="bg-gray-100 min-h-screen flex items-center justify-center">
            <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
              <div class="text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Verification Expired</h1>
                <p class="text-gray-700 mb-6">Your verification link has expired. Please sign up again to receive a new verification email.</p>
                <a href="/auth/signup" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Create New Account</a>
              </div>
            </div>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Update user's email verification status
    await prisma.user.update({
      where: { email: verificationToken.email },
      data: { emailVerified: new Date() },
    });

    // Delete the verification token
    await prisma.verificationToken.delete({
      where: { token },
    });

    // Return success response
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified - EPUB Fixer</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
          <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg class="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <h1 class="text-2xl font-bold text-gray-900 mb-4">Email Verified!</h1>
              <p class="text-gray-700 mb-6">Your email address has been successfully verified. You can now sign in to your account.</p>
              <a href="/auth/signin?verified=success" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Sign In to Your Account</a>
            </div>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verification - EPUB Fixer</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-gray-100 min-h-screen flex items-center justify-center">
          <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div class="text-center">
              <h1 class="text-2xl font-bold text-red-600 mb-4">Verification Error</h1>
              <p class="text-gray-700 mb-6">An unexpected error occurred during verification. Please try again or contact support.</p>
              <a href="/auth/signup" class="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">Create New Account</a>
            </div>
          </div>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}