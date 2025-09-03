"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

export default function TestAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");

  const handleSignIn = async () => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      console.log("Sign in result:", result);
      
      if (result?.error) {
        setMessage(`Sign in error: ${result.error}`);
      } else if (result?.ok) {
        setMessage("Sign in successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      setMessage("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Test Authentication
        </h2>
        
        {message && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="text-sm text-blue-700">{message}</div>
          </div>
        )}
        
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              onClick={handleSignIn}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
            
            <button
              onClick={handleSignOut}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Sign out
            </button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-medium text-gray-900">Session Status</h3>
            <p className="text-sm text-gray-600">Status: {status}</p>
            {session && (
              <div>
                <p className="text-sm text-gray-600">User: {session.user?.email}</p>
                <p className="text-sm text-gray-600">Name: {session.user?.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}