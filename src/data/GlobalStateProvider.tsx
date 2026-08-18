"use client";

import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { Section, Task } from "~/generated/prisma/client";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "./store/authStore";

type GlobalStateProps = {
  sectionsData: Section[];
  tasksData: Task[];
  userId: string;
  todaysCount: number;
  children: React.ReactNode;
};

export default function GlobalStateProvider({
  sectionsData,
  tasksData,
  userId,
  todaysCount,
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
    setTodayCount(todaysCount);
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
    todaysCount,
  ]);

  return <>{children}</>;
}
