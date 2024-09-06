"use client";

import React, { createContext, useState, useEffect } from "react";
import { clsx } from "clsx";
import { useWindowSize } from "@/lib/useWindowSize";
import {
  IoSearchSharp,
  IoAddCircle,
  IoToday,
  IoCalendar,
  IoFileTray,
  IoSettings,
  IoLogOut,
} from "react-icons/io5";
import { Button } from "./ui/button";
import { LuDot } from "react-icons/lu";
import { FiChevronsLeft, FiChevronRight } from "react-icons/fi";
import SideNavButton from "./ui/sidenav-button";

const SideNavContext = createContext({ collapsed: false });

const SideNav = () => {
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
      <aside
        className={clsx(
          "flex h-screen flex-col justify-around overflow-hidden bg-light-grey py-4 transition-all duration-300 dark:bg-dark",
          collapsed ? "w-16 px-2" : "w-64 px-4",
        )}
      >
        <section
          className={clsx(
            "flex items-center text-2xl",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          <h1
            className={clsx(
              "transtion-all overflow-hidden",
              collapsed && "w-0",
            )}
          >
            Menu
          </h1>
          <Button
            variant="outline"
            size="icon"
            className="border-none text-2xl dark:bg-dark"
            onClick={toggleSideNav}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronsLeft />}
          </Button>
        </section>
        <section>
          <SideNavButton icon={IoAddCircle} label="Add Task" />
          <SideNavButton icon={IoSearchSharp} label="Search" />
        </section>
        <section>
          <h2
            className={clsx(
              "transtion-all overflow-hidden",
              collapsed && "w-0",
            )}
          >
            Tasks
          </h2>
          <SideNavButton icon={IoFileTray} label="Inbox" />
          <SideNavButton icon={IoToday} label="Today" />
          <SideNavButton icon={IoCalendar} label="Calendar" />
        </section>
        <section>
          <h2
            className={clsx(
              "transtion-all overflow-hidden",
              collapsed && "w-0",
            )}
          >
            Notes
          </h2>
          <SideNavButton icon={LuDot} label="See All" />
          <SideNavButton icon={LuDot} label="List View" />
          <SideNavButton icon={LuDot} label="By Course Number" />
        </section>
        <section>
          <SideNavButton icon={IoSettings} label="Settings" />
          <SideNavButton icon={IoLogOut} label="Sign out" />
        </section>
      </aside>
    </SideNavContext.Provider>
  );
};

export default SideNav;
export { SideNavContext };
