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

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [errorMessage, formAction, isPending] = useFormState(
    authenticate,
    undefined,
  );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Form {...form}>
        <form
          className="flex w-2/5 flex-col gap-4 border border-black p-8"
          action={formAction}
        >
          <div className="flex flex-col items-center">
            <Image src={logo} width={200} height={200} alt="jotstream-logo" />
            <Link href="/dashboard">Dashboard</Link>
          </div>
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
            className="bg-[#FF5858] hover:bg-[#ff6969]"
            aria-disabled={isPending}
          >
            Login
          </Button>
          {errorMessage && (
            <div className="flex items-center gap-1 text-[#FF5858]">
              <MdErrorOutline className="size-5" />
              {errorMessage}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
