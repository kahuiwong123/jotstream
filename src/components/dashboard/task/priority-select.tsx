"use client";

import { TooltipItem } from "@/components/ui/tooltip-item";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoFlag, IoFlagOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const flags = [
  { icon: <IoFlag className="h-4 w-4 text-red-flag" />, tooltip: "Priority 1" },
  {
    icon: <IoFlag className="h-4 w-4 text-orange-flag" />,
    tooltip: "Priority 2",
  },
  {
    icon: <IoFlag className="h-4 w-4 text-blue-flag" />,
    tooltip: "Priority 3",
  },
  { icon: <IoFlagOutline className="h-4 w-4" />, tooltip: "Priority 4" },
];

export const PrioritySelect = ({
  variant,
}: {
  variant: "dropdown" | "list";
}) => {
  const [priority, setPriority] = useState(4);

  let trigger: React.JSX.Element;
  if (variant == "dropdown") {
    trigger = (
      <Select onValueChange={(value) => setPriority(Number(value))}>
        <SelectTrigger className="size-fit" isArrow={false}>
          <SelectValue
            placeholder={
              <Button variant="ghost" size="icon" className="flex size-fit">
                <IoFlagOutline className="size-4" />
              </Button>
            }
          >
            <div className="flex items-center gap-1 grow-0">
              {flags[priority - 1].icon}
              <span>{priority}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {flags.map((flag, index) => (
              <SelectItem key={index} value={`${index + 1}`}>
                <div className="flex items-center gap-2">
                  {flag.icon}
                  <span>{flag.tooltip}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  } else {
    trigger = (
      <div className="flex">
        {flags.map((flag, index) => (
          <TooltipItem
            key={index}
            tooltipTrigger={
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => setPriority(index + 1)}
              >
                {flag.icon}
              </Button>
            }
            tooltipString={flag.tooltip}
          />
        ))}
      </div>
    );
  }
  return trigger;
};
