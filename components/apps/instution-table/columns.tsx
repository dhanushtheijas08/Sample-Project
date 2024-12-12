"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { firebaseTimestampToNormal } from "@/lib/utils";
import { InstituteDialogData } from "@/schema";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { ColumnDef } from "@tanstack/react-table";
import InstituteActions from "../instution/InstituteActions";
export type InstutionTable = {
  instutionName: string;
  instutionEmail: string;
  instutionPhoneNumber: string;
  createdAt: string | Date;
  id: string;
  isDeleted: boolean;
};

export const columns: ColumnDef<InstutionTable>[] = [
  {
    accessorKey: "instutionName",
    header: "Name",
    cell: ({ row }) => {
      const instutionName = row.original.instutionName;

      return (
        <div className="flex items-center space-x-2 w-[200px] overflow-hidden">
          <Avatar className="h-10 w-10 bg-gray-100 rounded-full border flex items-center justify-center">
            <AvatarFallback className="rounded-full uppercase text-sm font-semibold ">
              {instutionName.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            {instutionName.length > 25 ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="font-medium truncate cursor-pointer">
                      {instutionName}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{instutionName}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <p className="font-medium ">{instutionName}</p>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "instutionEmail",
    header: "Email",
  },
  {
    accessorKey: "instutionPhoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <p>{firebaseTimestampToNormal(createdAt)}</p>;
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
      const instituteId = row.original.id!;

      const instituteData: InstituteDialogData = {
        name: row.original.instutionName,
        email: row.original.instutionEmail,
        phone: row.original.instutionPhoneNumber,
        isDeleted: row.original.isDeleted,
      };

      return (
        <InstituteActions
          instituteId={instituteId}
          instituteData={instituteData}
        />
      );
    },
  },
];
