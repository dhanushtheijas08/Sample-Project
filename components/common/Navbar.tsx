"use client";
import { navBar } from "@/constant/nav-bar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const renderNav = navBar
    .filter((nav) => user?.role && nav.role.includes(user.role))
    .map((nav) => (
      <Link
        key={nav?.href}
        href={nav?.href}
        className={cn(
          "flex items-center gap-3.5 rounded-lg px-3 py-3.5 transition-all group",
          pathname.startsWith(nav?.href)
            ? "text-white bg-[#EE2A2B]"
            : "text-[#7A7E86] hover:text-primary"
        )}
      >
        <nav.icon
          className={cn(
            "h-5 w-5 shrink-0 translate-x-0.5",
            pathname.startsWith(nav?.href)
              ? "text-white"
              : "text-[#7A7E86] group-hover:text-primary"
          )}
        />
        {nav.label}
      </Link>
    ));

  return (
    <aside className="flex-1 mt-5">
      <nav className="grid gap-y-1 items-start px-2 lg:px-4">{renderNav}</nav>
    </aside>
  );
};

export default Navbar;
