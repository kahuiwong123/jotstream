import { handleSignOut } from "@/data/authActions";
import { Button } from "../ui/button";
import SideNavButton from "./sidenav-button";
import { IoLogOutOutline } from "react-icons/io5";

export default function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <SideNavButton icon={IoLogOutOutline} label="Sign out" />
    </form>
  );
}
