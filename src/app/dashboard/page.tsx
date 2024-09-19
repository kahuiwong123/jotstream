import prisma from "../../../db/db";
import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { Suspense } from "react";
import { DashboardClient } from "./dashboard-client";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";
const Dashboard = async () => {
  const sections = await prisma.section.findMany({
    where: {
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b", //placeholder
    },
    include: {
      tasks: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return (
    <Suspense fallback={<SectionSkeleton />}>
      <DashboardClient sectionsData={sections} />
    </Suspense>
  );
};

export default Dashboard;
