"use client";

import { useState, createContext, useEffect } from "react";
import SideNav from "@/components/sidenav/sidenav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useWindowSize } from "@/lib/useWindowSize";
import { clsx } from "clsx";
const SideNavContext = createContext({ collapsed: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  const { width } = useWindowSize();
  const [collapsed, setCollapsed] = useState(width < 768);
  const toggleSideNav = () => {
    setCollapsed((prev) => !prev);
  };

  useEffect(() => {
    setCollapsed(width < 768);
  }, [width]);

  return (
    <SideNavContext.Provider value={{ collapsed }}>
      <div className="grid h-svh grid-cols-[15rem_auto] grid-rows-[auto_1fr] overflow-hidden">
        <SideNav toggleSideNav={toggleSideNav} />
        <header
          className={clsx(
            "flex dark:bg-dark-main justify-between py-4 px-8 transition-all duration-300 ease-in-out",
            collapsed ? "col-span-2 pl-24" : "col-span-1 col-start-2",
          )}
        >
          <h1 className="text-4xl font-bold">Inbox</h1>
          <ThemeToggle />
        </header>
        <main
          className={clsx(
            "overflow-auto transition-all duration-300 ease-in-out",
            collapsed ? "col-span-2 pl-24" : "col-span-1 col-start-2 pl-8",
          )}
        >
          {children}
        </main>
      </div>
    </SideNavContext.Provider>
  );
}

export { SideNavContext };
