import { Section, Task } from "@prisma/client";

type sectionProps = Section & { tasks: Task[] };
type taskProps = Task;

export type { sectionProps, taskProps };
