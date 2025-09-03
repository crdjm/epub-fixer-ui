import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// Note: We're not using Prisma adapter here because it doesn't work in middleware
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // In middleware, we can't access the database directly
        // We'll just return null here and let the API route handle authentication
        return null;
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request }) {
      // Allow access to public routes
      const { pathname } = request.nextUrl;
      const isPublicRoute = 
        pathname === "/" || 
        pathname === "/auth/signin" || 
        pathname === "/auth/signup" ||
        pathname.startsWith("/api/test");

      if (isPublicRoute) {
        return true;
      }

      // For protected routes, check if user is authenticated
      return !!auth?.user;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.sub || '',
          email: token.email || '',
          name: token.name || '',
          isAdmin: token.email === process.env.ADMIN_EMAIL,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = user.email === process.env.ADMIN_EMAIL;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});