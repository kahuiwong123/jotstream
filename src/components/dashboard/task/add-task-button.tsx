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

const taskSchema = z.object({
  section: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4).optional(),
  dueDate: z.date().optional(),
});

type taskFields = z.infer<typeof taskSchema>;

export const AddTaskButton = ({
  setIsAddingTask,
}: {
  setIsAddingTask: (bool: boolean) => void;
}) => {
  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      section: "Homework",
    },
  });

  const onSubmit: SubmitHandler<taskFields> = (data) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="border border-red-500 p-2 rounded-lg"
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
                  <DatePicker variant="icon" {...field} />
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
                  <PrioritySelect variant="dropdown" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-around gap-1">
          <FormField
            name="section"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <SectionSelect />
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
