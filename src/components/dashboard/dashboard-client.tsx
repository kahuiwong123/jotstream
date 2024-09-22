/* eslint-disable react/display-name */
"use client";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { useSectionStore } from "@/data/sectionStore";
import { sectionProps } from "@/data/types";
import { memo, useState, useEffect, useOptimistic } from "react";
import { useShallow } from "zustand/react/shallow";
import { moveSection } from "@/data/actions";
export const DashboardClient = memo(
  ({ sectionsData }: { sectionsData: sectionProps[] }) => {
    const [optimisticSections, setOptimisticSections] = useOptimistic(
      sectionsData,
      (prevSections: sectionProps[], updatedSections: sectionProps[]) =>
        updatedSections,
    );

    const setSections = useSectionStore((state) => state.setSections);

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const activeIndex = optimisticSections.findIndex(
          (section) => section.id === active.id.toString(),
        );
        const overIndex = optimisticSections.findIndex(
          (section) => section.id === over.id.toString(),
        );
        setOptimisticSections(
          arrayMove(optimisticSections, activeIndex, overIndex),
        );

        await moveSection(active.id.toString(), over.id.toString());
      }
    };

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 1,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          distance: 1,
        },
      }),
    );

    useEffect(() => {
      setSections(sectionsData);
    }, [sectionsData, setSections]);

    return (
      <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex grow gap-8">
            <SortableContext
              items={optimisticSections}
              strategy={horizontalListSortingStrategy}
            >
              {optimisticSections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </SortableContext>
            <AddSectionButton />
          </div>
        </DndContext>
      </div>
    );
  },
);
