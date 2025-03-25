import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./db";

// Use a fallback secret for development
const FALLBACK_SECRET = "a_development_secret_for_testing_purposes_only";

export const authOptions: NextAuthOptions = {
  adapter: null, // Disable adapter if not properly configured
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

        try {
          // In development, accept any credentials for testing
          if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Allowing any credentials');
            return {
              id: '1',
              email: credentials.email,
              name: 'Development User',
              image: 'https://randomuser.me/api/portraits/lego/1.jpg',
              role: 'USER',
            };
          }

          // Production auth logic
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          // Compare password (would use bcrypt here)
          const isPasswordValid = user.password === credentials.password;

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || '',
            image: user.image || '',
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          // In development, allow fallback
          if (process.env.NODE_ENV === 'development') {
            return {
              id: '1',
              email: credentials.email,
              name: 'Development User',
              image: 'https://randomuser.me/api/portraits/lego/1.jpg',
              role: 'USER',
            };
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
}; 