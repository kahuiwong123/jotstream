"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function DashboardHeader() {
  const pathname = usePathname();
  const [path, setPath] = useState("");

  useEffect(() => {
    const cleanPath = pathname.replace("/dashboard", "");
    const segments = cleanPath.split("/").filter(Boolean);
    setPath(segments.length > 0 ? segments[segments.length - 1] : "inbox");
  }, [pathname]);

  return (
    <header className="px-8 mb-4 w-screen">
      <h1 className="text-4xl font-bold">
        {path.charAt(0).toUpperCase() + path.slice(1)}
      </h1>
    </header>
  );
}

export default DashboardHeader;
