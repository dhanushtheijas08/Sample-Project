/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { fetchThemes } from "@/api/common/getThemes";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { classroomSchema } from "@/schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";

type FormValues = z.infer<typeof classroomSchema>;
type Level = {
  id: string;
  name: string;
  unlockAt: string;
  dueDate: string;
  image: string;
  gameFiles: any;
  type: string;
  url: string;
};

type Theme = {
  id: string;
  name: string;
  description: string;
  levels: Level[];
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addYears = (date: Date, years: number) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

export function Step3({
  disabled,
  themeDates,
  setThemeDates,
  form,
  hasMonthlyLicense,
}: {
  disabled: boolean;
  themeDates: any;
  setThemeDates: any;
  form: UseFormReturn<FormValues, unknown, undefined>;
  hasMonthlyLicense: boolean;
}) {
  const startDate = form.watch("startsAt");
  const duration = form.watch("duration");
  const courseId = form.watch("course");
  const unlockType = form.watch("unlockType");

  const { data: themesData, isLoading } = useQuery<Theme[] | undefined>({
    queryKey: ["themes"],
    queryFn: () => fetchThemes(courseId),
  });

  const durationValue = parseInt(duration, 10) || 0;
  useEffect(() => {
    if (startDate && durationValue && themesData && Array.isArray(themesData)) {
      let currentUnlockDate = new Date(startDate);

      const newThemeDates = themesData.map((theme, themeIndex: number) => {
        const nonVideoLevels = theme.levels.filter(
          (level: any) => level.type !== "video" && level.type !== "tutorial"
        );

        let themeUnlockDate: Date;
        let themeDueDate: Date;

        if (unlockType === "manual" || unlockType === "sequential") {
          themeUnlockDate = currentUnlockDate;

          themeDueDate = addDays(
            themeUnlockDate,
            nonVideoLevels.length * durationValue
          );

          currentUnlockDate = new Date(themeDueDate);
        } else if (unlockType === "all-levels-open") {
          const totalNonVideoLevels = themesData.reduce(
            (acc, t) =>
              acc +
              t.levels.filter(
                (l: any) => l.type !== "video" && l.type !== "tutorial"
              ).length,
            0
          );
          themeUnlockDate = new Date(startDate);
          themeDueDate = addDays(
            themeUnlockDate,
            totalNonVideoLevels * durationValue
          );
        } else if (unlockType === "theme-by-theme") {
          themeUnlockDate = currentUnlockDate;
          themeDueDate = addDays(
            themeUnlockDate,
            nonVideoLevels.length * durationValue
          );
          currentUnlockDate = new Date(themeDueDate);
        }

        let themeLevels = theme.levels.map((level: any, levelIndex: number) => {
          if (level.type !== "video" && level.type !== "tutorial") {
            if (unlockType === "sequential" || unlockType === "manual") {
              const levelSequenceIndex = nonVideoLevels.findIndex(
                (l) => l.id === level.id
              );

              const levelUnlockDate = addDays(
                themeUnlockDate,
                levelSequenceIndex * durationValue
              );
              const levelDueDate = addDays(levelUnlockDate, durationValue);

              return {
                ...level,
                unlockAt: levelUnlockDate.toISOString().split("T")[0],
                dueDate: levelDueDate.toISOString().split("T")[0],
              };
            } else if (unlockType === "theme-by-theme") {
              const onLevels = theme.levels.filter(
                (l) => l.type === "video" || l.type === "tutorial"
              );
              const adjustedLevelIndex = levelIndex - onLevels.length;

              const levelUnlockDate = themeUnlockDate;
              let levelDueDate = addDays(
                levelUnlockDate,
                (adjustedLevelIndex + 1) * durationValue
              );
              if (level.name.startsWith("Bus Beginner") && levelIndex < 6) {
                levelDueDate = addDays(levelDueDate, durationValue * 2);
              }

              return {
                ...level,
                unlockAt: levelUnlockDate.toISOString().split("T")[0],
                dueDate: levelDueDate.toISOString().split("T")[0],
              };
            } else if (unlockType === "all-levels-open") {
              const onLevels = theme.levels.filter(
                (l) => l.type === "video" || l.type === "tutorial"
              );
              const adjustedLevelIndex = levelIndex - onLevels.length + 1;

              let levelDueDate = addDays(
                themeUnlockDate,
                (themeIndex * nonVideoLevels.length + adjustedLevelIndex) *
                  durationValue
              );
              if (themeIndex > 0) {
                levelDueDate = addDays(levelDueDate, durationValue);
              }
              if (level.name.startsWith("Bus Beginner") && levelIndex < 6) {
                levelDueDate = addDays(levelDueDate, durationValue * 2);
              }
              return {
                ...level,
                unlockAt: themeUnlockDate.toISOString().split("T")[0],
                dueDate: levelDueDate.toISOString().split("T")[0],
              };
            } else {
              return {
                ...level,
                unlockAt: themeUnlockDate.toISOString().split("T")[0],
                dueDate: themeDueDate.toISOString().split("T")[0],
              };
            }
          }

          return {
            ...level,
            dueDate: addYears(themeUnlockDate, 10).toISOString().split("T")[0],
          };
        });

        const firstUnlockDate = themeLevels.find(
          (l) => l.type !== "video" && l.type !== "tutorial"
        )?.unlockAt;

        themeLevels = themeLevels.map((level: any) => {
          if (level.type === "video" || level.type === "tutorial") {
            return {
              ...level,
              unlockAt: firstUnlockDate,
              dueDate: addYears(new Date(firstUnlockDate), 10)
                .toISOString()
                .split("T")[0],
            };
          }
          return level;
        });

        return {
          name: theme.name,
          id: theme.id,
          description: theme.description,
          displayLevels: themeLevels.filter(
            (level: any) => level.type !== "video" && level.type !== "tutorial"
          ),
          levels: themeLevels,
        };
      });

      setThemeDates(newThemeDates);
    }
  }, [startDate, durationValue, themesData, unlockType, setThemeDates]);

  // useEffect(() => {
  //   if (startDate && durationValue && themesData && Array.isArray(themesData)) {
  //     let currentUnlockDate = new Date(startDate);
  //     let lastThemeDueDate = new Date(startDate);

  //     const newThemeDates = themesData.map((theme, themeIndex: number) => {
  //       const nonVideoLevels = theme.levels.filter(
  //         (level: any) => level.type !== "video" && level.type !== "tutorial"
  //       );

  //       let themeUnlockDate: Date;
  //       let themeDueDate: Date;

  //       if (unlockType === "all-levels-open") {
  //         const totalNonVideoLevels = themesData.reduce(
  //           (acc, t) =>
  //             acc +
  //             t.levels.filter(
  //               (l: any) => l.type !== "video" && l.type !== "tutorial"
  //             ).length,
  //           0
  //         );
  //         themeUnlockDate = new Date(startDate);
  //         themeDueDate = addDays(
  //           themeUnlockDate,
  //           totalNonVideoLevels * durationValue
  //         );
  //       }

  //       let themeLevels = theme.levels.map((level: any, levelIndex: number) => {
  //         if (level.type !== "video" && level.type !== "tutorial") {
  //           if (unlockType === "all-levels-open") {
  //             const onLevels = theme.levels.filter(
  //               (l) => l.type === "video" || l.type === "tutorial"
  //             );
  //             const adjustedLevelIndex = levelIndex - onLevels.length + 1;

  //             let levelDueDate = addDays(
  //               themeUnlockDate,
  //               (themeIndex * nonVideoLevels.length + adjustedLevelIndex) *
  //                 durationValue
  //             );

  //             // Ensure the first level of each theme (after the first theme)
  //             // starts one day after the last due date of the previous theme
  //             if (themeIndex > 0 && adjustedLevelIndex === 1) {
  //               levelDueDate = addDays(lastThemeDueDate, 1);
  //             }

  //             if (level.name.startsWith("Bus Beginner") && levelIndex < 6) {
  //               levelDueDate = addDays(levelDueDate, durationValue * 2);
  //             }

  //             // Update the last theme's due date for the next iteration
  //             if (levelIndex === nonVideoLevels.length - 1) {
  //               lastThemeDueDate = new Date(levelDueDate);
  //             }

  //             return {
  //               ...level,
  //               unlockAt: themeUnlockDate.toISOString().split("T")[0],
  //               dueDate: levelDueDate.toISOString().split("T")[0],
  //             };
  //           }
  //         }

  //         return {
  //           ...level,
  //           dueDate: addYears(themeUnlockDate, 10).toISOString().split("T")[0],
  //         };
  //       });

  //       const firstUnlockDate = themeLevels.find(
  //         (l) => l.type !== "video" && l.type !== "tutorial"
  //       )?.unlockAt;

  //       themeLevels = themeLevels.map((level: any) => {
  //         if (level.type === "video" || level.type === "tutorial") {
  //           return {
  //             ...level,
  //             unlockAt: firstUnlockDate,
  //             dueDate: addYears(new Date(firstUnlockDate), 10)
  //               .toISOString()
  //               .split("T")[0],
  //           };
  //         }
  //         return level;
  //       });

  //       return {
  //         name: theme.name,
  //         id: theme.id,
  //         description: theme.description,
  //         displayLevels: themeLevels.filter(
  //           (level: any) => level.type !== "video" && level.type !== "tutorial"
  //         ),
  //         levels: themeLevels,
  //       };
  //     });

  //     setThemeDates(newThemeDates);
  //   }
  // }, [startDate, durationValue, themesData, unlockType, setThemeDates]);

  function updateUnlockAt(themeId: string, levelId: string, newUnlockAt: any) {
    setThemeDates((prevThemeDates: any) => {
      const updatedThemeDates = [...prevThemeDates];
      const theme = updatedThemeDates.find((t) => t.id === themeId);

      if (theme) {
        const level = theme.levels.find((l: any) => l.id === levelId);
        if (level) {
          level.unlockAt = newUnlockAt;
        }
      }

      return updatedThemeDates;
    });
  }

  function updateDueDate(themeId: string, levelId: string, newDueDate: any) {
    setThemeDates((prevThemeDates: any) => {
      const updatedThemeDates = [...prevThemeDates];
      const theme = updatedThemeDates.find((t) => t.id === themeId);

      if (theme) {
        const level = theme.levels.find((l: any) => l.id === levelId);
        if (level) {
          level.dueDate = newDueDate;
        }
      }

      return updatedThemeDates;
    });
  }

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="unlockType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Unlocking Type</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select unlocking type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="sequential">Sequential</SelectItem>
                {!hasMonthlyLicense && (
                  <SelectItem value="theme-by-theme">Theme By Theme</SelectItem>
                )}
                <SelectItem value="all-levels-open">All Levels Open</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="startsAt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select Start Date</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                type="date"
                min={new Date().toISOString().split("T")[0]} // Disable previous dates
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring focus:ring-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select duration for each level</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="5">5 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ScrollArea className="w-full flex flex-col">
          {themeDates.map(
            (
              {
                name,
                id: themeId,
                displayLevels,
              }: { name: string; id: string; displayLevels: Level[] },
              themeIndex: string
            ) => (
              <div className="flex flex-col gap-1.5 mb-5" key={themeIndex}>
                <p className="text-nowrap text-xl font-semibold">{name}</p>
                <div className="flex flex-wrap items-center gap-10">
                  {displayLevels.map(({ name, id, unlockAt, dueDate }) => (
                    <div className="flex flex-col gap-2 max-w-[260px]" key={id}>
                      <p className="text-sm font-medium">{name}</p>
                      <div className="flex flex-col w-[80%]">
                        <label className="text-xs mb-1">Unlock Date</label>
                        <input
                          value={unlockAt}
                          type="date"
                          disabled={unlockType !== "manual" || disabled}
                          onChange={(e) =>
                            updateUnlockAt(themeId, id, e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                          className={cn(
                            "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring focus:ring-primary",
                            unlockType !== "manual" &&
                              "opacity-50 cursor-not-allowed"
                          )}
                        />
                      </div>
                      <div className="flex flex-col w-[80%]">
                        <label className="text-xs mb-1">Due Date</label>
                        <input
                          value={dueDate}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          disabled={unlockType !== "manual" || disabled}
                          onChange={(e) =>
                            updateDueDate(themeId, id, e.target.value)
                          }
                          className={cn(
                            "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary focus:ring focus:ring-primary",
                            unlockType !== "manual" &&
                              "opacity-50 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </div>
  );
}
