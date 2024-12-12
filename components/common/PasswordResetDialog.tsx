import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RotateCcw } from "lucide-react";
import { z } from "zod";
import { updateUserPassword } from "@/services/dashboard/common-service";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function PasswordResetDialog({ email }: { email: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleReset = async () => {
    const result = passwordSchema.safeParse({ password, confirmPassword });

    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await updateUserPassword(email, password, user?.userToken as string);

      toast.success("Password reset successfully!");

      setLoading(false);
      setIsDialogOpen(false);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Error resetting password. Please try again.");
    }
  };

  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setError(null);
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogHeader>
        <DialogTrigger asChild>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <RotateCcw
                  className="w-5 h-5 cursor-pointer rounded  hover:bg-gray-100"
                  onClick={() => setIsDialogOpen(true)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Reset Password</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </DialogTrigger>
      </DialogHeader>
      <DialogContent>
        <DialogTitle>Reset Password</DialogTitle>
        <div>
          <Label className="pb-2">Password</Label>
          <Input
            placeholder="Enter password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label className="pb-0">Confirm Password</Label>
          <Input
            placeholder="Enter confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <DialogFooter>
          <Button disabled={loading} onClick={handleReset}>
            {loading ? "Resetting..." : "Reset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
