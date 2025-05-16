import { useState, createContext, useEffect, Suspense } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { clsx } from "clsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";
import { IoFileTray } from "react-icons/io5";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidenav/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <TooltipProvider>
        <AppSidebar />
        <div className="grid h-svh grid-cols-2 grid-rows-[auto_auto_1fr] overflow-hidden">
          <div className="col-span-2 row-start-1 flex items-center justify-between px-6 py-4 w-screen">
            <SidebarTrigger />
            <ThemeToggle />
          </div>
          <header
            className={clsx(
              "flex justify-between px-6 py-4 transition-all duration-300 ease-in-out dark:bg-dark-main",
              "col-span-2 row-start-2",
            )}
          >
            <div className="flex items-center gap-2">
              <IoFileTray className="text-4xl" />
              <h1 className="text-4xl font-bold">Inbox</h1>
            </div>
          </header>
          <main
            className={clsx(
              "overflow-auto transition-all duration-300 ease-in-out px-6",
              "col-span-2 row-start-3",
            )}
          >
            <Suspense fallback={<SectionSkeleton />}>{children}</Suspense>
          </main>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
