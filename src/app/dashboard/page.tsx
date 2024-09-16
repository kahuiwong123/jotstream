import prisma from "../../../db/db";
import { DashboardClient } from "./dashboard-client";

const Dashboard = async () => {
  const sections = await prisma.section.findMany({
    where: {
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
    },
    include: {
      tasks: true,
    },
  });
  return <DashboardClient sectionsData={sections} />;
};

export default Dashboard


