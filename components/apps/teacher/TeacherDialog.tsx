"use client";
import TeacherForm from "@/components/apps/teacher/TeacherForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { TeacherDialogeData, teacherSchema } from "@/schema";
import { generateCsv } from "@/services/dashboard/common-service";
import { createTeacher, updateTeacher } from "@/services/dashboard/teacher-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TeacherData = z.infer<typeof teacherSchema>;

type TeacherDialogProps = {
  isAddTeacherModalOpen: boolean;
  setIsAddTeacherModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teacherData?: TeacherDialogeData;
  docId?: string;
};

const TeacherDialog = ({ isAddTeacherModalOpen, setIsAddTeacherModalOpen, teacherData, docId }: TeacherDialogProps) => {
  const queryClient = useQueryClient();
  const authToken = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["CreateTeacher"],
    mutationFn: async (data: TeacherData) => {
      console.log("teacher mutate called");
      if (!teacherData) {
        console.log(data);
        data.password = data.password || generatePassword();

        const response = await createTeacher(data, authToken.user?.userToken);
        console.log(response);

        if (response?.errors?.length != 0) {
          toast.error(response.errors[0].error);
          throw Error(response.errors.error);
        }
        toast.success("Teacher created successfully");
        generateCsv("Teacher", [data]);
      } else {
        const teacherData = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          teacherId: data.id,
        };

        await updateTeacher(docId!, authToken.user?.userToken, teacherData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });

      setIsAddTeacherModalOpen(false);
      form.reset();
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
    },
  });

  const form = useForm<TeacherData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: teacherData || {},
  });

  const onSubmit = async (data: TeacherData) => {
    console.log("teacher onSubmit");
    try {
      teacherSchema.parse(data);
      mutate(data);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Dialog open={isAddTeacherModalOpen} onOpenChange={(val) => setIsAddTeacherModalOpen(val)}>
      <DialogContent className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <DialogHeader>
              <DialogTitle>{teacherData ? "Edit New Teacher" : "Add New Teacher"}</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                {teacherData ? "Edit" : "Add"} teacher with the following details
                <Button type="submit" className="px-14 w-full max-w-[50px]" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <TeacherForm form={form} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherDialog;

function generatePassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}
