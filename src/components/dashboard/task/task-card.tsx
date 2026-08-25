/* eslint-disable react/display-name */
"use client";

import { removeTask } from "@/data/actions";
import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { Task } from "~/generated/prisma/client";
import clsx from "clsx";
import React, { memo, PropsWithChildren } from "react";
import { DateString } from "./date-string";
import { EditTaskDialog } from "./edit-task-dialog";
import { PriorityButton } from "./priority-button";
import { TaskCardDropDown } from "./task-card-dropdown";
import { Feedback } from "@dnd-kit/dom";

interface TaskCardProps {
  index?: number;
  task: Task;
  group?: string;
}

const TaskCard = memo(
  ({ index, task, group }: PropsWithChildren<TaskCardProps>) => {
    const isDraggable = index !== undefined && group !== undefined;
    const { ref, isDragging } = useSortable({
      id: task.id,
      index: index ?? 0,
      type: "task",
      accept: "task",
      group,
      data: { group },
      disabled: !isDraggable,
      plugins: [Feedback.configure({ feedback: "clone" })],
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

    const taskCard = (
      <div
        className={clsx(
          "task flex max-w-72 items-start gap-2 rounded-xl border border-gray-300 p-2 shadow-sm transition-all duration-300 ease-in-out hover:border-gray-400 hover:shadow-md dark:border-transparent dark:bg-[#262626] dark:hover:border-light-grey-hover",
          isDragging &&
            "scale-[1.03] shadow-[inset_0_0_1px_rgba(0,0,0,0.5),-1px_0_15px_0_rgba(34,33,81,0.01),0px_15px_15px_0_rgba(34,33,81,0.25)] backdrop-blur-[5px]",
        )}
        ref={ref as any}
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
  },
);

export default TaskCard;
