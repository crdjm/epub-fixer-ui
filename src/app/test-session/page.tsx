"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function TestSession() {
  const { data: session, status } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Loading Session...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Session Test</h1>
        {session ? (
          <div>
            <p className="text-lg text-gray-600">You are signed in as: {session.user?.email}</p>
          </div>
        ) : (
          <p className="text-lg text-gray-600">You are not signed in</p>
        )}
      </div>
    </div>
  );
}