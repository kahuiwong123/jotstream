import React, { FC, useContext, useState } from "react";
import { SideNavContext } from "../sidenav";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clsx } from "clsx";
type IconbuttonProps = {
  icon: React.ElementType;
  label: string;
};

const SideNavButton: FC<IconbuttonProps> = ({ icon: Icon, label }) => {
  const { collapsed } = useContext(SideNavContext);
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
            className="flex w-full items-center justify-start hover:bg-light-grey-hover"
            variant="ghost"
          >
            <Icon className="flex flex-shrink-0 text-lg" />
            <span
              className={clsx(
                "overflow-hidden transition-all",
                collapsed ? "w-0" : "ml-2 w-auto",
              )}
            >
              {label}
            </span>
          </Button>
        </TooltipTrigger>
        {collapsed && hovered && (
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default SideNavButton;
