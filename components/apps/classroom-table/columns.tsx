"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertTimestampToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import ClassroomAction from "./ClassroomAction";

export type ClassTable = {
  grade: string;
  name: string;
  startsAt: string;
  isArchived: boolean;
  studentsCount: string;
  teacherId: string;
  teacherName: string;
  teacherProfileImg: string;
  image: string;
  adminId: string;
  id: string;
};

export const columns: ColumnDef<ClassTable>[] = [
  {
    accessorKey: "className",
    header: "Name",
    cell: ({ row }) => {
      const className = row.original.name;
      const classProfileImg = row.original.image;
      const gradeAndSection = row.original.grade;
      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage src={`${classProfileImg}`} alt={"CN"} className="animate-in fade-in-50" />
            <AvatarFallback className="rounded-full uppercase text-xl font-semibold">
              {className.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{className}</p>
            <p className="text-muted-foreground text-xs">{gradeAndSection}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "studentsCount",
    header: "Student Count",
    cell: ({ row }) => {
      console.log(row.original);
      const count = row.original.studentsCount;
      return <div className="ml-10">{count} </div>;
    },
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
    cell: ({ row }) => {
      const teacherName = row.original.teacherName;
      const teacherId = row.original.teacherId;
      const teacherProfileImg = row.original.teacherProfileImg;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage src={`${teacherProfileImg}`} alt={"CN"} className="animate-in fade-in-50" />
            <AvatarFallback className="rounded-full uppercase text-xl font-semibold">
              {teacherName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p>{teacherName}</p>
            <p className="text-xs text-muted-foreground">{teacherId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.startsAt;
      if (!createdAt) return <div>{Date.now()}</div>;
      if (typeof createdAt === "string") return <div> {createdAt} </div>;
      return convertTimestampToDate(createdAt);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isArchived = row.original.isArchived;
      const status = !isArchived ? "Active" : "Inactive";

      return (
        <div
          className={`py-1 w-20 text-center rounded-md text-xs  ${
            isArchived === false ? "bg-[#BBFCC9] text-[#2E2E30]" : "bg-[#D9D9D9] text-[#2E2E30]"
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
      const classroomId = row.original.id;
      const isArchived = row.original.isArchived;

      return (
        // <div className="flex  items-end">
        //   <Button variant="ghost" size="icon" className="bg-transparent">
        //     <ChevronsRight />
        //   </Button>
        //   <Button variant="ghost" size="icon" className="bg-transparent">
        //     <Edit />
        //   </Button>
        // </div>
        <ClassroomAction classroomId={classroomId} isArchived={isArchived} />
      );
    },
  },
];
