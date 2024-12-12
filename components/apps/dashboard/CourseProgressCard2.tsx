"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lightbulb } from "lucide-react";
import { useSearchParams } from "next/navigation";

type LevelType = {
  type: string;
  status: string;
};

type ThemeType = {
  id: string;
  name: string;
  levels: LevelType[];
};

type StudentType = {
  uid: string;
  themes: ThemeType[];
  name: string;
};

type ClassDataType = {
  id: string;
  name: string;
  themes: ThemeType[];
  students: StudentType[];
};

type CourseProgressCard2Props = {
  classData: ClassDataType;
};

const CourseProgressCard2 = ({ classData }: CourseProgressCard2Props) => {
  const searchParams = useSearchParams();

  const classId = searchParams.get("class");
  const themeId = searchParams.get("theme");
  const stdId = searchParams.get("studentId");
  if (!classData) return <p>Loading...</p>;
  if (!stdId || !classId || !themeId) return <p>No data found</p>;

  let totalLevel = 0;
  let totalLevelCompleted = 0;

  const themeName: string | undefined = classData.themes.find(
    (theme) => theme.id === themeId
  )?.name;

  classData.students.forEach((std) => {
    if (std.uid === stdId) {
      std.themes.forEach((theme) => {
        if (theme.id === themeId) {
          theme.levels.forEach((level) => {
            if (level.type === "level") {
              totalLevel++;
              if (level.status === "completed") {
                totalLevelCompleted++;
              }
            }
          });
        }
      });
    }
  });

  return (
    <Card className="border-none bg-transparent shadow-none mt-8">
      <CardHeader className="flex flec-col gap-0 px-0 space-y-0 space-x-0 py-3">
        {themeName && (
          <div>
            <p className="text-muted-foreground text-sm">Theme</p>
            <Badge
              className="w-fit text-base font-semibold"
              variant="secondary"
            >
              {themeName.at(0)?.toUpperCase() + themeName.slice(1)}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0 flex flex-col items-start gap-2 mt-3">
        {/* {themeName && (
          <div className="size-28 rounded-full bg-gray-100 relative flex items-center justify-center">
            <p className="font-semibold text-xl">
              {themeName.at(0)?.toUpperCase()}
              {themeName.at(1)?.toUpperCase()}
            </p>
          </div>
        )} */}

        {/* <div className="flex gap-10 justify-center items-center"> */}
        <div className="mb-4">
          {/* {themeName && (
            <Badge variant="secondary" className="w-fit h-fit text-xl">
              {themeName.at(0)?.toUpperCase() + themeName.slice(1)}
            </Badge>
          )} */}
          <ProgressLabel
            Icon={Lightbulb}
            completedLevel={totalLevelCompleted}
            label={"Levels"}
            totalLevel={totalLevel}
          />
        </div>
      </CardContent>
      <ProgressBar total={totalLevel} completed={totalLevelCompleted} />
    </Card>
  );
};

type ProgressLabelProps = {
  Icon: React.ElementType;
  totalLevel: number;
  completedLevel: number;
  label: string;
};

const ProgressLabel = ({
  Icon,
  totalLevel,
  completedLevel,
  label,
}: ProgressLabelProps) => {
  return (
    <div className="text-muted-foreground">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-5 w-5 sm:h-10 sm:w-10" />}
        <span className="text-primary/80 font-semibold text-sm sm:text-base">
          {completedLevel}/{totalLevel}
        </span>
      </div>
      <p className="text-center text-xs sm:text-base">{label}</p>
    </div>
  );
};
const ProgressBar = ({
  total,
  completed,
}: {
  total: number;
  completed: number;
}) => {
  const percentage = Math.round((completed / total) * 100);
  return (
    <div className="relative">
      <Progress
        value={percentage}
        className="h-5"
        indicatorColor="bg-[#419325]"
      />
      <span className="absolute left-0 mt-0.5">{percentage || 0}%</span>
    </div>
  );
};
export default CourseProgressCard2;
