import { stringToDate } from "../lib/date";
import { create } from "zustand";
import { SectionProp, TaskProp } from "./types";

const section1: SectionProp = {
  name: "Homework",
  tasks: [
    {
      sectionName: "Homework",
      title: "Homework 1",
      description:
        "Vestibulum et nisl molestie, aliquet urna eu, dictum libero. Vestibulum maximus ornare lorem, a malesuada ligula placerat sit amet. Nullam tincidunt porta mollis. Nulla lobortis leo ut tellus sagittis malesuada. Integer laoreet purus arcu, eget ornare turpis auctor a. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam fringilla enim et ornare posuere. Morbi diam velit, maximus quis elit id, dignissim sagittis sapien. Nulla egestas, ex vel ornare tincidunt, tortor nulla consequat urna, ac rhoncus ex turpis sed purus. Duis massa lorem, hendrerit sed maximus vitae, bibendum et urna. Donec blandit, mauris finibus tincidunt facilisis, tellus odio euismod metus, nec interdum sem erat sit amet mauris. Aenean lorem purus, aliquam id sollicitudin id, auctor eget lorem.",
      priority: 1,
      dueDate: stringToDate("10-31-2024"),
    },
    {
      sectionName: "Homework",
      title: "Homework 2",
      description: "This is HW2",
      priority: 2,
    },
    {
      sectionName: "Homework",
      title: "Homework 3",
    },
  ],
};

const section2: SectionProp = {
  name: "Chores",
  tasks: [
    {
      sectionName: "Chores",
      title: "Do dishes",
      priority: 4,
    },
  ],
};

const section3: SectionProp = {
  name: "Activities",
  tasks: [
    {
      sectionName: "Activities",
      title: "Work out",
      description: "20 squats",
      priority: 3,
    },
  ],
};

const section4: SectionProp = {
  name: "Others",
  tasks: [],
};

type SectionStore = {
  sections: SectionProp[];
  addSection: (section: SectionProp) => void;
  setSections: (sections: SectionProp[]) => void;
  removeSection: (sectionName: string) => void;
};

export const useSectionStore = create<SectionStore>((set) => ({
  sections: [section1, section2, section3, section4],
  addSection: (section) =>
    set((state) => ({ sections: [...state.sections, section] })),
  setSections: (sections) => set({ sections: sections }),
  removeSection: (sectionName) =>
    set((state) => ({
      sections: state.sections.filter(
        (section) => section.name !== sectionName,
      ),
    })),
}));
