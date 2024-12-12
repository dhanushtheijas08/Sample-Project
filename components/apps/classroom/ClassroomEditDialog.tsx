/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { classroomSchema } from "@/schema";
import { updateClassroom } from "@/services/dashboard/classroom-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { EditStep1 } from "./EditStep1";
import { EditStep2 } from "./EditStep2";
import { EditStep3 } from "./EditStep3";

interface Student {
  studentName: string;
  studentId: string;
  studentPhone: string;
  studentEmail: string;
  studentProfileImg: string;
  licenseType: "Annual" | "Monthly";
  gradeAndSection: string;
  isDeleted: boolean;
  id: string;
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
    if (newTheme.displayLevels) delete newTheme.displayLevels;
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

type FormValues = z.infer<typeof classroomSchema>;
const ClassroomEditDialog = ({ classroomData }: { classroomData: any }) => {
  const { user } = useAuth();
  const { classroomId } = useParams();
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [isLicenseCountValid, setIsLicenseCountValid] = useState(true);
  const [themeDates, setThemeDates] = useState<any>(classroomData.themes);
  const [submitBtnStatus, setSubmitBtnStatus] = useState<null | "done">(null);
  const oldStudents = classroomData.students.map((student: any) => ({
    studentName: student.name,
    id: student.uid,
    studentId: student.studentId,
    studentEmail: student.email,
    gradeAndSection: student?.grade?.name || "",
    studentProfileImg: student.image,
    licenseType: student.plan,
  }));

  const { mutate, status } = useMutation({
    mutationFn: (transformedPayload: ReturnType<typeof transformPayload>) =>
      updateClassroom(
        classroomId as string,
        transformedPayload,
        user?.userToken as string
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classroom"],
      });
      queryClient.invalidateQueries({
        queryKey: ["getAvailableLicences"],
      });
      toast.success("Classroom updated successfully!");
      form.reset();
      setStep(1);
      setSelectedStudents([]);
      setThemeDates([]);
      push("/classroom");
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
    },
  });
  const form = useForm<FormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      className: classroomData.name,
      classProfileImg: classroomData.image,
      course: classroomData.course.id,
      courseName: classroomData.course.name,
      courseImage: classroomData.course.image,
      gradeAndSectionId: classroomData.grade.id,
      gradeAndSectionName: classroomData.grade.name,
      teacherEmail: classroomData.teacher.email,
      teacherName: classroomData.teacher.name,
      teacherId: classroomData.teacher.id,
      teacherUid: classroomData.teacher.uid,
      teacherProfileImg: classroomData.teacher.image,
      startsAt: classroomData.startsAt,
      classBadge: "",
      coTeacherEmail: classroomData.coTeacher?.email,
      coTeacherName: classroomData.coTeacher?.name,
      coTeacherId: classroomData.coTeacher?.id,
      coTeacherUid: classroomData.coTeacher?.uid,
      coTeacherProfileImg: classroomData.coTeacher?.image,
      unlockType: classroomData.unlockType as
        | "manual"
        | "sequential"
        | "theme-by-theme",
      duration: classroomData.duration,
    },
  });

  const onSubmit = (data: any) => {
    if (!submitBtnStatus) return;

    const payload: FormData = {
      ...data,
      students: selectedStudents,
      themeDates: themeDates,
    };

    const transformedPayload = transformPayload(payload);
    transformedPayload.students = [
      ...classroomData.students,
      ...transformedPayload.students,
    ];
    mutate(transformedPayload);
  };
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  return (
    <Dialog>
      <DialogHeader>
        <DialogTrigger>
          <Button>Edit</Button>
        </DialogTrigger>
      </DialogHeader>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto scrollbar-none">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {step === 1 && "Edit Class"}
                {step === 2 && "Student Selection"}
                {step === 3 && "Course Unlocking"}
              </DialogTitle>
              <DialogDescription className="flex justify-between items-center">
                {step === 1 && "Edit class and assign to Teacher"}
                {step === 2 && "Add Students to class"}
                {step === 3 && "Decide how the course should be unlocked"}
                <div>
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="mr-2"
                      disabled={status === "pending"}
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button type="button" onClick={nextStep}>
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
              </DialogDescription>
            </DialogHeader>
            <Separator />
            {step === 1 && <EditStep1 form={form} />}
            {step === 2 && (
              <EditStep2
                form={form}
                selectedStudents={selectedStudents}
                setSelectedStudents={setSelectedStudents}
                oldStudents={oldStudents}
                isLicenseCountValid={isLicenseCountValid}
                setIsLicenseCountValid={setIsLicenseCountValid}
              />
            )}
            {step === 3 && (
              <EditStep3
                // hasMonthlyLicense={hasMonthlyLicense}
                disabled={status === "pending"}
                form={form}
                themeDates={themeDates}
                setThemeDates={setThemeDates}
              />
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassroomEditDialog;
