/* eslint-disable react/display-name */
"use client";

import { useSectionStore } from "@/data/store/sectionStore";
import { useSortable } from "@dnd-kit/react/sortable";
import { CollisionPriority } from "@dnd-kit/abstract";
import { Section, Task } from "~/generated/prisma/client";
import clsx from "clsx";
import { memo, PropsWithChildren, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../../ui/button";
import { TooltipItem } from "../../ui/tooltip-item";
import { AddTaskButton } from "../task/add-task-button";
import TaskCard from "../task/task-card";
import { SectionCardDropDown } from "./section-card-dropdown";
import { SectionCardEdit } from "./section-card-edit";

interface SectionCardProps {
  index: number;
  section: Section;
  tasks: Task[];
}

const SectionCard = memo(
  ({ index, section, tasks }: PropsWithChildren<SectionCardProps>) => {
    const { ref, isDragging, isDropTarget, handleRef } = useSortable({
      id: section.id,
      index,
      type: "section",
      accept: ["section", "task"],
      collisionPriority: CollisionPriority.Low,
    });

    const [isEditing, setIsEditing] = useState(false);

    const { activeSectionId, setActiveSectionId, highlightSectionId } =
      useSectionStore(
        useShallow((state) => ({
          activeSectionId: state.activeSectionId,
          setActiveSectionId: state.setActiveSectionId,
          highlightSectionId: state.highlightSectionId,
        })),
      );

    return (
      <section
        className={clsx(
          "section-card flex h-fit w-72 flex-col gap-4 rounded-lg border border-transparent bg-[#fcfcfc] p-4 shadow-md transition-all duration-300 ease-in-out dark:bg-[#202020]",
          highlightSectionId === section.id &&
            "animate-pulse !border-[#FF5858] transition delay-300",
          isDragging &&
            "scale-[1.03] shadow-[inset_0_0_1px_rgba(0,0,0,0.5),-1px_0_15px_0_rgba(34,33,81,0.01),0px_15px_15px_0_rgba(34,33,81,0.25)] backdrop-blur-[2px]",
          isDropTarget && !isDragging && "brightness-95 dark:brightness-150",
        )}
        ref={ref}
      >
        {isEditing ? (
          <SectionCardEdit section={section} setIsEditing={setIsEditing} />
        ) : (
          <div className="section-card-header flex items-center justify-between">
            <div className={clsx("flex items-center gap-2")}>
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
              <span className="text-sm font-extralight">{tasks.length}</span>
            </div>
            <SectionCardDropDown
              setIsEditing={setIsEditing}
              section={section}
            />
          </div>
        )}

        <ul id={section.id} className="grid gap-4 ">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              index={index}
              task={task}
              group={section.id}
            />
          ))}
        </ul>

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
