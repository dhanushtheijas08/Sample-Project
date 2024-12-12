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
import { useDeleteTeacher } from "@/hooks/useTeacher";
import { ArchiveRestore, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { TeacherDialogeData } from "@/schema";
import TeacherDialog from "../teacher/TeacherDialog";
import PasswordResetDialog from "@/components/common/PasswordResetDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { enableUser } from "@/services/dashboard/common-service";
import { toast } from "sonner";

type TeacherActionsProps = {
  teacherId: string;
  teacherData: TeacherDialogeData;
};

const TeacherActions = ({ teacherId, teacherData }: TeacherActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate: deleteTeacher, isPending } = useDeleteTeacher();

  const handleEnableUser = async () => {
    if (teacherData?.isDeleted == true || teacherData?.isDeleted === undefined) {
      setIsLoading(true);
      try {
        await enableUser(user && user.userToken!, teacherId);
        await queryClient.invalidateQueries({ queryKey: ["getTeachers"] });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error enabling the user");
      }
    } else {
      toast.error("It is already active!");
    }
  };

  return (
    <div className="flex gap-5 items-center">
      {teacherData?.isDeleted === false ? (
        <>
          {" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    setIsAddTeacherModalOpen(true);
                  }}
                  variant="ghost"
                  size="icon"
                  className="bg-transparent w-5 h-5"
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Edit Teacher</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PasswordResetDialog email={teacherData?.email} />
          <AlertDialog open={isDialogOpen} onOpenChange={(val) => setIsDialogOpen(val)}>
            <AlertDialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2 className=" w-5 h-5 hover:bg-gray-100 rounded cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Delete Teacher </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this teacher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this teacher will deactivate their account but will not permanently delete their data. You
                  can restore the account in the future if needed. Please confirm if you want to proceed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={() =>
                    deleteTeacher(
                      { teacherId, userToken: user?.userToken },
                      {
                        onSuccess: () => {
                          setIsDialogOpen(false);
                        },
                      }
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
        </>
      ) : (
        <div className="flex items-center mx-auto ml-11">
          <AlertDialog open={isRestoreDialogOpen} onOpenChange={(val) => setIsRestoreDialogOpen(val)}>
            <AlertDialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArchiveRestore className="w-5 h-5 hover:bg-gray-100 rounded cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Restore Teacher</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to restore this teacher?</AlertDialogTitle>
                <AlertDialogDescription>
                  Restoring this teacher will reactivate their account and make their information accessible again. This
                  action can be undone by deleting the account if needed in the future.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button
                  onClick={async () => {
                    await handleEnableUser();
                    setIsRestoreDialogOpen(false);
                  }}
                  disabled={isLoading}
                  variant="destructive"
                >
                  {isLoading ? "Restoring..." : "Restore"}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {isAddTeacherModalOpen && (
        <TeacherDialog
          isAddTeacherModalOpen={isAddTeacherModalOpen}
          setIsAddTeacherModalOpen={setIsAddTeacherModalOpen}
          teacherData={teacherData}
          docId={teacherId}
        />
      )}
    </div>
  );
};

export default TeacherActions;
