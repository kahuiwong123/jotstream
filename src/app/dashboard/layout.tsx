import SideNav from "@/components/sidenav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <SideNav />
      <ThemeToggle className="fixed right-4 top-4" />
      <main>{children}</main>
    </div>
  );
}
