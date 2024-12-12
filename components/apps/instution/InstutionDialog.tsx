"use client";
import InstituteForm from "@/components/apps/instution/InstituteForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { InstituteDialogData, instutionSchema } from "@/schema";
import { generateCsv } from "@/services/dashboard/common-service";
import { createInstution, updateInstitute } from "@/services/dashboard/institution-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
type InstutionDialogProps = {
  isAddInstutionModalOpen: boolean;
  setIsAddInstutionModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  instutionData?: InstituteDialogData;
  docId?: string;
};
type InstutionData = z.infer<typeof instutionSchema>;

const InstutionDialog = ({
  isAddInstutionModalOpen,
  setIsAddInstutionModalOpen,
  instutionData,
  docId,
}: InstutionDialogProps) => {
  const form = useForm<InstutionData>({
    resolver: zodResolver(instutionSchema),
    defaultValues: instutionData || {}, // Use studentData for edit mode
  });
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: InstutionData) => {
      if (!instutionData) {
        data.password = data.password || generatePassword();
        const response = await createInstution(data, user?.userToken);

        if (response?.error) {
          toast.error(response?.error);
          throw Error(response?.error);
        }
        toast.success("Institution created successfully!");
        generateCsv("Institution", [data]);
      } else {
        await updateInstitute(docId!, user?.userToken, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getInstution"],
      });
      setIsAddInstutionModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating Instution:", error);
    },
  });

  const onSubmit = async (data: InstutionData) => {
    try {
      instutionSchema.parse(data);
      mutate(data);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Dialog open={isAddInstutionModalOpen} onOpenChange={(val) => setIsAddInstutionModalOpen(val)}>
      <DialogContent className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <DialogHeader>
              <DialogTitle>{instutionData ? "Edit" : "Add"} New Institute</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                {instutionData ? "Edit" : "Add"} institute with the following details
                <Button type="submit" className="px-14 w-full max-w-[50px]" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <InstituteForm form={form} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InstutionDialog;

function generatePassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
