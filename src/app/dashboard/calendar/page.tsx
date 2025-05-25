"use client";

import { Button } from "@/components/ui/button";
import { authSignin } from "@/data/authActions";
import { useSession } from "next-auth/react";

function Page() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Button onClick={() => authSignin("google")}>
        Connect with Google Calendar
      </Button>
    );
  }

  return <p>Connected</p>;
}

export default Page;
