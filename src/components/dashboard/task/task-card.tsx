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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task
    },
  });

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTask(task.id);
  };

  const handleOnlick = (e: React.MouseEvent) => {
    setActiveSection(task.sectionId);
    setActiveTask(task);
  };

  const activeTask = useSectionStore((state) => state.activeTask);
  const activeSection = useSectionStore((state) => state.activeSection);
  const setActiveTask = useSectionStore((state) => state.setActiveTask);
  const setActiveSection = useSectionStore((state) => state.setActiveSection);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="transtion-all group flex w-full max-w-full items-start gap-2 rounded-lg border border-red-flag p-2 opacity-30 shadow-sm cursor-grab"
      >
        {task.title}
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="transtion-all group flex w-full max-w-full items-start gap-2 rounded-lg border border-transparent p-2 shadow-sm hover:border-gray-300 hover:shadow-md"
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          style={style}
          onClick={handleOnlick}
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
