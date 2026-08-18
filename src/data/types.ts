import { Section, Task } from "~/generated/prisma/client";

type sectionProps = Section & { tasks: Task[] };
type taskProps = Task;

export type { sectionProps, taskProps };
