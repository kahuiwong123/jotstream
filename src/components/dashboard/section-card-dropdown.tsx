import React from "react";
import { TooltipItem } from "../ui/tooltip-item";
import { Button } from "../ui/button";
import {
  IoEllipsisHorizontalOutline,
  IoDuplicateOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
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
export const SectionCardDropDown = ({
  setIsEditing,
}: {
  setIsEditing: (bool: boolean) => void;
}) => {
  const EllipsisButton = (
    <Button
      variant="outline"
      size="icon"
      className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-dark-main"
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
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <IoPencilOutline className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IoDuplicateOutline className="mr-2 h-4 w-4" />
              <span>Duplicate</span>
            </DropdownMenuItem>
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
          <p>Section options</p>
        </TooltipContent>
      </Tooltip>
    </DropdownMenu>
  );
};
