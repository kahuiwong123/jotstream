"use server";

import { Section, Task } from "~/generated/prisma/client";
import { LexoRank } from "lexorank";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "../../db/db";
import { Description } from "@radix-ui/react-dialog";

const sectionSchema = z.object({
  name: z.string().min(1, { message: "section name cannot be empty" }),
  userId: z.string().min(1),
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

type taskUpdateProps = {
  sectionId?: string;
  dueDate?: Date | null;
  priority?: number;
  title?: string;
  description?: string | null;
};

export const findTasksDue = async (userId: string, dueDate: Date) => {
  const tasksDue = await prisma.task.findMany({
    where: {
      userId: userId,
      dueDate: dueDate,
    },

    orderBy: {
      rank: "asc",
    },
  });

  return tasksDue;
};

export const findAllSections = async (userId?: string) => {
  const sections = await prisma.section.findMany({
    where: {
      userId: userId,
    },
    include: {
      tasks: {
        orderBy: {
          rank: "asc",
        },
      },
    },
    orderBy: {
      rank: "asc",
    },
  });

  return sections;
};

export const addSection = async (
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const userId = data.get("userId") as string;
  const name = data.get("name") as string;
  console.log(data);
  const validate = sectionSchema.safeParse({ name, userId });
  if (!validate.success) {
    return {
      message: "section name cannot be empty.",
    };
  }
  const lastSection = await prisma.section.findFirst({
    where: {
      userId: userId,
    },

    orderBy: {
      rank: "desc",
    },

    select: {
      rank: true,
    },
  });

  const rank = lastSection
    ? LexoRank.parse(lastSection.rank).genNext().toString()
    : LexoRank.middle().toString();
  await prisma.section.create({
    data: {
      name: name,
      userId: userId,
      rank: rank,
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
  const [nextSection, tasks] = await prisma.$transaction([
    prisma.section.findFirst({
      where: {
        userId: section.userId,
        rank: { gt: section.rank },
      },

      orderBy: {
        rank: "asc",
      },
    }),

    prisma.task.findMany({
      where: {
        sectionId: section.id,
      },
    }),
  ]);

  let newRank: string;
  if (nextSection) {
    newRank = LexoRank.parse(section.rank)
      .between(LexoRank.parse(nextSection.rank))
      .toString();
  } else {
    newRank = LexoRank.parse(section.rank).genNext().toString();
  }

  await prisma.$transaction(async (tx) => {
    const createdSection = await prisma.section.create({
      data: {
        name: `Copy of ${section.name}`,
        userId: section.userId,
        rank: newRank,
      },
    });

    const taskData = tasks.map((task) => ({
      title: task.title,
      description: task.description,
      sectionId: createdSection.id,
      dueDate: task.dueDate,
      priority: task.priority,
      rank: task.rank,
      userId: section.userId,
    }));

    await tx.task.createMany({
      data: taskData,
    });

    return createdSection;
  });

  revalidatePath("/dashboard");
  return {
    message: `section ${section.name} duplicated!`,
  };
};

export const updateSection = async (
  data: Omit<Section, "createdAt" | "rank" | "updatedAt">,
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

export const moveSection = async (
  oldId: string,
  newId: string,
): Promise<FormState> => {
  const [oldSection, newSection] = await prisma.$transaction([
    prisma.section.findUnique({ where: { id: oldId } }),
    prisma.section.findUnique({ where: { id: newId } }),
  ]);

  if (!oldSection || !newSection) {
    return { message: "one or both sections not found!" };
  }

  console.log(oldSection.name, newSection.name);

  const movingDown = oldSection.rank < newSection.rank;

  let prevSection, nextSection;

  if (movingDown) {
    // move to back of lsit
    prevSection = newSection;
    nextSection = await prisma.section.findFirst({
      where: {
        userId: oldSection.userId,
        rank: { gt: newSection.rank },
      },
      orderBy: { rank: "asc" },
    });
  } else {
    // move to front of list
    prevSection = await prisma.section.findFirst({
      where: {
        userId: oldSection.userId,
        rank: { lt: newSection.rank },
      },
      orderBy: { rank: "desc" },
    });
    nextSection = newSection;
  }

  let newRank: string;
  if (prevSection && nextSection) {
    // move between two sections
    newRank = LexoRank.parse(prevSection.rank)
      .between(LexoRank.parse(nextSection.rank))
      .toString();
  } else if (prevSection && !nextSection) {
    // move to end of list
    newRank = LexoRank.parse(prevSection.rank).genNext().toString();
  } else if (!prevSection && nextSection) {
    // move to beginning of list
    newRank = LexoRank.parse(nextSection.rank).genPrev().toString();
  } else {
    newRank = LexoRank.middle().toString();
  }

  await prisma.section.update({
    where: { id: oldSection.id },
    data: { rank: newRank },
  });

  // revalidatePath("/dashboard")

  return { message: `${oldSection.name} moved!` };
};

export const addTask = async (
  userId: string | undefined,
  prevState: FormState,
  data: FormData,
): Promise<FormState> => {
  const taskData = Object.fromEntries(data.entries());
  const newTask = {
    title: taskData.title.toString(),
    description: taskData.description.toString(),
    dueDate: taskData.dueDate
      ? new Date(taskData.dueDate.toString())
      : undefined,
    priority: Number(taskData.priority),
    sectionId: taskData.sectionId.toString(),
  };
  const validate = taskSchema.safeParse(newTask);
  console.log(validate.error?.flatten().fieldErrors);
  if (!validate.success) {
    return {
      message: "task schema validation failed.",
    };
  }
  const lastTask = await prisma.task.findFirst({
    select: {
      rank: true,
    },
    where: {
      sectionId: newTask.sectionId,
    },

    orderBy: {
      rank: "desc",
    },
  });

  const rank = lastTask
    ? LexoRank.parse(lastTask.rank).genNext().toString()
    : LexoRank.middle().toString();

  await prisma.task.create({
    data: { ...newTask, rank: rank, userId: userId },
  });

  revalidatePath("/dashboard");

  return {
    message: `task added!`,
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
  const nextTask = await prisma.task.findFirst({
    where: {
      sectionId: task.sectionId,
      rank: { gt: task.rank },
    },

    orderBy: {
      rank: "asc",
    },
  });

  let newRank: string;
  if (nextTask) {
    newRank = LexoRank.parse(task.rank)
      .between(LexoRank.parse(nextTask.rank))
      .toString();
  } else {
    newRank = LexoRank.parse(task.rank).genNext().toString();
  }

  await prisma.task.create({
    data: {
      sectionId: task.sectionId,
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      rank: newRank,
      userId: task.userId,
    },
  });

  revalidatePath("/dashboard");
  return {
    message: `${task.title} duplicated!`,
  };
};

export const updateTask = async (
  taskId: string,
  updates: taskUpdateProps,
): Promise<FormState> => {
  const currentTask = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  let newRank = currentTask?.rank;
  if (
    currentTask &&
    updates.sectionId &&
    currentTask.sectionId !== updates.sectionId
  ) {
    const lastTask = await prisma.task.findFirst({
      select: {
        rank: true,
      },
      where: {
        sectionId: updates.sectionId,
      },

      orderBy: {
        rank: "desc",
      },
    });

    // if task is moved to a different section, recalculate rank
    newRank = lastTask
      ? LexoRank.parse(lastTask.rank).genNext().toString()
      : LexoRank.middle().toString();
  }

  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: { ...updates, rank: newRank },
  });
  revalidatePath("/dashboard");

  return {
    message: `${currentTask?.title} updated!`,
  };
};

export const moveTask = async (
  oldId: string,
  newId: string,
  moveToSection: boolean,
  movingDown?: boolean,
): Promise<FormState> => {
  if (moveToSection) {
    const lastTask = await prisma.task.findFirst({
      where: {
        sectionId: newId,
      },

      orderBy: {
        rank: "desc",
      },

      select: {
        rank: true,
      },
    });

    let newRank: string;

    if (lastTask) {
      newRank = LexoRank.parse(lastTask.rank).genNext().toString();
    } else {
      newRank = LexoRank.middle().toString();
    }

    await prisma.task.update({
      where: { id: oldId },
      data: { rank: newRank, sectionId: newId },
    });

    return { message: `moved task ${oldId} to section ${newId}` };
  }

  const [oldTask, newTask] = await prisma.$transaction([
    prisma.task.findUnique({ where: { id: oldId } }),
    prisma.task.findUnique({ where: { id: newId } }),
  ]);

  if (!oldTask || !newTask) {
    return { message: "one or both tasks not found!" };
  }

  let prevTask = await prisma.task.findFirst({
    where: {
      sectionId: newTask.sectionId,
      rank: { lt: newTask.rank },
    },

    orderBy: {
      rank: "desc",
    },
  });

  let nextTask = await prisma.task.findFirst({
    where: {
      sectionId: newTask.sectionId,
      rank: { gt: newTask.rank },
    },

    orderBy: {
      rank: "asc",
    },
  });

  let movingD =
    oldTask.sectionId === newTask.sectionId
      ? oldTask.rank < newTask.rank
      : movingDown;
  if (movingD) {
    prevTask = newTask;
  } else {
    nextTask = newTask;
  }

  let newRank: string;
  if (prevTask && nextTask) {
    newRank = LexoRank.parse(prevTask.rank)
      .between(LexoRank.parse(nextTask.rank))
      .toString();
  } else if (prevTask && !nextTask) {
    newRank = LexoRank.parse(prevTask.rank).genNext().toString(); // end of list
  } else if (!prevTask && nextTask) {
    newRank = LexoRank.parse(nextTask.rank).genPrev().toString(); // beginning of list
  } else {
    newRank = LexoRank.middle().toString();
  }

  await prisma.task.update({
    where: { id: oldTask.id },
    data: { rank: newRank, sectionId: newTask.sectionId },
  });

  return { message: `${oldTask.title} moved!` };
};

export const rescheduleTasks = async (
  taskIds: string[],
  prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const dueDate = formData.get("dueDate") as string;
  await prisma.task.updateMany({
    where: {
      id: {
        in: taskIds,
      },
    },

    data: {
      dueDate: dueDate,
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "tasks rescheduled",
  };
};
