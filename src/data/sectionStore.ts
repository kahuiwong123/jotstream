import { create } from "zustand";
import { sectionProps, taskProps } from "./types";

type SectionStore = {
  sections: sectionProps[];
  activeSectionId?: string | null;
  setSections: (sections: sectionProps[]) => void;
  setActiveSectionId: (sectionId: string | null) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [],
  setSections: (sections) => set({ sections: sections }),
  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
}));
