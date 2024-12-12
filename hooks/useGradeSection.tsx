"use client";
import { deleteGradeSection } from "@/services/dashboard/grade-section-service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteGradeSection = () => {
  // const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ uid, id }: { uid: string; id: string }) => {
      await deleteGradeSection(uid, id);
    },
    onSuccess: () => {
      toast.success("Grade and Section deleted successfully!");
    },
    onError: (error) => {
      console.error("Error deleting teacher:", error);
    },
  });

  return mutation;
};
