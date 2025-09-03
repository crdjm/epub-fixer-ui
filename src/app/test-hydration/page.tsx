"use client";

import { useState, useEffect } from "react";

export default function TestHydration() {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hydration Test</h1>
        <p className="text-lg text-gray-600">If you see this, hydration is working correctly!</p>
      </div>
    </div>
  );
}