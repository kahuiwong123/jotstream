import React from "react";
import { CiCalendar } from "react-icons/ci";
import { getStringFromDate } from "@/lib/date";
import { FaCheck } from "react-icons/fa6";
import { Button } from "../../ui/button";
import { TaskCardDropDown } from "./task-card-dropdown";
import { Task } from "@prisma/client";
import { PriorityButton } from "./priority-button";
import { removeTask } from "@/data/actions";

const TaskCard = ({ task }: { task: Task }) => {
  return (
    <div className="transtion-all group flex w-full max-w-full items-start gap-2 rounded-lg border border-transparent p-2 shadow-sm duration-300 hover:border-gray-300 hover:shadow-md">
      <PriorityButton
        priority={task.priority}
        onClick={() => removeTask(task.id)}
      />
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <div className="flex items-center justify-between">
          <h3>{task.title}</h3>
          <TaskCardDropDown task={task} />
        </div>
        <p className="truncate text-sm text-text-grey">{task.description}</p>
        <div className="flex">
          {task.dueDate && (
            <Button
              variant="ghost"
              className="flex h-fit items-center gap-1 p-0 text-sm text-text-grey"
            >
              <CiCalendar />
              {getStringFromDate(task.dueDate)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
