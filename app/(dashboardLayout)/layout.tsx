"use clinet";
import { WelcomeUser } from "@/components/common";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { MobileNavbar, Sidebar } from "@/components/layout/index";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["superadmin", "admin", "teacher"]}>
      <div className="grid overflow-hidden  h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="flex flex-col bg-[#F8FAFF]">
          <header className="flex h-14  border-b items-center gap-4  px-4 lg:h-[80px] lg:px-6">
            <MobileNavbar />

            <WelcomeUser />
          </header>
          <ScrollArea className="h-screen">
            <main className="px-5 py-5 mb-5">{children}</main>
          </ScrollArea>
        </div>
      </div>
    </ProtectedRoute>
  );
}
