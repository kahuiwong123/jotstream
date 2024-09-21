/* eslint-disable react/display-name */
"use client";
import {
  DndContext,
  DragEndEvent,
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
import { memo, useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { moveSection } from "@/data/actions";
export const DashboardClient = memo(
  ({ sectionsData }: { sectionsData: sectionProps[] }) => {
    const [isLoading, setIsLoading] = useState(true);

    const { sections, setSections } = useSectionStore(
      useShallow((state) => ({
        sections: state.sections,
        setSections: state.setSections,
      })),
    );

    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const res = await moveSection(active.id.toString(), over.id.toString());
        console.log(res.message);
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
      setIsLoading(false);
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
              items={sections.map((section) => section.id)}
              strategy={horizontalListSortingStrategy}
            >
              {sections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </SortableContext>
            {!isLoading && <AddSectionButton />}
          </div>
        </DndContext>
      </div>
    );
  },
);
