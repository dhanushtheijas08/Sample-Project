"use client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bot, Lightbulb } from "lucide-react";
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
};

type ClassDataType = {
  id: string;
  image: string;
  name: string;
  students: StudentType[];
};

type CourseProgressCard1Props = {
  classData: ClassDataType;
};

const CourseProgressCard1 = ({ classData }: CourseProgressCard1Props) => {
  const searchParams = useSearchParams();
  const stdId = searchParams.get("studentId");

  if (!classData) return <p>Loading...</p>;
  if (!stdId) return <p>No data found</p>;
  let totalTheme = 0;
  let totalLevel = 0;
  let totalThemeCompleted = 0;
  let totalLevelCompleted = 0;

  if (classData?.students === undefined) return <p>No data found</p>;

  classData?.students?.forEach((std) => {
    if (std.uid === stdId) {
      std.themes.forEach((theme) => {
        let isThemeCompleted = true;
        totalTheme++;

        theme.levels.forEach((level) => {
          if (level.type === "level") {
            totalLevel++;
            if (level.status === "completed") {
              totalLevelCompleted++;
            } else {
              isThemeCompleted = false;
            }
          }
        });

        if (isThemeCompleted) {
          totalThemeCompleted++;
        }
      });
    }
  });
  console.log(classData);

  return (
    <Card className="border-none bg-transparent shadow-none mb-7 mt-11 w-full">
      <CardHeader className="flex flex-col xl:flex-row items-center justify-between gap-5 space-y-0 p-0 pb-2">
        {classData.name && (
          <div>
            <p className="text-muted-foreground text-sm ml-1">Class</p>
            <Badge
              className="w-fit text-base font-semibold"
              variant="secondary"
            >
              {classData.name.at(0)?.toUpperCase() + classData.name.slice(1)}
            </Badge>
          </div>
        )}

        {/* <CardTitle className="w-full">
          <Image
            src={classData.image}
            height={105}
            width={105}
            alt="profile"
            className="rounded-full mx-auto"
          />
        </CardTitle> */}
        {/* <Select onValueChange={handleValueChange} value={classId}>
          <div className="flex flex-col w-full">
            <Label className="mb-1.5 text-muted-foreground">Class</Label>
            <SelectTrigger className="w-full h-12 text-lg bg-[#EEF7E2] text-[#464646] border-none">
              <SelectValue
                placeholder="Select course"
                className="border-none"
              />
            </SelectTrigger>
          </div>
          <SelectContent className="text-lg">
            {classData.map((data) => (
              <SelectItem value={data.id} key={data.id}>
                {data.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent className="mt-2 p-0">
        <div className="flex justify-start gap-5">
          <ProgressLabel
            Icon={Bot}
            completedLevel={totalThemeCompleted}
            label="Themes"
            totalLevel={totalTheme}
          />
          <ProgressLabel
            Icon={Lightbulb}
            completedLevel={totalLevelCompleted}
            label="Levels"
            totalLevel={totalLevel}
          />
        </div>
        <ProgressBar
          total={totalLevel || 0}
          completed={totalLevelCompleted || 0}
        />
      </CardContent>
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
    <div className="relative mt-5">
      <Progress
        value={percentage}
        className="h-5"
        indicatorColor="bg-[#419325]"
      />
      <span className="absolute left-0 mt-0.5">{percentage || 0}%</span>
    </div>
  );
};

export default CourseProgressCard1;
