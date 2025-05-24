"use client";

import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { Task } from "@prisma/client";
import { FaRegFolder } from "react-icons/fa";
import { DateString } from "../dashboard/task/date-string";
import { EditTaskDialog } from "../dashboard/task/edit-task-dialog";
import { PriorityButton } from "../dashboard/task/priority-button";
import { CommandItem } from "../ui/command";

function SidebarSearchTaskButton({ task }: { task: Task | null | undefined }) {
  const setActiveTask = useTaskStore((state) => state.setActiveTask);
  const setActiveSection = useSectionStore((state) => state.setActiveSection);
  const sections = useSectionStore((state) => state.sections);

  if (!task) {
    return null;
  }

  const button = (
    <div
      onClick={() => {
        setActiveTask(task);
        setActiveSection(task.sectionId);
      }}
    >
      <CommandItem className="flex w-full items-center gap-4 border-l-4 border-transparent py-2 hover:cursor-pointer hover:border-l-[#FE6767]">
        <div className="flex-shrink-0">
          <PriorityButton priority={task.priority} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-base">{task.title}</span>
          <span className="truncate text-sm">{task.description}</span>
        </div>
        <div className="ml-auto hidden w-24 flex-shrink-0 text-right md:block">
          {task.dueDate && <DateString date={task.dueDate} />}
        </div>
        <div className="ml-auto hidden w-24 flex-shrink-0 items-center gap-2 truncate text-right text-sm md:flex">
          <FaRegFolder size={15} />
          {sections.find((section) => section.id === task.sectionId)?.name}
        </div>
      </CommandItem>
    </div>
  );

  return <EditTaskDialog dialogTrigger={button} />;
}

export default SidebarSearchTaskButton;
