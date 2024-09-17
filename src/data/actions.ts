"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../db/db";

export type FormState = {
  message: string;
};

export const addSection = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const name = data.get("name") as string;
  await prisma.section.create({
    data: {
      name: name,
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "success",
  };
};
