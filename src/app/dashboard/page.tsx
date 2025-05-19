import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { auth } from "../../../auth";
import { Suspense } from "react";
import prisma from "../../../db/db";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const { email } = session.user;

  const user = await prisma.user.findUnique({
    where: {
      email: email ?? undefined,
    },

    select: {
      id: true,
    },
  });

  if (!user) {
    return null
  }

  const [sections, tasks] = await prisma.$transaction([
    prisma.section.findMany({
      where: { userId: user.id },
      orderBy: { rank: "asc" },
    }),
    prisma.task.findMany({
      where: { userId: user.id },
      orderBy: { rank: "asc" },
    }),
  ]);

  return (
    <Suspense fallback={<SectionSkeleton />}>
      <DashboardClient
        userId={user.id}
        email={email}
        sectionsData={sections}
        tasksData={tasks}
      />
    </Suspense>
  );
};

export default Dashboard;
