import { getUserFromToken } from "@/lib/simple-auth-middleware";
import { cookies } from "next/headers";
import AdminNavbar from "@/components/AdminNavbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("auth-token")?.value;
  const user = token ? await getUserFromToken(token) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <AdminNavbar user={user} />}
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
