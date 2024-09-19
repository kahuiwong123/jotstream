import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa6";

const priorityColors = [
  { border: "border-red-flag", text: "text-red-flag" },
  { border: "border-orange-flag", text: "text-orange-flag" },
  { border: "border-blue-flag", text: "text-blue-flag" },
  { border: "border-gray-300", text: "text-gray-300" },
];

export const PriorityButton = ({ priority }: { priority: number }) => {
  const { border, text } = priorityColors[priority - 1];
  return (
    <Button
      variant="ghost"
      size="icon"
      className={`group mt-0.5 size-fit rounded-full border-2 ${border} bg-transparent`}
    >
      <FaCheck
        className={`size-4 rounded-full border border-transparent ${text} opacity-0 transition-opacity duration-200 hover:opacity-100`}
      />
    </Button>
  );
};
