import { Section } from "~/generated/prisma/client";
import { create } from "zustand";

type SectionStore = {
  sections: Section[];
  highlightSectionId: string | null;
  activeSectionId?: string | null;
  isAdding: boolean;
  activeSection?: Section | null;
  setIsAdding: () => void;
  setSections: (sections: Section[]) => void;
  setHighlightSectionId: (sectionId: string) => void;
  setActiveSectionId: (sectionId: string | null) => void;

  setActiveSection: (sectionId: string | null) => void;

  editOpen: boolean;
  setEditOpen: () => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [],
  highlightSectionId: null,
  isAdding: false,
  editOpen: false,
  setIsAdding: () => set((prev) => ({ isAdding: !prev.isAdding })),
  setEditOpen: () => set((prev) => ({ editOpen: !prev.editOpen })),
  setSections: (sections) => set({ sections: sections }),
  setHighlightSectionId: (sectionId) => {
    set({ highlightSectionId: sectionId });
    setTimeout(() => {
      set({ highlightSectionId: null });
    }, 5000);
  },
  setActiveSectionId: (sectionId) => set({ activeSectionId: sectionId }),
  setActiveSection: (sectionId) =>
    set((prev) => ({
      activeSection: prev.sections.find((section) => section.id === sectionId),
    })),
}));
