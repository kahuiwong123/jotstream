/* eslint-disable react/display-name */
"use client";

import { useSectionStore } from "@/data/sectionStore";
import {
  SortableContext,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Section, Task } from "@prisma/client";
import clsx from "clsx";
import { memo, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { useShallow } from "zustand/react/shallow";
import { Button } from "../../ui/button";
import { TooltipItem } from "../../ui/tooltip-item";
import { AddTaskButton } from "../task/add-task-button";
import TaskCard from "../task/task-card";
import { SectionCardDropDown } from "./section-card-dropdown";
import { SectionCardEdit } from "./section-card-edit";

const SectionCard = memo(
  ({ section, tasks }: { section: Section; tasks: Task[] }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: section.id,
      data: {
        type: "section",
        section,
      },
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

    const style = {
      transition,
      transform: CSS.Translate.toString(transform),
    };

    if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className="flex w-72 cursor-grabbing touch-none flex-col gap-4 rounded-lg bg-[#fcfcfc] p-4 opacity-60 shadow-2xl hover:shadow-lg dark:bg-[#202020] dark:hover:border-light-grey-hover"
        />
      );
    }

    return (
      <section
        data-section-id={section.id}
        className={clsx(
          "section-card flex h-fit w-72 flex-col gap-4 rounded-lg border border-transparent bg-[#fcfcfc] p-4 shadow-md dark:bg-[#202020]",
          highlightSectionId === section.id && "animate-pulse !border-[#FF5858] transition delay-300"
        )}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
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
        <SortableContext items={tasks.map((task) => task.id)}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

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
