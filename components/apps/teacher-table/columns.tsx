"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { convertTimestampToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import TeacherActions from "./TeacherActions";
import { TeacherDialogeData } from "@/schema";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type TeacherTable = {
  teacherName: string;
  teacherId: string;
  teacherProfileImg: string | null;
  teacherEmail: string;
  teacherPhoneNumber: string;
  createdAt: Timestamp;
  id: string;
  isDeleted: boolean;
};

export const columns: ColumnDef<TeacherTable>[] = [
  {
    accessorKey: "teacherName",
    header: "Name",
    cell: ({ row }) => {
      const teacherName = row.original.teacherName;
      const teacherId = row.original.teacherId;
      const teacherProfileImg = row.original.teacherProfileImg;

      return (
        <div className="flex items-center space-x-2 w-[200px] overflow-hidden">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage src={`${teacherProfileImg}`} alt={"CN"} className="animate-in fade-in-50" />
            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
              {teacherName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            {teacherName.length > 25 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="font-medium truncate cursor-pointer">{teacherName}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{teacherName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="font-medium ">{teacherName}</p>
            )}

            <p className="text-sm text-muted-foreground truncate">{teacherId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "teacherEmail",
    header: "Email",
  },
  {
    accessorKey: "teacherPhoneNumber",
    header: "Phone Number",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return convertTimestampToDate(createdAt);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const isDeleted = row.original.isDeleted;
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
      const teacherId = row.original.id!;

      const teacherData: TeacherDialogeData = {
        name: row.original.teacherName,
        email: row.original.teacherEmail,
        phone: row.original.teacherPhoneNumber,
        id: row.original.teacherId,
        isDeleted: row.original.isDeleted,
      };

      return <TeacherActions teacherId={teacherId} teacherData={teacherData} />;
    },
  },
];
