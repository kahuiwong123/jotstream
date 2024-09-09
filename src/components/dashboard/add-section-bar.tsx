import React from "react";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Button } from "../ui/button";
const AddSectionBar = () => {
  return (
    <Button variant="ghost" className="mt-4 border border-light-grey shadow-lg">
      <MdOutlineAddToPhotos className="mr-2 h-6 w-6" />
      <p>Add Section</p>
    </Button>
  );
};

export default AddSectionBar;
