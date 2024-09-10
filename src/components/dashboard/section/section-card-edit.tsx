import React from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";

type sectionCardEditProps = {
  originalName: string;
  sectionName: string;
  setIsEditing: (bool: boolean) => void;
  setSectionName: (str: string) => void;
};

export const SectionCardEdit = ({
  originalName,
  sectionName,
  setIsEditing,
  setSectionName,
}: sectionCardEditProps) => {
  const handleCancel = () => {
    setIsEditing(false);
    setSectionName(originalName);
  };

  return (
    <div className="flex flex-col">
      <Input
        placeholder="Name this section"
        value={sectionName}
        onChange={(e) => setSectionName(e.target.value)}
        autoFocus
      />
      <div className="mt-2 flex gap-2">
        <Button className="h-fit w-fit rounded-md px-4 py-1">Save</Button>
        <Button
          variant="ghost"
          className="h-fit w-fit rounded-md px-4 py-1"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
