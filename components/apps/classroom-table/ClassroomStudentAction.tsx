/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { getClassroom, transferStudent } from "@/services/dashboard/classroom-service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type ClassStudentActionsProps = {
  studentId: string;
  studentData: {
    name: string;
    email: string;
    grade: string;
    isDeleted: boolean;
  };
};

export default function ClassStudentActions({ studentId, studentData }: ClassStudentActionsProps) {
  const { user } = useAuth();
  const { classroomId } = useParams();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [classroom, setClassroom] = useState<any>(undefined);
  const [newClassroomId, setNewClassroomId] = useState<string | null>(null);

  const { mutate: loadClassroomData, isPending: isClassroomLoading } = useMutation({
    mutationKey: ["classroom"],
    mutationFn: () =>
      getClassroom({
        userId: user?.uid as string,
        role: user?.role as string,
      }),
    onSuccess: (data) => {
      setClassroom(data);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () => transferStudent(studentId, classroomId as string, newClassroomId!, user?.userToken),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["classroom", classroomId],
      });
      setIsDialogOpen(false);
      toast.success("Student transferred successfully");
    },
  });

  return (
    <div className="flex gap-5">
      {/* <Button
        variant="ghost"
        size="icon"
        className="bg-transparent hover:bg-transparent"
      >
        View
      </Button> */}
      {studentData.isDeleted === false && (
        <Dialog open={isDialogOpen} onOpenChange={(val) => setIsDialogOpen(val)}>
          <DialogTrigger asChild>
            <Button>Transfer</Button>
          </DialogTrigger>
          <DialogContent className="bg-background">
            <DialogHeader>
              <DialogTitle>Are you sure you want to transfer this student?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {studentData.name}
              </p>
              <p>
                <strong>Email:</strong> {studentData.email}
              </p>
              <p>
                <strong>Grade:</strong> {studentData.grade}
              </p>

              <Button
                onClick={() => loadClassroomData()}
                disabled={isClassroomLoading}
                className={cn(classroom !== undefined ? "hidden" : "block")}
              >
                {isClassroomLoading ? "Loading..." : "Load Classroom"}
              </Button>
              {classroom && (
                <Select onValueChange={(val) => setNewClassroomId(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new classroom" />
                  </SelectTrigger>
                  <SelectContent>
                    {classroom
                      .filter((cls: any) => cls.id !== classroomId)
                      .map((cls: any) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <DialogFooter>
              <Button disabled={isPending || !newClassroomId} onClick={() => mutate()}>
                Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
