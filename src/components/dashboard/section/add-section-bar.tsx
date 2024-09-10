import React, { useState } from "react";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
const AddSectionBar = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [sectionName, setSectionName] = useState<string>("");

  const handleCancel = () => {
    setIsAdding(false);
    setSectionName("");
  };

  return (
    <div className="mr-16">
      {isAdding ? (
        <div className="flex w-48 flex-col">
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
      ) : (
        <Button
          variant="ghost"
          className="h-12 w-48 border border-transparent shadow-lg hover:border-light-grey"
          onClick={() => setIsAdding(true)}
        >
          <MdOutlineAddToPhotos className="mr-2 size-6" />
          <p>Add Section</p>
        </Button>
      )}
    </div>
  );
};

export default AddSectionBar;
