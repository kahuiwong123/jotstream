"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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
import { useFormState } from "react-dom";
import { registerUser } from "@/data/authActions";
import { MdErrorOutline } from "react-icons/md";
import Link from "next/link";
import clsx from "clsx";
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Passwords must be at least 8 characters long." }),
});

const RegisterForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [errorMessage, formAction, isPending] = useFormState(
    registerUser,
    undefined,
  );

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (formSchema.safeParse(data).success) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formAction(formData);
    }
  };

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-gradient-to-r from-[#FF5858] to-red-400">
      <Form {...form}>
        <form
          className="flex h-fit w-2/5 flex-col gap-6 rounded-xl bg-white p-8 shadow-xl dark:bg-white"
          onSubmit={form.handleSubmit(onSubmit)}
        >
            <h1 className="text-2xl font-bold text-dark-main text-center">Get Started Today</h1>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md dark:text-black">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    {...field}
                    className="dark:bg-dark-white text-md rounded-[0.5rem] py-6"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md dark:text-black">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    {...field}
                    className="text-md rounded-[0.5rem] py-6 dark:bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-[0.5rem] bg-[#FF5858] py-6 text-lg hover:bg-[#ff6969] dark:bg-[#FF5858] dark:text-white dark:hover:bg-[#ff6969]"
            aria-disabled={isPending}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Sign up with Email"}
          </Button>
          <div
            className={clsx(
              "flex h-fit items-center justify-end gap-2 text-sm",
              errorMessage ? "justify-between" : "justify-end",
            )}
          >
            {errorMessage && (
              <div className="flex items-center gap-1 text-[#FF5858]">
                <MdErrorOutline className="size-5" />
                {errorMessage}
              </div>
            )}
            <p className="text-dark-grey">
              {`Already signed up?`}
              <Link href={"/"} className="ml-1 underline">
                Go to login
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm;
