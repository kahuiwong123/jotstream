import { addYears, eachDayOfInterval, format, startOfYear } from "date-fns";
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
      {days.map((day) => (
        <div key={day.toISOString()}>{format(day, "MM/dd/yyyy")}</div>
      ))}
    </div>
  );
}

export default Page;
