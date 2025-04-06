import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, prismaExec } from "./db";
import { compare } from "bcrypt";
import { cookies } from "next/headers";

// Use a fallback secret for development
const FALLBACK_SECRET = "a_development_secret_for_testing_purposes_only";

export const authOptions: NextAuthOptions = {
  adapter: undefined, // Disable adapter if not properly configured
  secret: process.env.NEXTAUTH_SECRET || FALLBACK_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Special case for admin returning from impersonation
        if (credentials.password === 'admin-return') {
          const user = await prismaExec(
            () => prisma.user.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                role: true
              }
            }),
            'Error fetching admin during return from impersonation'
          );

          if (!user || user.role !== 'ADMIN') {
            return null;
          }

          // Return admin user
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        // Special case for admin impersonation
        if (credentials.password === 'impersonated') {
          const user = await prismaExec(
            () => prisma.user.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                email: true,
                name: true,
                role: true
              }
            }),
            'Error fetching user during impersonation'
          );

          if (!user) {
            return null;
          }

          // Return user with impersonation flag
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isImpersonating: true,
            originalAdmin: credentials.email, // This will be overridden by the admin email
          };
        }

        const user = await prismaExec(
          () => prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true
            }
          }),
          'Error fetching user during authentication'
        );

        if (!user) {
          return null;
        }

        // Add this check to handle users without passwords (e.g. OAuth users)
        if (!user.password) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          isImpersonating: token.isImpersonating,
          originalAdmin: token.originalAdmin,
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          isImpersonating: user.isImpersonating,
          originalAdmin: user.originalAdmin,
        };
      }
      return token;
    },
  },
}; 