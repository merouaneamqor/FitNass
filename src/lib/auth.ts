import { NextAuthOptions } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { User } from 'next-auth';

// Define valid roles
type UserRole = "USER" | "ADMIN" | "GYM_OWNER";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password');
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
              role: true,
              image: true
            }
          });

          if (!user || !user.password) {
            throw new Error('No user found with this email');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: (user.role as UserRole) || "USER",
            image: user.image
          } as User;
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error('Authentication failed. Please try again.');
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true }
          });

          if (!existingUser) {
            // Create new user if they don't exist
            const newUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                role: 'USER',
                emailVerified: new Date(), // Google accounts are pre-verified
              },
            });
            return true;
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }

      // For credentials, just check if the user exists
      if (account?.provider === 'credentials') {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
            select: { id: true }
          });
          return !!dbUser;
        } catch (error) {
          console.error('SignIn callback error:', error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user.role as UserRole) || 'USER';
      }

      // If it's a Google sign in, update the user's profile image
      if (account?.provider === 'google' && profile?.picture) {
        token.picture = profile.picture;
      }

      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role || 'USER',
          image: token.picture || session.user.image,
        },
      };
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
}; 