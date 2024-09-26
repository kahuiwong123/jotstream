import prisma from "../../../db/db";
import { DashboardClient } from "../../components/dashboard/dashboard-client";
import { auth } from "../../../auth";

const Dashboard = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }
  const sections = await prisma.section.findMany({
    where: {
      userId: session?.user?.id, //placeholder
    },
    include: {
      tasks: {
        orderBy: {
          rank: "asc",
        },
      },
    },
    orderBy: {
      rank: "asc",
    },
  });
  return <DashboardClient sectionsData={sections} userId={session.user?.id} />;
};

export default Dashboard;
