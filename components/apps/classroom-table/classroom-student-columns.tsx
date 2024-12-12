"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertTimestampToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ClassStudentActions from "./ClassroomStudentAction";

export type ClassStudentsTable = {
  studentsData: {
    grade: {
      name: string;
      id: string;
    };
    email: string;
    id: string;
    image: string;
    plan: string;
    name: string;
    studentId: string;
    uid: string;
    isDeleted: boolean;
  };
  duration: string;
  startsAt: string;
};

export const columns: ColumnDef<ClassStudentsTable>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const studentName = row.original.studentsData.name;
      const studentProfileImg = row.original.studentsData.image;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage src={`${studentProfileImg}`} alt={"CN"} className="animate-in fade-in-50" />
            <AvatarFallback className="rounded-full uppercase text-xl font-semibold">
              {studentName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{studentName}</p>
            {/* <p className="text-muted-foreground text-xs">{grade}</p> */}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "emailAndPhone",
    header: "Email",
    cell: ({ row }) => {
      const email = row.original.studentsData.email;
      return (
        <div className=" flex flex-col">
          <p> {email} </p>
        </div>
      );
    },
  },
  {
    accessorKey: "startsAt",
    header: "Activated On",
    cell: ({ row }) => {
      const createdAt = row.original.startsAt;
      if (!createdAt) return <div>{Date.now()}</div>;
      if (typeof createdAt === "string") return <div> {createdAt} </div>;
      return convertTimestampToDate(createdAt);
    },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => {
      const plan = row.original.studentsData.plan;
      return <div className="bg-secondary px-1 text-center py-1.5 rounded">{plan}</div>;
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.duration;
      return <div> {duration} Day</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.original.studentsData.isDeleted;
      const status = isDeleted === false ? "Active" : "Deleted";

      return (
        <div
          className={`py-1 w-20 text-center rounded-md text-xs  ${
            isDeleted === false ? "bg-[#BBFCC9] text-[#2E2E30]" : "bg-red-200 text-[#2E2E30]"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="mx-5">Action</div>,

    cell: ({ row }) => {
      const stdId = row.original.studentsData.uid;
      const name = row.original.studentsData.name;
      const email = row.original.studentsData.email;
      const grade = row.original.studentsData.grade;
      const isDeleted = row.original.studentsData.isDeleted;

      console.log(row.original.studentsData);

      return <ClassStudentActions studentId={stdId} studentData={{ name, email, grade: grade?.name, isDeleted }} />;
    },
  },
];
