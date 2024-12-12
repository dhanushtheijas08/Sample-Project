/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import CourseProgress from "@/components/apps/dashboard/CourseProgress";
import { ProtectedRoute } from "@/components/common/index";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { getClassroomByRole } from "@/services/dashboard/classroom-service";
import { useQuery } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import CoursesBoughtOrSold from "./CoursesBought";
import DashboardHeader from "./DashboardHeader";
import TicketManagement from "./Ticket";
import { Card } from "@/components/ui/card";
import StudentsHeatMap from "./StudentsHeatMap";
import TicketsTable from "./TicketsTable";
import { getAllTickets } from "@/services/dashboard/ticket-service";
import { TicketData } from "@/schema";
import TicketsPage from "@/app/(dashboardLayout)/tickets/page";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<{
    class: string | undefined;
    course: string | undefined;
    theme: string | undefined;
  }>({
    class: "6th A CSE",
    course: "Basic Robotics",
    theme: "Theme 1",
  });
  const [isCompare, setIsCompare] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | "all">("all");
  const [studentsData, setStudentsData] = useState([
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
    {
      profileImg: "/student-profile.png",
      studentName: "Ram Kumar",
      studentMark: 500,
    },
  ]);

  const { user } = useAuth();

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

  // const { data: classData, isLoading: classroomDataLoading } = useQuery({
  //   queryKey: ["getClass", user?.uid],
  //   queryFn: async () => {
  //     if (!user?.uid || !user.role) return;
  //     const classCollection = collection(db, "classes");
  //     const whereQ =
  //       user.role === "teacher"
  //         ? where("teacherId", "==", user?.uid)
  //         : where("adminId", "==", user?.uid);
  //     const q = query(classCollection, whereQ);

  //     const querySnapshot = await getDocs(q);
  //     const classList = querySnapshot.docs.map((doc) => {
  //       const data = doc.data();

  //       return {
  //         id: doc.id,
  //         className: data.name || "",
  //         themes: data.themes || [],
  //       };
  //     });
  //     return classList;
  //   },
  // });

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="flex flex-col xl:flex-row gap-2 justify-between mt-4">
        <CoursesBoughtOrSold componentOwner="admin" />
        {/* <div className="w-full bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
          <TicketsPage />
        </div> */}
        <TicketManagement />
        {/* <CountCardExample /> */}
      </div>

      <div className="mb-14 flex flex-col gap-5 flex-1 mt-8">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-nowrap">
            Details of{" "}
          </h2>

          <DashboardHeader isCompare={false} setIsCompare={() => {}} />
        </div>
        <div className="flex flex-col xl:flex-row gap-5">
          {/* <StudentsPerformance
            studentsData={studentsData}
            maxHeight="h-[950px]"
          /> */}
          <CourseProgress className="lg:max-w-md lg:mx-auto" />
        </div>

        <Card>
          <div className="my-12">
            <StudentsHeatMap studentsLevelData={studentsLevelData} />
          </div>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;
