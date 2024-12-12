/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { getLicences } from "@/api/common/getLicences";
import {
  getStudents,
  getStudentsByGradeAndSection,
} from "@/services/dashboard/student-service";
import { useEffect, useMemo, useState } from "react";
import { classroomSchema } from "@/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

type FormValues = z.infer<typeof classroomSchema>;

export function EditStep2({
  selectedStudents,
  setSelectedStudents,
  setIsLicenseCountValid,
  form,
  oldStudents,
}: {
  selectedStudents: any[];
  setSelectedStudents: React.Dispatch<React.SetStateAction<any[]>>;
  isLicenseCountValid: boolean;
  setIsLicenseCountValid: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<FormValues>;
  oldStudents: any[];
}) {
  const { user } = useAuth();
  const gradeAndSectionId = form.getValues("gradeAndSectionId");
  const gradeAndSectionName = form.getValues("gradeAndSectionName");
  const course = form.getValues("course");
  const [selectedToAdd, setSelectedToAdd] = useState<any[]>([]);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const { isLoading: isLicenceDataLoading, data: licenceData } = useQuery<any>({
    queryKey: ["getAvailableLicences"],
    queryFn: () => getLicences(`${user?.uid}_${course}`),
    enabled: !!course && !!user?.uid,
  });

  const { isLoading: allStudentsLoading, data: allStudents } = useQuery({
    queryKey: ["getStudents"],
    queryFn: () => getStudents(user?.uid as string),
    enabled: !!user?.uid,
  });

  const {
    isLoading: studentsByGradeAndSectionLoading,
    data: studentsByGradeAndSectionData,
  } = useQuery({
    queryKey: ["getStudentsByGradeAndSection", gradeAndSectionId],
    queryFn: () =>
      getStudentsByGradeAndSection({
        gradeAndSection: gradeAndSectionId as string,
        userId: user?.uid as string,
      }),
    enabled: !!gradeAndSectionId && !!user?.uid,
  });

  const [totalAnnualLicenses, setTotalAnnualLicenses] = useState(0);
  const [totalMonthlyLicenses, setTotalMonthlyLicenses] = useState(0);

  useEffect(() => {
    if (licenceData) {
      setTotalAnnualLicenses(licenceData.annual);
      setTotalMonthlyLicenses(licenceData.monthly);
    }
  }, [licenceData]);

  const remainingLicenses = useMemo(() => {
    const annualUsed = selectedStudents.filter(
      (s: any) => s.licenseType === "Annual"
    ).length;
    const monthlyUsed = selectedStudents.filter(
      (s: any) => s.licenseType === "Monthly"
    ).length;

    return {
      annual: totalAnnualLicenses - annualUsed,
      monthly: totalMonthlyLicenses - monthlyUsed,
      total:
        totalAnnualLicenses - annualUsed + (totalMonthlyLicenses - monthlyUsed),
    };
  }, [selectedStudents, totalAnnualLicenses, totalMonthlyLicenses]);

  const availableStudents = useMemo(() => {
    if (!allStudents) return [];
    const newStd = allStudents.filter(
      (student: any) => !oldStudents.some((s: any) => s.id === student.id)
    );

    return newStd.filter(
      (student: any) => !selectedStudents.some((s: any) => s.id === student.id)
    );
  }, [allStudents, oldStudents, selectedStudents]);

  const availableStudentsByGrade = useMemo(() => {
    if (!studentsByGradeAndSectionData) return [];
    const newStd = studentsByGradeAndSectionData.filter(
      (student: any) => !oldStudents.some((s: any) => s.id === student.id)
    );

    return newStd.filter(
      (student: any) => !selectedStudents.some((s: any) => s.id === student.id)
    );
  }, [studentsByGradeAndSectionData, oldStudents, selectedStudents]);

  const handleSelectStudent = (student: any, isChecked: boolean) => {
    if (isChecked) {
      setSelectedToAdd((prev) => [...prev, student]);
    } else {
      setSelectedToAdd((prev) => prev.filter((s) => s.id !== student.id));
    }
  };

  const handleSelectAll = (students: any[], isChecked: boolean) => {
    if (isChecked) {
      setSelectedToAdd(students);
    } else {
      setSelectedToAdd([]);
    }
  };

  const removeStudent = (studentEmail: string) => {
    setSelectedStudents((prev: any) =>
      prev.filter((s: any) => s.studentEmail !== studentEmail)
    );
  };

  const updateLicenseType = (
    studentId: string,
    newLicenseType: "Annual" | "Monthly"
  ) => {
    const otherStudents = selectedStudents.filter(
      (s: any) => s.id !== studentId
    );
    const annualUsedByOthers = otherStudents.filter(
      (s: any) => s.licenseType === "Annual"
    ).length;
    const monthlyUsedByOthers = otherStudents.filter(
      (s: any) => s.licenseType === "Monthly"
    ).length;

    const canChangeToAnnual =
      newLicenseType === "Annual" &&
      totalAnnualLicenses - annualUsedByOthers > 0;
    const canChangeToMonthly =
      newLicenseType === "Monthly" &&
      totalMonthlyLicenses - monthlyUsedByOthers > 0;

    if (
      (newLicenseType === "Annual" && !canChangeToAnnual) ||
      (newLicenseType === "Monthly" && !canChangeToMonthly)
    ) {
      setErrorMessage(
        `No ${newLicenseType.toLowerCase()} licenses available for this change.`
      );
      return;
    }

    setSelectedStudents((prev: any) =>
      prev.map((s: any) =>
        s.id === studentId ? { ...s, licenseType: newLicenseType } : s
      )
    );
    setErrorMessage("");
  };

  const validateAndAddStudents = () => {
    if (selectedToAdd.length === 0) {
      setErrorMessage("Please select students to add.");
      return;
    }

    if (selectedToAdd.length > remainingLicenses.total) {
      setErrorMessage(
        `Cannot add ${selectedToAdd.length} students. You only have ${
          remainingLicenses.total
        } license${remainingLicenses.total === 1 ? "" : "s"} available ` +
          `(${remainingLicenses.annual} annual and ${remainingLicenses.monthly} monthly).`
      );
      return;
    }

    let annualLeft = remainingLicenses.annual;
    let monthlyLeft = remainingLicenses.monthly;

    const newStudents = selectedToAdd
      .map((student) => {
        if (annualLeft > 0) {
          annualLeft--;
          return { ...student, licenseType: "Annual" };
        } else if (monthlyLeft > 0) {
          monthlyLeft--;
          return { ...student, licenseType: "Monthly" };
        }
        return null;
      })
      .filter(Boolean);

    setSelectedStudents((prev: any) => [...prev, ...newStudents]);
    setSelectedToAdd([]);
    setErrorMessage("");
  };

  useEffect(() => {
    const isValid =
      remainingLicenses.annual >= 0 && remainingLicenses.monthly >= 0;
    setIsLicenseCountValid(isValid);
  }, [remainingLicenses, setIsLicenseCountValid]);

  if (allStudentsLoading || studentsByGradeAndSectionLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="section">
              <TabsList>
                <TabsTrigger value="section">In 6th B section</TabsTrigger>
                <TabsTrigger value="institute">Whole Institute</TabsTrigger>
              </TabsList>
              <TabsContent value="section">
                <Skeleton className="h-10 w-full mb-4" />
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="institute"></TabsContent>
            </Tabs>
          </div>

          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Selection</h2>
        {!isLicenceDataLoading && (
          <div className="flex flex-col">
            <div className="self-end">
              <p className="text-left mb-1.5 ml-1.5 text-xs">
                Available licenses
              </p>
              <div className="space-x-2">
                <Badge
                  className={`text-sm ${
                    remainingLicenses.annual <= 0
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                  variant="secondary"
                >
                  Annual{" "}
                  <span className="font-semibold ml-1.5">
                    {remainingLicenses.annual}
                  </span>
                </Badge>
                <Badge
                  variant="secondary"
                  className={`text-sm ${
                    remainingLicenses.monthly <= 0
                      ? "bg-red-100 text-red-800"
                      : ""
                  }`}
                >
                  Monthly{" "}
                  <span className="font-semibold ml-1.5">
                    {remainingLicenses.monthly}
                  </span>
                </Badge>
              </div>
            </div>
            {errorMessage && (
              <div className="mt-2 p-2 max-w-96 rounded bg-red-50 border border-red-200">
                <p className="text-red-600 text-sm flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  {errorMessage}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <Tabs defaultValue="section">
            <TabsList>
              <TabsTrigger value="section">
                In {gradeAndSectionName} section
              </TabsTrigger>
              <TabsTrigger value="institute">Whole Institute</TabsTrigger>
            </TabsList>
            <TabsContent value="section">
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        selectedToAdd.length === availableStudentsByGrade.length
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAll(
                          availableStudentsByGrade,
                          checked as boolean
                        )
                      }
                    />
                    <label className="text-sm font-medium">Select All</label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={validateAndAddStudents}
                    disabled={selectedToAdd.length === 0}
                  >
                    Add Selected ({selectedToAdd.length})
                  </Button>
                </div>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {availableStudentsByGrade?.map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedToAdd.some(
                              (s) => s.id === student.id
                            )}
                            onCheckedChange={(checked) =>
                              handleSelectStudent(student, checked as boolean)
                            }
                          />
                          <Avatar className="h-10 w-10 rounded-full border">
                            <AvatarImage
                              src={`${student.studentProfileImg}`}
                              alt={student.studentName}
                              className="animate-in fade-in-50"
                            />
                            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
                              {student.studentName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{student.studentName}</span>
                            <span className="text-sm text-gray-500">
                              {student.studentId}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
            <TabsContent value="institute">
              <div className="mt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={
                        selectedToAdd.length === availableStudents.length
                      }
                      onCheckedChange={(checked) =>
                        handleSelectAll(availableStudents, checked as boolean)
                      }
                    />
                    <label className="text-sm font-medium">Select All</label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={validateAndAddStudents}
                    disabled={selectedToAdd.length === 0}
                  >
                    Add Selected ({selectedToAdd.length})
                  </Button>
                </div>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {availableStudents.map((student) => (
                      <div
                        key={student.id}
                        className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedToAdd.some(
                              (s) => s.id === student.id
                            )}
                            onCheckedChange={(checked) =>
                              handleSelectStudent(student, checked as boolean)
                            }
                          />
                          <Avatar className="h-10 w-10 rounded-full border">
                            <AvatarImage
                              src={`${student.studentProfileImg}`}
                              alt={student.studentName}
                              className="animate-in fade-in-50"
                            />
                            <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
                              {student.studentName.slice(0, 1)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span>{student.studentName}</span>
                            <span className="text-sm text-gray-500">
                              {student.studentId}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Old Students</h3>
          {oldStudents && oldStudents.length > 0 ? (
            <ScrollArea className="mt-4 h-52">
              <div className="space-y-2 ">
                {oldStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10 rounded-full border">
                        <AvatarImage
                          src={student.studentProfileImg}
                          alt={student.studentName}
                          className="animate-in fade-in-50"
                        />
                        <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
                          {student.studentName.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.studentName}</span>
                    </div>
                    <div className="bg-gray-100 px-2.5 rounded py-1">
                      {student.licenseType}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p>No old students</p>
          )}
          <div>
            <h3 className="text-xl font-semibold mb-4">Selected Students</h3>

            <ScrollArea className="h-52">
              <div className="space-y-2 mt-2">
                {selectedStudents.map((student: any) => (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10 rounded-full border">
                        <AvatarImage
                          src={`${student.studentProfileImg}`}
                          alt={student.studentName}
                          className="animate-in fade-in-50"
                        />
                        <AvatarFallback className="rounded-full uppercase text-sm font-semibold">
                          {student.studentName.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.studentName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={student.licenseType}
                        onValueChange={(value: "Annual" | "Monthly") =>
                          updateLicenseType(student.studentId, value)
                        }
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Annual">Annual</SelectItem>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStudent(student.studentEmail)}
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-4 h-4"
                        >
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
