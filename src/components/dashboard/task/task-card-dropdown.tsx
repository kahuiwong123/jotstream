"use client";

import React, { useState } from "react";
import { Button } from "../../ui/button";
import { TooltipItem } from "../../ui/tooltip-item";
import { DatePicker } from "../../ui/date-picker";
import { PrioritySelect } from "./priority-select";
import { useSectionStore } from "@/data/sectionStore";
import {
  IoEllipsisHorizontalOutline,
  IoDuplicateOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoSwapHorizontalOutline,
  IoCaretForwardOutline,
  IoFlag,
  IoFlagOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskProp } from "@/data/types";

export const TaskCardDropDown = ({ task }: { task: TaskProp }) => {
  const sections = useSectionStore((state) => state.sections);
  const [date, setDate] = useState<Date>();
  const [priority, setPriority] = useState(4);
  const EllipsisButton = (
    <Button
      variant="ghost"
      size="icon"
      className="h-fit w-fit opacity-0 group-hover:opacity-100"
    >
      <IoEllipsisHorizontalOutline className="h-5 w-5" />
    </Button>
  );

  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger asChild>{EllipsisButton}</TooltipTrigger>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IoPencilOutline className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IoDuplicateOutline className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <IoSwapHorizontalOutline className="mr-2 h-4 w-4" />
                <span>Move to...</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {sections
                    .filter((section) => section.name !== task.sectionName)
                    .map((section, index) => (
                      <DropdownMenuItem key={index}>
                        <IoCaretForwardOutline className="mr-2 h-4 w-4" />
                        <span>{section.name}</span>
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuGroup className="flex">
            <PrioritySelect
              variant="list"
              value={priority}
              onValueChange={(value) => setPriority(Number(value))}
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup className="flex items-center">
            <DatePicker variant="text" value={date} onChange={setDate} />
            <TooltipItem
              tooltipTrigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-fit w-fit px-3 py-3"
                >
                  <IoRemoveCircleOutline className="size-5" />
                </Button>
              }
              tooltipString="Remove due date"
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IoTrashOutline className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
        <TooltipContent>
          <p>Task options</p>
        </TooltipContent>
      </Tooltip>
    </DropdownMenu>
  );
};
