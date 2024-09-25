/* eslint-disable react/display-name */
import React, { memo } from "react";
import { DateString } from "./date-string";
import { TaskCardDropDown } from "./task-card-dropdown";
import { Task } from "@prisma/client";
import { PriorityButton } from "./priority-button";
import { removeTask } from "@/data/actions";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { EditTaskDialog } from "./edit-task-dialog";
import { useSectionStore } from "@/data/sectionStore";
const TaskCard = memo(({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
      },
    });

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTask(task.id);
  };

  const setActiveTask = useSectionStore((state) => state.setActiveTask);
  const setActiveSection = useSectionStore((state) => state.setActiveSection);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="transtion-all group flex w-full max-w-full items-start gap-2 rounded-lg border border-transparent p-2 shadow-sm hover:border-gray-300 hover:shadow-md"
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={{
            transition,
            transform: CSS.Translate.toString(transform),
          }}
          onClick={() => {
            setActiveSection(task.sectionId);
            setActiveTask(task);
          }}
        >
          <PriorityButton
            priority={task.priority}
            onClick={(e) => handleCompleteTask(e)}
          />
          <div className="flex flex-1 flex-col justify-center overflow-hidden">
            <div className="flex items-center justify-between">
              <h3>{task.title}</h3>
              <TaskCardDropDown task={task} />
            </div>
            <p className="truncate text-sm text-text-grey">
              {task.description}
            </p>
            <div className="flex">
              {task.dueDate && <DateString date={task.dueDate} />}
            </div>
          </div>
        </div>
      </DialogTrigger>
      <EditTaskDialog />
    </Dialog>
  );
});

export default TaskCard;
