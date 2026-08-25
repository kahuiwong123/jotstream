/* eslint-disable react/display-name */
"use client";

import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { moveSection, moveTask } from "@/data/actions";
import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { KeyboardSensor, PointerSensor } from "@dnd-kit/dom";
import { arrayMove, move } from "@dnd-kit/helpers";
import { DragDropEventHandlers, DragDropProvider } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";
import { useCallback, useEffect, useRef, useState } from "react";
import { Task } from "~/generated/prisma/client";

export default function Page() {
  const tasksData = useTaskStore((state) => state.tasks);
  const sections = useSectionStore((state) => state.sections);
  const setSections = useSectionStore((state) => state.setSections);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [items, setItems] = useState<Record<string, Task[]>>({});
  const snapshot = useRef(structuredClone(items));
  const isDragging = useRef(false);
  const dropTarget = useRef<{
    id: string;
    type: string;
    initialGroup: string;
    initialIndex: number;
  } | null>(null);
  const sensors = [
    PointerSensor.configure({
      activatorElements(source) {
        return [source.element, source.handle];
      },
    }),
    KeyboardSensor,
  ];

  useEffect(() => {
    if (tasksData && sections && !isDragging.current) {
      setItems(
        Object.fromEntries(
          sections.map((section) => [
            section.id,
            tasksData.filter((task) => task.sectionId === section.id),
          ]),
        ),
      );
    }
  }, [tasksData, sections]);

  return (
    <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
      <div className="flex grow gap-8">
        <DragDropProvider
          onDragStart={useCallback<DragDropEventHandlers["onDragStart"]>(
            (event) => {
              const { source } = event.operation;
              isDragging.current = true;
              snapshot.current = structuredClone(items);
              if (isSortable(source) && dropTarget.current === null) {
                dropTarget.current = {
                  initialGroup: source.sortable.initialGroup as string,
                  initialIndex: source.sortable.initialIndex,
                  id: "",
                  type: "",
                };
              }
            },
            [items],
          )}
          onDragOver={useCallback<DragDropEventHandlers["onDragOver"]>(
            (event) => {
              const { source, target } = event.operation;

              if (source?.type === "section") {
                return;
              }

              if (
                isSortable(source) &&
                isSortable(target) &&
                target.id !== source?.id
              ) {
                if (dropTarget.current) {
                  dropTarget.current = {
                    ...dropTarget.current,
                    id: target.id as string,
                    type: target.type as string,
                  };
                }
              }
              setItems((items) => move(items, event));
            },
            [],
          )}
          onDragEnd={useCallback<DragDropEventHandlers["onDragEnd"]>(
            async (event) => {
              isDragging.current = false;
              const { source, target, canceled } = event.operation;

              if (canceled) {
                if (source?.type === "task") {
                  setItems(snapshot.current);
                }

                return;
              }

              if (!isSortable(source) || !target) {
                return;
              }

              const sourceIndex = source.sortable.initialIndex;
              const targetIndex = source.sortable.index;
              const currentDropTarget = dropTarget.current;

              if (source.type === "section") {
                if (sourceIndex === targetIndex) return;
                const sourceId = Object.keys(snapshot.current)[sourceIndex];
                const targetId = Object.keys(snapshot.current)[targetIndex];
                setSections(arrayMove(sections, sourceIndex, targetIndex));
                await moveSection(sourceId, targetId);
              }

              if (source.type === "task") {
                let { initialIndex, index, initialGroup, group } =
                  source.sortable;
                if (
                  currentDropTarget?.initialGroup == undefined ||
                  group == null
                )
                  return;
                if (
                  currentDropTarget.initialGroup === group &&
                  currentDropTarget.initialIndex === index
                ) {
                  return;
                }

                const activeIndex = tasksData.findIndex(
                  (task) =>
                    task.id ===
                    snapshot.current[currentDropTarget.initialGroup][
                      currentDropTarget.initialIndex
                    ].id,
                );
                if (currentDropTarget.type === "task") {
                  if (index > snapshot.current[group].length - 1) {
                    index -= 1;
                  }
                  const overIndex = tasksData.findIndex(
                    (task) => task.id === snapshot.current[group][index].id,
                  );

                  if (activeIndex === overIndex) {
                    return;
                  }

                  const destGroupTasks = items[group]; // already correctly ordered by onDragOver's move()
                  const movedTaskId = tasksData[activeIndex].id;
                  const overTaskId = tasksData[overIndex].id;

                  const i = destGroupTasks.findIndex(
                    (task) => task.id === movedTaskId,
                  );
                  const j = destGroupTasks.findIndex(
                    (task) => task.id === overTaskId,
                  );
                  const movingDown = j < i;

                  console.log(
                    `moved ${tasksData[activeIndex].title} ${movingDown ? "below" : "above"} ${tasksData[overIndex].title}`,
                  );

                  const updatedMovedTask = {
                    ...tasksData[activeIndex],
                    sectionId: tasksData[overIndex].sectionId,
                  };

                  const updatedGroupTasks = destGroupTasks.map((task) =>
                    task.id === movedTaskId ? updatedMovedTask : task,
                  );

                  const flattenedTasks = sections.flatMap((section) =>
                    section.id === group
                      ? updatedGroupTasks
                      : (items[section.id] ?? []).filter(
                          (t) => t.id !== movedTaskId,
                        ),
                  );

                  setTasks(flattenedTasks);
                  setItems((current) => ({
                    ...current,
                    [group]: updatedGroupTasks,
                  }));

                  if (currentDropTarget.initialGroup === group) {
                    await moveTask(movedTaskId, overTaskId, false);
                  } else {
                    await moveTask(movedTaskId, overTaskId, false, movingDown);
                  }
                } else if (currentDropTarget.type === "section") {
                  console.log(
                    `moving ${tasksData[activeIndex].title} to ${sections.find((s) => s.id === currentDropTarget.id)?.name}`,
                  );

                  const movedTaskId = tasksData[activeIndex].id;
                  const updatedMovedTask = {
                    ...tasksData[activeIndex],
                    sectionId: currentDropTarget.id,
                  };

                  const destGroupTasks = [
                    ...(items[currentDropTarget.id] ?? []).filter(
                      (t) => t.id !== movedTaskId,
                    ),
                    updatedMovedTask,
                  ];

                  const flattenedTasks = sections.flatMap((section) =>
                    section.id === currentDropTarget.id
                      ? destGroupTasks
                      : (items[section.id] ?? []).filter(
                          (t) => t.id !== movedTaskId,
                        ),
                  );

                  setTasks(flattenedTasks);
                  setItems((current) => ({
                    ...current,
                    [currentDropTarget.id]: destGroupTasks,
                  }));

                  await moveTask(movedTaskId, currentDropTarget.id, true);
                }
              }

              dropTarget.current = null;
            },
            [sections, setSections, items, setTasks, tasksData],
          )}
          sensors={sensors}
        >
          {Object.entries(items).map(([sectionId, tasks], index) => {
            const section = sections.find((item) => item.id === sectionId);

            if (!section) return null;

            return (
              <SectionCard
                key={sectionId}
                index={index}
                section={section}
                tasks={tasks}
              />
            );
          })}
        </DragDropProvider>
        <AddSectionButton />
      </div>
    </div>
  );
}
