/* eslint-disable react/display-name */
"use client";

import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { useSectionStore } from "@/data/sectionStore";
import { sectionProps } from "@/data/types";
import { memo, useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
export const DashboardClient = memo(
  ({ sectionsData }: { sectionsData: sectionProps[] }) => {
    const [isLoading, setIsLoading] = useState(true);

    const { sections, setSections } = useSectionStore(
      useShallow((state) => ({
        sections: state.sections,
        setSections: state.setSections,
      })),
    );

    useEffect(() => {
      setSections(sectionsData);
      setIsLoading(false);
    }, [sectionsData, setSections]);

    return (
      <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
        <div className="flex grow gap-8">
          {sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
          {!isLoading && <AddSectionButton />}
        </div>
      </div>
    );
  },
);
