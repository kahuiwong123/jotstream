"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../db/db";
import { z } from "zod";

const sectionSchema = z.object({
  name: z.string().min(1),
});

export type FormState = {
  message: string;
};

export const addSection = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const validate = sectionSchema.safeParse(Object.fromEntries(data));
  if (!validate.success) {
    return {
      message: "section name cannot be empty.",
    };
  }
  const name = data.get("name") as string;
  await prisma.section.create({
    data: {
      name: name,
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "section added!",
  };
};

export const removeSection = async (id: string) => {
  await prisma.section.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "section removed!",
  };
};