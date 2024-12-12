/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { columns } from "@/components/apps/teacher-table/columns";
import { DataTable } from "@/components/apps/teacher-table/data-table";
import TeacherDialog from "@/components/apps/teacher/TeacherDialog";
import { AppLayout } from "@/components/common";
import ImportBulkDialog from "@/components/common/ImportBulkDialog";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTeachers } from "@/services/dashboard/teacher-service";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { createTeacher } from "@/api/teacher/createTeacher";
import { toast } from "sonner";
import { teacherExcelFileParser } from "@/lib/excelParser";
import { bulkUploadUsers, convertToCSV, downloadCSV } from "@/services/dashboard/common-service";
export type TeacherTable = {
  teacherName: string;
  teacherId: string;
  teacherProfileImg: string;
  teacherEmail: string;
  teacherPhoneNumber: string;
  createdAt: Timestamp;
  id: string;
  isDeleted: boolean;
};

const TeacherPage = () => {
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isImportBulkDialogOpen, setIsImportBulkDialogOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery<TeacherTable[], Error>({
    queryKey: ["getTeachers"],
    queryFn: () => getTeachers(user?.uid as string),
  });

  const {} = useMutation({
    mutationFn: async (data: any) => {
      await createTeacher(data, user?.userToken, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getTeachers"],
      });
      toast.success("Teacher created successfully");
      setIsImportBulkDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
    },
  });

  const description = "File should have Teacher Name, ID, Email, Phone Number.";

  const handleBtn = () => {
    setIsAddTeacherModalOpen(true);
  };
  const handleImportBtn = () => {
    setIsImportBulkDialogOpen(true);
  };

  const handleParsedData = async (parsedData: any) => {
    setloading(true);
    parsedData.shift();

    const response = await bulkUploadUsers(user?.userToken ?? null, "teacher", parsedData);

    if (response.status) {
      const csvData = convertToCSV(response.results);
      downloadCSV("teacher_bulk_upload_results", csvData);
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["getTeachers"] });
    } else {
      toast.error(response.message);
    }
    setIsImportBulkDialogOpen(false);
    setloading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout
        appLayoutHeading="Teacher"
        btnText="Add Teacher"
        secondaryBtnText="Import"
        btnAction={handleBtn}
        secondaryBtnAction={handleImportBtn}
        showButton={true}
      >
        <div className="mt-5">
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : (
            data && <DataTable columns={columns} data={data} isLoading={isLoading} />
          )}
        </div>
        <TeacherDialog
          isAddTeacherModalOpen={isAddTeacherModalOpen}
          setIsAddTeacherModalOpen={setIsAddTeacherModalOpen}
        />

        <ImportBulkDialog
          isModalOpen={isImportBulkDialogOpen}
          setIsModalOpen={setIsImportBulkDialogOpen}
          excelFileParser={teacherExcelFileParser}
          handleParsedData={handleParsedData}
          isPending={loading}
          title="teachers"
          description={description}
          sample_url="https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/sample-data%2Fteacher_sample_data.xlsx?alt=media&token=135442b8-15e6-48c4-b918-12ed0cd79649"
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default TeacherPage;
