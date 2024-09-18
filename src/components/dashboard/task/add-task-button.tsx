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
import { useForm } from "react-hook-form";
import { DatePicker } from "@/components/ui/date-picker";
import { PrioritySelect } from "./priority-select";
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";
import { TooltipItem } from "@/components/ui/tooltip-item";
import { addTask, FormState } from "@/data/actions";

const taskSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().optional(),
});

type taskFields = z.infer<typeof taskSchema>;

type AddTaskButtonProps = {
  setIsAddingTask: (bool: boolean) => void;
  sectionId: string;
};

export const AddTaskButton = ({
  setIsAddingTask,
  sectionId,
}: AddTaskButtonProps) => {
  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      sectionId: sectionId,
      priority: 4,
    },
  });

  const action: () => void = form.handleSubmit(async (data) => {
    await addTask(data)
  })

  return (
    <Form {...form}>
      <form
        className="divide-y rounded-lg border border-[#E6E6E6] border-transparent transition-all duration-300 dark:border-[#707070]"
        action={action}
      >
        <div>
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Task name"
                    {...field}
                    className="border-none text-base dark:bg-transparent"
                  />
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
                  <Input
                    placeholder="Description"
                    {...field}
                    className="border-none dark:bg-transparent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex grow-0 items-center gap-3 p-2">
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
                    className="border dark:border-[#3D3D3D] dark:bg-transparent"
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
                    className="size-fit dark:border-[#3D3D3D] dark:bg-transparent"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-around gap-1 p-2">
          <FormField
            name="sectionId"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grow">
                <FormControl>
                  <SectionSelect
                    onValueChange={field.onChange}
                    value={field.value}
                    className="border-none dark:bg-transparent"
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
                  className="dark:bg-dark-main"
                >
                  <IoCloseOutline className="size-6" />
                </Button>
              }
              tooltipString="Cancel"
            />
            <TooltipItem
              tooltipTrigger={
                <Button
                  type="submit"
                  variant={"outline"}
                  size={"icon"}
                  disabled={!form.formState.isValid}
                  className="bg-red-flag hover:bg-[#d6584f] dark:bg-red-flag dark:hover:bg-[#d6584f]"
                >
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
