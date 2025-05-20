import { useState, createContext, useEffect, Suspense } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { clsx } from "clsx";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { SectionSkeleton } from "@/components/dashboard/section/section-skeleton";
import { IoFileTray } from "react-icons/io5";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/sidebar";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { SessionProvider } from "next-auth/react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={false}>
        <TooltipProvider>
          <SessionProvider>
            <AppSidebar />
            <div className="grid h-svh grid-cols-2 grid-rows-[auto_auto_1fr] overflow-hidden bg-white-main antialiased dark:bg-dark-main">
              <div className="col-span-2 row-start-1 flex w-screen items-center justify-between px-8 py-4">
                <SidebarTrigger />
                <ThemeToggle className="fixed right-8" />
              </div>
              <header
                className={clsx(
                  "flex justify-between px-8 py-4 transition-all duration-300 ease-in-out dark:bg-dark-main",
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
                  "overflow-auto px-8 transition-all duration-300 ease-in-out",
                  "col-span-2 row-start-3",
                )}
              >
                {children}
              </main>
            </div>
          </SessionProvider>
        </TooltipProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
