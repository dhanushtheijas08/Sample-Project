"use client";
import { deleteTeacherById } from "@/services/dashboard/teacher-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTeacher = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ teacherId, userToken }: { teacherId: string; userToken: string | null | undefined }) =>
      deleteTeacherById(teacherId, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });
    },
    onError: (error) => {
      console.error("Error deleting teacher:", error);
    },
  });

  return mutation;
};
