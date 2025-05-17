import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { auth } from "../../../auth";
import { Suspense } from "react";
import prisma from "../../../db/db";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const { id, email } = session.user;
  const [sections, tasks] = await prisma.$transaction([
    prisma.section.findMany({
      where: { userId: session.user.id },
      orderBy: { rank: "asc" },
    }),
    prisma.task.findMany({
      where: { userId: session.user.id },
      orderBy: { rank: "asc" },
    }),
  ]);

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <DashboardClient
        userId={id}
        email={email}
        sectionsData={sections}
        tasksData={tasks}
      />
    </Suspense>
  );
};

export default Dashboard;
