"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no-background.svg";
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
import { MdErrorOutline } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFormState } from "react-dom";
import { authenticate } from "@/data/authActions";
import clsx from "clsx";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Passwords must be at least 8 characters long." }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [errorMessage, formAction, isPending] = useFormState(
    authenticate,
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
          className="flex h-fit w-2/5 flex-col gap-6 rounded-xl p-8 shadow-xl dark:bg-white bg-white"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-center">
            <Image src={logo} width={200} height={200} alt="jotstream-logo" />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="dark:text-black text-md">Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} className="dark:bg-dark-white py-6 text-md rounded-[0.5rem]"/>
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
                <FormLabel className="dark:text-black text-md">Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" {...field} className="dark:bg-white py-6 text-md rounded-[0.5rem]"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="rounded-[0.5rem] bg-[#FF5858] py-6 hover:bg-[#ff6969] dark:bg-[#FF5858] dark:text-white dark:hover:bg-[#ff6969] text-lg"
            aria-disabled={isPending}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Login"}
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
              {`Don't have an account?`}
              <Link href={"/register"} className="ml-1 underline">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
