"use client";

import { Task } from "@prisma/client";
import { CommandItem } from "../ui/command";
import { useSectionStore } from "@/data/sectionStore";
import { EditTaskDialog } from "../dashboard/task/edit-task-dialog";
import { DateString } from "../dashboard/task/date-string";
import { PriorityButton } from "../dashboard/task/priority-button";
import { FaRegFolder } from "react-icons/fa";
import { useTaskStore } from "@/data/taskStore";

function SidebarSearchTaskButton({ task }: { task: Task }) {
  const setActiveTask = useTaskStore((state) => state.setActiveTask);
  const setActiveSection = useSectionStore((state) => state.setActiveSection);
  const sections = useSectionStore((state) => state.sections);

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
        <div className="hidden md:block w-24 flex-shrink-0 text-right ml-auto">
          {task.dueDate && <DateString date={task.dueDate} />}
        </div>
        <div className="hidden w-24 flex-shrink-0 truncate text-sm md:flex items-center gap-2 ml-auto text-right">
          <FaRegFolder size={15} />
          {sections.find((section) => section.id === task.sectionId)?.name}
        </div>
      </CommandItem>
    </div>
  );

  return <EditTaskDialog dialogTrigger={button} />;
}

export default SidebarSearchTaskButton;
