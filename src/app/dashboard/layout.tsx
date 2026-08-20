import DashboardHeader from "@/components/dashboard/dashboard-header";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import GlobalStateProvider from "@/data/GlobalStateProvider";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "../../../db/db";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) {
    redirect("/");
  }

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const sections = await prisma.section.findMany({
    where: { userId: id },
    orderBy: { rank: "asc" },
  });

  const tasks = await prisma.task.findMany({
    where: { userId: id },
    orderBy: { rank: "asc" },
  });

  const tasksDueTodayOrTomorrow = await prisma.task.aggregate({
    where: {
      userId: id,
      OR: [
        { dueDate: { lt: startOfToday } },
        { dueDate: { gte: startOfToday, lt: startOfTomorrow } },
      ],
    },

    _count: true,
  });

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={false}>
        <TooltipProvider>
          <SessionProvider refetchOnWindowFocus={false}>
            <AppSidebar />
            <div className="grid h-svh grid-cols-2 grid-rows-[auto_auto_1fr] overflow-hidden bg-white-main antialiased dark:bg-dark-main">
              <div className="col-span-2 row-start-1 flex w-screen items-center justify-between px-8 py-4">
                <SidebarTrigger />
                <ThemeToggle className="fixed right-8" />
              </div>
              <DashboardHeader />
              <main
                className={clsx(
                  "overflow-auto px-8 transition-all duration-300 ease-in-out",
                  "col-span-2 row-start-3",
                )}
              >
                <GlobalStateProvider
                  sectionsData={sections}
                  tasksData={tasks}
                  userId={id}
                  todaysCount={tasksDueTodayOrTomorrow._count}
                >
                  {children}
                </GlobalStateProvider>
              </main>
            </div>
          </SessionProvider>
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
