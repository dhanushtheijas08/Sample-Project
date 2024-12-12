"use client";
import { deleteStudentById } from "@/services/dashboard/student-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ docId, userToken }: { docId: string; userToken: string | null | undefined }) =>
      deleteStudentById(docId, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });
      toast.success("Student deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting student:", error);
    },
  });

  return mutation;
};
