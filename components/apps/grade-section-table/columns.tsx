"use client";
import { convertTimestampToDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Timestamp } from "firebase/firestore";
import TeacherActions from "./GradeSectionActions";

export type GradeSection = {
  name: string;
  createdAt: Timestamp;
  id: string;
};

export const columns: ColumnDef<GradeSection>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <div className="flex items-center space-x-2">
          <div className="flex flex-col">
            <p className="font-medium">{name}</p>
          </div>
        </div>
      );
    },
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
    id: "actions",
    header: () => <div className="mx-14 text-right">Action</div>,
    cell: ({ row }) => {
      const id = row.original?.id;
      return <TeacherActions id={id} />;
    },
  },
];
