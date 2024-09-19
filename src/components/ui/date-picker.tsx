"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { getStringFromDate } from "@/lib/date";

type DatePickerProps = {
  variant: "icon" | "text";
  value: Date | null;
  onChange: (...event: any[]) => void;
  className?: string;
};

export function DatePicker({
  variant,
  value,
  onChange,
  className,
}: DatePickerProps) {
  return (
    <Popover>
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
          {value
            ? getStringFromDate(value, true)
            : variant == "text" && <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2 focus-visible:ring-0 focus-visible:ring-offset-0">
        <Select
          onValueChange={(value) =>
            onChange(addDays(new Date(), parseInt(value)))
          }
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
            selected={value || undefined}
            onSelect={onChange}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
