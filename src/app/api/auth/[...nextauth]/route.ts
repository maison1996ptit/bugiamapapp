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
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Fetch fresh user data from DB to handle role upgrades in real-time
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true, department: true }
        });
        
        (session.user as any).role = dbUser?.role || token.role;
        (session.user as any).id = token.id;
        (session.user as any).department = dbUser?.department;
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
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
