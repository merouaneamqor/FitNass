// Add your custom augmentations here
// import NextAuth from 'next-auth';

import "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's id */
      id: string;
      /** The user's name */
      name: string;
      /** The user's email address */
      email: string;
      /** The user's profile image */
      image?: string;
      /** The user's role */
      role: 'USER' | 'GYM_OWNER' | 'ADMIN';
      /** Whether the user is being impersonated by an admin */
      isImpersonating?: boolean;
      /** The email of the admin who is impersonating */
      originalAdmin?: string;
    };
  }

  interface User {
    id: string;
    role: "USER" | "GYM_OWNER" | "ADMIN";
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isImpersonating?: boolean;
    originalAdmin?: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** The user's id */
    id: string;
    /** The user's role */
    role: "USER" | "GYM_OWNER" | "ADMIN";
    /** Whether the user is being impersonated by an admin */
    isImpersonating?: boolean;
    /** The email of the admin who is impersonating */
    originalAdmin?: string;
  }
} 