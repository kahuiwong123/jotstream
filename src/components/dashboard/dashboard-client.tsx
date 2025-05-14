/* eslint-disable react/display-name */
"use client";
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
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { useSectionStore } from "@/data/sectionStore";
import { sectionProps } from "@/data/types";
import { memo, useEffect, useState } from "react";
import { findAllSections, moveSection, moveTask } from "@/data/actions";
import { Section, Task } from "@prisma/client";
import { useAuthStore } from "@/data/authStore";
export const DashboardClient = memo(
  ({ userId, email }: { userId?: string; email?: string }) => {
    const [sectionsData, setSectionsData] = useState<sectionProps[]>([]);
    const setSections = useSectionStore((state) => state.setSections);
    const setUserId = useAuthStore((state) => state.setUserId);
    const setEmail = useAuthStore((state) => state.setEmail);
    const [activeSection, setActiveSection] = useState<
      sectionProps | undefined
    >();

    useEffect(() => {
      const fetchSections = async () => {
        const sections = await findAllSections(userId);
        setSectionsData(sections);
        setSections(sections);
        setUserId(userId);
        setEmail(email);
      };
      fetchSections();
    }, [setSectionsData, setSections, userId, setUserId, setEmail, email]);

    const findSection = (id: string, type: string) => {
      if (type === "section") {
        return sectionsData.find((section) => section.id === id);
      } else {
        return sectionsData.find((section) =>
          section.tasks.find((task: Task) => task.id === id),
        );
      }
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
      if (
        active &&
        over &&
        active.data.current?.type == "section" &&
        over.data.current?.type == "section" &&
        active.id !== over.id
      ) {
        const activeSectionIndex = sectionsData.findIndex(
          (section) => section.id === active.id,
        );
        const overSectionIndex = sectionsData.findIndex(
          (section) => section.id === over.id,
        );
        let newSections = [...sectionsData];
        newSections = arrayMove(
          newSections,
          activeSectionIndex,
          overSectionIndex,
        );

        setSectionsData(newSections);
        await moveSection(active.id.toString(), over.id.toString());
      }

      if (
        active &&
        over &&
        active.data.current?.type == "task" &&
        over.data.current?.type == "task" &&
        active.id !== over.id
      ) {
        const activeSection = findSection(active.id.toString(), "task");
        const overSection = findSection(over.id.toString(), "task");
        if (activeSection && overSection) {
          const activeSectionIndex = sectionsData.findIndex(
            (section) => section.id === activeSection.id,
          );
          const overSectionIndex = sectionsData.findIndex(
            (section) => section.id === overSection.id,
          );

          // Find the index of the active and over item
          const activeTaskIndex = activeSection.tasks.findIndex(
            (task) => task.id === active.id,
          );
          const overTaskIndex = overSection.tasks.findIndex(
            (task) => task.id === over.id,
          );

          if (activeSectionIndex === overSectionIndex) {
            // moving tasks in the same section
            let newSections = [...sectionsData];
            newSections[activeSectionIndex].tasks = arrayMove(
              newSections[activeSectionIndex].tasks,
              activeTaskIndex,
              overTaskIndex,
            );

            // setSectionsData(newSections);
            await moveTask(active.id.toString(), over.id.toString());
          }
        }
      }
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
      if (active.data.current?.type === "section") {
        const temp = sectionsData.find((section) => section.id === active.id);
        setActiveSection(temp);
      }
    };

    const handleDragOver = ({ active, over }: DragOverEvent) => {};

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
          >
            <SortableContext items={sectionsData.map((section) => section.id)}>
              {sectionsData.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </SortableContext>
            {/* <DragOverlay>
            {activeSection && <SectionCard section={activeSection} />}
          </DragOverlay> */}
          </DndContext>
          <AddSectionButton />
        </div>
      </div>
    );
  },
);
