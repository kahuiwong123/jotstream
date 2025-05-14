import { handleSignOut } from "@/data/authActions";
import { Button } from "../ui/button";
import { IoLogOutOutline } from "react-icons/io5";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button>
        <IoLogOutOutline />
        Sign Out
      </Button>
    </form>
  );
}
