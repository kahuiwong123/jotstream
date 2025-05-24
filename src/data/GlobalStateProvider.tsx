"use client";

import { useEffect } from "react";
import { useSectionStore } from "@/data/sectionStore";
import { useTaskStore } from "@/data/taskStore";
import { Section, Task } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./authStore";

type GlobalStateProps = {
  sectionsData: Section[];
  tasksData: Task[];
  userId: string;
  children: React.ReactNode;
};

export default function GlobalStateProvider({
  sectionsData,
  tasksData,
  userId,
  children,
}: GlobalStateProps) {
  const setSections = useSectionStore((state) => state.setSections);

  const { setTasks, setTasksCount, setTodayCount } = useTaskStore(
    useShallow((state) => ({
      setTasks: state.setTasks,
      setTasksCount: state.setTasksCount,
      setTodayCount: state.setTodayCount,
    })),
  );

  const setUserId = useAuthStore((state) => state.setUserId);

  useEffect(() => {
    setTasks(tasksData);
    setUserId(userId);
    setSections(sectionsData);
    setTasksCount(tasksData.length);
    setTodayCount(
      tasksData.filter(
        (task) => task.dueDate !== null && task.dueDate <= new Date(),
      ).length,
    );
  }, [
    setUserId,
    setSections,
    sectionsData,
    setTasksCount,
    tasksData.length,
    tasksData,
    setTodayCount,
    userId,
    setTasks,
  ]);

  return <>{children}</>;
}
