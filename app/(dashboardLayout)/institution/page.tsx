"use client";
import { columns } from "@/components/apps/instution-table/columns";
import { DataTable } from "@/components/apps/instution-table/data-table";
import InstutionDialog from "@/components/apps/instution/InstutionDialog";
import { AppLayout } from "@/components/common";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import TableSkeleton from "@/components/common/TableSkeleton";
import { getInstution } from "@/services/dashboard/institution-service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type InstituteTable = {
  instutionName: string;
  instutionEmail: string;
  instutionPhoneNumber: string;
  instutionProfileImg: string;
  createdAt: string;
  id: string;
  isDeleted: boolean;
};

const DashboardPage = () => {
  const [isAddInstutionModalOpen, setIsAddInstutionModalOpen] = useState(false);

  const handleBtn = () => {
    setIsAddInstutionModalOpen(true);
  };
  const { isLoading, data: instituteData } = useQuery<InstituteTable[], Error>({
    queryKey: ["getInstution"],
    queryFn: getInstution,
  });

  return (
    <ProtectedRoute allowedRoles={["superadmin"]}>
      <AppLayout appLayoutHeading="Institutions" btnText="Add Institution" btnAction={handleBtn} showButton={true}>
        <div className="mt-5">
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : !instituteData || instituteData?.length < 1 ? (
            <p>No data found</p>
          ) : (
            <DataTable columns={columns} data={instituteData!} />
          )}
        </div>
        <InstutionDialog
          isAddInstutionModalOpen={isAddInstutionModalOpen}
          setIsAddInstutionModalOpen={setIsAddInstutionModalOpen}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default DashboardPage;
