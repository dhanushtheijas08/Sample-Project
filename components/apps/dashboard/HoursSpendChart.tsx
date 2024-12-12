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
import { doc, getDoc, DocumentData } from "firebase/firestore";
import { BadgeInfo } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import React from "react";

function formatSecondsToTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = remainingSeconds.toString().padStart(2, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
}
// Type definitions for data structure
interface Level {
  type: string;
  totalTimeTaken?: number;
  totalSessionTime?: number;
}

interface Theme {
  id: string;
  levels: Level[];
}

interface Student {
  uid: string;
  themes: Theme[];
}

interface Class {
  id: string;
  name: string;
  students: Student[];
  studentIds: string[];
}

// Type definition for chart data
interface ChartData {
  label: string;
  sec: number;
}

// Chart configuration
const chartConfig: ChartConfig = {
  sec: {
    label: "Session Time",
    color: "hsl(var(--chart-1))",
  },
};

export default function SecSpendChart() {
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const themeId = searchParams.get("theme");
  const stdId = searchParams.get("studentId");
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
      if (!classId) throw new Error("Class ID is missing from the query.");

      // Fetch user data
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error("User document does not exist.");
      const userData = userSnap.data() as DocumentData;

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
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-600">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-red-600">Error:</p>
          <p className="text-sm text-gray-600">
            {(error as Error)?.message || "An unexpected error occurred."}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!classData || !themeId || !stdId) {
    return (
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-600">
            No data available.
          </p>
          <p className="text-sm text-gray-500">
            Please ensure the correct class, theme, and student are selected.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedStudent = classData.students.find((s) => s.uid === stdId);
  if (!selectedStudent) {
    return (
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-600">
            Student not found.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedTheme = selectedStudent.themes.find((t) => t.id === themeId);
  if (!selectedTheme) {
    return (
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-600">
            Theme not found for the selected student.
          </p>
        </CardContent>
      </Card>
    );
  }

  const selectedLevels = selectedTheme.levels.filter(
    (level) => level.type === "level"
  );

  if (selectedLevels.length === 0) {
    return (
      <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
        <CardContent className="p-4 text-center">
          <p className="text-lg font-semibold text-gray-600">
            No levels available for this theme.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData: ChartData[] = selectedLevels.map((level, index) => ({
    label: `Level ${index + 1}`,
    sec: level.totalSessionTime || 0,
  }));

  return (
    <Card className="w-full max-w-lg bg-transparent border-none shadow-none p-0">
      <CardHeader className="items-start px-0">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="text-lg font-semibold text-black/70 flex flex-row items-center gap-1.5">
              Total Session Time
              <BadgeInfo className="h-5 w-5 text-black/70" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-40">
                This indicates the total time you spent on the game.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            width={500}
            height={300}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="label" axisLine={false} tickLine={false} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                const val = formatSecondsToTime(value);
                return `${val}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  formatter={(value) => {
                    const val = formatSecondsToTime(parseInt(value.toString()));
                    return (
                      <div className="flex gap-1 items-center justify-center">
                        <p className="size-1.5 rounded-lg bg-[#7472d8]"></p>
                        <p>{`Session Time ${val}`}</p>
                      </div>
                    );
                  }}
                />
              }
            />
            <Bar
              dataKey="sec"
              fill="#8884d8"
              radius={[8, 8, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
