export default function TestEnv() {
  // This is a server component, so we can access process.env directly
  const adminEmail = process.env.ADMIN_EMAIL;
  const nextPublicAdminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Environment Variables Test</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-2">ADMIN_EMAIL: {adminEmail || "Not set"}</p>
          <p className="text-lg text-gray-600">NEXT_PUBLIC_ADMIN_EMAIL: {nextPublicAdminEmail || "Not set"}</p>
        </div>
      </div>
    </div>
  );
}