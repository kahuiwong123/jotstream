import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { auth } from "../../../auth";
import { Suspense } from "react";
import LoadingSkeleton from "../../components/ui/loading";
import prisma from "../../../db/db";

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
    <Suspense fallback={<LoadingSkeleton />}>
      <DashboardClient userId={id} email={email} sectionsData={sections} tasksData={tasks}/>
    </Suspense>
  );
};

export default Dashboard;
