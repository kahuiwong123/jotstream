import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import prisma from "../../../../db/db";
import TaskCard from "@/components/dashboard/task/task-card";
import { Button } from "@/components/ui/button";
import dayjs from "dayjs";
import { LuDot } from "react-icons/lu";
import { DatePicker } from "@/components/ui/date-picker";
import RescheduleTaskButton from "@/components/dashboard/task/reschedule-task-button";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const overdueTasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      dueDate: {
        lt: startOfToday,
      },
    },
  });

  const tasksDueToday = await prisma.task.findMany({
    where: {
      userId: session.user.id,
      dueDate: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  if (overdueTasks.length == 0 && tasksDueToday.length == 0) {
    return <h2 className="text-xl">No tasks due today.</h2>
  }

  return (
      <div className="space-y-6">
        {overdueTasks.length > 0 && (
          <div>
            <h2 className="flex h-fit items-center justify-between text-base font-semibold">
              <p>Overdue ({overdueTasks.length})</p>
              <RescheduleTaskButton
                taskIds={overdueTasks.map((task) => task.id)}
              />
            </h2>
            <div className="space-y-4">
              {overdueTasks.map((task) => (
                <TaskCard task={task} key={task.id} />
              ))}
            </div>
          </div>
        )}

        {tasksDueToday.length > 0 && (
          <div>
            <h2 className="mb-2 flex items-center text-base font-semibold">
              Due Today ({tasksDueToday.length}) <LuDot />{" "}
              {dayjs().format("MMM D")}
            </h2>
            <div className="space-y-4">
              {tasksDueToday.map((task) => (
                <TaskCard task={task} key={task.id} />
              ))}
            </div>
          </div>
        )}
      </div>
  );
}
