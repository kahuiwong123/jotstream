import React from "react";
import { Button } from "../../ui/button";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

import { Section } from "@prisma/client";
import { useSectionStore } from "@/data/sectionStore";
export const SectionCardDropDown = ({
  setIsEditing,
  section,
}: {
  setIsEditing: (bool: boolean) => void;
  section: Section;
}) => {
  const removeSection = useSectionStore((state) => state.removeSection);
  const duplicateSection = useSectionStore((state) => state.duplicateSection);

  const EllipsisButton = (
    <Button
      variant="outline"
      size="icon"
      className="border-none bg-[#fcfcfc] focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#202020]"
    >
      <IoEllipsisHorizontalOutline className="h-5 w-5" />
    </Button>
  );
  return (
    <AlertDialog>
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
              <DropdownMenuItem onClick={() => duplicateSection(section.name)}>
                <IoDuplicateOutline className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <IoTrashOutline className="mr-2 h-4 w-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete section?</AlertDialogTitle>
              <AlertDialogDescription>
                The <span className="font-bold">{section.name}</span> section
                will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => removeSection(section.name)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <TooltipContent>
            <p>Section options</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenu>
    </AlertDialog>
  );
};
