/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import CourseProgress from "@/components/apps/dashboard/CourseProgress";
import DashboardHeader from "@/components/apps/dashboard/DashboardHeader";
import { ProtectedRoute } from "@/components/common/index";
import { useAuth } from "@/context/AuthContext";
import { getClassroomByRole } from "@/services/dashboard/classroom-service";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import RecentFeedbackCard from "./RecentFeedback";
import StudentsPerformance from "./StudentsPerformance";
import { Card } from "@/components/ui/card";
import StudentsHeatMap from "./StudentsHeatMap";

const TeacherDashboard = () => {
  const [isCompare, setIsCompare] = useState(false);

  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { data, isLoading } = useQuery({
    queryKey: ["getScoreboard"],
    queryFn: () => getClassroomByRole({ userUid: user?.uid as string }),
  });

  let studentsLevelData: any = null;
  if (!isLoading) {
    studentsLevelData = data?.map((classItem: any) =>
      classItem.students.map((student: any) => ({
        ...student,
        classId: classItem.id,
      }))
    );
  }

  const studentsData = [
    {
      profileImg: "/profile.png",
      studentName: "Ram Kumar",
      studentMark: 80,
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardHeader setIsCompare={setIsCompare} isCompare={isCompare} />
      <div className="mb-14 flex flex-col gap-5 flex-1">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="space-y-5 h-full">
            <RecentFeedbackCard />
            {/* <StudentsPerformance
              studentsData={studentsData}
              maxHeight="h-full max-h-[420px]"
            /> */}
          </div>
          <CourseProgress className="lg:max-w-md lg:mx-auto h-full" />
        </div>
        <Card>
          <div className="my-12">
            <StudentsHeatMap studentsLevelData={studentsLevelData} />
          </div>
        </Card>
      </div>
      {/*       
      {isCompare ? (
        <Card className="max-w-md mb-14 mx-auto lg:mx-0">
          <CardHeader className="flex flex-row space-y-0 gap-2.5">
            <Select
              defaultValue="all"
              onValueChange={(val) => setSelectedStudent(val)}
            >
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent className="text-lg">
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="ram-kumar">Ram Kumar</SelectItem>
                <SelectItem value="sam-kumar">Sam Kumar</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg text-left mb-2.5">Basic Robotics</h3>
            <CourseProgressCard1
              isCompare={true}
              selectedStudent={selectedStudent}
            />
            {selectedStudent === "all" ? (
              <LevelChart />
            ) : (
              <CourseProgressCard2
                selectedStudent={selectedStudent}
                isCompare={isCompare}
              />
            )}
            <HoursSpendChart selectedStudent={selectedStudent} />
            <ProgressChart selectedStudent={selectedStudent} />
          </CardContent>
        </Card>
      ) : (
       
      )} */}
    </ProtectedRoute>
  );
};

export default TeacherDashboard;
