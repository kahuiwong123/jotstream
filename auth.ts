import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser } from "@/data/authActions";
import GoogleProvider from "next-auth/providers/google";
import prisma from "./db/db";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user || !user.password) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("no profile");
        }
        const success = await prisma.user.upsert({
          where: {
            email: profile.email,
          },

          update: {},
          create: {
            email: profile.email,
          },
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      // Add user id to the token on initial sign in
      if (user) {
        token.id = user.id; // Assuming user has an `id` property
        token.email = user.email; // Assuming user has an `email` property
      }
      return token;
    },
    async session({ session, token }) {
      // Include the user id in the session object
      session.user.id = token.id as string;
      session.user.email = token.email as string; // Assuming you want to include email as well
      return session;
    },
  },
});
