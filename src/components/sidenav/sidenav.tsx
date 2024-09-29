"use client";

import React, { useContext } from "react";
import { clsx } from "clsx";
import {
  IoSearchSharp,
  IoAddCircle,
  IoToday,
  IoCalendar,
  IoFileTray,
  IoSettings,
  IoLogOut,
} from "react-icons/io5";
import { Button } from "../ui/button";
import { LuDot } from "react-icons/lu";
import { FiChevronsLeft, FiChevronRight } from "react-icons/fi";
import SideNavButton from "./sidenav-button";
import { TooltipItem } from "../ui/tooltip-item";
import { logoutUser } from "@/data/authActions";
import { useSectionStore } from "@/data/sectionStore";
import SignOutButton from "./signout-button";
const SideNav = ({ toggleSideNav }: { toggleSideNav: () => void }) => {
  const sidebarCollapsed = useSectionStore((state) => state.sidebarCollapsed);

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 z-10 flex h-full shrink-0 flex-col justify-around overflow-hidden bg-light-grey py-4 shadow-sm transition-all duration-300 ease-out dark:bg-dark-side",
        sidebarCollapsed ? "w-16 px-2" : "w-60 px-4",
      )}
    >
      <section
        className={clsx(
          "flex items-center text-2xl",
          sidebarCollapsed ? "justify-center" : "justify-around",
        )}
      >
        <h1
          className={clsx(
            "transtion-all overflow-hidden",
            sidebarCollapsed && "w-0",
          )}
        >
          Menu
        </h1>
        <Button
          variant="outline"
          size="icon"
          className={clsx(
            "transform border-none bg-transparent text-2xl dark:bg-dark-side",
          )}
          onClick={toggleSideNav}
        >
          {sidebarCollapsed ? <FiChevronRight /> : <FiChevronsLeft />}
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
            sidebarCollapsed && "w-0",
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
            sidebarCollapsed && "w-0",
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
        <SignOutButton />
      </section>
    </aside>
  );
};

export default SideNav;
