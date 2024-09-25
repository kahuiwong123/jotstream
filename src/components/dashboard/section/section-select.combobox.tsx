"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSectionStore } from "@/data/sectionStore";
import { FormControl } from "@/components/ui/form";

type SelectProps = {
  onSelect: any;
  value: string;
};

export function SectionSelectComboBox({ onSelect, value }: SelectProps) {
  const sections = useSectionStore((state) => state.sections);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !value && "text-muted-foreground",
            )}
          >
            {value
              ? sections.find((section) => section.id === value)?.name
              : "Select section"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search section..." />
          <CommandList>
            <CommandEmpty>Section not found</CommandEmpty>
            <CommandGroup>
              {sections.map((section) => (
                <CommandItem
                  value={section.name}
                  key={section.id}
                  onSelect={() => onSelect(section.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      section.id === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {section.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
