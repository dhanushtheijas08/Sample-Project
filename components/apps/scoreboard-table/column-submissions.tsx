"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Award, Calendar, Clock, Star, Timer, User } from "lucide-react";
export type ScordboardData = {
  isLateSubmission: boolean;
  grade: number;
  gamePlayId: string;
  sessionTime: number;
  code: string;
  submittedAt: {
    seconds: number;
    nanoseconds: number;
  };
  levelId: string;
  score: number;
  lateSubmissionDuration: number;
  userInfo: {
    gradeAndSection: {
      id: string;
      name: string;
    };
    name: string;
    image: string;
    createdAt: {
      seconds: number;
      nanoseconds: number;
    };
    adminId: string;
    email: string;
    phone: string;
    studentId: string;
    role: "student";
  };
  studentId: string;
  attempts: number;
  classId: string;
  submissionTime: number;
  timeTaken: number;
  instituteId: string;
};
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
};
export const columns: ColumnDef<ScordboardData>[] = [
  {
    id: "serialNo",
    header: "S.No",
    cell: ({ row }) => {
      return <p>{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "className",
    header: () => {
      return (
        <div className="flex gap-1">
          <User className="size-5" />
          <p className="text-md self-end mt-1">Name</p>
        </div>
      );
    },
    cell: ({ row }) => {
      console.log(row.original);
      const studentName = row.original.userInfo.name || "";
      const studentProfileImg = row.original.userInfo.image || "";
      const studentId = row.original.userInfo.studentId || "";

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarImage
              src={`${studentProfileImg}`}
              alt={"CN"}
              className="animate-in fade-in-50"
            />
            <AvatarFallback className="rounded-full uppercase text-xl font-semibold">
              {studentName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{studentName}</p>
            <p className="text-xs text-muted-foreground">{studentId}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sessionTime",
    // header: "",
    header: () => {
      return (
        <div className="flex gap-1 ">
          <Clock className="size-5" />
          <p className="text-md self-end mt-0.5">Session Time</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const sessionTime = row.original?.sessionTime;
      if (sessionTime == null) return <p>0 sec</p>;

      const time = Number(sessionTime);
      return <p>{time.toFixed(2)} sec</p>;
    },
  },
  {
    accessorKey: "timeTaken",
    // header: "Time Taken",
    header: () => {
      return (
        <div className="flex gap-1">
          <Timer className="size-5" />
          <p className="text-md self-end mt-1">Time Taken</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const timeTaken = row.original?.timeTaken;
      if (timeTaken == null) return <p>0 sec</p>;

      const time = Number(timeTaken);
      return <p>{time.toFixed(2)} sec</p>;
    },
  },

  {
    accessorKey: "score",
    // header: "Score",
    header: () => {
      return (
        <div className="flex gap-1">
          <Award className="size-5" />
          <p className="text-md self-end mt-1">Score</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const score = row.original?.score;
      return <p>{`${score || 0}`} </p>;
    },
  },
  {
    accessorKey: "grade",
    header: () => {
      return (
        <div className="flex gap-1">
          <Star className="size-5" />
          <p className="text-md self-end mt-1">Grade</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const grade = row.original?.grade;

      return (
        <div className="flex gap-1">
          {[...Array(3)].map((_, index) => (
            <span key={index}>
              <Star
                className={cn(
                  "",
                  index < +grade
                    ? "text-[#FBC720] fill-[#FBC720]"
                    : "text-[#E0E0E0] fill-[#E0E0E0]"
                )}
              />
            </span>
          ))}
        </div>
      );
    },
  },

  {
    accessorKey: "submissionTime",
    // header: "Submission Time",
    header: () => {
      return (
        <div className="flex gap-1">
          <Calendar className="size-5" />
          <p className="text-md self-end mt-1">Submission Time</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const totalTimeSpend = row.original?.submissionTime;
      const isLate = row.original.isLateSubmission;

      if (!isLate)
        return (
          <div className="flex flex-row gap-2">
            <p className="">{`${formatTimestamp(totalTimeSpend) || 0}`}</p>
          </div>
        );

      const lateDuration = row.original.lateSubmissionDuration;
      return (
        <div className="flex flex-row gap-2">
          <p className="text-red-500">{`${
            formatTimestamp(totalTimeSpend) || 0
          }`}</p>
          <Badge variant={"destructive"}>{Math.round(lateDuration)} Days</Badge>
        </div>
      );
    },
  },
];
