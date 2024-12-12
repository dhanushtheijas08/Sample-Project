/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CourseProgressCard1 from "./CourseProgressCard1";
import CourseProgressCard2 from "./CourseProgressCard2";
import HoursSpendChart from "./HoursSpendChart";
import ProgressChart from "./ProgressChart";

type LevelType = {
  type: string;
  status: string;
};

type ThemeType = {
  id: string;
  name: string;
  levels: LevelType[];
};

type StudentType = {
  uid: string;
  name: string;
  themes: ThemeType[];
};

type ClassDataType = {
  id: string;
  image: string;
  name: string;
  themes: ThemeType[];
  students: StudentType[];
};

export default function CourseProgress({ className }: { className?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<string | undefined>();

  const { data: classData, isLoading: classroomDataLoading } = useQuery<ClassDataType | undefined>({
    queryKey: ["getClassroom", searchParams.get("class")],
    queryFn: async (): Promise<ClassDataType | undefined> => {
      if (!user?.uid) return undefined;

      // const docRef = doc(db, "users", user.uid);
      // const docSnap = await getDoc(docRef);
      // if (!docSnap.exists()) return undefined;

      // const userData = docSnap.data();
      // if (userData.role !== "teacher" || userData.role !== "admin")
      //   return undefined;

      const classroomId = searchParams.get("class");
      if (!classroomId) return undefined;

      const classroomDocRef = doc(db, "classes", classroomId);
      const classroomSnap = await getDoc(classroomDocRef);
      if (classroomSnap.exists()) {
        return classroomSnap.data() as ClassDataType;
      }

      return undefined;
    },
  });

  useEffect(() => {
    if (!classData || classroomDataLoading) return;

    const currentStudent = searchParams.get("studentId") || classData.students[0]?.uid;
    if (currentStudent) {
      setSelectedStudent(currentStudent);
    }

    if (!searchParams.get("studentId") && classData.students.length > 0) {
      const params = new URLSearchParams(window.location.search);
      params.set("studentId", currentStudent!);
      router.replace(`?${params.toString()}`);
    }
  }, [classData, classroomDataLoading, searchParams, router]);

  const handleStudentChange = (studentId: string) => {
    setSelectedStudent(studentId);

    const params = new URLSearchParams(window.location.search);
    params.set("studentId", studentId);
    router.replace(`?${params.toString()}`);
  };

  if (classroomDataLoading) return <div>Loading...</div>;
  if (!classData) return <div>No data found</div>;

  const classroomStudents =
    classData.students?.map((student) => ({
      name: student.name,
      id: student.uid,
    })) || [];

  return (
    <Card className={cn("w-full max-w-md mx-auto lg:mx-0 lg:max-w-3xl xl:max-w-full h-full pt-0", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:justify-between lg:justify-start lg:items-center gap-5">
          <h1 className="text-xl font-semibold text-[#464646]">Course Progress of</h1>
          <Select value={selectedStudent} onValueChange={handleStudentChange}>
            <SelectTrigger className="w-full sm:w-[180px] lg:w-[220px] text-base">
              <SelectValue placeholder="Select Student" className="capitalize" />
            </SelectTrigger>
            <SelectContent>
              {classroomStudents.map((student) => (
                <SelectItem value={student.id} key={student.id}>
                  {student.name?.[0].toLocaleUpperCase() + student.name?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pb-0 pt-0 h-full">
        <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-5 gap-x-10 w-full">
          <CourseProgressCard1 classData={classData} />
          <CourseProgressCard2 classData={classData} />

          <HoursSpendChart />
          <ProgressChart />
        </div>
      </CardContent>
    </Card>
  );
}
