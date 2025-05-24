"use client";

import { useSectionStore } from "@/data/store/sectionStore";
import React from "react";
import {
  IoCaretForwardOutline,
  IoDuplicateOutline,
  IoEllipsisHorizontalOutline,
  IoPencilOutline,
  IoRemoveCircleOutline,
  IoSwapHorizontalOutline,
  IoTrashOutline
} from "react-icons/io5";
import { Button } from "../../ui/button";
import { DatePicker } from "../../ui/date-picker";
import { TooltipItem } from "../../ui/tooltip-item";
import { PrioritySelect } from "./priority-select";

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
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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

import { duplicateTask, removeTask, updateTask } from "@/data/actions";
import { useTaskStore } from "@/data/store/taskStore";
import { Task } from "@prisma/client";
import { useShallow } from "zustand/react/shallow";
import { EditTaskDialog } from "./edit-task-dialog";

export const TaskCardDropDown = ({ task }: { task: Task }) => {
  const [sections, setActiveSection] = useSectionStore(
    useShallow((state) => [state.sections, state.setActiveSection]),
  );

  const setActiveTask = useTaskStore((state) => state.setActiveTask);

  const handleEdit = (e: React.MouseEvent) => {
    setActiveSection(task.sectionId);
    setActiveTask(task);
  };

  const editButton = (
    <DropdownMenuItem onClick={handleEdit} onSelect={(e) => e.preventDefault()}>
      <IoPencilOutline className="mr-2 h-4 w-4" />
      <span>Edit</span>
    </DropdownMenuItem>
  );

  return (
    <AlertDialog>
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-fit w-fit group-hover:opacity-100"
              >
                <IoEllipsisHorizontalOutline className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            onCloseAutoFocus={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuGroup>
              <EditTaskDialog dialogTrigger={editButton} />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateTask(task);
                }}
              >
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
                      .toSorted((a, b) => (a.id === task.sectionId ? -1 : 1))
                      .map((section, index) => (
                        <DropdownMenuItem
                          key={index}
                          disabled={section.id === task.sectionId}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateTask(task.id, { sectionId: section.id });
                          }}
                        >
                          <IoCaretForwardOutline className="mr-2 size-4" />
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
              <div onClick={(e) => e.stopPropagation()}>
                <PrioritySelect
                  variant="list"
                  value={task.priority}
                  onValueChange={(value: number) =>
                    updateTask(task.id, { priority: value })
                  }
                />
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup className="flex items-center justify-between">
              <div onClick={(e) => e.stopPropagation()}>
                <DatePicker
                  variant="text"
                  value={task.dueDate}
                  onChange={(val) => updateTask(task.id, { dueDate: val })}
                  className="border-none"
                />
              </div>
              <TooltipItem
                tooltipTrigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-fit w-fit px-3 py-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateTask(task.id, { dueDate: null });
                    }}
                  >
                    <IoRemoveCircleOutline className="size-5" />
                  </Button>
                }
                tooltipString="Remove due date"
              />
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem>
                  <IoTrashOutline className="mr-2 size-4 text-red-500" />
                  <span className="text-red-500">Delete</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuGroup>
          </DropdownMenuContent>

          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete task?</AlertDialogTitle>
              <AlertDialogDescription>
                The <span className="font-bold">{task.title}</span> task will be
                permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  removeTask(task.id);
                }}
                className="bg-red-flag hover:bg-[#d6584f] dark:bg-red-flag dark:text-white dark:hover:bg-[#d6584f]"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
          <TooltipContent>
            <p>Task options</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenu>
    </AlertDialog>
  );
};
