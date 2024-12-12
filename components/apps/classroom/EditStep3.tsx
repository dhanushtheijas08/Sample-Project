/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface Level {
  id: string;
  name: string;
  type?: string;
  unlockAt: string;
  dueDate: string;
}

interface Theme {
  id: string;
  name: string;
  description?: string;
  levels: Level[];
}

interface CourseUnlockingProps {
  form: UseFormReturn<any>;
  disabled: boolean;
  themeDates: Theme[];
  setThemeDates: React.Dispatch<React.SetStateAction<Theme[]>>;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addYears = (date: Date, years: number): Date => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

export function EditStep3({
  form,
  disabled,
  themeDates,
  setThemeDates,
}: CourseUnlockingProps) {
  const startDate = form.watch("startsAt");
  const duration = parseInt(form.watch("duration") || "0", 10);
  const unlockType = form.watch("unlockType");
  useEffect(() => {
    if (startDate && duration && themeDates && Array.isArray(themeDates)) {
      let currentUnlockDate = new Date(startDate);

      const newThemeDates = themeDates.map((theme, themeIndex: number) => {
        const nonVideoLevels = theme.levels.filter(
          (level: any) => level.type !== "video" && level.type !== "tutorial"
        );

        let themeUnlockDate: Date;
        let themeDueDate: Date;
        if (unlockType === "manual") {
          themeUnlockDate = new Date(theme.levels[0].unlockAt);
          themeDueDate = new Date(theme.levels[0].dueDate);
        } else if (unlockType === "sequential") {
          themeUnlockDate = currentUnlockDate;

          themeDueDate = addDays(
            themeUnlockDate,
            nonVideoLevels.length * duration
          );

          currentUnlockDate = new Date(themeDueDate);
        } else if (unlockType === "all-levels-open") {
          const totalNonVideoLevels = themeDates.reduce(
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
            totalNonVideoLevels * duration
          );
        } else if (unlockType === "theme-by-theme") {
          themeUnlockDate = currentUnlockDate;
          themeDueDate = addDays(
            themeUnlockDate,
            nonVideoLevels.length * duration
          );
          currentUnlockDate = new Date(themeDueDate);
        }

        let themeLevels = theme.levels.map((level: any, levelIndex: number) => {
          if (level.type !== "video" && level.type !== "tutorial") {
            if (unlockType === "manual") {
              return level;
            } else if (unlockType === "sequential") {
              const levelSequenceIndex = nonVideoLevels.findIndex(
                (l) => l.id === level.id
              );

              const levelUnlockDate = addDays(
                themeUnlockDate,
                levelSequenceIndex * duration
              );
              const levelDueDate = addDays(levelUnlockDate, duration);

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
                (adjustedLevelIndex + 1) * duration
              );
              if (level.name.startsWith("Bus Beginner") && levelIndex < 6) {
                levelDueDate = addDays(levelDueDate, duration * 2);
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
                  duration
              );
              if (themeIndex > 0) {
                levelDueDate = addDays(levelDueDate, duration);
              }
              if (level.name.startsWith("Bus Beginner") && levelIndex < 6) {
                levelDueDate = addDays(levelDueDate, duration * 2);
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
            if (unlockType === "manual") {
              return {
                ...level,
              };
            }

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
  }, [startDate, duration, unlockType, themeDates.length]);

  console.log({ startDate });

  const updateDate = (
    themeId: string,
    levelId: string,
    dateType: "unlockAt" | "dueDate",
    newDate: string
  ) => {
    setThemeDates((prev) =>
      prev.map((theme) => {
        if (theme.id !== themeId) return theme;

        const updatedLevels = theme.levels.map((level) => {
          if (level.id !== levelId) return level;
          return {
            ...level,
            [dateType]: newDate,
          };
        });

        return {
          ...theme,
          levels: updatedLevels,
        };
      })
    );
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="unlockType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unlock Type</FormLabel>
            <Select
              disabled={disabled}
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select unlock type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="sequential">Sequential</SelectItem>
                <SelectItem value="theme-by-theme">Theme By Theme</SelectItem>
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
            <FormLabel>Start Date</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={disabled}
                type="date"
                value={field.value ? formatDate(new Date(field.value)) : ""}
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
            <FormLabel>Duration (days per level)</FormLabel>
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

      <ScrollArea className="w-full">
        <div className="space-y-6">
          {themeDates?.map((theme) => (
            <div key={theme.id} className="space-y-3">
              <h3 className="text-lg font-semibold">{theme.name}</h3>
              <div className="flex flex-wrap gap-6">
                {theme.levels
                  .filter(
                    (level) =>
                      level.type !== "video" && level.type !== "tutorial"
                  )
                  .map((level) => (
                    <div key={level.id} className="space-y-2 min-w-[200px]">
                      <p className="text-sm font-medium">
                        {level.name}
                        {(level.type === "video" ||
                          level.type === "tutorial") && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({level.type})
                          </span>
                        )}
                      </p>
                      <div>
                        <label className="text-xs text-gray-500">
                          Unlock Date
                        </label>
                        <input
                          type="date"
                          value={level.unlockAt || ""}
                          disabled={unlockType !== "manual" || disabled}
                          onChange={(e) =>
                            updateDate(
                              theme.id,
                              level.id,
                              "unlockAt",
                              e.target.value
                            )
                          }
                          className={cn(
                            "mt-1 w-full rounded-md border px-3 py-2",
                            unlockType !== "manual" && "bg-gray-100"
                          )}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={level.dueDate || ""}
                          disabled={unlockType !== "manual" || disabled}
                          onChange={(e) =>
                            updateDate(
                              theme.id,
                              level.id,
                              "dueDate",
                              e.target.value
                            )
                          }
                          className={cn(
                            "mt-1 w-full rounded-md border px-3 py-2",
                            unlockType !== "manual" && "bg-gray-100"
                          )}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
