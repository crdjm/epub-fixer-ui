"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div>
              <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Something went wrong!
              </h1>
              <p className="mt-2 text-center text-sm text-gray-600">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={reset}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Try again
              </button>
              {isClient && (
                <Link
                  href="/"
                  className="text-center font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Go back home
                </Link>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}