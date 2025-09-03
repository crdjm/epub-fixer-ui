export { auth as middleware } from "@/lib/auth-middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};