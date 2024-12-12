/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import CourseProgress from "@/components/apps/dashboard/CourseProgress";
import StudentsPerformance from "@/components/apps/dashboard/StudentsPerformance";
import { ProtectedRoute } from "@/components/common/index";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { CountCardExample } from "./Count";
import CoursesBoughtOrSold from "./CoursesBought";
import TicketManagement from "./Ticket";

const SuperAdminDashboard = () => {
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
  return (
    <ProtectedRoute allowedRoles={["superadmin"]}>
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="flex flex-col xl:flex-row gap-2 justify-between mt-4">
        <CoursesBoughtOrSold componentOwner="superadmin" />
        <TicketManagement />
        <CountCardExample />
      </div>
      <div className="mb-14 flex flex-col gap-5 flex-1 mt-8">
        <div className="flex items-center gap-5">
          <h2 className="text-xl font-semibold">Details of </h2>
          <Select>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic-of-robotics">
                Basic of robotics
              </SelectItem>
              <SelectItem value="advanced-robotics">
                Advanced robotics
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          <StudentsPerformance
            studentsData={studentsData}
            maxHeight="h-[950px]"
          />
          {/* <CourseProgress /> */}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SuperAdminDashboard;
