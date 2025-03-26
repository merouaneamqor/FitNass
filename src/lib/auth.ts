import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma, prismaExec } from "./db";
import { compare } from "bcrypt";

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

        const user = await prismaExec(
          () => prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              isVerified: true,
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

        if (user && !user.isVerified) {
          throw new Error("Email not verified");
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
        },
      };
    },
    jwt: ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
        };
      }
      return token;
    },
  },
}; 