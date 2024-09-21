/* eslint-disable react/display-name */
"use client";

import React, { useState, memo } from "react";
import { Button } from "../../ui/button";
import { IoAdd } from "react-icons/io5";
import TaskCard from "../task/task-card";
import { SectionCardEdit } from "./section-card-edit";
import { SectionCardDropDown } from "./section-card-dropdown";
import { TooltipItem } from "../../ui/tooltip-item";
import { AddTaskButton } from "../task/add-task-button";
import { Section, Task } from "@prisma/client";
import { useSectionStore } from "@/data/sectionStore";
import { useShallow } from "zustand/react/shallow";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SectionCard = memo(
  ({ section }: { section: Section & { tasks: Task[] } }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: section.id });

    const [isEditing, setIsEditing] = useState(false);

    const { activeSectionId, setActiveSectionId } = useSectionStore(
      useShallow((state) => ({
        activeSectionId: state.activeSectionId,
        setActiveSectionId: state.setActiveSectionId,
      })),
    );

    const style = {
      transition,
      transform: CSS.Translate.toString(transform),
    };

    return (
      <section
        className="flex h-fit w-72 touch-none flex-col gap-4 rounded-md border border-transparent bg-[#fcfcfc] p-4 shadow-md hover:shadow-lg dark:bg-[#202020] dark:hover:border-light-grey-hover"
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
      >
        {isEditing ? (
          <SectionCardEdit section={section} setIsEditing={setIsEditing} />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TooltipItem
                tooltipTrigger={
                  <h2
                    className="font-semibold"
                    onClick={() => setIsEditing(true)}
                  >
                    {section.name}
                  </h2>
                }
                tooltipString={section.name}
              />
              <span className="text-sm font-extralight">
                {section.tasks.length}
              </span>
            </div>
            <SectionCardDropDown
              setIsEditing={setIsEditing}
              section={section}
            />
          </div>
        )}

        {section.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
        {activeSectionId === section.id ? (
          <AddTaskButton sectionId={section.id} />
        ) : (
          <Button
            variant="ghost"
            className="flex justify-start gap-2 px-2"
            onClick={() => setActiveSectionId(section.id)}
          >
            <IoAdd className="h-6 w-6" />
            <p>Add Task</p>
          </Button>
        )}
      </section>
    );
  },
);

export default SectionCard;
