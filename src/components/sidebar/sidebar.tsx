"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { handleSignOut } from "@/data/authActions";
import { useTaskStore } from "@/data/store/taskStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { CgProfile } from "react-icons/cg";
import { FaBook, FaColumns, FaList } from "react-icons/fa";
import {
  IoCalendar,
  IoFileTray,
  IoLogOutOutline,
  IoSettings,
  IoToday,
} from "react-icons/io5";
import { LuChevronsUpDown } from "react-icons/lu";
import logo from "../../../public/logo-2.svg";
import SidebarAddTaskButton from "./sidebar-add-task";
import SidebarSearchButton from "./sidebar-search-button";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { data: session } = useSession();
  const tasks = useTaskStore((state) => state.tasks);
  const tasksCount = useTaskStore((state) => state.tasksCount);
  const todayCount = useTaskStore((state) => state.todayCount);
  const pathname = usePathname();
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );

  const overdue = tasks.some(
    (task) => task.dueDate && task.dueDate < startOfToday,
  );

  const taskMenuItems = [
    { icon: IoFileTray, label: "Inbox", url: "/dashboard", badge: tasksCount || "" },
    {
      icon: IoToday,
      label: "Today",
      url: "/dashboard/today",
      badge: todayCount || "",
    },
    { icon: IoCalendar, label: "Calendar", url: "/dashboard/calendar" },
  ];

  const noteMenuItems = [
    { icon: FaBook, label: "See All", url: "#" },
    { icon: FaList, label: "List View", url: "#" },
    { icon: FaColumns, label: "By Course", url: "#" },
  ];

  return (
    <Sidebar
      className="border-none shadow-md"
      collapsible="offcanvas"
      variant="inset"
    >
      <SidebarHeader className="flex flex-col items-start">
        <Image src={logo} height={200} width={200} alt="jotstream-logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarAddTaskButton />
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Suspense>
                  <SidebarSearchButton />
                </Suspense>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="dark:bg-gray-100 dark:opacity-10" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group flex items-center justify-between text-lg">
                      Tasks
                      <ChevronRight
                        className="ml-2 transition-transform duration-300 group-data-[state=open]:rotate-90"
                        aria-hidden
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {taskMenuItems.map((item, index) => (
                      <SidebarMenuButton
                        key={index}
                        asChild
                        className="rounded-xl text-base"
                      >
                        <Link
                          href={item.url}
                          className={clsx(
                            "space-x-1",
                            pathname === item.url &&
                              "border !bg-[#FFFFFF] shadow-sm dark:!bg-[#1E1E1E] dark:border-none",
                          )}
                        >
                          {item.icon ? <item.icon size={20} /> : null}
                          <span>{item.label}</span>
                          {item.badge && (
                            <SidebarMenuBadge
                              className={clsx(
                                "size-fit pr-2",
                                item.label === "Today" &&
                                  overdue &&
                                  "text-[#FF5858]",
                              )}
                            >
                              {item.badge}
                            </SidebarMenuBadge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator className="dark:bg-gray-100 dark:opacity-10" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group flex items-center justify-between gap-2 text-lg">
                      Notes
                      <ChevronRight
                        className="ml-2 transition-transform duration-300 group-data-[state=open]:rotate-90"
                        aria-hidden
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="space-y-1">
                    {noteMenuItems.map((item, index) => (
                      <SidebarMenuButton
                        key={index}
                        asChild
                        className="rounded-xl text-base"
                      >
                        <Link href={item.url} className="space-x-1">
                          {item.icon ? <item.icon size={20} /> : null}
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex h-fit items-center gap-2 rounded-xl">
                  {session?.user?.image ? (
                    <Image
                      className="rounded-full"
                      alt="profile-image"
                      src={session.user.image}
                      width={30}
                      height={30}
                    />
                  ) : (
                    <CgProfile size={20} />
                  )}
                  <div className="flex flex-col">
                    <p>{session?.user?.name}</p>
                    <p>{session?.user?.email}</p>
                  </div>
                  <LuChevronsUpDown size={20} />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <SidebarMenuButton>
                    <IoSettings size={20} />
                    Settings
                  </SidebarMenuButton>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SidebarMenuButton onClick={handleSignOut}>
                    <IoLogOutOutline size={20} />
                    Sign Out
                  </SidebarMenuButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
