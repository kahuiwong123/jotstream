import { Section } from "@prisma/client";
import { CommandItem } from "../ui/command";
import { FaRegFolder } from "react-icons/fa";
import { useSectionStore } from "@/data/sectionStore";

function SideBarSearchSectionButton({
  section,
  setOpen,
}: {
  section: Section;
  setOpen: (val: boolean) => void;
}) {
  const setHighlightSectionId = useSectionStore(state => state.setHighlightSectionId)  

  return (
    <div onClick={() => {
        setHighlightSectionId(section.id)
        setOpen(false)
    }}>
      <CommandItem className="flex w-full items-center gap-4 border-l-4 border-transparent py-2 hover:cursor-pointer hover:border-l-[#FE6767]">
        <FaRegFolder size={20} />
        {section.name}
      </CommandItem>
    </div>
  );
}

export default SideBarSearchSectionButton;
