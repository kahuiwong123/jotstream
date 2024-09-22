import { create } from "zustand";
import { sectionProps, taskProps } from "./types";

type SectionStore = {
  sections: sectionProps[];
  activeSectionId?: string | null;
  isAdding: boolean;
  setIsAdding: () => void;
  setSections: (sections: sectionProps[]) => void;
  setActiveSectionId: (sectionId: string | null) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [],
  isAdding: false,
  setIsAdding: () => set((prev) => ({ isAdding: !prev.isAdding })),
  setSections: (sections) => set({ sections: sections }),
  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
}));
