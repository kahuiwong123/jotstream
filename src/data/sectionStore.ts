import { create } from "zustand";
import { sectionProps, taskProps } from "./types";
import { Section, Task } from "@prisma/client";

type SectionStore = {
  sections: sectionProps[];
  activeSectionId?: string | null;
  isAdding: boolean;
  activeTask?: Task | null;
  activeSection?: (Section & { tasks: Task[] }) | null;
  setIsAdding: () => void;
  setSections: (sections: sectionProps[]) => void;
  setActiveSectionId: (sectionId: string | null) => void;
  setActiveTask: (task: Task | null) => void;
  setActiveSection: (sectionId: string | null) => void;
  editOpen: boolean;
  setEditOpen: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (bool: boolean) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [],
  isAdding: false,
  editOpen: false,
  setIsAdding: () => set((prev) => ({ isAdding: !prev.isAdding })),
  setEditOpen: () => set((prev) => ({ editOpen: !prev.editOpen })),
  setSections: (sections) => set({ sections: sections }),
  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
  setActiveTask: (task) => set({ activeTask: task }),
  setActiveSection: (sectionId) =>
    set((prev) => ({
      activeSection: prev.sections.find((section) => section.id === sectionId),
    })),
  sidebarCollapsed: false,
  setSidebarCollapsed: (bool) => set({ sidebarCollapsed: bool }),
}));
