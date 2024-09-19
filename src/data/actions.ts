"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../db/db";
import { z } from "zod";

import { Section, Task } from "@prisma/client";

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

export type TaskModified = {
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

export const duplicateSection = async (
  section: Section,
): Promise<FormState> => {
  const tasks = await prisma.task.findMany({
    where: {
      sectionId: section.id,
    },
  });

  const newSection = await prisma.section.create({
    data: {
      name: `Copy of ${section.name}`,
      userId: section.userId,
      createdAt: new Date(section.createdAt.getTime() + 1),
    },
  });

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        sectionId: newSection.id,
        dueDate: task.dueDate,
        priority: task.priority,
      },
    });
  }

  revalidatePath("/dashboard");
  return {
    message: "section duplicated!",
  };
};

export const updateSection = async (
  data: Omit<Section, "createdAt">,
): Promise<FormState> => {
  await prisma.section.update({
    where: {
      id: data.id,
    },

    data: {
      name: data.name,
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "section updated!",
  };
};

export const addTask = async (data: TaskModified): Promise<FormState> => {
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

export const duplicateTask = async (task: Task): Promise<FormState> => {
  await prisma.task.create({
    data: {
      sectionId: task.sectionId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      createdAt: new Date(task.createdAt.getTime() + 1),
    },
  });
  revalidatePath("/dashboard")
  return {
    message: "task duplicated!",
  };
};
