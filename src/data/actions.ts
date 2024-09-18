"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../db/db";
import { z } from "zod";
import { taskProps } from "./types";

const sectionSchema = z.object({
  name: z.string().min(1),
});

const taskSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().optional(),
});

export type FormState = {
  message: string;
};

export type Section = {
  sectionId: string;
  title: string;
  description?: string;
  priority: number;
  dueDate?: Date;
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

export const removeSection = async (id: string): Promise<FormState> => {
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

export const addTask = async (data: Section): Promise<FormState> => {
  const validate = taskSchema.safeParse(data);
  if (!validate.success) {
    return {
      message: "task name cannot be empty.",
    };
  }
  await prisma.task.create({
    data: data,
  });
  revalidatePath("/dashboard");
  return {
    message: "task added!",
  };
};

export const removeTask = async (id: string): Promise<FormState> => {
  await prisma.task.delete({
    where: {
      id: id,
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "task removed!",
  };
};
