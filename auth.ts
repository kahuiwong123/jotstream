import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { getUser } from "@/data/authActions";

export const { auth, signIn, signOut } = NextAuth({
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
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Add user id to the token on initial sign in
      if (user) {
        token.id = user.id; // Assuming user has an `id` property
      }
      return token;
    },
    async session({ session, token }) {
      // Include the user id in the session object
      session.user.id = token.id as string;
      return session;
    },
  },
});
