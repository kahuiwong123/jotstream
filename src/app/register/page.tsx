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
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Sign up</h1>
      <Form {...form}>
        <form
          className="flex w-2/5 flex-col gap-4 border border-black p-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            aria-disabled={isPending}
            className="rounded-md bg-[#FF5858] py-2 hover:bg-[#ff6969]"
          >
            Sign up with Email
          </Button>
          <div
            className={clsx(
              "flex h-fit items-center justify-end gap-2 text-sm",
              errorMessage ? "justify-between" : "justify-end",
            )}
          >
            {errorMessage && (
              <div className="flex items-center gap-1 text-[#FF5858] text-nowrap">
                <MdErrorOutline className="size-5" />
                {errorMessage}
              </div>
            )}
            <p className="text-nowrap">
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
