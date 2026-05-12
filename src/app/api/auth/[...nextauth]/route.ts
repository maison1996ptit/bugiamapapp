import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Auth attempt for:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing email or password in credentials");
          throw new Error("Invalid credentials");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) {
            console.error("User not found in database:", credentials.email);
            throw new Error("User not found");
          }

          if (!user.password) {
            console.error("User has no password set:", credentials.email);
            throw new Error("User not found");
          }

          console.log("Comparing passwords for:", credentials.email);
          console.log(`Input password length: ${credentials.password.length}`);
          console.log(`Stored hash length: ${user.password.length}`);
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordCorrect) {
            console.error("Invalid password for:", credentials.email);
            throw new Error("Invalid password");
          }

          console.log("Auth successful for:", credentials.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error: any) {
          console.error("Auth error:", error.message);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        console.log(`[AUTH-JWT] User logged in: ${user.email}, role: ${(user as any).role}`);
        token.role = (user as any).role;
        token.id = user.id;
        token.department = (user as any).department;
      }

      if (trigger === "update" && session?.role) {
        console.log(`[AUTH-JWT] Trigger update, new role: ${session.role}`);
        token.role = session.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        console.log(`[AUTH-SESSION] Populating session for: ${session.user.email}, role in token: ${token.role}`);
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).department = token.department;
  ...

        // Then, try to fetch fresh data from DB if possible
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true, department: true }
          });
          
          if (dbUser) {
            (session.user as any).role = dbUser.role;
            (session.user as any).department = dbUser.department;
          }
        } catch (error) {
          console.error("Session callback DB error:", error);
          // Fallback to token data already set above
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "bugiamap_super_secret_key_2026_mps_gov_vn",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
