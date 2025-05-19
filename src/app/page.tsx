"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo-no-background.svg";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
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
import { authenticate, authSignin } from "@/data/authActions";
import clsx from "clsx";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/ui/login/password-input";
import { signIn } from "../../auth";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(8, { message: "Passwords must be at least 8 characters long." }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <div className="relative flex h-screen flex-col items-center justify-center bg-gradient-to-r from-[#FF5858] to-red-400 dark:bg-dark-main">
      <div className="h-fit w-2/5 rounded-xl bg-white p-8 shadow-xl dark:bg-white">
        <div className="flex flex-col items-center">
          <Image src={logo} width={200} height={200} alt="jotstream-logo" />
        </div>
        <Form {...form}>
          <form action={formAction} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md dark:text-black">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="text-md rounded-[0.5rem] border border-gray-200 bg-[#EFF3F6] py-6 shadow-sm focus:border-gray-400 focus:shadow-md dark:border-gray-200 dark:bg-[#EFF3F6] dark:text-black dark:focus:border-gray-400"
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
                    <PasswordInput
                      placeholder="Enter your password"
                      {...field}
                      className="text-md rounded-[0.5rem] border border-gray-200 bg-[#EFF3F6] py-6 shadow-sm focus:border-gray-400 focus:shadow-md dark:border-gray-200 dark:bg-[#EFF3F6] dark:text-black dark:focus:border-gray-400"
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
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mb-4 flex items-center justify-between gap-6">
          <Button
            onClick={() => authSignin("google")}
            className="w-1/3 rounded-[0.5rem] dark:border-gray-300 shadow-sm dark:bg-white dark:hover:bg-[#F5F5F5] dark:text-black dark:hover:text-black"
            variant={"outline"}
            size={"icon"}
          >
            <FcGoogle className="size-8" />
          </Button>
          <Button
            className="w-1/3 rounded-[0.5rem] dark:border-gray-300 shadow-sm dark:bg-white dark:hover:bg-[#F5F5F5] dark:text-black dark:hover:text-black"
            onClick={() => authSignin("github")}
            variant={"outline"}
            size={"icon"}
          >
            <FaGithub className="size-8" />
          </Button>
          <Button
            className="w-1/3 rounded-[0.5rem] dark:border-gray-300 shadow-sm dark:bg-white dark:hover:bg-[#F5F5F5] dark:text-black dark:hover:text-black"
            variant={"outline"}
            size={"icon"}
          >
            <FaXTwitter className="size-8" />
          </Button>
        </div>
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
      </div>
    </div>
  );
}
