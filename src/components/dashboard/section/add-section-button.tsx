"use client";

import React, { useState } from "react";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSectionStore } from "@/data/sectionStore";

const taskSchema = z.object({
  sectionName: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.number().gte(1).lte(4).optional(),
  dueDate: z.date().optional(),
});

const sectionSchema = z.object({
  name: z.string(),
  tasks: z.array(taskSchema),
});

type SectionProp = z.infer<typeof sectionSchema>;

const AddSectionButton = () => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const addSection = useSectionStore((state) => state.addSection);

  const form = useForm<SectionProp>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      tasks: [],
    },
  });

  const onSubmit = (data: SectionProp) => {
    addSection(data);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  return (
    <div className="mr-16">
      {isAdding ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-48 flex-col"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Name this section" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-2 flex gap-2">
              <Button
                type="submit"
                className="h-fit w-fit rounded-md px-4 py-1"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                type="reset"
                className="h-fit w-fit rounded-md px-4 py-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
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

export default AddSectionButton;
