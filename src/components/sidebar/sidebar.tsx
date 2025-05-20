"use client";

import { useSession } from "next-auth/react";
import logo from "../../../public/logo-2.svg";
import { CgProfile } from "react-icons/cg";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  IoAddCircle,
  IoCalendar,
  IoFileTray,
  IoLogOutOutline,
  IoSearchSharp,
  IoSettings,
  IoToday,
} from "react-icons/io5";
import { LuChevronsUpDown, LuDot } from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ChevronRight } from "lucide-react";
import { handleSignOut } from "@/data/authActions";
import Image from "next/image";
import { FaBook, FaColumns, FaList } from "react-icons/fa";

export function AppSidebar() {
  const { data: session } = useSession();

  const taskMenuItems = [
    { icon: IoFileTray, label: "Inbox", url: "#" },
    { icon: IoToday, label: "Today", url: "#" },
    { icon: IoCalendar, label: "Calendar", url: "#" },
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
                <SidebarMenuButton className="rounded-xl border-2 border-[#FF5858] !bg-[#FF5858] text-lg !text-white hover:opacity-90">
                  <IoAddCircle size={22} />
                  Add Task
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  variant={"outline"}
                  className="rounded-xl border border-gray-200 text-lg hover:opacity-90 dark:border-transparent dark:bg-[#202020]"
                >
                  <IoSearchSharp
                    size={22}
                    className="group-data-[collapsible=icon]:size-full"
                  />
                  Search...
                </SidebarMenuButton>
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
                        <a href={item.url} className="space-x-1">
                          {item.icon ? <item.icon size={20} /> : null}
                          <span>{item.label}</span>
                        </a>
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
                        <a href={item.url} className="space-x-1">
                          {item.icon ? <item.icon size={20} /> : null}
                          <span>{item.label}</span>
                        </a>
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
