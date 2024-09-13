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
export function SectionSelect() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sections</SelectLabel>
          <SelectItem value="homework">
            <div className="flex items-center">
              <IoCaretForwardOutline className="mr-2 h-4 w-4" />
              <span>Homework</span>
            </div>
          </SelectItem>
          <SelectItem value="chores">
            <div className="flex items-center">
              <IoCaretForwardOutline className="mr-2 h-4 w-4" />
              <span>Chores</span>
            </div>
          </SelectItem>
          <SelectItem value="activities">
            <div className="flex items-center">
              <IoCaretForwardOutline className="mr-2 h-4 w-4" />
              <span>Activities</span>
            </div>
          </SelectItem>
          <SelectItem value="others">
            <div className="flex items-center">
              <IoCaretForwardOutline className="mr-2 h-4 w-4" />
              <span>Others</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
