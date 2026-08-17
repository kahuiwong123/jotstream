"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import dayjs from "dayjs";

function CalendarHeader({ days }: { days: Date[] }) {
  return (
    <ScrollArea>
      <div className="flex sticky top-0 space-x-2 overflow-x-auto">
        {days.map((date) => {
          const dateKey = dayjs(date).format("YYYY-MM-DD");
          return <Button key={dateKey}>{dayjs(date).format("ddd D")}</Button>;
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default CalendarHeader;
