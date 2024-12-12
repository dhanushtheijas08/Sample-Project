"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDeleteGradeSection } from "@/hooks/useGradeSection";
import { ChevronsRight, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

type GradeSectionActionsProps = {
  id: string;
};

const GradeSectionActions = ({ id }: GradeSectionActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const uid = user?.uid as string;
  const { mutate: deleteGradeSection, isPending } = useDeleteGradeSection();

  return (
    <div className="flex gap-5 items-center justify-end">
      <ChevronsRight />

      <Button variant="ghost" size="icon" className="bg-transparent">
        <Edit />
      </Button>

      <AlertDialog
        open={isDialogOpen}
        onOpenChange={(val) => setIsDialogOpen(val)}
      >
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="bg-transparent">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this grade section?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. Once deleted, the
              grade section&apos;s data will be permanently removed from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={() =>
                deleteGradeSection(
                  { uid, id },
                  { onSuccess: () => setIsDialogOpen(false) }
                )
              }
              disabled={isPending}
              variant="destructive"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GradeSectionActions;
