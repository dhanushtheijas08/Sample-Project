"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { firebaseTimestampToNormal } from "@/lib/utils";
import { GradeSection, StudentDialogData } from "@/schema";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import StudentActions from "./StudentActions";
export type StudentTable = {
  studentName: string;
  studentId: string;
  studentProfileImg: string;
  studentEmail: string;
  studentPhoneNumber: string;
  createdAt: Timestamp;
  gradeAndSection: GradeSection;
  isDeleted: boolean;
  id: string;
};

export const columns: ColumnDef<StudentTable>[] = [
  {
    accessorKey: "studentName",
    header: "Name",
    cell: ({ row }) => {
      const studentName = row.original.studentName;
      const studentId = row.original.studentId;
      const studentProfileImg = row.original.studentProfileImg;

      return (
        <div className="flex items-center space-x-2 w-[200px] overflow-hidden">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage
              src={`${studentProfileImg}`}
              alt={"CN"}
              className="animate-in fade-in-50"
            />
            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
              {studentName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            {studentName.length > 25 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="font-medium truncate cursor-pointer">
                      {studentName}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{studentName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="font-medium ">{studentName}</p>
            )}

            <p className="text-sm text-muted-foreground truncate">
              {studentId}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "gradeAndSection",
    header: "Grade/Section",
    cell: ({ row }) => {
      const gradeAndSection = row.original.gradeAndSection?.name || "";
      return <p> {gradeAndSection} </p>;
    },
  },
  {
    accessorKey: "studentEmail",
    header: "Email",
  },
  {
    accessorKey: "studentPhoneNumber",
    header: "Phone Number",
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return firebaseTimestampToNormal(createdAt);
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
            isDeleted === false
              ? "bg-[#BBFCC9] text-[#2E2E30]"
              : "bg-red-200 text-[#2E2E30]"
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
      const docId = row.original.id!;

      const studentData: StudentDialogData = {
        name: row.original.studentName,
        email: row.original.studentEmail,
        phone: row.original.studentPhoneNumber,
        gradeAndSection: row.original.gradeAndSection,
        studentId: row.original.studentId,
        isDeleted: row.original.isDeleted,
      };

      return <StudentActions docId={docId} studentData={studentData} />;
    },
  },
];
