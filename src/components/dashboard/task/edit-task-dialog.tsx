"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { updateTask } from "@/data/actions";
import { useSectionStore } from "@/data/sectionStore";
import { useTaskStore } from "@/data/taskStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ReactElement, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoFileTray } from "react-icons/io5";
import { z } from "zod";
import { DialogClose, DialogTitle } from "../../ui/dialog";
import { SectionSelectComboBox } from "../section/section-select.combobox";
import { PrioritySelect } from "./priority-select";

const taskSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  description: z.string().nullish(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().nullish(),
});

type taskFields = z.infer<typeof taskSchema>;

export const EditTaskDialog = ({
  dialogTrigger,
}: {
  dialogTrigger: ReactElement;
}) => {
  const activeTask = useTaskStore((state) => state.activeTask);
  const activeSection = useSectionStore((state) => state.activeSection);
  const setActiveTask = useTaskStore((state) => state.setActiveTask);
  const setActiveSection = useSectionStore((state) => state.setActiveSection);
  
  const [open, setOpen] = useState(false);

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setActiveSection(null);
      setActiveTask(null);
      form.reset();
    }
  };

  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
  });

  const action: () => void = form.handleSubmit(async (data) => {
    if (!activeTask) return;
    await updateTask(activeTask.id, data);
    
  });

  useEffect(() => {
    if (activeTask) {
      form.reset({
        ...activeTask,
        dueDate: activeTask.dueDate ? new Date(activeTask.dueDate) : null,
      });
    }
  }, [activeTask, form]);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>{dialogTrigger}</DialogTrigger>
      <DialogContent className="m-0">
        <DialogTitle className="flex items-center">
          <IoFileTray size={20} className="mr-1" />
          Inbox / {activeSection?.name}
        </DialogTitle>
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
                          className="w-full rounded-b-none border-b-0 focus:border-b-0"
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
                        data-gramm={false}
                        className="rounded-t-none border-t-0 focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col justify-center gap-4 md:flex-row md:justify-between md:gap-0">
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
                        className="w-full dark:border-[#3D3D3D] dark:bg-transparent md:size-fit"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <DialogFooter className="flex justify-end gap-4">
              <DialogClose asChild>
                <Button
                  type="reset"
                  variant={"outline"}
                  className="dark:bg-dark-main"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant={"outline"}
                disabled={!form.formState.isValid}
                className="bg-red-flag !text-white hover:bg-[#d6584f] dark:bg-red-flag dark:hover:bg-[#d6584f]"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
