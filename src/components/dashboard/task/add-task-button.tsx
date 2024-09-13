"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { SectionSelect } from "../section/section-select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { PrioritySelect } from "./priority-select";
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";
import { TooltipItem } from "@/components/ui/tooltip-item";
import { useSectionStore } from "@/data/sectionStore";

const taskSchema = z.object({
  sectionName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().optional(),
});

type taskFields = z.infer<typeof taskSchema>;

type AddTaskButtonProps = {
  setIsAddingTask: (bool: boolean) => void;
  sectionName: string;
};

export const AddTaskButton = ({
  setIsAddingTask,
  sectionName,
}: AddTaskButtonProps) => {
  const addTaskToSection = useSectionStore((state) => state.addTaskToSection);

  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      sectionName: "Homework",
      priority: 4,
    },
  });

  const onSubmit: SubmitHandler<taskFields> = (data) => {
    console.log(data)
    addTaskToSection(data.sectionName, data);
    setIsAddingTask(false)
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg border border-red-500 p-2"
      >
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Task name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-3">
          <FormField
            name="dueDate"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <DatePicker
                    variant="icon"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="priority"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PrioritySelect
                    variant="dropdown"
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-around gap-1">
          <FormField
            name="sectionName"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <SectionSelect
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex gap-1">
            <TooltipItem
              tooltipTrigger={
                <Button
                  type="reset"
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => setIsAddingTask(false)}
                >
                  <IoCloseOutline className="size-6" />
                </Button>
              }
              tooltipString="Cancel"
            />
            <TooltipItem
              tooltipTrigger={
                <Button type="submit" variant={"outline"} size={"icon"}>
                  <IoChevronForwardOutline className="size-6" />
                </Button>
              }
              tooltipString="Add task"
            />
          </div>
        </div>
      </form>
    </Form>
  );
};
