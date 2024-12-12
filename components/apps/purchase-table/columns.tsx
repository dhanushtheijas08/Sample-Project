/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import HistoryDialog from "../purchase/HistoryDialog";

type AdminCourseObj = {
  name: string;
  image: string;
};

export type PurchaseInfo = {
  instituteName: string;
  courseName: string;
};

export type PurchaseTable = {
  admin: AdminCourseObj;
  instituteProfileImg: string;
  course: AdminCourseObj;
  courseProfileImg: string;
  annual: number;
  monthly: number;
  total: number;
  history: Record<string, any>;
  purchasedAt: Timestamp;
};
const ActionsCell = ({ row }: { row: any }) => {
  const [open, setOpen] = useState(false);

  const purchaseInfo = {
    instituteName: row.original?.admin?.name,
    courseName: row.original?.course?.name,
  };

  return (
    <div className="flex gap-5 items-end">
      <HistoryDialog open={open} setOpen={setOpen} historyObject={row.original.history} purchaseInfo={purchaseInfo} />
    </div>
  );
};

export const columns: ColumnDef<PurchaseTable>[] = [
  {
    accessorKey: "InstituteName",
    header: "Institute",
    cell: ({ row }) => {
      const admin = row.original.admin;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
              {admin.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium">{admin.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "CourseName",
    header: "Course",
    cell: ({ row }) => {
      const course = row.original.course;

      return (
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 rounded-full border">
            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
              {course.name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <p className="font-medium">{course.name}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "annual",
    header: "Unused Annual",
  },
  {
    accessorKey: "monthly",
    header: "Unused Monthly",
  },
  {
    accessorKey: "Total",
    header: "Total",
    cell: ({ row }) => {
      const annual = row.original.annual;
      const monthly = row.original.monthly;
      const total = annual + monthly;

      return (
        <div className="flex items-center space-x-2">
          <p className="font-medium">{total}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasedAt",
    header: "Purchase Date",
    cell: ({ row }) => {
      const purchasedAt = row.original.purchasedAt;
      const purchasedAtDate = purchasedAt?.toDate();

      return (
        <div className="flex items-center space-x-2">
          <p className="font-medium">{purchasedAtDate ? purchasedAtDate.toLocaleDateString() : "N/A"}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="mx-5">Action</div>,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
