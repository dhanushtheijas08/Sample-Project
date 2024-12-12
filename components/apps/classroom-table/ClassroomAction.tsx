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
import { ChevronsRight, RotateCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ClassroomActionProps = {
  classroomId: string;
  isArchived: boolean;
};

const ClassroomAction = ({ classroomId, isArchived }: ClassroomActionProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { push } = useRouter();

  if (isArchived) {
    return (
      <div className="flex gap-5">
        <RotateCcw />

        {user?.role === "admin" && (
          <AlertDialog open={isDialogOpen} onOpenChange={(val) => setIsDialogOpen(val)}>
            <AlertDialogTrigger>
              <Trash2 />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action is permanent and cannot be undone. Once deleted, the student&apos;s data will be
                  permanently removed from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button variant="destructive">Delete</Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  }

  return (
    <div className="mx-4">
      <Button
        variant="ghost"
        size="icon"
        className="bg-transparent cursor-pointer"
        onClick={() => push(`classroom/${classroomId}`)}
      >
        <ChevronsRight />
      </Button>

      {/* <AlertDialog
        open={isDialogOpen}
        onOpenChange={(val) => setIsDialogOpen(val)}
      >
        <AlertDialogTrigger>
          <Trash2 />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this student?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. Once deleted, the
              student&apos;s data will be permanently removed from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <Button variant="destructive">Delete</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
  );
};

export default ClassroomAction;
