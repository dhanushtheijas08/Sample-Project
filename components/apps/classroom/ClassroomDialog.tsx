/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Step1 } from "./ClassroomForm1";
import { Step2 } from "./ClassroomForm2";
import { Step3 } from "./ClassroomForm3";
import { classroomSchema } from "@/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { createClassroom } from "@/services/dashboard/classroom-service";

type FormValues = z.infer<typeof classroomSchema>;
const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
};

interface Student {
  studentName: string;
  studentId: string;
  studentPhone: string;
  studentEmail: string;
  studentProfileImg: string;
  licenseType: "Annual" | "Monthly";
  gradeAndSection: string;
  id: string;
  isDeleted: boolean;
}

interface ThemeLevel {
  [key: string]: string;
}

interface ThemeDates {
  [themeId: string]: ThemeLevel[];
}

interface FormData {
  className: string;
  gradeAndSectionName: string;
  gradeAndSectionId: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  teacherUid: string;
  teacherProfileImg?: string;
  coTeacherId: string;
  coTeacherUid: string;
  coTeacherName: string;
  coTeacherEmail: string;
  coTeacherProfileImg?: string;
  students: Student[];
  themeDates: ThemeDates[];
  course: string;
  courseName: string;
  courseImage: string;
  duration: string;
  startsAt: string;
  unlockType: "Manual" | "Automatic";
  classProfileImg?: string;
}

const transformPayload = (data: FormData) => {
  const licenceUsed = data.students.reduce(
    (acc, student) => {
      if (student.licenseType.toLocaleLowerCase() === "annual") {
        acc.annual += 1;
      } else if (student.licenseType.toLocaleLowerCase() === "monthly") {
        acc.monthly += 1;
      }
      return acc;
    },
    { annual: 0, monthly: 0 }
  );
  const themes = data.themeDates.map((theme: any) => {
    const newTheme = { ...theme };
    delete newTheme.displayLevels;
    return newTheme;
  });

  return {
    name: data.className,
    grade: {
      name: data.gradeAndSectionName,
      id: data.gradeAndSectionId,
    },
    teacher: {
      id: data.teacherId,
      uid: data.teacherUid,
      name: data.teacherName,
      image: data.teacherProfileImg || "",
      email: data.teacherEmail || "",
    },
    coTeacher: {
      id: data.coTeacherId,
      name: data.coTeacherName,
      uid: data.coTeacherUid,
      image: data.coTeacherProfileImg || "",
      email: data.coTeacherEmail || "",
    },
    course: {
      id: data.course,
      name: data.courseName,
      image: data.courseImage,
    },
    duration: data.duration,
    startsAt: data.startsAt,
    image: data.classProfileImg || "",
    unlockType: data.unlockType,
    students: data.students.map((student) => ({
      name: student.studentName,
      uid: student.id,
      image: student.studentProfileImg || "",
      plan: student.licenseType,
      studentId: student.studentId,
      email: student.studentEmail,
      phone: student.studentPhone,
      grade: student.gradeAndSection,
      isDeleted: student.isDeleted,
    })),
    themeDates: themes,
    licenceUsed,
  };
};

export default function ClassroomAlertDialog({
  isOpen,
  onOpenChange,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isLicenseCountValid, setIsLicenseCountValid] = useState(true);
  const [themeDates, setThemeDates] = useState<any>([]);
  const [submitBtnStatus, setSubmitBtnStatus] = useState<null | "done">(null);

  const hasMonthlyLicense = selectedStudents.some(
    (student) => student.licenseType === "Monthly"
  );
  const { mutate, status } = useMutation({
    mutationFn: (transformedPayload: ReturnType<typeof transformPayload>) =>
      createClassroom(transformedPayload, user?.userToken as string),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["classroom"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAvailableLicences"],
      });
      toast.success("Classroom created successfully");
      onOpenChange(false);
      form.reset();
      setStep(1);
      setSelectedStudents([]);
      setThemeDates([]);
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      className: "",
      classProfileImg: "",
      coTeacherEmail: "",
      coTeacherUid: "",
      courseName: "",
      gradeAndSectionId: "",
      gradeAndSectionName: "",
      teacherEmail: "",
      teacherUid: "",
      teacherName: "",
      coTeacherName: "",
      teacherId: "",
      teacherProfileImg: "",
      startsAt: "",
      course: "",
      classBadge: "",
      coTeacherId: "",
      coTeacherProfileImg: "",
      unlockType: "manual" as "manual" | "sequential" | "theme-by-theme",
      duration: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: any) => {
    if (!submitBtnStatus) return;

    const payload: FormData = {
      ...data,
      students: selectedStudents,
      themeDates: themeDates,
    };

    const isObjectEmpty = isEmpty(payload.themeDates);
    if (isObjectEmpty) return;

    const transformedPayload = transformPayload(payload);
    console.log(JSON.stringify(transformedPayload));

    mutate(transformedPayload);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto scrollbar-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex justify-between items-center">
                <p>
                  {step === 1 && "Add New Class"}
                  {step === 2 && "Student Selection"}
                  {step === 3 && "Course Unlocking"}
                </p>
                <AlertDialogCancel
                  onClick={() => onOpenChange(false)}
                  className="border-none w-fit h-fit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </AlertDialogCancel>
              </AlertDialogTitle>
              <AlertDialogDescription className="flex justify-between items-center">
                {step === 1 && "Create new class and assign to Teacher"}
                {step === 2 && "Add Students to class"}
                {step === 3 && "Decide how the course should be unlocked"}
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="mr-2"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!isLicenseCountValid}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      onClick={() => setSubmitBtnStatus("done")}
                      disabled={status === "pending"}
                    >
                      {status === "pending" ? "Saving..." : "Save"}
                    </Button>
                  )}
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Separator />
            {step === 1 && <Step1 form={form} />}
            {step === 2 && (
              <Step2
                form={form}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                setIsLicenseCountValid={setIsLicenseCountValid}
              />
            )}
            {step === 3 && (
              <Step3
                disabled={status === "pending"}
                hasMonthlyLicense={hasMonthlyLicense}
                form={form}
                themeDates={themeDates}
                setThemeDates={setThemeDates}
              />
            )}
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
