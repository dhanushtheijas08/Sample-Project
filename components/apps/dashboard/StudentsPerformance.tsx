import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Image from "next/image";

type StudentsPerformanceProps = {
  studentsData: {
    profileImg: string;
    studentName: string;
    studentMark: number;
  }[];
  maxHeight?: string;
};

const StudentsPerformance = ({
  studentsData,
  maxHeight,
}: StudentsPerformanceProps) => {
  // const searchParams = useSearchParams();
  // const classId = searchParams.get("class");
  // const themeId = searchParams.get("theme");

  return (
    <Card className="max-w-md mx-auto w-full xl:w-fit xl:mx-0">
      <CardHeader>Students Performance</CardHeader>
      <CardContent>
        <div className="flex flex-col gap-5">
          <div className="flex justify-between">
            <p> Name</p>
            <p>Score</p>
          </div>

          <ScrollArea
            className={cn(
              "w-full xl:w-72 h-80 flex flex-col gap-1.5",
              maxHeight
            )}
          >
            {studentsData.map((student, index) => (
              <StudentProfileWithMark
                key={index}
                profileImg={student.profileImg}
                studentName={student.studentName}
                studentMark={student.studentMark}
              />
            ))}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

function StudentProfileWithMark({
  profileImg,
  studentName,
  studentMark,
}: {
  profileImg: string;
  studentName: string;
  studentMark: number | string;
}) {
  return (
    <div className="flex justify-between items-center mb-5 pr-3.5">
      <div className="flex items-center gap-1">
        <Image
          src={profileImg}
          alt="avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <p> {studentName} </p>
      </div>
      <p> {studentMark} </p>
    </div>
  );
}

export default StudentsPerformance;
