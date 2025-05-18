"use server";

import bcrypt from "bcrypt";
import { Prisma, User } from "@prisma/client";
import { signIn, signOut } from "../../auth";
import { AuthError } from "next-auth";
import prisma from "../../db/db";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Passwords must be at least 8 characters long." }),
});

export async function googleSignin() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  let errorOccured = false;
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      errorOccured = true;
      switch (error.name) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  } finally {
    if (!errorOccured) {
      redirect("/dashboard");
    }
  }
}

export const getUser = async (email: string): Promise<User | null> => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export const registerUser = async (
  prevState: string[] | undefined,
  data: FormData,
) => {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  const validatedFields = formSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    const errorMessages = Object.values(
      validatedFields.error.flatten().fieldErrors,
    )
      .filter((messages) => messages !== undefined)
      .flat();
    return errorMessages;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  let errorOccured = false;
  try {
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
      },
    });
    if (!user) {
      return ["An error occured while creating your account."];
    }
    await createSession(user.id);
  } catch (e: any) {
    errorOccured = true;
    if (e.code === "P2002") {
      return ["An user with this email already exist."];
    }
    throw e;
  } finally {
    if (!errorOccured) {
      await authenticate(undefined, data);
    }
  }
};

export const logoutUser = async () => {
  deleteSession();
  redirect("/");
};

export const handleSignOut = async () => {
  await signOut({ redirectTo: "/" });
};
