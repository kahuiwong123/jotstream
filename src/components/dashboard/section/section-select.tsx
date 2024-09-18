import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSectionStore } from "@/data/sectionStore";

type SectionSelectProps = {
  onValueChange: (...event: any[]) => void;
  value: string;
  className?: string;
};

export function SectionSelect({
  onValueChange,
  value,
  className,
}: SectionSelectProps) {
  const sections = useSectionStore((state) => state.sections);
  return (
    <Select onValueChange={onValueChange} defaultValue={value}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a section" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sections</SelectLabel>
          {sections.map((section) => (
            <SelectItem key={section.id} value={section.id}>
              <span>{section.name}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
