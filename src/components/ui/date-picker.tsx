"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
type DatePickerProps = {
  variant: "icon" | "text";
  mode?: "reschedule";
  value?: Date | null;
  text?: string;
  onChange: (...event: any[]) => void;
  className?: string;
};

export function DatePicker({
  variant,
  mode,
  value,
  text,
  onChange,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "justify-start p-[0.6rem] text-left font-normal",
            value && "text-muted-foreground",
            variant == "text" ? "w-full" : "size-fit",
            className,
          )}
        >
          <CalendarIcon
            className={cn("size-4", (variant == "text" || value) && "mr-2")}
          />
          {value && mode !== "reschedule" ? (
            <span>{dayjs(value).format("MMMM D YYYY")}</span>
          ) : (
            variant == "text" && <span>{text ? text : "Pick a date"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 focus-visible:ring-0 focus-visible:ring-offset-0">
        <Select
          onValueChange={(val) => {
            onChange(addDays(new Date(), parseInt(val)));
            if (mode === "reschedule") {
              setOpen(false);
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={mode === "reschedule" ? undefined : value || undefined}
            onSelect={(val) => {
              onChange(val);
              if (mode === "reschedule") {
                setOpen(false);
              }
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
