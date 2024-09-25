import { Input } from "@/components/ui/input";
import { DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import { useSectionStore } from "@/data/sectionStore";
import { Task } from "@prisma/client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SectionSelectComboBox } from "../section/section-select.combobox";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { PrioritySelect } from "./priority-select";
import { updateSection, updateTask } from "@/data/actions";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const taskSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  description: z.string().nullish(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().nullish(),
});

type taskFields = z.infer<typeof taskSchema>;

export const EditTaskDialog = () => {
  const activeTask = useSectionStore((state) => state.activeTask);
  const activeSection = useSectionStore((state) => state.activeSection);
  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
  });

  React.useEffect(() => {
    if (activeTask) {
      form.reset({
        sectionId: activeTask.sectionId,
        title: activeTask.title,
        description: activeTask.description,
        priority: activeTask.priority,
        dueDate: activeTask.dueDate,
      });
    }
  }, [activeTask, form]);

  if (!activeTask) {
    return null;
  }

  const action: () => void = form.handleSubmit(async (data) => {
    await updateTask(activeTask.id, data);
  });

  return (
    <DialogContent isTaskEditing>
      <DialogTitle>{activeSection?.name}</DialogTitle>
      <Form {...form}>
        <form className="flex flex-col gap-4" action={action}>
          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div>
                      <Input
                        placeholder="Task name"
                        {...field}
                        className="w-full rounded-b-none border-b-0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                      value={field.value === null ? undefined : field.value}
                      className="rounded-t-none border-t-0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="sectionId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <SectionSelectComboBox
                    value={field.value}
                    onSelect={(id: string) => form.setValue("sectionId", id)}
                  />
                </FormItem>
              )}
            />

            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <DatePicker
                      variant="text"
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
          <Separator />
          <div className="flex justify-end gap-4">
            <Button
              type="reset"
              variant={"outline"}
              className="dark:bg-dark-main"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"outline"}
              disabled={!form.formState.isValid}
              className="bg-red-flag hover:bg-[#d6584f] dark:bg-red-flag dark:hover:bg-[#d6584f]"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
};
