"use client";
import React from "react";
import SectionCard from "@/components/dashboard/section/section-card";
import AddSectionBar from "@/components/dashboard/section/add-section-button";
import { clsx } from "clsx";
import { useSectionStore } from "@/data/sectionStore";
const Dashboard = () => {
  const sections = useSectionStore((state) => state.sections);
  return (
    <div
      className={clsx("flex h-full grow gap-8 bg-white-main dark:bg-dark-main")}
    >
      <div className="flex grow gap-8">
        {sections.map((section, index) => (
          <SectionCard key={index} section={section} />
        ))}
        <AddSectionBar />
      </div>
    </div>
  );
};

export default Dashboard;
