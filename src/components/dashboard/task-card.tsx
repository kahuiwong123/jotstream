import React from "react";
import { CiCalendar } from "react-icons/ci";
import { getMonthDayFromDate } from "@/lib/date";
import { FaCheck } from "react-icons/fa6";
import { Button } from "../ui/button";
import { TaskCardDropDown } from "./task-card-dropdown";
type TaskProp = {
  section: string;
  title: string;
  description?: string;
  priority?: number;
  dueDate?: Date | null;
};

const TaskCard = ({ task }: { task: TaskProp }) => {
  return (
    <div className="transtion-all group flex w-full max-w-full items-start gap-2 rounded-lg border border-gray-200 p-2 shadow-sm hover:border-gray-300 hover:shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="group mt-0.5 h-fit w-fit rounded-full border-2 border-red-500 bg-transparent"
      >
        <FaCheck className="h-4 w-4 rounded-full border border-transparent text-red-500 opacity-0 transition-opacity duration-200 hover:opacity-100" />
      </Button>
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <div className="flex items-center justify-between">
          <h3>{task.title}</h3>
          <TaskCardDropDown />
        </div>
        <p className="truncate text-sm text-text-grey">{task.description}</p>
        <div className="flex">
          {task.dueDate && (
            <Button
              variant="ghost"
              className="flex h-fit items-center gap-1 p-0 text-sm text-text-grey"
            >
              <CiCalendar />
              {getMonthDayFromDate(task.dueDate)}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
