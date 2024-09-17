import prisma from "../../../db/db";
import AddSectionButton from "@/components/dashboard/section/add-section-button";
import SectionCard from "@/components/dashboard/section/section-card";
import { Suspense } from "react";
const Dashboard = async () => {
  const sections = await prisma.section.findMany({
    where: {
      userId: "392dc2c9-4ddd-45a2-83bb-a5171e1ef04b",
    },
    include: {
      tasks: true,
    },
  });
  return (
    <Suspense fallback={<p>Loading sections...</p>}>
      <div className="flex h-full grow gap-8 bg-white-main dark:bg-dark-main">
        <div className="flex grow gap-8">
          {sections.map((section, index) => (
            <SectionCard key={index} section={section} />
          ))}
          <AddSectionButton />
        </div>
      </div>
    </Suspense>
  );
};

export default Dashboard;
