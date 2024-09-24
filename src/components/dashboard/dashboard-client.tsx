/* eslint-disable react/display-name */
"use client";
import {
  Active,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  closestCorners,
  pointerWithin,
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
import {
  memo,
  useState,
  useEffect,
  useOptimistic,
  startTransition,
} from "react";
import { moveSection, moveTask } from "@/data/actions";
import TaskCard from "./task/task-card";
export const DashboardClient = memo(
  ({ sectionsData }: { sectionsData: sectionProps[] }) => {
    const [optimisticSections, setOptimisticSections] = useOptimistic(
      sectionsData,
      (prevSections: sectionProps[], updatedSections: sectionProps[]) =>
        updatedSections,
    );

    const [active, setActive] = useState<Active | null>(null);

    const setSections = useSectionStore((state) => state.setSections);

    const findSection = (id: string, type: string) => {
      if (type === "section") {
        return optimisticSections.find((section) => section.id === id);
      } else {
        return optimisticSections.find((section) =>
          section.tasks.find((task) => task.id === id),
        );
      }
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
      setActive(active);
    };

    const handleDragMove = ({ active, over }: DragMoveEvent) => {};

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
      console.log(active);
      console.log(over);
      if (
        active &&
        over &&
        active.data.current?.type == "section" &&
        over.data.current?.type == "section" &&
        active.id !== over.id
      ) {
        const activeSectionIndex = optimisticSections.findIndex(
          (section) => section.id === active.id,
        );
        const overSectionIndex = optimisticSections.findIndex(
          (section) => section.id === over.id,
        );
        let newSections = [...optimisticSections];
        newSections = arrayMove(
          newSections,
          activeSectionIndex,
          overSectionIndex,
        );
        startTransition(() => {
          setOptimisticSections(newSections);
        });

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
          const activeSectionIndex = optimisticSections.findIndex(
            (section) => section.id === activeSection.id,
          );
          const overSectionIndex = optimisticSections.findIndex(
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

            let newSections = [...optimisticSections];
            newSections[activeSectionIndex].tasks = arrayMove(
              newSections[activeSectionIndex].tasks,
              activeTaskIndex,
              overTaskIndex,
            );
            startTransition(() => {
              setOptimisticSections(newSections);
            });
            await moveTask(active.id.toString(), over.id.toString());
          }
        }
      }

      setActive(null);
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
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    useEffect(() => {
      setSections(sectionsData);
    }, [sectionsData, setSections]);

    return (
      <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
        <div className="flex grow gap-8">
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            // onDragStart={handleDragStart}
          >
            <SortableContext
              items={optimisticSections.map((section) => section.id)}
              strategy={horizontalListSortingStrategy}
            >
              {optimisticSections.map((section) => (
                <SectionCard key={section.id} section={section} />
              ))}
            </SortableContext>
            {/* <DragOverlay>
              {active && active.data.current?.type === "task" && (
                <TaskCard
                  task={optimisticSections
                    .find((section) =>
                      section.tasks.some((task) => task.id === active.id),
                    )
                    ?.tasks.find((task) => task.id === active.id)}
                />
              )}
              {active && active.data.current?.type === "section" && (
                <SectionCard
                  section={optimisticSections.find(
                    (section) => section.id === active.id,
                  )}
                />
              )}
            </DragOverlay> */}
          </DndContext>
          <AddSectionButton />
        </div>
      </div>
    );
  },
);
