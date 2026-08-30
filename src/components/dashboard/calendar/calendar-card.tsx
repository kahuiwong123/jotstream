"use client";

import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { AddTaskButton } from "../task/add-task-button";
import { useDateStore } from "@/data/store/dateStore";
import { Button } from "@/components/ui/button";
import { IoAdd } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/data/store/authStore";
import { useEffect, useState } from "react";
import { findTasksDue } from "@/data/actions";
import TaskCard from "../task/task-card";
import { Task } from "~/generated/prisma/client";
import { useTaskStore } from "@/data/store/taskStore";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

function CalendarCard({ date }: { date: Date }) {
  const { activeDate, setActiveDate } = useDateStore(
    useShallow((state) => ({
      activeDate: state.activeDate,
      setActiveDate: state.setActiveDate,
    })),
  );

  const tasksDue = useTaskStore(
    useShallow((state) =>
      state.tasks.filter(
        (task) => task.dueDate && dayjs(task.dueDate).isSame(date, "day"),
      ),
    ),
  );

  let todayOrTomorrow = "";
  if (dayjs(date).isToday()) {
    todayOrTomorrow = "Today";
  } else if (dayjs(date).isTomorrow()) {
    todayOrTomorrow = "Tomorrow";
  }

  return (
    <div>
      <h2 className="border-b border-b-gray-500 p-3">
        {dayjs(date).format("MMM D . dddd")}
        {todayOrTomorrow && (
          <span className="font-semibold"> . {todayOrTomorrow}</span>
        )}
      </h2>

      <ul className="my-3 grid gap-3">
        {tasksDue.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </ul>

      {activeDate === date ? (
        <AddTaskButton dueDate={activeDate} />
      ) : (
        <Button
          variant="ghost"
          className="flex justify-start gap-2 px-2"
          onClick={() => setActiveDate(date)}
        >
          <IoAdd className="size-6" />
          <p>Add Task</p>
        </Button>
      )}
    </div>
  );
}

export default CalendarCard;
