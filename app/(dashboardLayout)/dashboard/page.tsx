"use client";

import AdminDashboard from "@/components/apps/dashboard/AdminDashboard";
import SuperAdminDashboard from "@/components/apps/dashboard/SuperAdminDashboard";
import TeacherDashboard from "@/components/apps/dashboard/TeacherDashboard";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (!loading && user?.role === "teacher") return <TeacherDashboard />;
  else if (!loading && user?.role === "admin") return <AdminDashboard />;
  else if (!loading && user?.role === "superadmin")
    return <SuperAdminDashboard />;
  else return null;
};

export default DashboardPage;
