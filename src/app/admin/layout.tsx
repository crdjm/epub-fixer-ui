import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/DashboardNavbar";
import SessionWrapper from "@/components/SessionWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Check if user is admin
  if (!session || !session.user?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <SessionWrapper>
      <div className="min-h-screen bg-gray-50">
        <DashboardNavbar session={session} />
        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </SessionWrapper>
  );
}