import { Task } from "@prisma/client";
import { create } from "zustand";

type TaskStore = {
  tasksCount: number;
  todayCount: number;
  activeTask?: Task | null;
  setTasksCount: (count: number) => void;
  setTodayCount: (count: number) => void;
  setActiveTask: (task: Task | null) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasksCount: 0,
  todayCount: 0,
  setTasksCount: (tasksCount) => set({ tasksCount: tasksCount }),
  setTodayCount: (count) => set({ todayCount: count }),
  setActiveTask: (task) => set({ activeTask: task }),
}));
