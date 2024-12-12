/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { columns, StudentTable } from "@/components/apps/student-table/column";
import { DataTable } from "@/components/apps/student-table/data-table";
import StudentDialog from "@/components/apps/student/StudentDialog";
import { AppLayout } from "@/components/common";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAuth } from "@/context/AuthContext";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents } from "@/services/dashboard/student-service";
import { useState } from "react";
import { getCourseAndGrade } from "@/api/common/getCourseAndGrade";
import { createStudent } from "@/api/student/createStudent";
import { toast } from "sonner";
import ImportBulkDialog from "@/components/common/ImportBulkDialog";
import { studentsExcelFileParser } from "@/lib/excelParser";
import { bulkUploadUsers, convertToCSV, downloadCSV } from "@/services/dashboard/common-service";
const StudentPage = () => {
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isImportBulkDialogOpen, setIsImportBulkDialogOpen] = useState(false);
  const [loading, setloading] = useState(false);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery<StudentTable[], Error>({
    queryKey: ["getStudents"],
    queryFn: () => getStudents(user?.uid as string),
  });
  const {} = useMutation({
    mutationFn: async (data: any) => {
      await createStudent(data, user?.userToken, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getStudents"],
      });
      toast.success("Student created successfully");
      setIsImportBulkDialogOpen(false);
    },
    onError: (error) => {
      console.error("Error creating teacher:", error);
    },
  });

  const { data: sectionData } = useQuery({
    queryKey: ["getGradeAndSection"],
    queryFn: () => getCourseAndGrade(user?.uid as string),
  });
  const handleBtn = () => {
    setIsAddStudentModalOpen(true);
  };
  const handleImportBtn = () => {
    setIsImportBulkDialogOpen(true);
  };

  const description = "File should have Student Name, ID, Email, Phone Number";

  const handleParsedData = async (parsedData: any) => {
    setloading(true);
    console.log("Initial parsedData:", parsedData);

    let error = 0;
    if (!sectionData || !sectionData.gradeAndSections) {
      console.error("Grade and Section data is not yet loaded.");
      toast.error("Please wait for course and grade data to load before importing.");
      return;
    }
    console.log(parsedData);

    parsedData.shift();
    const updatedData = parsedData.map((student: any) => {
      console.log("student.gradeAndSection:", sectionData);
      console.log("Type of student.gradeAndSection:", typeof student.gradeAndSection);

      const matchingSection = sectionData.gradeAndSections.find(
        (section: any) => section.name === student.gradeAndSection?.name
      );

      console.log(sectionData);
      console.log(matchingSection);

      if (!matchingSection) {
        toast.error(`No grade and section found for user Name: ${student.name}, Email: ${student.email}.`);
        error++;
      }

      return {
        ...student,
        gradeAndSection: matchingSection
          ? { name: matchingSection.name, id: matchingSection.id }
          : student.gradeAndSection,
      };
    });
    console.log("Updated Data:", JSON.stringify(updatedData));

    if (error != 0) {
      setloading(false);
      return;
    }

    const response = await bulkUploadUsers(user?.userToken ?? null, "student", updatedData);

    if (response.status) {
      const csvData = convertToCSV(response.results);
      downloadCSV("student_bulk_upload_results", csvData);
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["getStudents"] });
    } else {
      toast.error(response.message);
    }
    setIsImportBulkDialogOpen(false);
    setloading(false);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AppLayout
        appLayoutHeading="Student"
        btnText="Add student"
        secondaryBtnText="Import"
        btnAction={handleBtn}
        secondaryBtnAction={handleImportBtn}
        showButton={user?.role == "admin"}
      >
        <div className="mt-5">
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : data ? (
            <DataTable columns={columns} data={data} />
          ) : (
            <p className="text-center">No Students Data</p>
          )}
        </div>
        <StudentDialog
          isAddStudentModalOpen={isAddStudentModalOpen}
          setIsAddStudentModalOpen={setIsAddStudentModalOpen}
        />

        <ImportBulkDialog
          isModalOpen={isImportBulkDialogOpen}
          setIsModalOpen={setIsImportBulkDialogOpen}
          excelFileParser={studentsExcelFileParser}
          handleParsedData={handleParsedData}
          isPending={loading}
          title={"students"}
          description={description}
          sample_url="https://firebasestorage.googleapis.com/v0/b/wefaa-robotics.appspot.com/o/sample-data%2Fstudent_sample_data%20(1).xlsx?alt=media&token=b1852c28-e8af-4209-b49d-893119483f2f"
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default StudentPage;
