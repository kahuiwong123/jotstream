import CalendarCard from "@/components/dashboard/calendar/calendar-card";
import CalendarHeader from "@/components/dashboard/calendar/calendar-header";
import { addYears, eachDayOfInterval } from "date-fns";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const generateDays = (today: Date) => {
    const start = today;
    const end = addYears(start, 1);
    return eachDayOfInterval({ start, end });
  };

  const days = generateDays(new Date());

  return (
    <div>
      <CalendarHeader days={days}/>
      <div>
        {days.map((day) => (
          <CalendarCard
            date={day}
            userId={session.user?.id ?? ""}
            key={day.toISOString()}
          />
        ))}
      </div>
    </div>
  );
}

export default Page;
