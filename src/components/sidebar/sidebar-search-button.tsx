"use client";

import { IoSearchSharp } from "react-icons/io5";
import { SidebarMenuButton } from "../ui/sidebar";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { DialogContent, DialogTitle } from "../ui/dialog";
import {
  Command,
  CommandList,
  CommandShortcut,
  CommandInput,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "../ui/command";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Section, Task } from "@prisma/client";
import { useDebounceCallback } from "usehooks-ts";
import SidebarSearchTaskButton from "./sidebar-search-task-button";
import SideBarSearchSectionButton from "./sidebar-search-section.button";
import { useAuthStore } from "@/data/authStore";

function SidebarSearchButton() {
  const userId = useAuthStore((state) => state.userId);
  const [open, setOpen] = useState(false);

  const [results, setResults] = useState<{
    sections: Section[];
    tasks: Task[];
  }>({ sections: [], tasks: [] });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [inputValue, setInputValue] = useState(
    searchParams.get("query")?.toString() ?? "",
  );

  const handleSearch = useDebounceCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (userId) {
      const query = searchParams.get("query")?.toString() ?? "";
      if (!query) {
        setResults({ sections: [], tasks: [] });
        return;
      }
      fetch(
        `/api/search?id=${encodeURIComponent(userId)}&query=${encodeURIComponent(query)}`,
      )
        .then((res) => res.json())
        .then(setResults);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!open) {
      setInputValue("");
      handleSearch("");
    }
  }, [handleSearch, open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          variant={"outline"}
          className="rounded-xl border border-gray-200 text-lg hover:opacity-90 dark:border-transparent dark:bg-[#202020]"
        >
          <IoSearchSharp
            size={22}
            className="group-data-[collapsible=icon]:size-full"
          />
          Search...
          <CommandShortcut className="rounded-xl border bg-[#FAFAFA] px-1 dark:border-transparent dark:bg-[#262626]">
            ⌘ K
          </CommandShortcut>
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="max-h-screen overflow-scroll p-8">
        <DialogTitle className="hidden">Search</DialogTitle>
        <Command>
          <div className="relative flex w-full items-center">
            <IoSearchSharp
              size={20}
              className="pointer-events-none absolute left-3"
            />
            <Input
              placeholder="Search or type a command..."
              onChange={(e) => {
                setInputValue(e.target.value);
                handleSearch(e.target.value);
              }}
              className="rounded-xl pl-10"
              value={inputValue}
            />
          </div>
          {results.sections.length > 0 && (
            <CommandGroup heading="Sections">
              {results.sections.map((section) => (
                <SideBarSearchSectionButton
                  key={section.id}
                  section={section}
                  setOpen={setOpen}
                />
              ))}
            </CommandGroup>
          )}
          {results.tasks.length > 0 && (
            <CommandGroup heading="Tasks" className="flex flex-col">
              {results.tasks.map((task) => (
                <SidebarSearchTaskButton key={task.id} task={task} />
              ))}
            </CommandGroup>
          )}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default SidebarSearchButton;
