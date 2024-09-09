import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type tooltipProps = {
  tooltipTrigger: React.ReactNode;
  tooltipString: string;
};

export function TooltipItem({ tooltipTrigger, tooltipString }: tooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{tooltipTrigger}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipString}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
