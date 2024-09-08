"use client";

import React from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { IoAdd } from "react-icons/io5";
const SectionCard = ({ name }: { name: string }) => {
  return (
    <section className="flex w-64 flex-col rounded-md border border-transparent p-4 hover:shadow-lg dark:hover:border-light-grey-hover">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{name}</h2>
        <Button variant="outline" size="icon" className="border-none dark:bg-dark-main">
          <IoEllipsisHorizontalOutline className="h-5 w-5" />
        </Button>
      </div>
      <Button variant="ghost" className="flex justify-start gap-2 px-0">
        <IoAdd className="h-4 w-4" />
        <p>Add Task</p>
      </Button>
    </section>
  );
};

export default SectionCard;
