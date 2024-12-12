/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { BadgeInfo } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
type Level = {
  type: string;
  totalTimeTaken?: number;
  totalSessionTime?: number;
  totalSubmissions?: number;
};

type Theme = {
  id: string;
  levels: Level[];
};

type Student = {
  uid: string;
  themes: Theme[];
};

type Class = {
  id: string;
  name: string;
  students: Student[];
};

const chartConfig = {
  desktop: {
    label: "class avg Time Taken",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Total Time Taken",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function ProgressChart() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const themeId = searchParams.get("theme");
  const studentId = searchParams.get("studentId");
  const classId = searchParams.get("class");

  const {
    data: classData,
    isLoading,
    isError,
    error,
  } = useQuery<Class | null>({
    queryKey: ["getClassroom", classId],
    queryFn: async (): Promise<Class | null> => {
      if (!user?.uid) throw new Error("User is not authenticated.");
      if (!classId) throw new Error("Class ID is missing.");

      // Fetch user data
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error("User document does not exist.");
      const userData = userSnap.data();

      if (
        userData.role !== "teacher" &&
        userData.role !== "admin" &&
        userData.role !== "superadmin"
      ) {
        throw new Error("You do not have the required permissions.");
      }

      // Fetch classroom data
      const classDocRef = doc(db, "classes", classId);
      const classSnap = await getDoc(classDocRef);
      if (!classSnap.exists()) throw new Error("Classroom data not found.");

      return classSnap.data() as Class;
    },
  });

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-red-600">Error:</p>
        <p className="text-sm text-gray-600">
          {(error as Error)?.message || "An unexpected error occurred."}
        </p>
      </div>
    );
  }

  if (!classData || !themeId || !studentId) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">
          No data available.
        </p>
        <p className="text-sm text-gray-500">
          Please ensure the correct class, theme, and student are selected.
        </p>
      </div>
    );
  }

  const student = classData.students.find((s) => s.uid === studentId);
  if (!student) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">
          Student not found.
        </p>
      </div>
    );
  }

  const theme = student.themes.find((t) => t.id === themeId);
  if (!theme) {
    return (
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-600">
          Theme not found for the selected student.
        </p>
      </div>
    );
  }

  const calculateClassAvgSessionTime = (levels: Level[], students: Student[]) =>
    levels.map((level, index) => {
      let sumOfStudentAverages = 0;
      let studentCount = 0;

      students.forEach((student) => {
        const studentLevel = student.themes.find(
          (theme) => theme.id === themeId
        )?.levels[index];
        if (studentLevel) {
          const totalTime = studentLevel.totalTimeTaken || 0;
          const submissions = studentLevel.totalSubmissions || 1;
          sumOfStudentAverages += totalTime / submissions;
          studentCount++;
        }
      });

      return {
        month: `Lv ${index + 1}`,
        avgSessionTime:
          studentCount > 0 ? sumOfStudentAverages / studentCount : 0,
        totalTimeTaken: level.totalTimeTaken || 0,
        levelType: level.type,
      };
    });

  const selectedLevels = theme.levels.filter((level) => level.type === "level");
  const avgSessionTimeData = calculateClassAvgSessionTime(
    selectedLevels,
    classData.students
  );

  const chartData = avgSessionTimeData.map((data, index) => ({
    month: `Lv ${index + 1}`,
    // desktop: data.avgSessionTime,
    mobile: data.totalTimeTaken,
  }));

  return (
    <Card className="bg-transparent border-none shadow-none w-full max-w-md p-0">
      <CardHeader className="flex flex-col lg:flex-row md:items-center justify-between px-0">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="text-lg text-left font-semibold text-black/70 flex flex-row items-center gap-1.5">
              Progress
              <BadgeInfo className="h-5 w-5 text-black/70" />
            </TooltipTrigger>
            <TooltipContent>
              <p>This is sample</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex gap-4">
          <p className="space-x-1">
            <span className="inline-block h-2.5 w-2.5 bg-green-600 rounded-full" />
            <span>Time taken</span>
          </p>
          {/* <p className="space-x-1">
            <span className="inline-block h-2.5 w-2.5 bg-orange-500 rounded-full" />
            <span>Avg Class Time taken </span>
          </p> */}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 4)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="w-[180px]" />}
            />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-mobile)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
