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
import { InstituteDialogData } from "@/schema";
import { deleteInstituteById } from "@/services/dashboard/institution-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArchiveRestore, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import InstutionDialog from "./InstutionDialog";
import PasswordResetDialog from "@/components/common/PasswordResetDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { enableUser } from "@/services/dashboard/common-service";

type InstituteActionsProps = {
  instituteId: string;
  instituteData: InstituteDialogData;
};

const InstituteActions = ({ instituteId, instituteData }: InstituteActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddInstituteModalOpen, setIsAddInstituteModalOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleEnableUser = async () => {
    if (instituteData?.isDeleted == true || instituteData?.isDeleted === undefined) {
      setIsLoading(true);
      try {
        await enableUser(user && user?.userToken, instituteId);
        await queryClient.invalidateQueries({ queryKey: ["getInstution"] });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error enabling the user");
      }
    } else {
      toast.error("It is already active!");
    }
  };

  const { mutate: deleteInstitute, isPending } = useMutation({
    mutationFn: () => deleteInstituteById(instituteId, user?.userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getInstution"],
      });
      setIsDialogOpen(false);
      toast.success("Institution deleted successfully!");
    },
  });

  return (
    <div className="flex gap-5">
      {instituteData?.isDeleted === false ? (
        <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setIsAddInstituteModalOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="bg-transparent w-5 h-5"
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Institution</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PasswordResetDialog email={instituteData?.email} />
          <AlertDialog open={isDialogOpen} onOpenChange={(val) => setIsDialogOpen(val)}>
            <AlertDialogTrigger>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Trash2 className=" w-5 h-5 hover:bg-gray-100 rounded" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Delete Institution </p>
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

                <Button disabled={isPending} variant="destructive" onClick={() => deleteInstitute()}>
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
                    <p className="text-xs">Restore institute</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to restore this institute?</AlertDialogTitle>
                <AlertDialogDescription>
                  Restoring this institute will reactivate their account and make their information accessible again.
                  This action can be undone by deleting the account if needed in the future.
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

      {isAddInstituteModalOpen && (
        <InstutionDialog
          isAddInstutionModalOpen={isAddInstituteModalOpen}
          setIsAddInstutionModalOpen={setIsAddInstituteModalOpen}
          instutionData={instituteData}
          docId={instituteId}
        />
      )}
    </div>
  );
};

export default InstituteActions;
