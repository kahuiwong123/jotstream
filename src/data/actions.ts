"use server";

import { revalidatePath } from "next/cache";
import prisma from "../../db/db";
import { z } from "zod";
import { LexoRank } from "lexorank";

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

type taskUpdateProps = {
  dueDate?: Date | null;
  priority?: number;
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

  const lastSection = await prisma.section.findFirst({
    select: {
      rank: true,
    },
    where: {
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
    },

    orderBy: {
      rank: "desc",
    },
  });

  const name = data.get("name") as string;
  const rank = lastSection
    ? LexoRank.parse(lastSection.rank).genNext().toString()
    : LexoRank.middle().toString();
  await prisma.section.create({
    data: {
      name: name,
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
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

  const newSection = await prisma.$transaction(async (tx) => {
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
  data: Omit<Section, "createdAt" | "rank">,
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
    prisma.section.findUnique({
      where: {
        id: oldId,
      },
    }),

    prisma.section.findUnique({
      where: {
        id: newId,
      },
    }),
  ]);

  if (!oldSection || !newSection) {
    return {
      message: "one or both sections not found!",
    };
  }

  let [prevSection, nextSection] = await prisma.$transaction([
    prisma.section.findFirst({
      select: {
        rank: true,
      },
      where: {
        rank: { lt: newSection.rank },
      },
      orderBy: { rank: "desc" },
    }),

    prisma.section.findFirst({
      select: {
        rank: true,
      },
      where: { rank: { gt: newSection.rank } },
      orderBy: { rank: "asc" },
    }),
  ]);

  let newRank;
  // console.log("active section: " + oldSection.name);
  // console.log("over section: " + newSection.name);

  prevSection = oldSection.rank < newSection.rank ? newSection : prevSection;
  nextSection = oldSection.rank > newSection.rank ? newSection : nextSection;

  // console.log(prevSection?.name);
  // console.log(nextSection?.name);

  if (prevSection && nextSection) {
    newRank = LexoRank.parse(prevSection.rank)
      .between(LexoRank.parse(nextSection.rank))
      .toString();
  } else if (prevSection) {
    newRank = LexoRank.parse(prevSection.rank).genNext().toString();
  } else if (nextSection) {
    newRank = LexoRank.parse(nextSection.rank).genPrev().toString();
  } else {
    newRank = LexoRank.middle().toString();
  }

  await prisma.section.update({
    where: { id: oldSection.id },
    data: { rank: newRank },
  });

  revalidatePath("/dashboard");
  return {
    message: `${oldSection.name} moved!`,
  };
};

export const addTask = async (data: TaskModified): Promise<FormState> => {
  const validate = taskSchema.safeParse(data);
  const lexorank = LexoRank.middle();
  if (!validate.success) {
    return {
      message: "task name cannot be empty.",
    };
  }
  await prisma.task.create({
    data: { ...data, rank: lexorank.genNext().toString() },
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
      rank: task.rank,
    },
  });
  revalidatePath("/dashboard");
  return {
    message: "task duplicated!",
  };
};

export const changeTaskSection = async (
  task: Task,
  newSectionId: string,
): Promise<FormState> => {
  await prisma.task.update({
    where: {
      id: task.id,
    },

    data: {
      sectionId: newSectionId,
      createdAt: new Date(),
    },
  });
  revalidatePath("/dashboard");
  return {
    message: `task ${task.title} section updated!`,
  };
};

export const updateTask = async (
  taskId: string,
  updates: taskUpdateProps,
): Promise<FormState> => {
  await prisma.task.update({
    where: {
      id: taskId,
    },
    data: updates,
  });
  revalidatePath("/dashboard");
  return {
    message: "task updated!",
  };
};

export const moveTask = async (
  oldId: string,
  newId: string,
): Promise<FormState> => {
  const [oldTask, newTask] = await prisma.$transaction([
    prisma.task.findUnique({
      where: {
        id: oldId,
      },
    }),

    prisma.task.findUnique({
      where: {
        id: newId,
      },
    }),
  ]);

  if (!oldTask || !newTask) {
    return {
      message: "one or both tasks not found!",
    };
  }

  let [prevTask, nextTask] = await prisma.$transaction([
    prisma.task.findFirst({
      select: {
        rank: true,
      },
      where: {
        rank: { lt: newTask.rank },
      },
      orderBy: { rank: "desc" },
    }),

    prisma.task.findFirst({
      select: {
        rank: true,
      },
      where: { rank: { gt: newTask.rank } },
      orderBy: { rank: "asc" },
    }),
  ]);

  let newRank;
  prevTask = oldTask.rank < newTask.rank ? newTask : prevTask;
  nextTask = oldTask.rank > newTask.rank ? newTask : nextTask;

  if (prevTask && nextTask) {
    newRank = LexoRank.parse(prevTask.rank)
      .between(LexoRank.parse(nextTask.rank))
      .toString();
  } else if (prevTask) {
    newRank = LexoRank.parse(prevTask.rank).genNext().toString();
  } else if (nextTask) {
    newRank = LexoRank.parse(nextTask.rank).genPrev().toString();
  } else {
    newRank = LexoRank.middle().toString();
  }

  await prisma.task.update({
    where: { id: oldTask.id },
    data: { rank: newRank },
  });

  revalidatePath("/dashboard");
  return {
    message: `${oldTask.title} moved!`,
  };
};
