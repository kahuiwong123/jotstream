/* eslint-disable react/display-name */
"use client";

import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import TaskCard from "@/components/dashboard/task/task-card";
import { moveSection, moveTask } from "@/data/actions";
import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { sectionProps } from "@/data/types";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Task } from "@prisma/client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Page() {
  const tasksData = useTaskStore((state) => state.tasks);
  const sections = useSectionStore((state) => state.sections);
  const setSections = useSectionStore((state) => state.setSections);

  const [tasks, setTasks] = useState<Task[]>(tasksData);

  const [activeSection, setActiveSection] = useState<
    sectionProps | undefined
  >();
  const [activeTask, setActiveTask] = useState<Task | undefined>();

  useEffect(() => {
    setTasks(tasksData);
  }, [tasksData]);

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveSection(undefined);
    setActiveTask(undefined);

    if (!over) {
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "section" && overType === "section") {
      const oldIndex = sections.findIndex(
        (section) => section.id === active.id,
      );
      const newIndex = sections.findIndex((section) => section.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setSections(arrayMove(sections, oldIndex, newIndex));
      }
      await moveSection(active.id.toString(), over.id.toString());
    }
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (active.data.current?.type === "section") {
      setActiveSection(active.data.current?.section);
      return;
    }

    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current?.task);
      return;
    }
  };

  const handleDragOver = async ({ active, over }: DragOverEvent) => {
    if (!over || active.id === over.id) {
      return;
    }

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType !== "task") {
      return;
    }

    if (overType === "task") {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        const overIndex = tasks.findIndex((task) => task.id === over.id);
        tasks[activeIndex].sectionId = tasks[overIndex].sectionId;
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task.id === active.id);
        tasks[activeIndex].sectionId = over.id.toString();
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }

    await moveTask(
      active.id.toString(),
      over.id.toString(),
      overType === "section",
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );

  return (
    <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
      <div className="flex grow gap-8">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <SortableContext items={sections.map((section) => section.id)}>
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                tasks={tasks.filter((task) => task.sectionId === section.id)}
              />
            ))}
          </SortableContext>
          {typeof window === "object" &&
            createPortal(
              <DragOverlay>
                {activeSection && (
                  <SectionCard
                    section={activeSection}
                    tasks={tasks.filter(
                      (task) => task.sectionId === activeSection.id,
                    )}
                  />
                )}
                {activeTask && <TaskCard task={activeTask} />}
              </DragOverlay>,
              document.body,
            )}
        </DndContext>
        <AddSectionButton />
      </div>
    </div>
  );
}
