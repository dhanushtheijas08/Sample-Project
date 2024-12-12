/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn, firebaseTimestampToNormal } from "@/lib/utils";
import {
  BadgeAlert,
  Code2,
  Lock,
  LockOpen,
  Rocket,
  Star,
  Timer,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Level {
  id: string;
  name: string;
  status: "unopened" | "in-progress" | "completed" | "completed-after-due";
  type: string;
  lastUpdated?: string;
  score?: number;
  unlockAt?: string;
  dueDate?: string;
  gameData?: {
    score: number;
    attempts: number;
    grade: string;
  };
}

interface Theme {
  levels: Level[];
}

interface Student {
  name: string;
  classId: string;
  themes: Theme[];
}

interface ProgressCellProps {
  level: Level;
  studentIndex: number;
  studentName: string;
}

const updateLocalStorage = (key: string, newValue: any) => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  }
  localStorage.setItem(key, JSON.stringify(newValue));
};

const ProgressCell: React.FC<ProgressCellProps> = ({
  studentName,
  level,
  studentIndex,
}: {
  studentName: string;
  level: any;
  studentIndex: number;
}) => {
  if (level.status === "completed") console.log({ level });

  const getStatusColor = () => {
    const now = new Date();
    const unlockAtDate = level.unlockAt ? new Date(level.unlockAt) : null;
    const dueDate = level.dueDate ? new Date(level.dueDate) : null;

    if (unlockAtDate && unlockAtDate > now) {
      return "bg-gray-400";
    } else if (level.status !== "completed" && dueDate && dueDate > now) {
      return "bg-blue-400";
    } else if (level.status === "completed") {
      return "bg-green-400";
    } else if (dueDate && dueDate < now && level.status !== "completed") {
      return "bg-red-400";
    } else {
      return "border border-border";
    }
  };
  // console.log(JSON.stringify(level));

  const getStatusText = () => {
    const now = new Date();
    const unlockAtDate = level.unlockAt ? new Date(level.unlockAt) : null;
    const dueDate = level.dueDate ? new Date(level.dueDate) : null;

    if (unlockAtDate && unlockAtDate > now) {
      return "Locked";
    } else if (level.status !== "completed" && dueDate && dueDate > now) {
      return "Open";
    } else if (level.status === "completed") {
      return "Completed";
    } else if (dueDate && dueDate < now && level.status !== "completed") {
      return "Over Due";
    } else {
      return "";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="relative">
            {studentIndex === 0 && (
              <p
                className={cn(
                  "text-sm absolute text-nowrap -rotate-[70deg] -top-16 z-20 -translate-x-1/2 left-1/2 "
                )}
              >
                {level.name}
              </p>
            )}
            <div
              className={`w-[50px] h-[50px] rounded-md ${getStatusColor()}`}
            />
            {level?.resentSubmission?.isLateSubmission === true && (
              <div className="size-2 absolute bg-red-500 top-1 rounded-full right-1" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="w-[400px]">
          <div className="flex flex-row justify-between items-center">
            <div>
              <p className="font-medium text-2xl text-slate-800">
                {studentName}
              </p>
              <p className="text-xs text-muted-foreground">{level.name}</p>
            </div>
            {level.resentSubmission?.timeTaken && (
              <div className="bg-secondary text-secondary-foreground rounded-md flex flex-col  justify-center px-2.5 h-10">
                <p>
                  Submitted At{" "}
                  {firebaseTimestampToNormal(
                    level?.resentSubmission.submittedAt
                  )}
                </p>
                <p>Due Date {level.dueDate}</p>
              </div>
            )}
          </div>
          {getStatusText() === "Completed" ? (
            <>
              <div className="flex items-center gap-2.5 mt-4">
                <div className="w-full border-2 rounded py-[18px]">
                  {level.resentSubmission && (
                    <div className="flex flex-col items-center gap-0.5">
                      {/* <p className="text-sm text-muted-foreground">
                        Total Attempts run
                      </p> */}
                      <p className="text-sm text-muted-foreground">
                        No of submissions
                      </p>

                      <div className="text-base font-bold">
                        <div className="flex items-center gap-1">
                          <p>
                            <Rocket className="size-6" />
                          </p>
                          {/* <p>{level.resentSubmission.attempts} attempt</p> */}
                          <p>{level.totalSubmissions} attempt</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full border-2 rounded py-4">
                  {level.resentSubmission && (
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-sm text-muted-foreground">
                        Time Taken to run
                      </p>
                      <div className="text-base font-bold">
                        <div className="flex items-center gap-0.5">
                          <p>
                            <Timer className="size-6" />
                          </p>
                          <p className="mt-1">
                            00:00:{Math.round(level.resentSubmission.timeTaken)}{" "}
                            Sec
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2.5 mt-2">
                <div className="w-full border-2 rounded py-[18px]">
                  {level.resentSubmission && (
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-sm text-muted-foreground">
                        Recent Grade
                      </p>
                      <div className="text-base font-bold">
                        <div className="flex items-center gap-1">
                          <div className="flex gap-1 ml-1.5">
                            {[...Array(3)].map((_, index) => (
                              <span key={index}>
                                <Star
                                  className={cn(
                                    "size-6",
                                    index < +level.resentSubmission.grade
                                      ? "text-[#FBC720] fill-[#FBC720]"
                                      : "text-[#E0E0E0] fill-[#E0E0E0]"
                                  )}
                                />
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full border-2 rounded py-4">
                  {level.resentSubmission && (
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-sm text-muted-foreground">Score</p>
                      <div className="font-bold">
                        <div className="flex text-xl items-center gap-0.5">
                          {level.resentSubmission.score ?? "Nil"}
                          {/* {level.dueDate && <p>{level.dueDate}</p>} */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {getStatusText() === "Completed" && (
                <div className="w-full mt-3 border bg-muted py-2 px-1.5 rounded flex justify-between">
                  <p className="flex items-center gap-2">
                    <Code2 /> <span>View Students code </span>
                  </p>

                  <Button
                    size={"sm"}
                    onClick={() => {
                      updateLocalStorage("level", level);
                      window.open(
                        `${process.env.NEXT_PUBLIC_HOSTURL}/game-play`,
                        "_blank"
                      );
                    }}
                  >
                    View Game
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mt-4 pb-1.5">
                <div className="w-full border-2 rounded py-[18px]">
                  <div className="flex flex-col items-center gap-0.5">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="text-base font-bold">
                      <div className="flex items-center gap-1">
                        {getStatusText() === "Locked" ? (
                          <p>
                            <Lock className="size-6" />
                          </p>
                        ) : getStatusText() === "Open" ? (
                          <p>
                            <LockOpen className="size-6" />
                          </p>
                        ) : (
                          <p>
                            <BadgeAlert className="size-6" />
                          </p>
                        )}
                        <p>{getStatusText()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full border-2 rounded py-4">
                  {getStatusText() === "Locked" ? (
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-sm text-muted-foreground">Unlock At</p>
                      <div className="text-base font-bold">
                        <div className="flex items-center gap-0.5">
                          <p>
                            <Timer className="size-6" />
                          </p>
                          <p className="mt-1">{level.unlockAt}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <p className="text-sm text-muted-foreground">Due Date</p>
                      <div className="text-base font-bold">
                        <div className="flex items-center gap-0.5">
                          <p>
                            <Timer className="size-6" />
                          </p>
                          <p className="mt-1">{level.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface StudentsHeatMapProps {
  studentsLevelData: Student[][];
}

const StudentsHeatMap: React.FC<StudentsHeatMapProps> = ({
  studentsLevelData,
}) => {
  const searchParams = useSearchParams();
  const classId = searchParams.get("class");

  const allLevelNames =
    studentsLevelData &&
    Array.from(
      new Set(
        studentsLevelData.flatMap((group) =>
          group.flatMap((student) =>
            student.themes.flatMap((theme) =>
              theme.levels.map((level) => level.name)
            )
          )
        )
      )
    );

  return (
    <div className="w-full max-w-full p-4">
      <div className="flex items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-[16px] h-[16px]  bg-gray-400 border border-border rounded-full" />
          <span>Locked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[16px] h-[16px] bg-blue-400 rounded-full" />
          <span>Open</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[16totalSessionTimepx] h-[16px] bg-green-400 rounded-full" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-[16px] h-[16px] bg-red-400 rounded-full" />
          <span>Over Due</span>
        </div>
      </div>
      {allLevelNames && (
        <ScrollArea className="max-w-[90vw] overflow-x-hidden">
          <div className="inline-flex min-w-full flex-col mt-28 my-2.5">
            {studentsLevelData.map((group, groupIndex) =>
              group
                .filter((std) => std.classId === classId)
                .map((student, studentIndex) => (
                  <div
                    key={`${groupIndex}-${studentIndex}`}
                    className="flex items-center"
                  >
                    <div className="w-[100px] flex-shrink-0 text-sm font-medium gap-y-0.5 pr-4">
                      {student.name}
                    </div>
                    <div className="flex gap-x-0.5">
                      {allLevelNames.map((levelName, index) => {
                        const level = student.themes
                          .flatMap((theme) => theme.levels)
                          .find(
                            (l) => l.name === levelName && l.type === "level"
                          );
                        return (
                          <div key={index}>
                            {level && (
                              <ProgressCell
                                level={level}
                                studentName={student.name}
                                studentIndex={studentIndex}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
};

export default StudentsHeatMap;
