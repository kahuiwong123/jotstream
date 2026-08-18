/* eslint-disable react/display-name */
"use client"

import { removeTask } from "@/data/actions";
import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "~/generated/prisma/client";
import clsx from "clsx";
import React, { memo } from "react";
import { DateString } from "./date-string";
import { EditTaskDialog } from "./edit-task-dialog";
import { PriorityButton } from "./priority-button";
import { TaskCardDropDown } from "./task-card-dropdown";

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
      task,
    },
  });

  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeTask(task.id);
  };

  const handleOnlick = (e: React.MouseEvent) => {
    if (isDragging) {
      return;
    }
    setActiveSection(task.sectionId);
    setActiveTask(task);
  };

  const setActiveTask = useTaskStore((state) => state.setActiveTask);
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
        className="flex w-full max-w-full cursor-grabbing items-start gap-2 rounded-xl border border-[#FF5858] p-2 opacity-60 shadow-sm dark:hover:border-light-grey-hover"
      >
        {task.title}
      </div>
    );
  }

  const taskCard = (
    <div
      className={clsx(
        "task-card flex w-full max-w-full items-start gap-2 rounded-xl border border-gray-300 p-2 shadow-sm transition-all duration-300 hover:border-gray-400 hover:shadow-md dark:border-transparent dark:bg-[#262626] dark:hover:border-light-grey-hover",
      )}
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
        <div className="flex items-center justify-between truncate">
          <h3>{task.title}</h3>
          <TaskCardDropDown task={task} />
        </div>
        <p className="truncate text-sm text-text-grey">{task.description}</p>
        <div className="flex">
          {task.dueDate && <DateString date={task.dueDate} />}
        </div>
      </div>
    </div>
  );

  return <EditTaskDialog dialogTrigger={taskCard} />;
});

export default TaskCard;
