"use client";

import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { useSectionStore } from "@/data/sectionStore";
import { sectionProps } from "@/data/types";
import { useEffect } from "react";
export const DashboardClient = ({
  sectionsData,
}: {
  sectionsData: sectionProps[];
}) => {
  const sections = useSectionStore((state) => state.sections);
  const setSections = useSectionStore((state) => state.setSections);

  useEffect(() => {
    setSections(sectionsData);
  }, [sectionsData, setSections]);

  return (
    <div
      className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main"
    >
      <div className="flex grow gap-8">
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
        <AddSectionButton />
      </div>
    </div>
  );
};
