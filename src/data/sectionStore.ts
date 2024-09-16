import { create } from "zustand";
import { sectionProps, taskProps } from "./types";

type SectionStore = {
  sections: sectionProps[];
  addSection: (section: sectionProps) => void;
  setSections: (sections: sectionProps[]) => void;
  removeSection: (sectionName: string) => void;
  duplicateSection: (sectionName: string) => void;
  // addTaskToSection: (sectionName: string, task: TaskProp) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [],
  addSection: (section) =>
    set((state) => ({ sections: [...state.sections, section] })),

  setSections: (sections) => set({ sections: sections }),

  removeSection: (sectionName) =>
    set((state) => ({
      sections: state.sections.filter(
        (section) => section.name !== sectionName,
      ),
    })),

  duplicateSection: (name: string) =>
    set((state) => {
      const index = state.sections.findIndex(
        (section) => section.name === name,
      );
      if (index !== -1) {
        const newSection = {
          ...state.sections[index],
          name: `Copy of ${name}`,
        };
        const newSections = [
          ...state.sections.slice(0, index + 1),
          newSection,
          ...state.sections.slice(index + 1),
        ];
        return { sections: newSections };
      }
      return state;
    }),

  // addTaskToSection: (sectionName, task) =>
  //   set((state) => {
  //     const newSectons = state.sections.map((section) => {
  //       if (section.name === sectionName) {
  //         return {
  //           ...section,
  //           tasks: [...section.tasks, task],
  //         };
  //       }
  //       return section;
  //     });
  //     return { sections: newSectons };
  //   }),
}));
