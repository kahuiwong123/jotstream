"use client";

import { useState, createContext, useEffect, Suspense } from "react";
import SideNav from "@/components/sidenav/sidenav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useWindowSize } from "@/lib/useWindowSize";
import { clsx } from "clsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";
import { useSectionStore } from "@/data/sectionStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { width } = useWindowSize();
  const sidebarCollapsed = useSectionStore((state) => state.sidebarCollapsed);
  const setSidebarCollapsed = useSectionStore(
    (state) => state.setSidebarCollapsed,
  );
  const toggleSideNav = () => {
    setSidebarCollapsed(sidebarCollapsed ? false : true);
  };

  useEffect(() => {
    setSidebarCollapsed(width < 768);
  }, [width, setSidebarCollapsed]);

  return (
    <TooltipProvider>
      <div className="grid h-svh grid-cols-[15rem_auto] grid-rows-[auto_1fr] overflow-hidden">
        <SideNav toggleSideNav={toggleSideNav} />
        <header
          className={clsx(
            "flex justify-between p-8 transition-all duration-300 ease-in-out dark:bg-dark-main",
            sidebarCollapsed ? "col-span-2 pl-24" : "col-span-1 col-start-2",
          )}
        >
          <h1 className="text-4xl font-bold">Inbox</h1>
          <ThemeToggle />
        </header>
        <main
          className={clsx(
            "overflow-auto transition-all duration-300 ease-in-out",
            sidebarCollapsed
              ? "col-span-2 pl-24"
              : "col-span-1 col-start-2 pl-8",
          )}
        >
          <Suspense fallback={<SectionSkeleton />}>{children}</Suspense>
        </main>
      </div>
    </TooltipProvider>
  );
}
