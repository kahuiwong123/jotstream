import { Task } from "@prisma/client";
import { create } from "zustand";

type TaskStore = {
  tasks: Task[];
  tasksCount: number;
  todayCount: number;
  activeTask?: Task | null;

  setTasks: (tasks: Task[]) => void;
  setTasksCount: (count: number) => void;
  setTodayCount: (count: number) => void;
  setActiveTask: (task: Task | null) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  tasksCount: 0,
  todayCount: 0,

  setTasks: (tasks) => set({ tasks: tasks }),
  setTasksCount: (tasksCount) => set({ tasksCount: tasksCount }),
  setTodayCount: (count) => set({ todayCount: count }),
  setActiveTask: (task) => set({ activeTask: task }),
}));
