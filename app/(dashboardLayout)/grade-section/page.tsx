"use client";
import { columns } from "@/components/apps/grade-section-table/columns";
import { DataTable } from "@/components/apps/grade-section-table/data-table";
import GradeSectionDialog from "@/components/apps/grade-section-table/GradeSectionDialog";
import { AppLayout } from "@/components/common";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import TableSkeleton from "@/components/common/TableSkeleton";
import { useAuth } from "@/context/AuthContext";
import { GradeSection } from "@/schema";
import { getGradeAndSections } from "@/services/dashboard/grade-section-service";
import { useEffect, useState } from "react";

const GradeSectionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading as true
  const [gradeSections, setGradeSections] = useState<GradeSection[]>([]);

  const { user } = useAuth();

  const addGradeSection = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchGradeSections = async () => {
      if ((user?.role === "teacher" || user?.role === "admin") && user.uid) {
        console.log(user.uid);
        setIsLoading(true);

        unsubscribe = getGradeAndSections(user.uid, (sections) => {
          setGradeSections(sections);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    };

    fetchGradeSections();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["admin", "teacher"]}>
      <AppLayout
        appLayoutHeading="Grade and Section"
        btnText="Add Grade and Section"
        btnAction={addGradeSection}
        showButton={true}
      >
        <div className="mt-5">
          {isLoading ? (
            <TableSkeleton columns={columns} rowCount={5} />
          ) : gradeSections ? (
            gradeSections.length > 0 ? (
              <DataTable columns={columns} data={gradeSections} />
            ) : (
              <p className="text-center">No Grade and Section Data</p>
            )
          ) : (
            <></>
          )}
        </div>
        <GradeSectionDialog
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default GradeSectionsPage;
