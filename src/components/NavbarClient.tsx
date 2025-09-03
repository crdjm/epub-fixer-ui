"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavbarClient() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    
    // Safely access environment variable on client side only
    if (typeof window !== 'undefined') {
      setAdminEmail(process.env.NEXT_PUBLIC_ADMIN_EMAIL || null);
    }
  }, []);

  useEffect(() => {
    // Check if user is admin - only on client side
    if (session?.user?.email && adminEmail) {
      setIsAdmin(session.user.email === adminEmail);
    }
  }, [session, adminEmail]);

  // Don't render anything until the component is mounted to avoid hydration mismatch
  if (!isMounted) {
    return (
      <div className="hidden sm:ml-6 sm:flex sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching session
  if (status === "loading") {
    return (
      <div className="hidden sm:ml-6 sm:flex sm:items-center">
        <div className="flex items-center space-x-4">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:ml-6 sm:flex sm:items-center">
      {session ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            {session.user?.name || session.user?.email}
          </span>
          {isAdmin && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Admin
            </span>
          )}
          <Link
            href="/dashboard"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Sign up
          </Link>
        </div>
      )}
    </div>
  );
}