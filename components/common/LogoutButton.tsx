"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
const LogoutButton = () => {
  const { signOut } = useAuth();
  const queryClient = useQueryClient();
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground justify-start mx-2 lg:mx-4 w-full"
      onClick={() => {
        signOut();
        queryClient.clear();
      }}
    >
      <span className="py-3.5 flex gap-3.5 items-center">
        <LogOut className="h-5 w-5" /> Logout
      </span>
    </Button>
  );
};

export default LogoutButton;
