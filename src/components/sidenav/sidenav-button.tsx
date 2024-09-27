import React, { FC, useContext, useState } from "react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clsx } from "clsx";
import { useSectionStore } from "@/data/sectionStore";

interface IconbuttonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ElementType;
  label: string;
}

const SideNavButton = ({ icon: Icon, label, ...props }: IconbuttonProps) => {
  const sidebarCollapsed = useSectionStore((state) => state.sidebarCollapsed);

  const [hovered, setHovered] = useState(false);
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger
          asChild
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Button
            className="flex w-full items-center justify-start hover:bg-light-grey-hover dark:hover:bg-dark-hover"
            variant="ghost"
            {...props}
          >
            <Icon className="flex flex-shrink-0 text-lg" />
            <span
              className={clsx(
                "overflow-hidden transition-all",
                sidebarCollapsed ? "w-0" : "ml-2 w-auto",
              )}
            >
              {label}
            </span>
          </Button>
        </TooltipTrigger>
        {sidebarCollapsed && hovered && (
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SideNavButton;
