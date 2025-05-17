"use client";

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
import { useAuthStore } from "@/data/authStore";
import { ChevronRight, ChevronUp } from "lucide-react";
import { handleSignOut } from "@/data/authActions";
import Image from "next/image";

export function AppSidebar() {
  const email = useAuthStore((state) => state.email);

  const taskMenuItems = [
    { icon: IoFileTray, label: "Inbox", url: "#" },
    { icon: IoToday, label: "Today", url: "#" },
    { icon: IoCalendar, label: "Calendar", url: "#" },
  ];

  const noteMenuItems = [
    { icon: LuDot, label: "See All", url: "#" },
    { icon: LuDot, label: "List View", url: "#" },
    { icon: LuDot, label: "By Course Number", url: "#" },
  ];

  return (
    <Sidebar className="border-none" collapsible="offcanvas">
      <SidebarHeader>
        <Image src={logo} height={200} width={200} alt="jotstream-logo" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IoAddCircle size={22} className="fill-[#FF5858]" />
                  Add Task
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <IoSearchSharp size={22} />
                  Search
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group flex items-center justify-between gap-2">
                      Tasks
                      <ChevronRight
                        className="ml-2 transition-transform duration-300 group-data-[state=open]:rotate-90"
                        aria-hidden
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {taskMenuItems.map((item, index) => (
                      <SidebarMenuSub key={index}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>
                            {item.icon ? <item.icon size={20} /> : null}
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSub>
                    ))}
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible defaultOpen>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="group flex items-center justify-between gap-2">
                      Notes
                      <ChevronRight
                        className="ml-2 transition-transform duration-300 group-data-[state=open]:rotate-90"
                        aria-hidden
                      />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {noteMenuItems.map((item, index) => (
                      <SidebarMenuSub key={index}>
                        <SidebarMenuSubButton asChild>
                          <a href={item.url}>
                            {item.icon ? <item.icon size={20} /> : null}
                            <span>{item.label}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSub>
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
                <SidebarMenuButton>
                  <CgProfile size={20} />
                  {email}
                  <LuChevronsUpDown className="ml-auto" size={20} />
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
