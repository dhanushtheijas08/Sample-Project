"use client";
import StudentForm from "@/components/apps/student/StudentForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { StudentDialogData, studentSchema } from "@/schema";
import { generateCsv } from "@/services/dashboard/common-service";
import { createStudent, updateStudent } from "@/services/dashboard/student-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type StudentData = z.infer<typeof studentSchema>;

type StudentDialogProps = {
  isAddStudentModalOpen: boolean;
  setIsAddStudentModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  studentData?: StudentDialogData | null; // Added to hold student data for editing
  docId?: string;
  onClose?: () => void; // Callback to reset studentData on close
};

function generatePassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

const StudentDialog = ({
  isAddStudentModalOpen,
  setIsAddStudentModalOpen,
  studentData,
  docId,
  onClose,
}: StudentDialogProps) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationKey: ["CreateStudent"],
    mutationFn: async (data: StudentData) => {
      if (!studentData) {
        data.password = data.password || generatePassword();
        console.log(data);
        const response = await createStudent(data, user?.userToken);

        if (response?.error) {
          console.log(response);

          toast.error(response.error);
          throw Error(response.error);
        }
        toast.success("Student created successfully!");
        generateCsv("Student", [data]);
      } else {
        await updateStudent(docId!, user?.userToken, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });

      setIsAddStudentModalOpen(false);
      form.reset();
      if (onClose) onClose();
    },
    onError: (error) => {
      console.error("Error creating student:", error);
    },
  });

  const form = useForm<StudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: studentData || {},
  });

  const onSubmit = async (data: StudentData) => {
    try {
      studentSchema.parse(data);
      mutate(data);
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  useEffect(() => {
    // Reset form with new data if studentData changes
    form.reset(studentData || {});
  }, [isAddStudentModalOpen, studentData, form]);

  const handleClose = () => {
    setIsAddStudentModalOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isAddStudentModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            <DialogHeader>
              <DialogTitle>{studentData ? "Edit Student" : "Add New Student"}</DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                {studentData ? "Edit" : "Add"} student with the following details
                <Button type="submit" className="px-14 w-full max-w-[50px]" disabled={isPending}>
                  {isPending ? "Saving..." : "Save"}
                </Button>
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <StudentForm form={form} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDialog;
