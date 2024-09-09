"use client";
import React, { useContext } from "react";
import SectionCard from "@/components/dashboard/section-card";
import AddSectionBar from "@/components/dashboard/add-section-bar";
import { SideNavContext } from "./layout";
import { clsx } from "clsx";
const Dashboard = () => {
  const { collapsed } = useContext(SideNavContext);
  return (
    <div
      className={clsx(
        "flex h-full grow gap-8 bg-white-main dark:bg-dark-main",
      )}
    >
      <div className="flex grow gap-8">
        <SectionCard name="Homework" />
        <SectionCard name="Chores" />
        <SectionCard name="Activities" />
        <SectionCard name="Others" />
        <AddSectionBar />
      </div>
    </div>
  );
};

export default Dashboard;
