"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IoAdd } from "react-icons/io5";
import { AddTaskButton } from "../task/add-task-button";

function CalendarAddTaskButton({ date }: { date: Date }) {
  const [open, setOpen] = useState(false);
  return open ? (
    <AddTaskButton setOpen={setOpen} dueDate={date} />
  ) : (
    <Button variant={"ghost"} onClick={() => setOpen(true)}>
      <IoAdd size={20} />
      Add Task
    </Button>
  );
}

export default CalendarAddTaskButton;
