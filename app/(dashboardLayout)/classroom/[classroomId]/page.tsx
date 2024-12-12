"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { columns } from "@/components/apps/classroom-table/classroom-student-columns";
import { DataTable } from "@/components/apps/classroom-table/data-table";
import ClassroomEditDialog from "@/components/apps/classroom/ClassroomEditDialog";
import Spinner from "@/components/common/spinner";
import TableSkeleton from "@/components/common/TableSkeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getClassroomById } from "@/services/dashboard/classroom-service";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Profile = ({
  primaryText,
  secondaryText,
  image,
}: {
  primaryText: string | undefined;
  secondaryText: string | undefined;
  image?: string;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-12 w-12 rounded-full border">
        <AvatarImage src={image} alt="image" />
        <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
          {primaryText?.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-wrap">
        <p className="font-medium break-words text-sm">{primaryText || ""}</p>
        <p className="text-xs text-muted-foreground">{secondaryText || ""}</p>
      </div>
    </div>
  );
};

const ClassroomCard = ({
  cardHeading,
  children,
}: {
  cardHeading: string;
  children: React.ReactNode;
}) => {
  return (
    <Card className="p-5">
      <CardHeader className="p-0">
        <CardTitle className="font-semibold text-md p-0 pb-4">
          {cardHeading}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
};

const ClassroomByIdPage = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const [annualCount, setAnnualCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const { user } = useAuth();

  const { data: classroomData, isLoading } = useQuery({
    queryKey: ["classroom", classroomId],
    queryFn: () => getClassroomById({ classroomId }),
    enabled: !!classroomId,
  });

  useEffect(() => {
    if (classroomData?.students) {
      let annual = 0;
      let monthly = 0;

      classroomData.students.forEach((student) => {
        if (student.plan === "Annual") {
          annual++;
        } else if (student.plan === "Monthly") {
          monthly++;
        }
      });

      setAnnualCount(annual);
      setMonthlyCount(monthly);
    }
  }, [classroomData]);

  if (isLoading && !classroomData) {
    return <Spinner />;
  }

  const data =
    classroomData?.students?.map((student) => ({
      studentsData: student,
      duration: classroomData?.duration || "",
      startsAt: classroomData?.startsAt || "",
    })) || [];

  return (
    <div className="flex flex-col w-full gap-5 mb-16">
      <div className="flex w-full justify-between">
        <Profile
          primaryText={classroomData?.name}
          secondaryText={classroomData?.grade.name}
          image={classroomData?.image}
        />
        {!isLoading && user?.role === "admin" && (
          <ClassroomEditDialog classroomData={classroomData} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-5">
        <ClassroomCard cardHeading="Teacher">
          <Profile
            primaryText={classroomData?.teacher.name}
            secondaryText={classroomData?.teacher.id}
          />
        </ClassroomCard>

        <ClassroomCard cardHeading="Co-Teacher">
          <Profile
            primaryText={classroomData?.coTeacher.name}
            secondaryText={classroomData?.coTeacher.id}
          />
        </ClassroomCard>

        <ClassroomCard cardHeading="Course">
          <Profile
            primaryText={classroomData?.course?.name || "No course name"}
            secondaryText={classroomData?.unlockType}
          />
        </ClassroomCard>

        <ClassroomCard cardHeading="Licences Used">
          <div>
            <div className="space-x-2">
              <Badge className="text-sm" variant="secondary">
                Annual{" "}
                <span className="font-semibold ml-1.5">{annualCount}</span>
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Monthly{" "}
                <span className="font-semibold ml-1.5">{monthlyCount}</span>
              </Badge>
            </div>
          </div>
        </ClassroomCard>
      </div>

      <div className="mt-5">
        {isLoading ? (
          <TableSkeleton columns={columns} rowCount={5} />
        ) : classroomData ? (
          <DataTable columns={columns} data={data} />
        ) : (
          <p className="text-center">No Students Data</p>
        )}
      </div>
    </div>
  );
};

export default ClassroomByIdPage;
