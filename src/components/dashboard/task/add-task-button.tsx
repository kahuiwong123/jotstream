"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addTask } from "@/data/actions";
import { useAuthStore } from "@/data/store/authStore";
import { useSectionStore } from "@/data/store/sectionStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoChevronForwardOutline, IoCloseOutline } from "react-icons/io5";
import { z } from "zod";
import { SectionSelect } from "../section/section-select";
import { PrioritySelect } from "./priority-select";
import { useActionState, useEffect } from "react";

const taskSchema = z.object({
  sectionId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4),
  dueDate: z.date().optional(),
});

type taskFields = z.infer<typeof taskSchema>;

type AddTaskButtonProps = {
  sectionId?: string;
  setOpen?: (val: boolean) => void;
  dueDate?: Date;
};

export const AddTaskButton = ({
  sectionId,
  setOpen,
  dueDate,
}: AddTaskButtonProps) => {
  const userId = useAuthStore((state) => state.userId);

  const form = useForm<taskFields>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      sectionId: sectionId,
      title: "",
      description: "",
      priority: 4,
      dueDate: dueDate || undefined,
    },
  });

  const setActiveSectionId = useSectionStore(
    (state) => state.setActiveSectionId,
  );

  const [state, formAction, isPending] = useActionState(
    addTask.bind(null, userId),
    { message: "" },
  );

  const handleSubmit = (data: FormData) => {
    console.log("submitting");
    formAction(data);
    if (setOpen) {
      setOpen(false);
    }
    form.reset()
  };

  const closeButton = (
    <Button
      type="reset"
      variant={"outline"}
      size={"icon"}
      className="rounded-lg dark:bg-dark-main"
      onClick={() => {
        if (setOpen) {
          setOpen(false);
        }
        setActiveSectionId(null);
      }}
    >
      <IoCloseOutline className="size-6" />
    </Button>
  );

  const submitButton = (
    <Button
      type="submit"
      variant={"outline"}
      size={"icon"}
      disabled={!form.formState.isValid}
      className="rounded-lg bg-red-flag hover:bg-[#d6584f] dark:bg-red-flag dark:hover:bg-[#d6584f]"
    >
      <IoChevronForwardOutline className="size-6" />
    </Button>
  );

  return (
    <Form {...form}>
      <form
        className="flex cursor-auto flex-col gap-2 divide-y p-2 shadow-sm transition-all duration-300 dark:border-[#707070] dark:border-transparent dark:bg-[#262626]"
        action={handleSubmit}
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
                    autoComplete="off"
                    autoFocus
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
                  <div>
                    <DatePicker
                      variant="icon"
                      value={field.value}
                      onChange={field.onChange}
                      className="border dark:border-[#3D3D3D] dark:bg-transparent"
                    />
                    <input
                      type="hidden"
                      name="dueDate"
                      value={
                        field.value ? new Date(field.value).toISOString() : ""
                      }
                    />
                  </div>
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
                  <div>
                    <PrioritySelect
                      variant="dropdown"
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value}
                      className="size-fit dark:border-[#3D3D3D] dark:bg-transparent"
                    />
                    <input type="hidden" name="priority" value={field.value} />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between p-2">
          <FormField
            name="sectionId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <SectionSelect
                      onValueChange={field.onChange}
                      value={field.value}
                      className="space-x-2 border-none dark:bg-transparent"
                    />

                    <input
                      type="hidden"
                      name="sectionId"
                      defaultValue={field.value}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex items-center gap-2">
            {closeButton}
            {submitButton}
          </div>
        </div>
      </form>
    </Form>
  );
};
