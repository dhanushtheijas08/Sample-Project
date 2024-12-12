"use client";
import { columns } from "@/components/apps/classroom-table/columns";
import { DataTable } from "@/components/apps/classroom-table/data-table";
import ClassroomDialog from "@/components/apps/classroom/ClassroomDialog";
import { AppLayout } from "@/components/common";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAuth } from "@/context/AuthContext";
import { getClassroom } from "@/services/dashboard/classroom-service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const ClassroomPage = () => {
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const handleBtn = () => {
    setIsAddClassModalOpen(true);
  };
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["classroom"],
    queryFn: () =>
      getClassroom({
        userId: user?.uid as string,
        role: user?.role as string,
      }),
  });

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <AppLayout
        appLayoutHeading="Classroom"
        btnText={user?.role === "admin" ? "Add Classroom" : ""}
        btnAction={handleBtn}
        showButton={user?.role === "admin"}
      >
        <div className="mt-5">
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : data ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <p className="text-center">No Classroom Data</p>
          )}
        </div>
        <ClassroomDialog isOpen={isAddClassModalOpen} onOpenChange={setIsAddClassModalOpen} isLoading={isLoading} />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ClassroomPage;
