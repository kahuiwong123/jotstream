/* eslint-disable react/display-name */
"use client";

import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { moveSection, moveTask } from "@/data/actions";
import { useSectionStore } from "@/data/store/sectionStore";
import { useTaskStore } from "@/data/store/taskStore";
import { Task, Section } from "~/generated/prisma/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { move } from "@dnd-kit/helpers";
import { KeyboardSensor, PointerSensor } from "@dnd-kit/dom";
import {
  DragDropEventHandlers,
  DragDropProvider,
  DragOverlay,
} from "@dnd-kit/react";

export default function Page() {
  const tasksData = useTaskStore((state) => state.tasks);
  const sections = useSectionStore((state) => state.sections);

  const [items, setItems] = useState<Record<string, Task[]>>({});

  const sensors = [
    PointerSensor.configure({
      activatorElements(source) {
        return [source.element, source.handle];
      },
    }),
    KeyboardSensor,
  ];

  useEffect(() => {
    setItems(
      Object.fromEntries(
        sections.map((section) => [
          section.id,
          tasksData.filter((task) => task.sectionId === section.id),
        ]),
      ),
    );
  }, [tasksData, sections]);

  const snapshot = useRef(structuredClone(items));

  return (
    <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
      <div className="flex grow gap-8">
        <DragDropProvider
          onDragStart={useCallback<DragDropEventHandlers["onDragStart"]>(() => {
            snapshot.current = structuredClone(items);
          }, [items])}
          onDragOver={useCallback<DragDropEventHandlers["onDragOver"]>(
            (event) => {
              const { source } = event.operation;
              if (source && source.type === "section") return;
              setItems((items) => move(items, event));
            },
            [],
          )}
          onDragEnd={useCallback<DragDropEventHandlers["onDragEnd"]>(
            (event) => {
              if (event.canceled) {
                setItems(snapshot.current);
                return;
              }
            },
            [],
          )}
          sensors={sensors}
        >
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              index={index}
              section={section}
              tasks={items[section.id] ?? []}
            />
          ))}
        </DragDropProvider>
        <AddSectionButton />
      </div>
    </div>
  );
}
