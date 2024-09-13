type SectionProp = {
  name: string;
  tasks: TaskProp[];
};

type TaskProp = {
  sectionName: string;
  title: string;
  description?: string;
  priority?: number;
  dueDate?: Date;
};

export type { SectionProp, TaskProp };
