import React from "react";
import { Button } from "../../ui/button";
import { TooltipItem } from "../../ui/tooltip-item";
import { DatePicker } from "../../ui/date-picker";
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

export const TaskCardDropDown = () => {
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
                  <DropdownMenuItem>
                    <IoCaretForwardOutline className="mr-2 h-4 w-4" />
                    <span>Chores</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IoCaretForwardOutline className="mr-2 h-4 w-4" />
                    <span>Activites</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IoCaretForwardOutline className="mr-2 h-4 w-4" />
                    <span>Others</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Priority</DropdownMenuLabel>
          <DropdownMenuGroup className="flex">
            <TooltipItem
              tooltipTrigger={
                <Button variant="ghost" size="icon" className="h-fit w-fit p-2">
                  <IoFlag className="h-4 w-4 text-red-flag" />
                </Button>
              }
              tooltipString="Priority 1"
            />
            <TooltipItem
              tooltipTrigger={
                <Button variant="ghost" size="icon" className="h-fit w-fit p-2">
                  <IoFlag className="h-4 w-4 text-orange-flag" />
                </Button>
              }
              tooltipString="Priority 2"
            />
            <TooltipItem
              tooltipTrigger={
                <Button variant="ghost" size="icon" className="h-fit w-fit p-2">
                  <IoFlag className="h-4 w-4 text-blue-flag" />
                </Button>
              }
              tooltipString="Priority 3"
            />
            <TooltipItem
              tooltipTrigger={
                <Button variant="ghost" size="icon" className="h-fit w-fit p-2">
                  <IoFlagOutline className="h-4 w-4" />
                </Button>
              }
              tooltipString="Priority 4"
            />
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup className="flex items-center">
            <DatePicker />
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
