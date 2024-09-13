import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoCaretForwardOutline } from "react-icons/io5";
import { useSectionStore } from "@/data/sectionStore";

type SectionSelectProps = {
  onValueChange: (...event: any[]) => void;
  defaultValue: string;
};

export function SectionSelect({
  onValueChange,
  defaultValue,
}: SectionSelectProps) {
  const sections = useSectionStore((state) => state.sections);
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sections</SelectLabel>
          {sections.map((section, index) => (
            <SelectItem key={index} value={section.name}>
              <span>{section.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
