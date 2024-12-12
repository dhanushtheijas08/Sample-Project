"use client";

import { Logo, LogoutButton, Navbar } from "@/components/common/index";

export default function Sidebar() {
  return (
    <div className="hidden border-r bg-[#FFFFFF] md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <Logo />

        <Navbar />
        <div className="mb-5">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
