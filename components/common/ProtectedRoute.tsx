"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "./spinner";
import Unauthorized from "./Unauthorized";

type Role = "superadmin" | "admin" | "teacher" | "student";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (!loading && user && pathname === "/login") {
      router.push("/dashboard");
    }
  }, [user, loading, allowedRoles, router, pathname]);

  if (loading) {
    return <Spinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Unauthorized />;
  }

  return <>{children}</>;
};
