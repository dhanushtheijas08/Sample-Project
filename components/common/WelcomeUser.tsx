"use client";
import { useAuth } from "@/context/AuthContext";

const WelcomeUser = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-0.5 hidden md:block">
      <h3 className="text-[#211C37] text-lg font-semibold">Hello, {user?.name || user?.email} 👋</h3>
      {user?.role === "teacher" && <p className="text-[#85878D] text-sm">Guide your students to success today!</p>}
      {user?.role === "admin" && <p className="text-[#85878D] text-sm">Track performance across your institution</p>}
      {user?.role === "superadmin" && <p className="text-[#85878D] text-sm">Monitor platform activities seamlessly</p>}
    </div>
  );
};

export default WelcomeUser;
