"use client";

import React, { useEffect, useState } from "react";
import { MdOutlineAddToPhotos } from "react-icons/md";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addSection, FormState } from "@/data/actions";
import { useFormState } from "react-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSectionStore } from "@/data/sectionStore";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "@/data/authStore";

const sectionSchema = z.object({
  name: z.string().min(1, { message: "section name cannot be empty" }),
  userId: z.string().min(1),
});

type SectionProp = z.infer<typeof sectionSchema>;

const AddSectionButton = () => {
  const { isAdding, setIsAdding } = useSectionStore(
    useShallow((state) => ({
      isAdding: state.isAdding,
      setIsAdding: state.setIsAdding,
    })),
  );

  const [state, formAction] = useFormState<FormState, FormData>(addSection, {
    message: "",
  });

  const userId = useAuthStore((state) => state.userId);

  const onSubmit = async (data: SectionProp) => {
    if (sectionSchema.safeParse(data) && userId) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("userId", data.userId);
      formAction(formData);
    }
  };

  const form = useForm<SectionProp>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      userId: userId,
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsAdding();
  };

  useEffect(() => {
    form.reset();
  }, [state, form]);

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
                    <Input
                      placeholder="Name this section"
                      {...field}
                      autoComplete="off"
                      autoFocus
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-2 flex gap-2">
              <Button
                type="submit"
                className="h-fit w-fit rounded-md bg-red-flag px-4 py-1 hover:bg-[#d6584f] dark:bg-red-flag dark:text-white dark:hover:bg-[#d6584f]"
                disabled={!form.formState.isValid}
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
          onClick={() => setIsAdding()}
        >
          <MdOutlineAddToPhotos className="mr-2 size-6" />
          <p>Add Section</p>
        </Button>
      )}
    </div>
  );
};

export default AddSectionButton;
