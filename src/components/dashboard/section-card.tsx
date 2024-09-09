"use client";

import React, { useState } from "react";
import { IoEllipsisHorizontalOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { IoAdd } from "react-icons/io5";
import TaskCard from "./task-card";
import { stringToDate } from "@/lib/date";
import { SectionCardEdit } from "./section-card-edit";
import { SectionCardDropDown } from "./section-card-dropdown";
import { TooltipItem } from "../ui/tooltip-item";
const SectionCard = ({ name }: { name: string }) => {
  const task1 = {
    section: "Homework",
    title: "Homework 1",
    description:
      "Vestibulum et nisl molestie, aliquet urna eu, dictum libero. Vestibulum maximus ornare lorem, a malesuada ligula placerat sit amet. Nullam tincidunt porta mollis. Nulla lobortis leo ut tellus sagittis malesuada. Integer laoreet purus arcu, eget ornare turpis auctor a. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam fringilla enim et ornare posuere. Morbi diam velit, maximus quis elit id, dignissim sagittis sapien. Nulla egestas, ex vel ornare tincidunt, tortor nulla consequat urna, ac rhoncus ex turpis sed purus. Duis massa lorem, hendrerit sed maximus vitae, bibendum et urna. Donec blandit, mauris finibus tincidunt facilisis, tellus odio euismod metus, nec interdum sem erat sit amet mauris. Aenean lorem purus, aliquam id sollicitudin id, auctor eget lorem.",
    priority: 1,
    dueDate: stringToDate("10-31-2024"),
  };

  const task2 = {
    section: "Homework",
    title: "Homework 2",
    description: "This is HW2",
    priority: 2,
  };

  const task3 = {
    section: "Homework",
    title: "Homework 3",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [sectionName, setSectionName] = useState(name);

  return (
    <section className="flex w-72 flex-col gap-4 rounded-md border border-transparent p-4 hover:shadow-lg dark:hover:border-light-grey-hover">
      {isEditing ? (
        <SectionCardEdit
          originalName={name}
          sectionName={sectionName}
          setIsEditing={setIsEditing}
          setSectionName={setSectionName}
        />
      ) : (
        <div className="flex items-center justify-between">
          <TooltipItem
            tooltipTrigger={
              <h2 className="font-semibold" onClick={() => setIsEditing(true)}>
                {name}
              </h2>
            }
            tooltipString={name}
          />
          <SectionCardDropDown setIsEditing={setIsEditing} />
        </div>
      )}

      {name == "Homework" && <TaskCard task={task1} />}
      {name == "Homework" && <TaskCard task={task2} />}
      {name == "Homework" && <TaskCard task={task3} />}
      <Button variant="ghost" className="flex justify-start gap-2 px-2">
        <IoAdd className="h-6 w-6" />
        <p>Add Task</p>
      </Button>
    </section>
  );
};

export default SectionCard;
