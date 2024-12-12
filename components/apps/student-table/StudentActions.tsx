import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useDeleteStudent } from "@/hooks/useStudent";
import StudentDialog from "../student/StudentDialog";
import { StudentDialogData } from "@/schema";
import PasswordResetDialog from "@/components/common/PasswordResetDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { enableUser } from "@/services/dashboard/common-service";
import { toast } from "sonner";
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
import { useQueryClient } from "@tanstack/react-query";

type StudentActionsProps = {
  docId: string;
  studentData: StudentDialogData;
};

const StudentActions = ({ docId, studentData }: StudentActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { mutate: deleteStudent, isPending } = useDeleteStudent();
  const queryClient = useQueryClient();

  const handleEnableUser = async () => {
    if (studentData?.isDeleted == true || studentData?.isDeleted === undefined) {
      setIsLoading(true);
      try {
        await enableUser(user && user?.userToken, docId);
        await queryClient.invalidateQueries({ queryKey: ["getStudents"] });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error enabling the user");
      }
    } else {
      toast.error("It is already active!");
    }
  };

  useEffect(() => {
    console.log(studentData);
  }, [studentData]);

  return (
    <div className="flex gap-5 items-center">
      {studentData.isDeleted === false ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-transparent w-5 h-5"
                  onClick={() => setIsAddStudentModalOpen(true)}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Edit Student</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <PasswordResetDialog email={studentData?.email} />

          <AlertDialog open={isDialogOpen} onOpenChange={(val) => setIsDialogOpen(val)}>
            <AlertDialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2 className="w-5 h-5 hover:bg-gray-100 rounded" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Delete Student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this student?</AlertDialogTitle>
                <AlertDialogDescription>
                  Deleting this student will deactivate their account but will not permanently delete their data. You
                  can restore the account in the future if needed. Please confirm if you want to proceed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button
                  onClick={() =>
                    deleteStudent(
                      {
                        docId,
                        userToken: user?.userToken,
                      },
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
          <AlertDialog
            open={isRestoreDialogOpen}
            onOpenChange={(val) => {
              setIsRestoreDialogOpen(val);
            }}
          >
            <AlertDialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ArchiveRestore className="w-5 h-5 hover:bg-gray-100 rounded cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Restore Student</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to restore this student?</AlertDialogTitle>
                <AlertDialogDescription>
                  Restoring this student will reactivate their account and make their information accessible again. This
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

      {isAddStudentModalOpen && (
        <StudentDialog
          isAddStudentModalOpen={isAddStudentModalOpen}
          setIsAddStudentModalOpen={setIsAddStudentModalOpen}
          studentData={studentData}
          docId={docId}
        />
      )}
    </div>
  );
};

export default StudentActions;
