import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { prisma } from "../../../../db/db";
import TaskCard from "../task/task-card";
import CalendarAddTaskButton from "./calendar-add-task-button";

dayjs.extend(isToday);
dayjs.extend(isTomorrow);

async function CalendarCard({ date, userId }: { date: Date; userId: string }) {
  const startOfToday = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const startOfTomorrow = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + 1,
  );
  let todayOrTomorrow = "";
  if (dayjs(date).isToday()) {
    todayOrTomorrow = "Today .";
  } else if (dayjs(date).isTomorrow()) {
    todayOrTomorrow = "Tomorrow .";
  }

  const tasksDue = await prisma.task.findMany({
    where: {
      userId: userId,
      dueDate: {
        gte: startOfToday,
        lt: startOfTomorrow,
      },
    },
  });

  return (
    <div>
      <h2>
        {dayjs(date).format("MMM D")} . {todayOrTomorrow}{" "}
        {dayjs(date).format("dddd")}
      </h2>
      <div className="space-y-4">
        {tasksDue.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}
      </div>
      <CalendarAddTaskButton date={date} />
    </div>
  );
}

export default CalendarCard;
